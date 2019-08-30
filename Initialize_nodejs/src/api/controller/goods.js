/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 6:55 2019/8/23 0023
 *  @explain :   商品
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'goods');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  获取所有的
   */
  async indexAction() {
    const model = this.getBaseModel();
    const goodsList = await model.select();
    return this.success(goodsList);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :   获取sku信息，用于购物车编辑时选择规格
   */
  async skuAction() {
    const goodsId = this.get('id');
    const model = this.model('goods');

    return this.success({
      specificationList: await model.getSpecificationList(goodsId),
      productList: await model.getProductList(goodsId)
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  商品详情页数据
   */
  async detailAction() {
    const goodsId = this.get('id');
    const baseModel = this.getBaseModel();

    const info = await baseModel.where({'id': goodsId}).find();
    if(think.isEmpty(info)){
        return this.fail("没有该商品");
    }
    //goods_gallery【同一个商品 几个图片】
    const gallery = await this.model('goods_gallery').where({goods_id: goodsId}).limit(4).select();
    //商品的属性
    const attribute = await this.model('goods_attribute').field('nideshop_goods_attribute.value, nideshop_attribute.name')
      .join('nideshop_attribute ON nideshop_goods_attribute.attribute_id=nideshop_attribute.id')
      .order({'nideshop_goods_attribute.id': 'asc'})
      .where({'nideshop_goods_attribute.goods_id': goodsId})
      .select();
    //问题
    const issue = await this.model('goods_issue').select();
    //制造商
    const brand = await this.model('brands').where({id: info.brand_id}).find();
    //评论
    const commentCount = await this.model('comments').where({value_id: goodsId, type_id: 0}).count();
    const hotComment = await this.model('comments').where({value_id: goodsId, type_id: 0}).find();

    let commentInfo = {};
    if (!think.isEmpty(hotComment)) {
      const commentUser = await this.model('users').field(['nickname', 'username', 'avatar']).where({id: hotComment.user_id}).find();
      commentInfo = {
        content: Buffer.from(hotComment.content, 'base64').toString(),
        add_time: think.datetime(new Date(hotComment.add_time * 1000)),
        nickname: commentUser.nickname,
        avatar: commentUser.avatar,
        pic_list: await this.model('comment_picture').where({comment_id: hotComment.id}).select()
      };
    }

    const comment = {
      count: commentCount,
      data: commentInfo
    };
    const userId = this.getLoginUserId();
    // 当前用户是否收藏
    const userHasCollect = await this.model('collects').isUserHasCollect(userId, 0, goodsId);
    // 记录用户的足迹 TODO
    await await this.model('footprint').addFootprint(userId, goodsId);

    // return this.json(jsonData);
    return this.success({
      info: info,
      gallery: gallery,
      attribute: attribute,
      userHasCollect: userHasCollect,
      issue: issue,
      comment: comment,
      brand: brand,
      specificationList: await baseModel.getSpecificationList(goodsId),   //商品规格信息
      productList: await baseModel.getProductList(goodsId)   //商品库存
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  获取分类下的商品
   */
  async categoryAction() {
    const model = this.model('category');

    const currentCategory = await model.where({id: this.get('id')}).find();
    const parentCategory = await model.where({id: currentCategory.parent_id}).find();
    //所有和该数据父目录相同的目录
    const brotherCategory = await model.where({parent_id: currentCategory.parent_id}).select();

    return this.success({
      currentCategory: currentCategory,
      parentCategory: parentCategory,
      brotherCategory: brotherCategory
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  获取商品列表
   */
  async listAction() {
    //目录id
    const categoryId = this.get('categoryId');
    //品牌
    const brandId = this.get('brandId');
    //搜索
    const keyword = this.get('keyword');
    //是否新品
    const isNew = this.get('isNew');
    //是否最热
    const isHot = this.get('isHot');
    const page = this.get('page');
    const size = this.get('size');
    const sort = this.get('sort');
    const order = this.get('order');

    const goodsQuery = this.getBaseModel();

    const whereMap = {};
    if (!think.isEmpty(isNew)) {
      whereMap.is_new = isNew;
    }

    if (!think.isEmpty(isHot)) {
      whereMap.is_hot = isHot;
    }

    if (!think.isEmpty(keyword)) {
      whereMap.name = ['like', `%${keyword}%`];
      // 添加到搜索历史
      // const session = await this.session('user');
      // const userId = session.id;
      const userId = this.ctx.state.userId;
      if(think.isEmpty(userId)){
        return think.fail("用户的id不存在");
      }
      console.log("loginUserId"+userId);
      await this.model('search_history').addSearchHistory(keyword, userId);
    }

    if (!think.isEmpty(brandId)) {
      whereMap.brand_id = brandId;
    }

    // 排序
    let orderMap = {};
    if (sort === 'price') {
      // 按价格
      orderMap = {
        retail_price: order
      };
    } else {
      // 按商品添加时间
      orderMap = {
        id: 'desc'
      };
    }

    // 筛选的分类
    let filterCategory = [{
      'id': 0,
      'name': '全部',
      'checked': false
    }];
    //条件找到商品目录
    const categoryIds = await goodsQuery.where(whereMap).getField('category_id', 10000);

    if (!think.isEmpty(categoryIds)) {
      //查找商品父集目录
      const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
      //所有子目录
      const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

      if (!think.isEmpty(parentCategory)) {
        //连接两个数组
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    // 加入分类条件
     if (!think.isEmpty(categoryId) && parseInt(categoryId) > 0) {
      //父目录 当前目录
      whereMap.category_id = ['in', await this.model('category').getCategoryWhereIn(categoryId)];
    }

    // 搜索到的商品
    const goodsData = await goodsQuery.where(whereMap).field(['id', 'name', 'list_pic_url', 'retail_price']).order(orderMap).page(page, size).countSelect();
    //商品目录
    goodsData.filterCategory = filterCategory.map(function(v) {
      //检查
      v.checked = (think.isEmpty(categoryId) && v.id === 0) || v.id === parseInt(categoryId);
      return v;
    });
    //商品
    goodsData.goodsList = goodsData.data;

    return this.success(goodsData);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  商品列表筛选的分类列表
   */
  async filterAction() {
    const categoryId = this.get('categoryId');
    const keyword = this.get('keyword');
    const isNew = this.get('isNew');
    const isHot = this.get('isHot');

    const goodsQuery = this.model('goods');

    if (!think.isEmpty(categoryId)) {
      goodsQuery.where({category_id: {'in': await this.model('category').getChildCategoryId(categoryId)}});
    }

    if (!think.isEmpty(isNew)) {
      goodsQuery.where({is_new: isNew});
    }

    if (!think.isEmpty(isHot)) {
      goodsQuery.where({is_hot: isHot});
    }

    if (!think.isEmpty(keyword)) {
      goodsQuery.where({name: {'like': `%${keyword}%`}});
    }

    let filterCategory = [{
      'id': 0,
      'name': '全部'
    }];

    // 二级分类id
    const categoryIds = await goodsQuery.getField('category_id', 10000);
    if (!think.isEmpty(categoryIds)) {
      // 查找二级分类的parent_id
      const parentIds = await this.model('category').where({id: {'in': categoryIds}}).getField('parent_id', 10000);
      // 一级分类
      const parentCategory = await this.model('category').field(['id', 'name']).order({'sort_order': 'asc'}).where({'id': {'in': parentIds}}).select();

      if (!think.isEmpty(parentCategory)) {
        filterCategory = filterCategory.concat(parentCategory);
      }
    }

    return this.success(filterCategory);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 新品首发
   */
  async newAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '坚持初心，为你寻觅世间好物',
        img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
      }
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 人气推荐
   */
  async hotAction() {
    return this.success({
      bannerInfo: {
        url: '',
        name: '大家都在买的严选好物',
        img_url: 'http://yanxuan.nosdn.127.net/8976116db321744084774643a933c5ce.png'
      }
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  商品详情页的大家都在看的商品
   */
  async relatedAction() {
    // 大家都在看商品,取出关联表的商品，如果没有则随机取同分类下的商品
    const model = this.getBaseModel();
    const goodsId = this.get('id');
    const relatedGoodsIds = await this.model('related_goods').where({goods_id: goodsId}).getField('related_goods_id');
    let relatedGoods = null;
    if (think.isEmpty(relatedGoodsIds)) {
      // 查找同分类下的商品
      const goodsCategory = await model.where({id: goodsId}).find();
      relatedGoods = await model.where({category_id: goodsCategory.category_id}).field(['id', 'name', 'list_pic_url', 'retail_price']).limit(8).select();
    } else {
      relatedGoods = await model.where({id: ['IN', relatedGoodsIds]}).field(['id', 'name', 'list_pic_url', 'retail_price']).select();
    }
    return this.success({
      goodsList: relatedGoods
    });
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  在售的商品总数
   */
  async countAction() {
    const goodsCount = await this.model('goods').where({is_delete: 0, is_on_sale: 1}).count('id');
    return this.success({
      goodsCount: goodsCount
    });
  }

};

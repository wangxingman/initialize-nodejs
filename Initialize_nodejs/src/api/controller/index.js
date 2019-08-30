/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 2:31 2019/8/24 0024
 *  @explain :
 */
module.exports = class extends think.framework.base {
  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 初始化基础信息【我能相伴存储到 redis里面去吗】
   */
  async indexAction() {
    const initial_data = [];
    const start_initial_data = await this.cache('initial_data');
    if (!think.isEmpty(start_initial_data)) {
      return this.success({
        initial_data: initial_data,
      });
    } else {
      //首页主题活动
      const banner = await this.model('ad').where({ad_position_id: think.const.number.one}).select();
      //首页的类型搜索按钮
      const channel = await this.model('channel').order({sort_order: 'asc'}).select();
      // 最新的商品 最热的商品
      const newGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({is_new: think.const.number.one}).limit(think.const.number.four).select();
      const hotGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price', 'goods_brief']).where({is_hot: think.const.number.one}).limit(think.const.number.three).select();
      //品牌制造商
      const brandList = await this.model('brands').where({is_new: think.const.number.one}).order({new_sort_order: 'asc'}).limit(think.const.number.four).select();
      //主题
      const topicList = await this.model('topics').limit(think.const.number.three).select();
      //显示主目录
      const categoryList = await this.model('category').where({parent_id: think.const.number.zreo, name: ['<>', '推荐']}).select();
      const newCategoryList = [];
      for (const categoryItem of categoryList) {
        //主目录 下面子目录
        const childCategoryIds = await this.model('category').where({parent_id: categoryItem.id}).getField('id',  think.const.number.one_hundred);
       //包含子目录下面的商品
        const categoryGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({category_id: ['IN', childCategoryIds]}).limit( think.const.number.seven).select();
        newCategoryList.push({
          id: categoryItem.id,
          name: categoryItem.name,
          goodsList: categoryGoods
        });
      }
      initial_data.push({
        banner: banner,
        channel: channel,
        newGoodsList: newGoods,
        hotGoodsList: hotGoods,
        brandList: brandList,
        topicList: topicList,
        categoryList: newCategoryList
      });
      await this.cache(`initial_data`, initial_data);
    }
    return this.success({
      initial_data: initial_data,
    });
  }
};

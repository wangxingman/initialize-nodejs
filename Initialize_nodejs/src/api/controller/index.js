/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 2:31 2019/8/24 0024
 *  @explain :
 */
module.exports = class extends think.framework.base  {
  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 初始化基础信息
   */
  async indexAction() {
    //活动
    const banner = await this.model('ad').where({ad_position_id: 1}).select();
    const channel = await this.model('channel').order({sort_order: 'asc'}).select();
    const newGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({is_new: 1}).limit(4).select();
    const hotGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price', 'goods_brief']).where({is_hot: 1}).limit(3).select();
    //制造商
    const brandList = await this.model('brands').where({is_new: 1}).order({new_sort_order: 'asc'}).limit(4).select();
    //主题
    const topicList = await this.model('topics').limit(3).select();
    //目录
    const categoryList = await this.model('category').where({parent_id: 0, name: ['<>', '推荐']}).select();
    const newCategoryList = [];
    for (const categoryItem of categoryList) {
      const childCategoryIds = await this.model('category').where({parent_id: categoryItem.id}).getField('id', 100);
      const categoryGoods = await this.model('goods').field(['id', 'name', 'list_pic_url', 'retail_price']).where({category_id: ['IN', childCategoryIds]}).limit(7).select();
      newCategoryList.push({
        id: categoryItem.id,
        name: categoryItem.name,
        goodsList: categoryGoods
      });
    }

    return this.success({
      banner: banner,
      channel: channel,
      newGoodsList: newGoods,
      hotGoodsList: hotGoods,
      brandList: brandList,
      topicList: topicList,
      categoryList: newCategoryList
    });
  }
}

/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:02 2019/8/23 0023
 *  @explain :  主题
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'topics');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 全部主题
   */
  async listAction() {
    const model = this.getBaseModel();
    const data = await model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).page(this.get('page') || 1, this.get('size') || 10).countSelect();

    return this.success(data);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 主题明细
   */
  async detailAction() {
    const model = this.getBaseModel();
    const data = await model.where({id: this.get('id')}).find();
    return this.success(data);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  相关专题
   */
  async relatedAction() {
    const model = this.getBaseModel();
    const data = await model.field(['id', 'title', 'price_info', 'scene_pic_url', 'subtitle']).limit(4).select();

    return this.success(data);
  }

};

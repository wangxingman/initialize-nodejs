/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:38 2019/8/23 0023
 *  @explain :  制造商
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'brand');
  }
  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 查询所有的厂商
  */
  async listAction() {
    const baseModel = this.getBaseModel();
    const data = await baseModel.field(['id', 'name', 'floor_price', 'app_list_pic_url'])
      .page(this.get('page') || 1,this.get('size') || 10).countSelect();
    return this.success(data);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 查询单个制造商
  */
  async detailAction() {
    const baseModel = this.getBaseModel();
    const data = await baseModel.where({id: this.get('id')}).find();
    return this.success({brand: data});
  }

}

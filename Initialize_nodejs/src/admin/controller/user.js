/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 3:48 2019/8/23 0023
 *  @explain :
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'user');
  }
  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :
  */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const name = this.get('name') || '';

    const baseModel = this.getBaseModel();
    const data = await baseModel.where({username: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();

    return this.success(data);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :
  */
  async infoAction() {
    const id = this.get('id');
    const baseModel = this.getBaseModel();
    const data = await baseModel.where({id: id}).find();
    return this.success(data);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :
  */
  async storeAction() {
    if (!this.isPost) {
      return false;
    }
    const values = this.post();
    const id = this.post('id');
    const baseModel = this.getBaseModel();
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await baseModel.where({id: id}).update(values);
    } else {
      delete values.id;
      await baseModel.add(values);
    }
    return this.success(values);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :
  */
  async destoryAction() {
    const id = this.post('id');
    await  this.getBaseModel().where({id: id}).limit(1).delete();
    // TODO 删除图片
    return this.success();
  }

}

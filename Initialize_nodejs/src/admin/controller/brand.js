/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  上午 11:52 2019/8/23 0023
 *  @explain :  生产商操作 nideshop_brand
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'brands');
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain :  根据名字模糊查询制造商
   */
  async indexAction() {
    //如果没有 就是对应的数值
    const page = this.get('cp') || think.const.number.one;
    const size = this.get('ps') || think.const.number.ten;
    const name = this.get('name') || "";
    const baseModel = this.getBaseModel();
    const data = await baseModel.field(['id', 'name', 'floor_price', 'app_list_pic_url', 'is_new', 'sort_order', 'is_show']).where({name: ['like', `%${name}%`]}).order(['id DESC']).page(page, size).countSelect();
    return this.success(data);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain :  一个制造商
   */
  async infoAction() {
    return this.rAction();
  }


  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain : 修改||添加
   */
  async storeAction() {
    //判断请求是否是post
    if (!this.isPost) {
      return false;
    }
    //获取或有post的所有值
    const values = this.post();
    const id = this.post('id');
    const baseModel = this.getBaseModel();
    //是否展示 是否新创建的
    values.is_show = values.is_show ? 1 : 0;
    values.is_new = values.is_new ? 1 : 0;
    if (id > 0) {
      await baseModel.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain : 删除
   */
  async deleteAction() {
    this.dAction();
    // TODO 删除图片
    return this.success();
  }

};


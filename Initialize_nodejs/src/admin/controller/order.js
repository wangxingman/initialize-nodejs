/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 3:09 2019/8/23 0023
 *  @explain :  订单
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'order');
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 查询订单【返回订单当前的操作】
  */
  async indexAction() {
    const page = this.get('page') || 1;
    const size = this.get('size') || 10;
    const orderSn = this.get('orderSn') || '';
    const consignee = this.get('consignee') || '';

    const baseModel = this.getBaseModel();
    const data = await baseModel.where({order_sn: ['like', `%${orderSn}%`], consignee: ['like', `%${consignee}%`]}).order(['id DESC']).page(page, size).countSelect();
    const newList = [];
    for (const item of data.data) {
      item.order_status_text = await baseModel.getOrderStatusText(item.id);
      newList.push(item);
    }
    data.data = newList;
    return this.success(data);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 查询单个
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
  *@explain : 添加修改
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
      await model.add(values);
    }
    return this.success(values);
  }


  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 删除
  */
  async destoryAction() {
    const id = this.post('id');
    const baseModel = this.getBaseModel();
    await baseModel.where({id: id}).limit(1).delete();
    // 删除订单商品
    await this.model('order_goods').where({order_id: id}).delete();
    // TODO 事务，验证订单是否可删除（只有失效的订单才可以删除）
    return this.success();
  }

}


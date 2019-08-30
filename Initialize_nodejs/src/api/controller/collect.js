/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 6:52 2019/8/23 0023
 *  @explain :  收藏
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'collects');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  获取收藏
   */
  async listAction() {
    const typeId = this.get('typeId');
    const session = await this.session('user');
    const userId = session.id;
    const list = await this.getBaseModel()
      .field(['c.*', 'g.name', 'g.list_pic_url', 'g.goods_brief', 'g.retail_price'])
      .alias('c')
      .join({
        table: 'goods',
        join: 'left',
        as: 'g',
        on: ['c.value_id', 'g.id']
      }).where({user_id: userId, type_id: parseInt(typeId)}).countSelect();

    return this.success(list);
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain : 添加或者删除收藏
   */
  async addordeleteAction() {
    const typeId = this.post('typeId');
    const valueId = this.post('valueId');

    const session = await this.session('user');
    const userId = session.id;
    const collect = await this.model('collects').where({
      type_id: typeId,
      value_id: valueId,
      user_id: userId
    }).find();
    let collectRes = null;
    let handleType = 'add';
    if (think.isEmpty(collect)) {
      // 添加收藏
      collectRes = await this.model('collects').add({
        type_id: typeId,
        value_id: valueId,
        user_id: userId,
        add_time: parseInt(new Date().getTime() / 1000)
      });
    } else {
      // 取消收藏
      collectRes = await this.model('collects').where({id: collect.id}).delete();
      handleType = 'delete';
    }
    if (collectRes > 0) {
      return this.success({type: handleType});
    }
    return this.fail('操作失败');
  }
};

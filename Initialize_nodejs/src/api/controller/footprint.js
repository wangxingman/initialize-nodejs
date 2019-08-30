/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 6:54 2019/8/23 0023
 *  @explain :  足迹
 */
const moment = require('moment');    //日期
const _ = require('lodash');         // 基础类工具类

module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'footprint');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  删除当天的同一个商品的足迹
   */
  async deleteAction() {
    const footprintId = this.post('footprintId');
    const session = await this.session('user');
    const userId = session.id;
    const goods = await this.model('footprint').where({user_id: userId, id: footprintId}).find();
    await this.model('footprint').where({user_id: userId, goods_id: goods.goods_id}).delete();
    return this.success('删除成功');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  足迹列表
   */
  async listAction() {
    const baseModel = this.getBaseModel();
    baseModel.field(['f.*', 'g.name', 'g.list_pic_url', 'g.goods_brief', 'g.retail_price'])
      .alias('f')
      .join({
        table: 'goods',
        join: 'left',
        as: 'g',
        on: ['f.goods_id', 'g.id']
      }).where({user_id: this.getLoginUserId()})
      .order({id: 'desc'})
      .countSelect();

    // 去重、格式化日期、按天分组
    baseModel.data = _.map(_.uniqBy(baseModel.data, function(item) {
      return item.goods_id;
    }), (item) => {
      item.add_time = moment.unix(item.add_time).format('YYYY-MM-DD');
      // 今天
      if (moment().format('YYYY-MM-DD') === item.add_time) {
        item.add_time = '今天';
      }
      // 昨天
      if (moment().subtract(1, 'days').format('YYYY-MM-DD') === item.add_time) {
        item.add_time = '昨天';
      }
      // 前天
      if (moment().subtract(2, 'days').format('YYYY-MM-DD') === item.add_time) {
        item.add_time = '前天';
      }
      return item;
    });

    baseModel.data = _.groupBy(baseModel.data, function(item) {
      return item.add_time;
    });
    baseModel.data = _.values(baseModel.data);

    return this.success(baseModel);
  }
};

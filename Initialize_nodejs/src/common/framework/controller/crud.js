const base = require('./base');
const moment = require('moment');
/**
 * 通用crud action
 * t 表名
 * where 查询条件
 * data 数据
 * field 查询字段
 * pn 页码
 * ps 页码数量
 */

module.exports = class extends base {
  constructor(ctx, tableName) {
    super(ctx);
    this.tableName = tableName;
  }

  /**
  *@Date    :  2019/8/20 0020
  *@Author  :  wx
  *@explain :
  */
  getBaseModel() {
    return this.model(this.tableName);
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :
  */
  getBaseMoment() {
    return this.moment;
  }

  /**
  *@Date    :  2019/8/20 0020
  *@Author  :  wx
  *@explain :  创建
  */
  async cAction() {
    // 获取post的值
    const where = this.post('where');
    const data = this.post('data');
    const model = this.getBaseModel();

    // eslint-disable-next-line no-unused-vars
    let insertId;
    try {
      if (!think.isEmpty(where)) {
        insertId = await model.where(where).thenAdd(data);
      } else {
        insertId = await model.add(data);
      }
    } catch (e) {
    }
    if (think.isEmpty(insertId)) {
      this.fail('操作失败');
    } else {
      data.id = insertId;
      this.success(data, '操作成功');
    }
    think.logger.debug(`新增数据，表名${this.tableName}，插入数据为${JSON.stringify(data)}，插入条件为${JSON.stringify(where)}`);
  }

  /**
  *@Date    :  2019/8/20 0020
  *@Author  :  wx
  *@explain :
  */
  async rbAction() {
    const where = this.post('where');
    const field = this.post('field');
    const order = this.post('order');
    const group = this.post('group');
    const distinct = this.post('distinct');

    const model = this.getBaseModel();
    this.success(await model.distinct(distinct).where(where).order(order).group(group).select({field}));
    think.logger.debug(`批量查询数据，表名${this.tableName}，查询条件为${JSON.stringify(where)}，查询字段为${field}`);
  }

  /**
  *@Date    :  2019/8/20 0020
  *@Author  :  wx
  *@explain :  分页查询
  */
  async pageAction() {
    const currentPage = this.get('cp');
    const pageSize = this.get('ps');
    const where = this.post('where');
    const field = this.post('field');
    const order = this.post('order');
    const group = this.post('group');
    const distinct = this.post('distinct');
    const model = this.getBaseModel();
    const count = await model.distinct(distinct).where(where).group(group).count();
    const data = await model.distinct(distinct).where(where).page(currentPage, pageSize).order(order).group(group).select({field});
    const totalPages = count % pageSize === 0 ? count / pageSize : parseInt(count / pageSize) + 1;
    this.success({
      pageSize,
      currentPage,
      count,
      totalPages,
      data
    });
    think.logger.debug(`分页查询，表名${this.tableName}，页码数量为${currentPage}-${pageSize}，查询条件为${JSON.stringify(where)}，查询字段为${field}`);
  }

};

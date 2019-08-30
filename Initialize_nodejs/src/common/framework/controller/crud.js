const base =require('./base');
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
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取当前登录用户的id
  */
  getLoginUserId() {
    return this.ctx.state.userId;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  create action
  */
  async cAction() {
    const where = this.post('where');
    const data = this.post('data');
    const model = this.getBaseModel();

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
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  create batch action
  */
  async cbAction() {
    const data = this.post('data');
    const model = this.getBaseModel();
    const insertIds = await model.addMany(data);
    if (insertIds.length > 0) {
      this.success(null, '操作成功');
    } else {
      this.fail('操作失败');
    }
    think.logger.debug(`批量新增数据，表名${this.tableName}，插入数据为${JSON.stringify(data)}`);
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  select action
  */
  async rAction() {
    const where = this.post('where');
    const field = this.post('field');
    const order = this.post('order');
    const group = this.post('group');
    const distinct = this.post('distinct');

    const model = this.getBaseModel();
    this.success(await model.distinct(distinct).where(where).order(order).group(group).find({field}));
    think.logger.debug(`查询数据，表名${this.tableName}，查询条件为${JSON.stringify(where)}，查询字段为${field}`);
  }

 /**
 *@Date    :  2019/8/27 0027
 *@Author  :  wx
 *@explain :  select batch action
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
 *@Date    :  2019/8/27 0027
 *@Author  :  wx
 *@explain :  update action
 */
  async uAction() {
    const where = this.post('where');
    const data = this.post('data');
    if (think.isEmpty(data.id)) {
      this.fail('修改失败');
    } else {
      const model = this.getBaseModel();
      const rows = await model.where(where).update(data);
      if (rows > 0) {
        this.success(null, '修改成功');
      } else {
        this.fail('修改失败');
      }
      think.logger.debug(`修改数据，表名${this.tableName}，更新数据为${JSON.stringify(data)}，更新条件为${JSON.stringify(where)}`);
    }
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  update batch action
  */
  async ubAction() {
    const data = this.post('data');
    const model = this.getBaseModel();
    const uL = await model.updateMany(data);
    if (data.length === uL.length) {
      this.success(null, '修改成功');
    } else {
      this.fail('修改失败');
    }
    think.logger.debug(`批量修改数据，表名${this.tableName}，修改数据为${JSON.stringify(data)}`);
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  delete action
  */
  async dAction() {
    const where = this.post('where');
    const model = this.getBaseModel();
    this.success(await model.where(where).delete());
    think.logger.debug(`删除数据，表名${this.tableName}，删除条件为${JSON.stringify(where)}`);
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  page action
  */
  async pageAction() {
    const currentPage = this.get('cp');
    const pageSize = this.get('ps');
    //条件
    const where = this.post('where');
    //查询那些字段
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

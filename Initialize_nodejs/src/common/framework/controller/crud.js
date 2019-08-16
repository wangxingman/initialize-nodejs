const base = require('./base');

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

  /** BaseModel */
  getBaseModel() {
    return this.model(this.tableName);
  }

  /** create action */
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

};

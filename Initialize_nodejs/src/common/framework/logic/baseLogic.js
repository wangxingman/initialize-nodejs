module.exports = class extends think.Logic {
  /** 自动调用验证方法 自动效验  */
  /**
  *@Date    :  2019/8/19 0019
  *@Author  :  wx
  *@explain : 添加基础校验
  */
  addAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        aliasName: '创建条件'
      },
      data: {
        object: true,
        method: 'POST',
        required: true,
        aliasName: '创建数据'
      }
    };
  }
};

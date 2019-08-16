module.exports = class extends think.Logic {
  /** 自动调用验证方法 自动效验  */
  cAction() {
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

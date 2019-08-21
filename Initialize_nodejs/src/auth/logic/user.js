module.exports = class extends think.framework.baseLogic {
  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain :  user添加效验
   */
  addAction() {
    super.addAction();
    this.rules.roleIds = {
      array: true,
      required: true,
      aliasName: '角色'
    },
      this.rules.data.jsonSchema = {
        required: ['phone', 'username','avatar'],
        properties: {
          pthone: {type: 'string', maxLength: 11, minLength: 11},
          username: {type: 'string', maxLength: 20, minLength: 1},
        },
        errorMessage: {
          properties: {
            pthone: '用户的电话号码只能是11位',
            username: '用户名不能为空,用户名不能小于1位大于20位',
            avatar: '头像地址没有传输',
            deptId: '必须传入部门id',
            jobId: '您没有输入用户的职业',
          }
        }
      };
  }
};

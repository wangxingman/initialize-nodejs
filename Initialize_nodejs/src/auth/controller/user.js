module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'user');
  }

  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain :  创建用户
   */
  async aAction() {
    console.info('创建用户');
    const roleIds = this.post('roleIds');
    if (roleIds.length === 0) {
      this.fail('角色不能为空');
      return;
    } else {
      const user = this.post('data');
      user.password = think.isEmpty(user.password) ? think.md5_2(think.user.default_password) : think.md5_2(user.password);
      const baseModel = this.getBaseModel();
      //查询老用户
      const oldUser = await baseModel.where({username: user.username}).find();
      if (think.isEmpty(oldUser)) {
        const b = await baseModel.addUserAndRole(user, roleIds);
        if (b) {
          this.success(null, '添加用户成功');
        } else {
          this.fail('添加用户失败');
        }
      } else {
        this.fail('用户已存在');
      }
    }
  }

  /**
   * 删除用户
   * @returns {Promise<void>}
   */
  async delAction() {
    console.info('---dAction--------');
    const where = this.post('where');
    const model = this.getBaseModel();
    const b = await model.deleteUser(where);
    if (b) {
      this.success(null, '删除用户成功');
    } else {
      this.fail('删除用户失败');
    }
  }

  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain :  修改用户
   */
  async updateAction() {
    const roleIds = this.post('roleIds');
    const data = this.post('data');
    if (think.isEmpty(data.password)) {
      delete data.password;
    } else {
      data.password = think.md5_2(data.password);
    }
    delete data.username;
    const model = this.getBaseModel();
    const b = await model.updateUserAndRole(data, roleIds);
    if (b) {
      this.success(null, '修改用户成功');
    } else {
      this.fail('修改用户失败');
    }
  }

  /**
   *@Date    :  2019/8/20 0020
   *@Author  :  wx
   *@explain : 查询用户信息
   */
  async selectAction() {
    const id = this.post('id');
    const baseModel = this.getBaseModel();
    const oldUser = await baseModel.where({id: id}).find();
    if(!think.isEmpty(oldUser)) {
      return this.success(oldUser, '查询用户信息成功');
    }else {
      return this.fail('查询用户信息失败');
    }
  }

  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain : 退出登录
   */
  async logoutAction() {
    await this.session(null);
    this.success(null, '注销成功');
  }

};

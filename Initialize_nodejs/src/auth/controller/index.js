module.exports = class extends think.framework.base {

  /**
   *   @Date    :  2019/8/16 0016
   *   @Author  :  wx
   *   @explain :  登陆方法
   */
  async indexAction() {
    const userName = this.post('userName');
    // const passWord = think.md5_2(this.post('passWord'));
    const passWord = this.post('passWord');
    //直接对应数据库的表
    const userModel = this.model('user');
    //通过 setRelation('comment') 只查询 comment 的关联数据，不查询其他的关联关系数据。
    const user = await userModel.setRelation(false).where({userName, passWord}).find();
    console.info('用户的信息：' + user);
    if (!think.isEmpty(user)) {
      // const userRoleModel = this.model('users_roles');
      // const userRoles = await userRoleModel.where({user_id: user.id}).select();
      // if(!think.isEmpty(userRoles) && userRoles.length > 0) {
      //对象属性删除
      delete user.password;
      //获取所有的角色id【用户权限】
      // const roleIds = userRoles.map(r => r.role_id);
      // const roleModel = this.model('role');
      await this.session('user', user);
      const cookie = this.cookie('KH_SESSION');
      const uid = user.id;
      await this.cache(`uid-${uid}`, cookie);
      this.success({user});
      // }
    } else {
      this.fail('账号或密码错误');
    }
  }
};

/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  上午 11:35 2019/8/23 0023
 *  @explain :  用户登陆 nideshop_admin
 */
module.exports = class extends think.framework.base {

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :
  */
  async loginAction() {
    const username = this.post('username');
    const password = this.post('password');
    const admin = await this.model('admin').where({username: username}).find();

    if(think.isEmpty(admin)) {
      return  this.fail(401,'不存在该用户');
    }
    if(think.md5(password + '' + admin.password_salt) !== admin.password){
      return this.fail(400,'账户名密码错误')
    }
    console.log("当前的时间"+Date.now());
    //跟新登陆信息
    await this.model('admin').where({id:admin.id}).update({
      last_login_time:  parseInt(Date.now() / 1000),
      last_login_ip: this.ctx.ip
    })
    //对象属性删除
    delete admin.password;
    //存储对象登陆信息
    await this.session('user', admin);
    const cookie = this.cookie('KH_SESSION');
    const uid = admin.id;
    await this.cache(`uid-${uid}`, cookie);
    this.success({admin});
  }
}



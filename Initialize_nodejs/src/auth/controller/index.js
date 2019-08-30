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
    const userModel = this.model('admin');
    //通过 setRelation('comment') 只查询 comment 的关联数据，不查询其他的关联关系数据。
    const user = await userModel.setRelation(false).where({userName, passWord}).find();
    console.info('用户的信息：' + user);
    if (!think.isEmpty(user)) {
      delete user.password;

      const TokenSerivce = think.service('token', 'auth');
      const sessionKey = await TokenSerivce.create({
        user_id: user.id
      });

      await this.session('user', user);
      const cookie = this.cookie('SESSION');
      const uid = user.id;
      await this.cache(`uid-${uid}`, cookie);
      this.success({userInfo:user,token:sessionKey});
    } else {
      this.fail('账号或密码错误');
    }
  }

  /**
  *@Date    :  2019/8/29 0029
  *@Author  :  wx
  *@explain :  微信登陆
  */
  async loginWXAction() {
    const code = this.post('code');
    const fullUserInfo = this.post('userInfo');
    const clientIp = this.ctx.ip;

    // 解释用户数据
    const userInfo = await this.service('weixin', 'auth').login(code, fullUserInfo);
    if (think.isEmpty(userInfo)) {
      return this.fail('登录失败');
    }

    // 根据openid查找用户是否已经注册
    let userId = await this.model('users').where({ weixin_openid: userInfo.openId }).getField('id', true);
    if (think.isEmpty(userId)) {
      // 注册用户
      userId = await this.model('users').add({
        username: '微信用户' + think.uuid(6),
        password: '',
        register_time: parseInt(new Date().getTime() / 1000),
        register_ip: clientIp,
        mobile: '',
        weixin_openid: userInfo.openId,
        avatar: userInfo.avatarUrl || '',
        gender: userInfo.gender || 1, // 性别 0：未知、1：男、2：女
        nickname: userInfo.nickName
      });
    }

    // 查询用户信息
    const newUserInfo = await this.model('users').field(['id', 'username', 'nickname', 'gender', 'avatar', 'birthday']).where({ id: userId }).find();

    // 更新登录信息
    userId = await this.model('users').where({ id: userId }).update({
      last_login_time: parseInt(new Date().getTime() / 1000),
      last_login_ip: clientIp
    });

    const TokenSerivce = think.service('token', 'auth');
    const sessionKey = await TokenSerivce.create({
      user_id: user.id
    });

    await this.session('user', newUserInfo);
    const cookie = this.cookie('SESSION');
    const uid = user.id;
    await this.cache(`uid-${uid}`, cookie);
    this.success({userInfo:user,token:sessionKey});

    if (think.isEmpty(newUserInfo) || think.isEmpty(sessionKey)) {
      return this.fail('登录失败');
    }

    return this.success({ token: sessionKey, userInfo: newUserInfo });
  }
};

/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:36 2019/8/23 0023
 *  @explain :
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'auth');
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :  微信登录
  */
  async loginByWeixinAction() {

  }
}

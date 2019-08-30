/**
 *  @Author  :  wx
 *  @Desc    :
 *  @Date    :  下午 5:00 2019/8/29 0029
 *  @explain :   微信登陆
 */

module.exports = class extends think.Service {
  /**
   *@Date    :  2019/8/29 0029
   *@Author  :  wx
   *@explain :  登陆
   */
  async login(code, fullUserInfo) {
    try {
      //获取session
      const options = {
        method: 'GET',
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          grant_type: 'authorization_code',
          js_code: code,
          secret: think.config('weixin.secret'),  //config获取
          appid: think.config('weixin.appid')
        }
      };

      let sessionData = await think.rp(options);
      sessionData = JSON.parse(sessionData);
      if (!sessionData.openid) {
        return null;
      }
      //验证用户信息完整性
      const sha1 = think.crypto.createHash('sha1').update(fullUserInfo.rawData.toString() + sessionData.session_key).digest('hex');
      if (fullUserInfo.signature !== sha1) {
        return null;
      }

      // 解析用户数据
      const wechatUserInfo = await this.decryptUserInfoData(sessionData.session_key, fullUserInfo.encryptedData, fullUserInfo.iv);
      if (think.isEmpty(wechatUserInfo)) {
        return null;
      }
      return wechatUserInfo;
    } catch (e) {
      return null;
    }
  }

  /**
   *@Date    :  2019/8/29 0029
   *@Author  :  wx
   *@explain :   解析微信登录用户数据
   */
  async decryptUserInfoData(sessionKey, encryptedData, iv) {
    let decoded = '';
    try {
      const _sessionKey = Buffer.from(sessionKey, 'base64');
      encryptedData = Buffer.from(encryptedData, 'base64');
      iv = Buffer.from(iv, 'base64');
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', _sessionKey, iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = decipher.update(encryptedData, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      const userInfo = JSON.parse(decoded);
      if (userInfo.watermark.appid !== think.config('weixin.appid')) {
        return null;
      }

      // 解析后的数据格式
      // { openId: 'oILjs0JEDIZzaWVc_sJW2k3fhp1k',
      //   nickName: '明天',
      //   gender: 1,
      //   language: 'zh_CN',
      //   city: 'Shenzhen',
      //   province: 'Guangdong',
      //   country: 'China',
      //   avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/9Otwibfa5VXR0ntXdlX84dibbulWLJ0EiacHeAfT1ShG2A7LQa2unfbZVohsWQlmXbwQGM6NnhGFWicY5icdxFVdpLQ/132',
      //   watermark: { timestamp: 1542639764, appid: 'wx262f4ac3b1c477dd' } }
      return userInfo;
    } catch (err) {
      return null;
    }
  }
};

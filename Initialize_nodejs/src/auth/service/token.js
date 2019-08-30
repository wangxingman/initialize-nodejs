/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  上午 11:20 2019/8/27 0027
 *  @explain :
 */

const jwt = require('jsonwebtoken');
const secret = 'SLDLKKDS323ssdd@#@@gf';

module.exports = class extends think.Service{

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  token获取用户id
  */
  async getUserId(token) {
    if (!token) {
      return 0;
    }

    const result = await this.parse(token);
    if (think.isEmpty(result) || result.user_id <= 0) {
      return 0;
    }

    return result.user_id;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  创建token
  */
  async create(userInfo) {
    const token = jwt.sign(userInfo, secret);
    return token;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  解析
  */
  async parse(token) {
    if (token) {
      try {
        return jwt.verify(token, secret);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  验证
  */
  async verify(token) {
    const result = await this.parse(token);
    if (think.isEmpty(result)) {
      return false;
    }
    return true;
  }

}

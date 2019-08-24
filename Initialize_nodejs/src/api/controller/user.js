/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:03 2019/8/23 0023
 *  @explain :  用户
 */
const fs = require('fs');
const _ = require('lodash');

module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'region');
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain : 用户信息
  */
  async infoAction() {
    const userInfo = await this.model('user').where({id: this.getLoginUserId()}).find();
    delete userInfo.password;
    return this.json(userInfo);
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  保存用户的头像
  */
  async saveAvatarAction() {
    const avatar = this.file('avatar');
    if (think.isEmpty(avatar)) {
      return this.fail('保存失败');
    }

    const avatarPath = think.RESOURCE_PATH + `/static/user/avatar/${this.getLoginUserId()}.` + _.last(_.split(avatar.path, '.'));

    fs.rename(avatar.path, avatarPath, function(res) {
      return this.success();
    });
  }



}

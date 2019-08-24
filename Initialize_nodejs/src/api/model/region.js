/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:22 2019/8/23 0023
 *  @explain :
 */
const _ = require('lodash');

module.exports = class extends think.Model {
  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :  获取区域的名称
  */
  async getRegionName(regionId) {
    return this.where({id: regionId}).getField('name', true);
  }

}



/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:22 2019/8/23 0023
 *  @explain :
 */
const _ = require('lodash');

module.exports = class extends think.Model {

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  检查省市区信息是否完整和正确
  */
  async checkFullRegion(provinceId, cityId, districtId) {
    if (think.isEmpty(provinceId) || think.isEmpty(cityId) || think.isEmpty(districtId)) {
      return false;
    }

    const regionList = await this.limit(3).order({'id': 'asc'}).where({id: {'in': [provinceId, cityId, districtId]}}).select();
    if (think.isEmpty(regionList) || regionList.length !== 3) {
      return false;
    }

    // 上下级关系检查
    if (_.get(regionList, ['0', 'id']) !== _.get(regionList, ['1', 'parent_id'])) {
      return false;
    }

    if (_.get(regionList, ['1', 'id']) !== _.get(regionList, ['2', 'parent_id'])) {
      return false;
    }

    return true;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取区域的名称
  */
  async getRegionName(regionId) {
    return this.where({id: regionId}).getField('name', true);
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取下级的地区列表
  */
  async getRegionList(parentId) {
    return this.where({parent_id: parentId}).select();
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取区域的信息
  */
  async getRegionInfo(regionId) {
    return this.where({id: regionId}).find();
  }

}



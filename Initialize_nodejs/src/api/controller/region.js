/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:00 2019/8/23 0023
 *  @explain :  区域
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'region');
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取区域的信息
  */
  async infoAction() {
    const region = await this.model('region').getRegionInfo(this.get('regionId'));
    return this.success(region);
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  获取下级的地区列表
  */
  async listAction() {
    const regionList = await this.model('region').getRegionList(this.get('parentId'));
    return this.success(regionList);
  }

}

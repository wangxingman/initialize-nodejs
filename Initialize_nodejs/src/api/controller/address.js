/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:05 2019/8/23 0023
 *  @explain :
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'addresss');
  }
  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 获取用户的收货地址
  */
  async listAction() {
    const baseModel = this.getBaseModel();
    const session = await this.session('user');
    const userId = session.id;
    const addressList = await baseModel.where({user_id: userId}).select();
    let itemKey = 0;
    for(const addressItem of addressList) {
      addressList[itemKey].province_name = await this.model('region').getRegionName(addressItem.province_id);
      addressList[itemKey].city_name = await this.model('region').getRegionName(addressItem.city_id);
      addressList[itemKey].district_name = await this.model('region').getRegionName(addressItem.district_id);
      addressList[itemKey].full_region = addressList[itemKey].province_name + addressList[itemKey].city_name + addressList[itemKey].district_name;
      itemKey += 1;
    }
    return this.success(addressList);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :  获取收货地址的详情
  */
  async detailAction() {
    const addressId = this.get('id');
    const session = await this.session('user');
    const userId = session.id;
    const baseModel = this.getBaseModel();
    const addressInfo = await baseModel.where({user_id: userId, id: addressId}).find();
    if (!think.isEmpty(addressInfo)) {
      addressInfo.province_name = await this.model('region').getRegionName(addressInfo.province_id);
      addressInfo.city_name = await this.model('region').getRegionName(addressInfo.city_id);
      addressInfo.district_name = await this.model('region').getRegionName(addressInfo.district_id);
      addressInfo.full_region = addressInfo.province_name + addressInfo.city_name + addressInfo.district_name;
    }

    return this.success(addressInfo);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain :  添加或者跟新收货地址
  */
  async saveAction() {
    let addressId = this.post('id');
    const baseModel = this.getBaseModel();
    const session = await this.session('user');
    const userId = session.id;
    const addressData = {
      name: this.post('name'),
      mobile: this.post('mobile'),
      province_id: this.post('province_id'),
      city_id: this.post('city_id'),
      district_id: this.post('district_id'),
      address: this.post('address'),
      user_id: userId,
      is_default: this.post('is_default') === true ? 1 : 0
    };

    if (think.isEmpty(addressId)) {
      addressId = await baseModel.add(addressData);
    } else {
      await baseModel.where({id: addressId, user_id: userId}).update(addressData);
    }

    // 如果设置为默认，则取消其它的默认
    if (this.post('is_default') === true) {
      await baseModel.where({id: ['<>', addressId], user_id: userId}).update({
        is_default: 0
      });
    }
    const addressInfo = await baseModel.where({id: addressId}).find();

    return this.success(addressInfo);
  }

  /**
  *@Date    :  2019/8/23 0023
  *@Author  :  wx
  *@explain : 删除收货地址
  */
  async deleteAction() {
    const baseModel = this.getBaseModel();
    const addressId = this.post('id');
    const session = await this.session('user');
    const userId = session.id;
    await baseModel.where({id: addressId, user_id: userId}).delete();
    return this.success('删除成功');
  }

}

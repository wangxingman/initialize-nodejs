/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:11 2019/8/26 0026
 *  @explain :
 */
module.exports = class extends think.Model {

  /**
  *@Date    :  2019/8/26 0026
  *@Author  :  wx
  *@explain :  判断用户是否收藏过该对象
  */
  async isUserHasCollect(userId, typeId, valueId) {
    const hasCollect = await this.where({type_id: typeId, value_id: valueId, user_id: userId}).limit(1).count('id');
    return hasCollect;
  }
};


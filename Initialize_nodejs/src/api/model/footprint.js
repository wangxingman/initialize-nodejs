/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 6:54 2019/8/23 0023
 *  @explain :  足迹
 */
module.exports = class extends think.Model {

  /**
  *@Date    :  2019/8/26 0026
  *@Author  :  wx
  *@explain :  添加足迹
  */
  async addFootprint(userId, goodsId) {
    // 用户已经登录才可以添加到足迹
    await this.transaction(async() =>{
      if (userId > 0 && goodsId > 0) {
        await this.add({
          goods_id: goodsId,
          user_id: userId,
          add_time: parseInt(Date.now() / 1000)
        });
      }
    })
  }
};

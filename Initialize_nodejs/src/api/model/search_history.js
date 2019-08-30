/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 2:20 2019/8/26 0026
 *  @explain :
 */
module.exports = class extends think.Model {
  /**
   *@Date    :  2019/8/26 0026
   *@Author  :  wx
   *@explain :  添加搜索历史
   */
  async addSearchHistory(keyword, userId) {
    console.log("userId"+userId);
    const result = await this.transaction(async() => {
      const searchHistory = {
        keyword: keyword,
        user_id: userId,
        add_time: parseInt(new Date().getTime() / 1000)
      };
      const insertId = await this.add(searchHistory);
      if (!think.isEmpty(insertId)) {
        return true;
      }
      return false;
    });
    return result;
  }
};

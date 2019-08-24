/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:02 2019/8/23 0023
 *  @explain :  历史搜索
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'region');
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  用户搜索的历史记录
  */
  async indexAction() {
    // 取出输入框默认的关键词
    const defaultKeyword = await this.model('keywords').where({ is_default: 1 }).limit(1).find();
    // 取出热闹关键词
    const hotKeywordList = await this.model('keywords').distinct('keyword').field(['keyword', 'is_hot']).limit(10).select();
    const historyKeywordList = await this.model('search_history').distinct('keyword').where({ user_id: this.getLoginUserId() }).limit(10).getField('keyword');

    return this.success({
      defaultKeyword: defaultKeyword,
      historyKeywordList: historyKeywordList,
      hotKeywordList: hotKeywordList
    });
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain : 查询热闹关键词
  */
  async helperAction() {
    const keyword = this.get('keyword');
    const keywords = await this.model('keywords').distinct('keyword').where({ keyword: ['like', keyword + '%'] }).getField('keyword', 10);
    return this.success(keywords);
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  清空历史
  */
  async clearhistoryAction() {
    await this.model('search_history').where({ user_id: this.getLoginUserId() }).delete();
    return this.success();
  }

}

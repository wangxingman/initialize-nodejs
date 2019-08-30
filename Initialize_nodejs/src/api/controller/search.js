/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:02 2019/8/23 0023
 *  @explain :  历史搜索
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'search_history');
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  用户搜索的历史记录
  */
  async indexAction() {
    const baseModel = this.getBaseModel();
    const user = await this.session('user');
    const userId = user.id;
    // 取出输入框默认的关键词
    const defaultKeyword = await this.model('keywords').where({ is_default: 1 }).limit(1).find();
    // 取出热闹关键词
    const hotKeywordList = await this.model('keywords').distinct('keyword').field(['keyword', 'is_hot']).limit(10).select();
    const historyKeywordList = await baseModel.distinct('keyword').where({ user_id: userId }).limit(10).getField('keyword');

    return this.success({
      defaultKeyword: defaultKeyword,
      historyKeywordList: historyKeywordList,
      hotKeywordList: hotKeywordList
    });
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain : 搜索帮助
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
    const session = await this.session('user');
    const userId = session.id;
    const baseModel = this.getBaseModel();
    await baseModel.where({ user_id: userId}).delete();
    return this.success();
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :  搜索数据
  */
  async resultAction(){

    return this.success();
  }

}

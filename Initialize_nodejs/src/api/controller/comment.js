/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 6:53 2019/8/23 0023
 *  @explain :  评论
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'comments');
  }

  /**
   *@Date    :  2019/8/24 0024
   *@Author  :  wx
   *@explain :  发表评论
   */
  async postAction() {
    const session = await this.session('user');
    const userId = session.id;
    const typeId = this.post('typeId');
    const valueId = this.post('valueId');
    const content = this.post('content');
    const buffer = Buffer.from(content);
    const insertId = await this.model('comments').add({
      type_id: typeId,
      value_id: valueId,
      content: buffer.toString('base64'),
      add_time:  ['exp', 'CURRENT_TIMESTAMP()'],
      user_id: userId
    });
    if (insertId) {
      return this.success('评论添加成功');
    } else {
      return this.fail('评论保存失败');
    }
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  评论总数量
  */
  async countAction() {
    const typeId = this.get('typeId');
    const valueId = this.get('valueId');
    const allCount = await this.model('comments').where({type_id: typeId, value_id: valueId}).count('id');

    const hasPicCount = await this.model('comments').alias('comment')
      .join({
        table: 'comment_picture',
        join: 'right',
        alias: 'comment_picture',
        on: ['id', 'comment_id']
      }).where({'comment.type_id': typeId, 'comment.value_id': valueId}).count('comment.id');

    return this.success({
      allCount: allCount,
      hasPicCount: hasPicCount
    });
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  全部评论
  */
  async listAction() {
    const session = await this.session('user');
    const userId = session.id;
    const typeId = this.get('typeId');
    const valueId = this.get('valueId');
    const showType = this.get('showType'); // 选择评论的类型 0 全部， 1 只显示图片

    const page = this.get('page');
    const size = this.get('size');

    let comments = [];
    if (showType !== 1) {
      comments = await this.model('comments').where({
        type_id: typeId,
        value_id: valueId
      }).page(page, size).countSelect();
    } else {
      comments = await this.model('comments').alias('comments')
        .field(['comment.*'])
        .join({
          table: 'comment_picture',
          join: 'right',
          alias: 'comment_picture',
          on: ['id', 'comment_id']
        }).page(page, size).where({'comment.type_id': typeId, 'comment.value_id': valueId}).countSelect();
    }

    const commentList = [];
    for (const commentItem of comments.data) {
      const comment = {};
      comment.content = Buffer.from(commentItem.content, 'base64').toString();
      comment.type_id = commentItem.type_id;
      comment.value_id = commentItem.value_id;
      comment.id = commentItem.id;
      comment.add_time = think.datetime(new Date(commentItem.add_time * 1000));
      comment.user_info = await this.model('users').field(['username', 'avatar', 'nickname']).where({id: commentItem.user_id}).find();
      comment.pic_list = await this.model('comment_picture').where({comment_id: commentItem.id}).select();
      commentList.push(comment);
    }
    comments.data = commentList;
    return this.success(comments);
  }

};

/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 12:24 2019/8/23 0023
 *  @explain :  种类 即是目录 nideshop_category
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'category');
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain :  二级标题
   */
  async indexAction() {
    const baseModel = this.getBaseModel();
    const data = await baseModel.where({is_show: 1}).order(['sort_order_ASC']).select();
    const topCategory = data.filter((item) => {
      return item.parent_id === 0;
    });
    const categoryList = [];
    topCategory.map((item) => {
      item.level = 1;
      categoryList.push(item);
      data.map((child) => {
        if (child.parent_id === item.id) {
          child.level = 2;
          categoryList.push(child);
        }
      });
    });
    return this.success(categoryList);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain : 一级标题
   */
  async topCategoryAction() {
    const baseModel = this.getBaseModel();
    const data = await baseModel.where({parent_id: 0}).order(['id ASC']).select();
    return this.success(data);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain : 对应查询
   */
  async infoAction() {
    const id = this.get('id');
    const baseModel = this.getBaseModel();
    const data = await baseModel.where({id: id}).find();
    return this.success(data);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain : 修改 || 添加
   */
  async storeAction() {
    if (!this.isPost) {
      return false;
    }
    const values = this.post();
    const id = this.post('id');

    const model = this.model('category');
    values.is_show = values.is_show ? 1 : 0;
    if (id > 0) {
      await model.where({id: id}).update(values);
    } else {
      delete values.id;
      await model.add(values);
    }
    return this.success(values);
  }

  /**
   *@Date    :  2019/8/23 0023
   *@Author  :  wx
   *@explain :  删除
   */
  async destoryAction() {
    const id = this.post('id');
    const baseModel = this.getBaseModel();
    await baseModel.where({id: id}).limit(1).delete();
    // TODO 删除图片
    return this.success();
  }

};


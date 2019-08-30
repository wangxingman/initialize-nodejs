module.exports = class extends think.Model {
  /**
  *@Date    :  2019/8/26 0026
  *@Author  :  wx
  *@explain :  是谁的父目录
  */
  async getChildCategoryId(parentId) {
    const childIds = await this.where({parent_id: parentId}).getField('id', 10000);
    return childIds;
  }

  /**
  *@Date    :  2019/8/26 0026
  *@Author  :  wx
  *@explain : 父目录 当前目录
  */
  async getCategoryWhereIn(categoryId) {
    const childIds = await this.getChildCategoryId(categoryId);
    childIds.push(categoryId);
    return childIds;
  }
};

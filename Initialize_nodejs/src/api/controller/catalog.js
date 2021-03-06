/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 4:42 2019/8/23 0023
 *  @explain : 目录
 */
module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'category');
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  获取当前目录数据【以及子目录】 获取一级目录
  */
  async indexAction() {
    const categoryId = this.get('id');

    const model = this.getBaseModel();
    const data = await model.limit(10).where({parent_id: 0}).select();

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await model.where({'id': categoryId}).find();
    }

    if (think.isEmpty(currentCategory)) {
      currentCategory = data[0];
    }

    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      //当前目录下面的子目录
      currentCategory.subCategoryList = await model.where({'parent_id': currentCategory.id}).select();
    }

    return this.success({
      categoryList: data,
      currentCategory: currentCategory
    });
  }

  /**
  *@Date    :  2019/8/24 0024
  *@Author  :  wx
  *@explain :  当前目录【并且下面子目录】【再点击的时候显示下面的子菜单】
  */
  async currentAction() {
    const categoryId = this.get('id');
    const baseModel = this.getBaseModel();

    let currentCategory = null;
    if (categoryId) {
      currentCategory = await baseModel.where({'id': categoryId}).find();
    }
    // 获取子分类数据
    if (currentCategory && currentCategory.id) {
      currentCategory.subCategoryList = await baseModel.where({'parent_id': currentCategory.id}).select();
    }

    return this.success({
      currentCategory: currentCategory
    });
  }

}

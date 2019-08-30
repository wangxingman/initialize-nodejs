const crud = require('./crud')

module.exports = class extends crud {

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :
  */
  async treeAction() {
    const order = this.post('order');
    const _value = this.post('_value');
    const _keyColumn = this.post('_keyColumn');

    const _this = this;

    async function recursion(trees) {
      for (const tree of trees) {
        tree.children = await recursion(await _this.getBaseModel().where({parent_id: tree.id}).order(order).select());
      }
      return trees;
    }

    let parentTrees;
    if (think.isEmpty(_value)) {
      parentTrees = await this.getBaseModel().where({parent_id: null}).order(order).select();
    } else {
      const where = {};
      where[_keyColumn] = _value;
      parentTrees = await this.getBaseModel().where(where).order(order).select();
    }

    const trees = await recursion(parentTrees);
    this.success(trees);
  }

}

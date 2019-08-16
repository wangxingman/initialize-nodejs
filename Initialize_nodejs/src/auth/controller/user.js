module.exports = class extends think.framework.crud {
  constructor(ctx) {
    super(ctx, 'user');
  }

  /**
   * 删除用户
   * @returns {Promise<void>}
   */
  async dAction() {
    console.info("---dAction--------");
    const where = this.post('where');
    const model = this.getBaseModel();
    const b = await model.deleteUser(where);
    if (b) {
      this.success(null, '删除用户成功');
    } else {
      this.fail('删除用户失败');
    }
  }
}

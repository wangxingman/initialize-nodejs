module.exports = class extends think.Model {
  get relation() {
    return {
      role: {
        type: think.Model.MANY_TO_MANY
      },
      department: {
        type: think.Model.BELONG_TO
      }
    };
  }

  /**
   * 删除用户
   * @param where
   * @returns {Promise<void>}
   */
  async deleteUser(where) {
    const result = await this.transaction(async() => {
      const affectedRows = await this.where(where).delete();
      if (affectedRows > 0) {
        // eslint-disable-next-line no-console
        console.log('-----------------');
        return true;
      }
      return false;
    });
    return result;
  }

};

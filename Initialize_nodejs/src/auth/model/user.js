module.exports = class extends think.Model {
  get relation() {
    return {
      role: {
        type: think.Model.MANY_TO_MANY,
        rfKey: 'role_id',
        rModel: 'users_roles'
      },
      dept: {
        type :think.Model.BELONG_TO,
      },
      job: {
        type :think.Model.BELONG_TO,
      },
    };
  }

  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain : 添加用户和角色
   */
  async addUserAndRole(user, roleIds) {
    const result = await this.transaction(async() => {
      user.create_time = ['exp', 'CURRENT_TIMESTAMP()'];
      user.last_password_reset_time = ['exp', 'CURRENT_TIMESTAMP()'];
      if (think.isEmpty(user.enabled)) {
        user.enabled = think.const.number.one;
      }
      let jobId = user.job;
      let deptId = user.dept;
      const jobModel = this.model('job').db(this.db());
      const deptModel = this.model('dept').db(this.db());
      let newVar = await jobModel.where({id: deptId}).find();
      let newDept = await deptModel.where({id: jobId}).find();
      if (!think.isEmpty(newDept) && think.isEmpty(newVar)) {
        const insertId = await this.add(user);
      if (!think.isEmpty(insertId)) {
        const userRoleModel = this.model('users_roles').db(this.db());
        const userRoleIds = roleIds.map(roleId => {
          return {user_id: insertId, role_id: 1};
        });
        await userRoleModel.addMany(userRoleIds);
        return true;
        }
      }
      return false;
    });
    return result;
  }

  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain : 修改用户和角色
   */
  async updateUserAndRole(user, roleIds) {
    const result = await this.transaction(async() => {
      const affectedRows = await this.where({id: user.id}).update(user);
      if (affectedRows > 0) {
        if (roleIds.length > 0) {
          const userRoleModel = this.model('users_roles').db(this.db());
          await userRoleModel.where({user_id: user.id}).delete();
          const userRoleIds = roleIds.map(roleId => {
            return {role_id: roleId, user_id: user.id};
          });
          await userRoleModel.addMany(userRoleIds);
          return true;
        }
      }
      return false;
    });
    return result;
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
        console.log('-----------------');
        return true;
      }
      return false;
    });
    return result;
  }

};

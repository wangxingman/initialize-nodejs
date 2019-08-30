module.exports = class extends think.framework.baseLogic {

  // department_id: {type: ['integer', 'string']},
  // realname: {type: 'string', maxLength: 10, minLength: 1},
  // username: {type: 'string', maxLength: 20, minLength: 1},
  // position_status: {type: 'integer', minimum: 0, maximum: 1}

  /**
   *@Date    :  2019/8/29 0029
   *@Author  :  wx
   *@explain :
   */
  indexAction() {
    this.rules = {
      cp: {
        int: {min: 1},
        required: true,
        method: 'GET',
        aliasName: '页码'
      },
      ps: {
        int: {min: 1},
        required: true,
        method: 'GET',
        aliasName: '数量'
      },
      name: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '查询字段name'
      }
    };
  }

  storeAction() {
    this.rules.jsonSchema = {
      required:[],
      properties:{

      },
      errorMessage:{
        properties:{

        }
      }
    };
  }

};

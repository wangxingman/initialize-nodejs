/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:06 2019/8/26 0026
 *  @explain :  自动验证
 */
module.exports = class extends think.Logic {
  cAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        aliasName: '创建条件'
      },
      data: {
        object: true,
        method: 'POST',
        required: true,
        aliasName: '创建数据'
      }
    };
  }

  cbAction() {
    this.rules = {
      data: {
        array: true,
        method: 'POST',
        required: true,
        aliasName: '创建数据'
      }
    };
  }

  rAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        aliasName: '查询条件'
      },
      field: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '查询字段'
      },
      order: {
        object: true,
        method: 'POST',
        aliasName: '排序字段'
      },
      group: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '分组字段'
      },
      distinct: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '去重字段'
      }
    };
  }

  rbAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        aliasName: '查询条件'
      },
      field: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '查询字段'
      },
      order: {
        object: true,
        method: 'POST',
        aliasName: '排序字段'
      },
      group: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '分组字段'
      },
      distinct: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '去重字段'
      }
    };
  }

  uAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        required: true,
        aliasName: '更新条件'
      },
      data: {
        object: true,
        method: 'POST',
        required: true,
        aliasName: '更新数据'
      }
    };
  }

  ubAction() {
    this.rules = {
      data: {
        array: true,
        method: 'POST',
        required: true,
        aliasName: '更新数据'
      }
    };
  }

  dAction() {
    this.rules = {
      where: {
        object: true,
        method: 'POST',
        required: true,
        aliasName: '删除条件',
        jsonSchema: {
          required: ['id'],
          properties: {
            id: {type: 'number'}
          },
          errorMessage: {
            properties: {
              id: '删除条件不能为空'
            }
          }
        }
      }
    };
  }

  pageAction() {
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
      where: {
        object: true,
        method: 'POST',
        aliasName: '查询条件'
      },
      field: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '查询字段'
      },
      order: {
        object: true,
        method: 'POST',
        aliasName: '排序字段'
      },
      group: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '分组字段'
      },
      distinct: {
        string: true,
        trim: true,
        method: 'POST',
        aliasName: '去重字段'
      }
    };
  }

  treeAction() {
    this.rules = {
      order: {
        object: true,
        method: 'POST',
        aliasName: '排序字段'
      }
    };
  }
};

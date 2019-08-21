const path = require('path');

module.exports = {
  framework: {
    base: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'base')),
    crud: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'crud')),
    baseLogic: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'logic', 'baseLogic'))
  },
  /**
   *@Date    :  2019/8/16 0016
   *@Author  :  wx
   *@explain :
   */
  md5_2(text) {
    return this.md5(this.md5(text));
  },
  /**
  *@Date    :  2019/8/19 0019
  *@Author  :  wx
  *@explain :  公用
  */
  const:{
    user: {
      default_password: '123456'
    },
    number: {
      zreo: 0,
      one: 1,
      tow: 2,
      three: 3,
      four: 4
    },
  }

};

const path = require('path');

module.exports = {
  framework: {
    base: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'base')),
    crud: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'crud')),
  },
  /**
   *@Date    :  2019/8/16 0016
   *@Author  :  wx
   *@explain :
   */
  md5_2(text) {
    return this.md5(this.md5(text));
  }
};

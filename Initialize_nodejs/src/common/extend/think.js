const path = require('path');

module.exports = {
  framework: {
    info: require(path.join(think.ROOT_PATH, 'package.json')),
    crud: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'crud')),
    baseLogic: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'logic', 'baseLogic'))
  }
};

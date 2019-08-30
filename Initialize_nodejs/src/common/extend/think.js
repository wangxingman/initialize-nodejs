const path = require('path');
const crypto = require('crypto');
const fs = require('fs');    //内置的文件传输系统
const moment = require('moment'); //时间插件
const lodash = require('lodash');  //类似java的基本数据结构操作的类
moment.locale('zh-cn');
const md5 = require('md5');
const requestPromise = require('request-promise');


module.exports = {
  moment: moment,
  lodash: _,
  requestPromise: requestPromise,
  md5:md5,
  crypto: crypto,
  fs:fs,
  /**
   *@Date    :  2019/8/27 0027
   *@Author  :  wx
   *@explain :
   */
  framework: {
    info: require(path.join(think.ROOT_PATH, 'package.json')),
    base: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'base')),
    crud: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'crud')),
    tree: require(path.join(think.ROOT_PATH, 'src', 'common', 'framework', 'controller', 'tree')),
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
   *@Date    :  2019/8/27 0027
   *@Author  :  wx
   *@explain : 生成编号
   */
  getSerial(code) {
    const date = new Date();
    const codeDate = think.datetime(date, 'YYYYMMDDHHmmss') + date.getMilliseconds();
    return code + codeDate;
  },
  /**
   *@Date    :  2019/8/19 0019
   *@Author  :  wx
   *@explain :  公用
   */
  const: {
    user: {
      default_password: '123456'
    },
    number: {
      zreo: 0,
      one: 1,
      tow: 2,
      three: 3,
      four: 4,
      seven: 7,
      ten:10,
      one_hundred: 100
    },
  }
};

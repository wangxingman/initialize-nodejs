/** 用来解决一类功能的多种实现 ，这些实现提供一套相同的接口 ，可以很方便不同类型的切换 我理解为就是配置 一些软件 或者应用*/
//todo 回头将适配器的东西熟悉一下
const redisCache = require('think-cache-redis');
const redisSession = require('think-session-redis');
const mysql = require('think-model-mysql');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
/**
 * 缓存配置
 * @type {Object}
 */
exports.cache = {
  type: 'redis',
  common: {
    timeout: 24 * 3600 * 1000 // millisecond
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: '127.0.0.1',
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'game-server-shop',
    prefix: 'nideshop_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    dateStrings: true
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'redis',
  common: {
    cookie: {
      name: 'KH_SESSION'
    }
  },
  redis: {
    handle: redisSession,
    maxAge: 3600 * 1000,
    autoUpdate: true,
    port: 6379,
    host: '127.0.0.1',
  }
};


/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

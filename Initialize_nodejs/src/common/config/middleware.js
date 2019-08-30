/**
*@Date    :  2019/8/20 0020
*@Author  :  wx
*@explain :  中间件
*/

const path = require('path');
const isDev = think.env === 'development';
const session = require('../middleware/ssessionMiddlware');
//跨域资源共享
const koa2_cors = require('koa2-cors');

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb'
    }
  },
  {
    handle: koa2_cors,
    options: {
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept']
    }
  },
  {
    //配置session中间件
    handle: session
  },
  {
    handle: 'router',
    options: {}
  },
  'logic',
  'controller'
];

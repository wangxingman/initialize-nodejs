/** 方便对框架进行扩展。支持的扩展类型为 think、application、context、request、response、controller、logic 和 service 这个意思是这些组件上都可以有扩展组件的功能*/

const view = require('think-view');
const model = require('think-model');
const cache = require('think-cache');
const session = require('think-session');

module.exports = [
  view, // make application support view
  model(think.app),
  cache,
  session
];

module.exports = class extends think.Controller {
   __before() {
  }
  // 如果相应的Action不存在则调用该方法
  __call() {
    this.fail('请求的地址不存在');
  }

};

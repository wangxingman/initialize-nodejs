module.exports = options => {
  return async(ctx, next) => {
    if (ctx.req.url === '/auth' || ctx.req.url === '/auth/user/logout' || ctx.req.url.indexOf('/api') !== -1) {
      return next();
    }
    //异步操作包含在 async 里面 然后调用这个函数，只有等里面的异步操作都执行，变量参数才会有值
    // 请求时，判断 session cookie 值是否相同
    const user = await ctx.session('user');
    if (think.isEmpty(user)) {
      ctx.fail(334, '未登录，无访问权限');
    } else {
      const cookie = ctx.cookie('KH_SESSION');
      const saveCookie = await ctx.cache(`uid-${user.id}`);
      if (saveCookie && saveCookie !== cookie) {
        // 不是最近一台登录的设备【验证号模型像手机发送验证号 提示】
        ctx.fail(333, '此账号已在别处登陆');
      }
    }
  };
};

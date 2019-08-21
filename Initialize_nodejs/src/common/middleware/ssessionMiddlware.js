module.exports = options => {
  return async(ctx, next) => {
    if (ctx.req.url === '/auth' || ctx.req.url === '/auth/user/selectActionExample' || ctx.req.url === '/auth/user/logout' || ctx.req.url.indexOf('/api') !== -1 || ctx.req.url.indexOf('/pda') !== -1) {
      return next();
    }
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
      } else {
        return next();
      }
    }
  };
};

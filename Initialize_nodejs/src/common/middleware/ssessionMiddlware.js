module.exports = options => {
  return async(ctx, next) => {
    if (ctx.req.url === '/auth' || ctx.req.url === '/auth/user/logout' || ctx.req.url.indexOf('/api') !== -1) {
      return next();
    }
    // 请求时，判断 session cookie 值是否相同
    const user = await ctx.session('user');
    if (think.isEmpty(user)) {
      ctx.fail(334, '未登录，无访问权限');
    }
  };
};

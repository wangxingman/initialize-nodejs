module.exports = options => {
  return async(ctx, next) => {

    if (ctx.req.url === '/auth'|| ctx.req.url === '/auth/user/logout' ) {
      return next();
    }

    ctx.state.token = ctx.header['x-nideshop-token'] || '';
    const tokenSerivce = think.service('token', 'auth');
    ctx.state.userId = await tokenSerivce.getUserId(ctx.state.token);

    //session有一个缺陷：如果web服务器做了负载均衡，那么下一个操作请求到了另一台服务器的时候session会丢失。
    // 请求时，判断 session cookie 值是否相同
    const user = await ctx.session('user');     //session保存在服务器 占用我们服务器的内存
    if (think.isEmpty(user) || ctx.state.userId <= 0) {
      ctx.fail(334, '未登录，无访问权限');
    } else {
      //下一次请求同一网站时会把该cookie发送给服务器
      const cookie = ctx.cookie('SESSION');     //cookie保存在客户端 但是可以伪造
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

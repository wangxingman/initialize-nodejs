module.exports = options => {
  return async(ctx, next) => {
    if (ctx.req.url === '/auth' || ctx.req.url === '/auth/user/logout' || ctx.req.url.indexOf('/api') !== -1 || ctx.req.url.indexOf('/pda') !== -1) {
      return next();
    }
  };
};

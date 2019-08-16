module.exports = {
  para(param, def) {
    return this.get(param) || this.post(param) || def;
  }
};

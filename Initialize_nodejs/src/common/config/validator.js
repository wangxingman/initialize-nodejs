/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:13 2019/8/21 0021
 *  @explain :  效验器
 */
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, jsonPointers: true});
require('ajv-errors')(ajv);
//ajv——json模式验证器
module.exports = {
  messages: {
    required: '{name}不能为空',
    string: '{name}必须为字符串',
    object: '{name}必须为对象',
    array: '{name}必须为数组',
    int({name, validName, rule, args, pargs}) {
      if (args) {
        if (rule.value > args.min && rule.value < args.max) {
          return `${rule.aliasName || name}不能小于${args.min}或大于 ${args.max}`;
        } else if (rule.value > args.min) {
          return `${rule.aliasName || name}不能小于${args.min}`;
        } else if (rule.value < args.max) {
          return `${rule.aliasName || name}不能大于${args.max}`;
        }
      }
      return `${rule.aliasName || name}必须为整数`;
    }
  },
  rules: {
    jsonSchema: (value, {argName, validName, validValue, parsedValidValue, rule, rules, currentQuery, ctx}) => {
      const validate = ajv.compile(validValue);
      const valid = validate(value);
      if (valid) return true;
      const error = {};
      validate.errors.forEach(e => {
        error[e.dataPath.substring(1)] = e.message;
      });
      return error;
    }
  }
};



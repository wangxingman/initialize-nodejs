/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 7:06 2019/8/26 0026
 *  @explain :  快递
 */
module.exports = class extends think.Service {

  /**
  *@Date    :  2019/8/26 0026
  *@Author  :  wx
  *@explain :
  */
  async queryExpress(shipperCode, logisticCode, orderCode = '') {
    let expressInfo = {
      success: false,
      shipperCode: shipperCode,
      shipperName: '',
      logisticCode: logisticCode,
      isFinish: 0,
      traces: []
    };
    const fromData = this.generateFromData(shipperCode, logisticCode, orderCode);
    if (think.isEmpty(fromData)) {
      return expressInfo;
    }

    const sendOptions = {
      method: 'POST',
      url: think.config('express.request_url'),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: fromData
    };

    try {
      const requestResult = await think.requestPromise(sendOptions);
      if (think.isEmpty(requestResult)) {
        return expressInfo;
      }
      expressInfo = this.parseExpressResult(requestResult);
      expressInfo.shipperCode = shipperCode;
      expressInfo.logisticCode = logisticCode;
      return expressInfo;
    } catch (err) {
      return expressInfo;
    }
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :
  */
  parseExpressResult(requestResult) {
    const expressInfo = {
      success: false,
      shipperCode: '',
      shipperName: '',
      logisticCode: '',
      isFinish: 0,
      traces: []
    };

    if (think.isEmpty(requestResult)) {
      return expressInfo;
    }

    try {
      if (think.lodash.isString(requestResult)) {
        requestResult = JSON.parse(requestResult);
      }
    } catch (err) {
      return expressInfo;
    }

    if (think.isEmpty(requestResult.Success)) {
      return expressInfo;
    }

    // 判断是否已签收
    if (Number.parseInt(requestResult.State) === 3) {
      expressInfo.isFinish = 1;
    }
    expressInfo.success = true;
    if (!think.isEmpty(requestResult.Traces) && Array.isArray(requestResult.Traces)) {
      expressInfo.traces = think.lodash.map(requestResult.Traces, item => {
        return { datetime: item.AcceptTime, content: item.AcceptStation };
      });
      think.lodash.reverse(expressInfo.traces);
    }
    return expressInfo;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :
  */
  generateFromData(shipperCode, logisticCode, orderCode) {
    const requestData = this.generateRequestData(shipperCode, logisticCode, orderCode);
    const fromData = {
      RequestData: encodeURI(requestData),
      EBusinessID: think.config('express.appid'),
      RequestType: '1002',
      DataSign: this.generateDataSign(requestData),
      DataType: '2'
    };
    return fromData;
  }

  /**
  *@Date    :  2019/8/27 0027
  *@Author  :  wx
  *@explain :
  */
  generateRequestData(shipperCode, logisticCode, orderCode = '') {
    // 参数验证
    const requestData = {
      OrderCode: orderCode,
      ShipperCode: shipperCode,
      LogisticCode: logisticCode
    };
    return JSON.stringify(requestData);
  }

  generateDataSign(requestData) {
    return encodeURI(Buffer.from(think.md5(requestData + think.config('express.appkey'))).toString('base64'));
  }
}

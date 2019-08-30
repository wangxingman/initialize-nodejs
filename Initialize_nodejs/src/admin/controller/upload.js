/**
 *  @Author  : wx
 *  @Desc    :
 *  @Date    :  下午 3:40 2019/8/23 0023
 *  @explain :  上传文件
 */
module.exports = class extends think.framework.base {

  /**
  *@Date    :  2019/8/29 0029
  *@Author  :  wx
  *@explain : 制造商的照片
  */
  async brandPicAction() {
    const brandFile = this.file("brand_pic");
    if (think.isEmpty(brandFile)) {
      return this.fail('保存失败');
    }
    const filename = '/static/upload/brand/' + think.uuid(32) + '.jpg';
    const is = think.fs.createReadStream(brandFile.path);
    const os = think.fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);
    return this.success({
      name: 'brand_pic',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

  /**
  *@Date    :  2019/8/29 0029
  *@Author  :  wx
  *@explain :
  */
  async brandNewPicAction() {
    const brandFile = this.file('brand_new_pic');
    if (think.isEmpty(brandFile)) {
      return this.fail('保存失败');
    }
    const filename = '/static/upload/brand/' + think.uuid(32) + '.jpg';

    const is = think.fs.createReadStream(brandFile.path);
    const os = think.fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return this.success({
      name: 'brand_new_pic',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

  /**
  *@Date    :  2019/8/29 0029
  *@Author  :  wx
  *@explain :  目录
  */
  async categoryWapBannerPicAction() {
    const imageFile = this.file('wap_banner_pic');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/static/upload/category/' + think.uuid(32) + '.jpg';

    const is = think.fs.createReadStream(imageFile.path);
    const os = think.fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'wap_banner_url',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

  /**
  *@Date    :  2019/8/29 0029
  *@Author  :  wx
  *@explain :  专题
  */
  async topicThumbAction() {
    const imageFile = this.file('scene_pic_url');
    if (think.isEmpty(imageFile)) {
      return this.fail('保存失败');
    }
    const that = this;
    const filename = '/static/upload/topic/' + think.uuid(32) + '.jpg';

    const is = think.fs.createReadStream(imageFile.path);
    const os = think.fs.createWriteStream(think.ROOT_PATH + '/www' + filename);
    is.pipe(os);

    return that.success({
      name: 'scene_pic_url',
      fileUrl: 'http://127.0.0.1:8360' + filename
    });
  }

}

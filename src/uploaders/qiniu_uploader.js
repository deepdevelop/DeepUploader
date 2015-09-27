// http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html

import BaseUploader from './base_uploader';

export default class QiniuUploader extends BaseUploader {
  constructor(element, profile, file) {
    super(element, profile, file);

    // Set default upload url.
    if (!this.profile.uploadUrl) {
      this.profile.uploadUrl = 'http://upload.qiniu.com/';
    }
  }

  start() {
    var _this  = this;

    var request = new XMLHttpRequest();
    request.open('GET', this.profile.uptokenUrl, true);
    request.onload = function () {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        _this.uptoken = data.uptoken;
        console.log('Uptoken:', _this.uptoken);

        super.start();
      }
    };

    request.send();
  }

}
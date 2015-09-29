// http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html
// http://jssdk.demo.qiniu.io/

import BaseUploader from './base-uploader';

export default class QiniuUploader extends BaseUploader {
  constructor(element, profile, file) {
    super(element, profile, file);

    // Set default upload url.
    if (!this.profile.uploadUrl) {
      this.profile.uploadUrl = 'http://upload.qiniu.com/';
    }
  }

  // Fetch upload token from profile.uptokenUrl
  _fetchUploadToken(callback) {
    var self = this;
    var request = new XMLHttpRequest();

    request.open('GET', this.profile.uptokenUrl, true);
    request.onload = function () {
      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        self.formData.append('token', data.uptoken);

        callback();
      }
    };

    request.send();  
  }

  onBeforeUpload(callback) {
    self = this;

    super.onBeforeUpload(function() {
      self._fetchUploadToken(callback);
    });
  }

  onFileUploaded(data, callback) {
    var self = this;

    super.onFileUploaded(data, function() {
      self.response.url = self.profile.domain + self.response.key;

      callback();
    });
  }
}
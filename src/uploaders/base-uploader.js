import EventTrigger from '../event-trigger';
import uuid from 'uuid';

export default class BaseUploader {
  constructor(element, profile, file) {
    this.id = uuid.v4();
    this.element = element;
    this.profile = profile;
    this.file = file;

    EventTrigger.trigger(this.element, 'FileAdded', this._detail());
  }

  _detail() {
    return {
      id: this.id,
      element: this.element,
      profile: this.profile,
      file: this.file,
      xhr: this.xhr
    };
  }

  filename() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
        month = month > 9 ? month : '0' + month;

    var fileExt = this.file.name.split('.').pop() || 'tmp';

    return `${year}/${month}/${this.id}.${fileExt}`;
  }

  start() {
    var self = this;

    self.xhr = new XMLHttpRequest();
    self.xhr.open('POST', self.profile.uploadUrl, true);

    this.onBeforeUpload(function() {
      EventTrigger.trigger(self.element, 'BeforeUpload', self._detail());

      self.upload(function() {
        EventTrigger.trigger(self.element, 'FileUpload', self._detail());
      });
    });
  }

  onBeforeUpload(callback) {
    var filename = this.filename();
    this.formData = new FormData();
    this.formData.append('file', this.file);
    // this.formData.append('name', filename);
    this.formData.append('key', filename);

    callback();
  }

  upload(callback) {
    var self = this;

    self.xhr.onload = function () {
      if (self.xhr.status === 200) {
        var data = JSON.parse(self.xhr.responseText);
        self.onFileUploaded(data, function() {
          var detail = self._detail();
          detail.response = self.response;

          EventTrigger.trigger(self.element, 'FileUploaded', detail);
        });
      } else {
        self.onFileError(self.xhr.status, self.xhr.responseText);
      }
    };

    self.xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        var percent = event.loaded / event.total;
        var percentText = percent;

        self.onFileProgress(function() {
          var detail = self._detail();
          detail.percent = percent;

          EventTrigger.trigger(self.element, 'FileProgress', detail);
        });
      }
    };
    self.xhr.send(self.formData);

    callback();
  }

  cancel() {}

  onFileProgress(callback) {
    callback();
  }

  onFileUploaded(data, callback) {
    this.response = data;

    callback();
  }

  onFileError(status, response) {
    var detail = this._detail();
    detail.responseStatus = status;
    detail.responseText = response;

    EventTrigger.trigger(this.element, 'FileError', detail);
  }
}
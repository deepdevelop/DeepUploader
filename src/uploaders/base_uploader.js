import EventTrigger from '../event_trigger';

export default class BaseUploader {
  constructor(element, profile, file) {
    this.element = element;
    this.profile = profile;
    this.file = file;
  }

  _detail() {
    return {
      element: this.element,
      profile: this.profile,
      file: this.file,
      xhr: this.xhr
    };
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
    this.formData = new FormData();
    this.formData.append('file', this.file);
    this.formData.append('name', this.file.name);
    this.formData.append('key', this.file.name);

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
    self.xhr.send(self.formData);

    callback();
  }

  cancel() {}

  onFileProgress() {}

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
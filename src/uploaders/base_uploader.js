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
    this.xhr = new XMLHttpRequest();
    this.xhr.open('POST', this.profile.uploadUrl, true);

    this.onBeforeUpload();
  }

  upload() {
    EventTrigger.trigger(this.element, 'FileUpload', this._detail());
    console.log('File upload:', this.file);
  }

  cancel() {}

  onBeforeUpload() {
    EventTrigger.trigger(this.element, 'BeforeUpload', this._detail());

    this.upload();
  }

  onFileUpload() {}

  onFileProgress() {}

  onFileUploaded() {}

  onFileError() {}
}
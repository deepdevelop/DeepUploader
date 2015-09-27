export default class BaseUploader {
  constructor(element, profile, file) {
    this.element = element;
    this.profile = profile;
    this.file = file;
  }

  start() {}

  upload() {}

  cancel() {}

  onFileAdded() {}

  onBeforeUpload() {}

  onFileUpload() {}

  onFileProgress() {}

  onFileUploaded() {}

  onFileError() {}
}
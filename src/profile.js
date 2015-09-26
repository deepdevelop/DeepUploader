export default class Profile {
  constructor(uploader, options={}) {
    this.uploader = uploader;
    
    this.name = options.name;
    this.bucket = options.bucket;
    this.domain = options.domain;
    this.ssl = options.ssl || false;
    this.accept = options.accept;
    this.uptokenUrl = options.uptokenUrl;

    this.public = true;
    if (options.public !== undefined) {
      this.public = options.public;
    }
  }
}
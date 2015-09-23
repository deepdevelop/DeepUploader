import Profile from './profile';

class QiniuUploader {
  constructor(options={}) {
    uptokenUrl = options.uptokenUrl;

    // Register profiles if any.
    if (Array.isArray(options.profiles)) {
      options.profiles.forEach(profile => {
        register(profile);
      });
    }
  }

  register(profile) {
    profiles[profile.name] = new Profile(uploader, profile);
  }
}

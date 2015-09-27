import FileTrigger from './file_trigger';
import QiniuUploader from './uploaders/qiniu_uploader';

var profiles     = [];
var uploaders    = {
  qiniu: QiniuUploader
};


var DeepUploader = {};

function getProfile(name) {
  var profile = profiles[name];

  if (profile) {
    return profile;
  } else {
    throw `Profile '${name}' not registered.`;
  }
}

function getUploader(element, profile, file) {
  var Uploader = uploaders[profile.uploader];
  if (!Uploader) {
    throw `Unsupported uploader '${profile.uploader}'.`;
  }

  return new Uploader(element, profile, file);
}

// Register profile.
DeepUploader.register = function(profile) {
  profiles[profile.name] = profile;
};

// Trigger file dialog
DeepUploader.browse = function(element, uploaderProfile) {
  var profileName = element.dataset.uploaderProfile || uploaderProfile;
  var profile = getProfile(profileName);

  FileTrigger.trigger(element, profile, function(file) {
    var uploader = getUploader(element, profile, file);
    uploader.start();
  });
};

DeepUploader.browseHandler = function() {
  DeepUploader.browse(this);
};

window.DeepUploader = DeepUploader;
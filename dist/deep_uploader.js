(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _file_trigger = require('./file_trigger');

var _file_trigger2 = _interopRequireDefault(_file_trigger);

var _uploadersQiniu_uploader = require('./uploaders/qiniu_uploader');

var _uploadersQiniu_uploader2 = _interopRequireDefault(_uploadersQiniu_uploader);

var profiles = [];
var uploaders = {
  qiniu: _uploadersQiniu_uploader2['default']
};

var DeepUploader = {};

function getProfile(name) {
  var profile = profiles[name];

  if (profile) {
    return profile;
  } else {
    throw 'Profile \'' + name + '\' not registered.';
  }
}

function getUploader(element, profile, file) {
  var Uploader = uploaders[profile.uploader];
  if (!Uploader) {
    throw 'Unsupported uploader \'' + profile.uploader + '\'.';
  }

  return new Uploader(element, profile, file);
}

// Register profile.
DeepUploader.register = function (profile) {
  profiles[profile.name] = profile;
};

// Trigger file dialog
DeepUploader.browse = function (element, uploaderProfile) {
  var profileName = element.dataset.uploaderProfile || uploaderProfile;
  var profile = getProfile(profileName);

  _file_trigger2['default'].trigger(element, profile, function (file) {
    var uploader = getUploader(element, profile, file);
    uploader.start();
  });
};

DeepUploader.browseHandler = function () {
  DeepUploader.browse(this);
};

window.DeepUploader = DeepUploader;

},{"./file_trigger":3,"./uploaders/qiniu_uploader":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EventTrigger = {};

EventTrigger.trigger = function (element, eventName) {
  var detail = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  element.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail: detail
  }));
};

exports["default"] = EventTrigger;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _event_trigger = require('./event_trigger');

var _event_trigger2 = _interopRequireDefault(_event_trigger);

function makeInput(element, profile) {
  var input = document.createElement('input');

  input.setAttribute('type', 'file');

  if (profile.accept) {
    input.setAttribute('accept', profile.accept);
  }

  input.style.visibility = 'hidden';
  input.style.position = 'absolute';
  input.style.width = '1px';
  input.style.height = '1px';

  document.body.appendChild(input);

  return input;
}

var FileTrigger = {};

FileTrigger.trigger = function (element, profile, callback) {
  var input = makeInput(element, profile);
  input.addEventListener('change', function (event) {
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {
      callback(files[i]);
      _event_trigger2['default'].trigger(element, 'FileAdded', {
        element: element,
        profile: profile,
        file: files[i]
      });
    }

    // Destroy the file input
    input.parentNode.removeChild(input);
  }, false);

  input.click();
};

exports['default'] = FileTrigger;
module.exports = exports['default'];

},{"./event_trigger":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _event_trigger = require('../event_trigger');

var _event_trigger2 = _interopRequireDefault(_event_trigger);

var BaseUploader = (function () {
  function BaseUploader(element, profile, file) {
    _classCallCheck(this, BaseUploader);

    this.element = element;
    this.profile = profile;
    this.file = file;
  }

  _createClass(BaseUploader, [{
    key: '_detail',
    value: function _detail() {
      return {
        element: this.element,
        profile: this.profile,
        file: this.file,
        xhr: this.xhr
      };
    }
  }, {
    key: 'start',
    value: function start() {
      var self = this;

      self.xhr = new XMLHttpRequest();
      self.xhr.open('POST', self.profile.uploadUrl, true);

      this.onBeforeUpload(function () {
        _event_trigger2['default'].trigger(self.element, 'BeforeUpload', self._detail());

        self.upload(function () {
          _event_trigger2['default'].trigger(self.element, 'FileUpload', self._detail());
        });
      });
    }
  }, {
    key: 'onBeforeUpload',
    value: function onBeforeUpload(callback) {
      this.formData = new FormData();
      this.formData.append('file', this.file);
      this.formData.append('name', this.file.name);
      this.formData.append('key', this.file.name);

      callback();
    }
  }, {
    key: 'upload',
    value: function upload(callback) {
      var self = this;

      self.xhr.onload = function () {
        if (self.xhr.status === 200) {
          var data = JSON.parse(self.xhr.responseText);
          self.onFileUploaded(data, function () {
            var detail = self._detail();
            detail.response = self.response;

            _event_trigger2['default'].trigger(self.element, 'FileUploaded', detail);
          });
        } else {
          self.onFileError(self.xhr.status, self.xhr.responseText);
        }
      };

      self.xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var percent = event.loaded / event.total;
          var percentText = percent;

          self.onFileProgress(function () {
            var detail = self._detail();
            detail.percent = percent;

            _event_trigger2['default'].trigger(self.element, 'FileProgress', detail);
          });
        }
      };
      self.xhr.send(self.formData);

      callback();
    }
  }, {
    key: 'cancel',
    value: function cancel() {}
  }, {
    key: 'onFileProgress',
    value: function onFileProgress(callback) {
      callback();
    }
  }, {
    key: 'onFileUploaded',
    value: function onFileUploaded(data, callback) {
      this.response = data;

      callback();
    }
  }, {
    key: 'onFileError',
    value: function onFileError(status, response) {
      var detail = this._detail();
      detail.responseStatus = status;
      detail.responseText = response;

      _event_trigger2['default'].trigger(this.element, 'FileError', detail);
    }
  }]);

  return BaseUploader;
})();

exports['default'] = BaseUploader;
module.exports = exports['default'];

},{"../event_trigger":2}],5:[function(require,module,exports){
// http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html
// http://jssdk.demo.qiniu.io/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _base_uploader = require('./base_uploader');

var _base_uploader2 = _interopRequireDefault(_base_uploader);

var QiniuUploader = (function (_BaseUploader) {
  _inherits(QiniuUploader, _BaseUploader);

  function QiniuUploader(element, profile, file) {
    _classCallCheck(this, QiniuUploader);

    _get(Object.getPrototypeOf(QiniuUploader.prototype), 'constructor', this).call(this, element, profile, file);

    // Set default upload url.
    if (!this.profile.uploadUrl) {
      this.profile.uploadUrl = 'http://upload.qiniu.com/';
    }
  }

  // Fetch upload token from profile.uptokenUrl

  _createClass(QiniuUploader, [{
    key: '_fetchUploadToken',
    value: function _fetchUploadToken(callback) {
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
  }, {
    key: 'onBeforeUpload',
    value: function onBeforeUpload(callback) {
      self = this;

      _get(Object.getPrototypeOf(QiniuUploader.prototype), 'onBeforeUpload', this).call(this, function () {
        self._fetchUploadToken(callback);
      });
    }
  }, {
    key: 'onFileUploaded',
    value: function onFileUploaded(data, callback) {
      var self = this;

      _get(Object.getPrototypeOf(QiniuUploader.prototype), 'onFileUploaded', this).call(this, data, function () {
        var filename = encodeURIComponent(self.response.key);
        self.response.url = self.profile.domain + filename;

        callback();
      });
    }
  }]);

  return QiniuUploader;
})(_base_uploader2['default']);

exports['default'] = QiniuUploader;
module.exports = exports['default'];

},{"./base_uploader":4}]},{},[1]);

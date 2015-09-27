(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

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

//   upload(file, element, profile) {
//     var formData = new FormData();
//     // FIXME: 使用自定义的 filename
//     formData.append(this.options.paramName, file, file.name);

//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', profile.uploadUrl, true);
//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         uploadButton.innerHTML = 'Upload';
//       } else {
//         alert('An error occurred!');
//       }
//     };
//     xhr.send(formData);
//   }

window.DeepUploader = DeepUploader;

},{"./file_trigger":3,"./profile":4,"./uploaders/qiniu_uploader":6}],2:[function(require,module,exports){
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
"use strict";

// export default class Profile {
//   constructor(options={}) {
//     this.name = options.name;
//     this.adapter = options.adapter;

//     this.bucket = options.bucket;
//     this.domain = options.domain;
//     this.ssl = options.ssl || false;
//     this.uptokenUrl = options.uptokenUrl;
//     this.uploadUrl = options.uploadUrl || 'http://upload.qiniu.com/'

//     this.public = true;
//     if (options.public !== undefined) {
//       this.public = options.public;
//     }
//   }
// }

},{}],5:[function(require,module,exports){
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
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', this.profile.uploadUrl, true);

      this.onBeforeUpload();
    }
  }, {
    key: 'upload',
    value: function upload() {
      _event_trigger2['default'].trigger(this.element, 'FileUpload', this._detail());
      console.log('File upload:', this.file);
    }
  }, {
    key: 'cancel',
    value: function cancel() {}
  }, {
    key: 'onBeforeUpload',
    value: function onBeforeUpload() {
      _event_trigger2['default'].trigger(this.element, 'BeforeUpload', this._detail());

      this.upload();
    }
  }, {
    key: 'onFileUpload',
    value: function onFileUpload() {}
  }, {
    key: 'onFileProgress',
    value: function onFileProgress() {}
  }, {
    key: 'onFileUploaded',
    value: function onFileUploaded() {}
  }, {
    key: 'onFileError',
    value: function onFileError() {}
  }]);

  return BaseUploader;
})();

exports['default'] = BaseUploader;
module.exports = exports['default'];

},{"../event_trigger":2}],6:[function(require,module,exports){
// http://developer.qiniu.com/docs/v6/api/overview/up/form-upload.html

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

  _createClass(QiniuUploader, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var _this = this;

      var request = new XMLHttpRequest();
      request.open('GET', this.profile.uptokenUrl, true);
      request.onload = function () {
        if (request.status === 200) {
          var data = JSON.parse(request.responseText);
          _this.uptoken = data.uptoken;
          console.log('Uptoken:', _this.uptoken);

          _get(Object.getPrototypeOf(QiniuUploader.prototype), 'start', _this2).call(_this2);
        }
      };

      request.send();
    }
  }]);

  return QiniuUploader;
})(_base_uploader2['default']);

exports['default'] = QiniuUploader;
module.exports = exports['default'];

},{"./base_uploader":5}]},{},[1]);

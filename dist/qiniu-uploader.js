(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Profile = function Profile(uploader) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  _classCallCheck(this, Profile);

  this.uploader = uploader;

  this.name = options.name;
  this.bucket = options.bucket;
  this.domain = options.domain;
  this.ssl = options.ssl || false;
  this.accept = options.accept;
  this.uptokenUrl = options.uptokenUrl;

  this["public"] = true;
  if (options["public"] !== undefined) {
    this["public"] = options["public"];
  }
};

exports["default"] = Profile;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var singleton = Symbol();
var singletonEnforcer = Symbol();

var QiniuUploader = (function () {
  function QiniuUploader(enforcer) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, QiniuUploader);

    if (enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    } else {
      this.uptokenUrl = options.uptokenUrl;
      this.profiles = [];
      this.files = [];

      // Register profiles if any.
      if (Array.isArray(options.profiles)) {
        options.profiles.forEach(function (profile) {
          _this.register(profile);
        });
      }
    }
  }

  _createClass(QiniuUploader, [{
    key: "register",
    value: function register(profile) {
      this.profiles[profile.name] = new _profile2["default"](this, profile);
    }
  }, {
    key: "_makeInput",
    value: function _makeInput(element, profile) {
      var uploader = this;
      var input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', profile.accept);

      Object.assign(input.style, {
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px'
      });

      document.body.appendChild(input);
      input.addEventListener('change', function (e) {
        if (input.value.length > 0) {
          uploader.addFiles(e.target.files, element, profile);
        }

        // Destroy the file input
        input.parentNode.removeChild(input);
      }, false);

      return input;
    }
  }, {
    key: "addFiles",
    value: function addFiles(files, element, profile) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        this.files.push(file);

        var event = new CustomEvent('qinu:file:added', {
          bubbles: true,
          detail: {
            'uploader': this,
            'profile': profile
          }
        });

        element.dispatchEvent(event);
      }
    }
  }, {
    key: "browse",
    value: function browse(element, profileName) {
      var profile = this.profiles[profileName];
      if (!profile) throw "Profile '" + profileName + "' not registered";

      var input = this._makeInput(element, profile);
      input.click();
    }
  }], [{
    key: "init",
    value: function init() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this[singleton]) {
        throw 'Uploader has initialized.';
      }

      this[singleton] = new QiniuUploader(singletonEnforcer, options);
    }
  }, {
    key: "instance",
    get: function get() {
      if (this[singleton]) {
        return this[singleton];
      } else {
        throw "Uploader not configured.";
      }
    }
  }]);

  return QiniuUploader;
})();

window.QiniuUploader = QiniuUploader;

},{"./profile":1}]},{},[2]);

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

var QiniuUploader = (function () {
  function QiniuUploader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, QiniuUploader);

    uptokenUrl = options.uptokenUrl;

    // Register profiles if any.
    if (Array.isArray(options.profiles)) {
      options.profiles.forEach(function (profile) {
        register(profile);
      });
    }
  }

  _createClass(QiniuUploader, [{
    key: 'register',
    value: function register(profile) {
      profiles[profile.name] = new _profile2['default'](uploader, profile);
    }
  }]);

  return QiniuUploader;
})();
//# sourceMappingURL=qiniu-uploader.js.map

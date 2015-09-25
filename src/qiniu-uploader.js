import Profile from './profile';

var singleton = Symbol();
var singletonEnforcer = Symbol();

class QiniuUploader {
  constructor(enforcer, options={}) {
    if(enforcer != singletonEnforcer) {
      throw "Cannot construct singleton";
    } else {
      this.uptokenUrl = options.uptokenUrl;
      this.profiles = [];
      this.files = [];

      // Register profiles if any.
      if (Array.isArray(options.profiles)) {
        options.profiles.forEach(profile => {
          this.register(profile);
        });
      }
    }
  }

  static get instance() {
    if (this[singleton]) {
      return this[singleton];
    } else {
      throw "Uploader not configured.";
    }
  }

  register(profile) {
    this.profiles[profile.name] = new Profile(this, profile);
  }

  static init(options={}) {
    if (this[singleton]) { throw 'Uploader has initialized.'; }

    this[singleton] = new QiniuUploader(singletonEnforcer, options);
  }

  _makeInput(element, profile) {
    var uploader = this;
    var input = document.createElement('input');
    input.setAttribute('type', 'file');

    Object.assign(input.style, {
      visibility: 'hidden',
      position: 'absolute',
      width: '1px',
      height: '1px'
    });

    document.body.appendChild(input);
    input.addEventListener('change', e => {
      if (e.target.value) {
        uploader.addFiles(e.target.files, element, profile);
      }

      // Destroy the file input
      input.parentNode.removeChild(input);
    }, false);
    
    return input;
  }

  addFiles(files, element, profile) {
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

  browse(element, profileName) {
    var profile = this.profiles[profileName];
    if (!profile) throw `Profile '${profileName}' not registered`;

    var input = this._makeInput(element, profile);
    input.click();
  }
}

window.QiniuUploader = QiniuUploader;
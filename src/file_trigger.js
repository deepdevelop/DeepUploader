import EventTrigger from './event_trigger';

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

FileTrigger.trigger = function(element, profile, callback) {
  var input = makeInput(element, profile);
  input.addEventListener('change', event => {
    var files = event.target.files;

    for (var i = 0; i < files.length; i++) {
      callback(files[i]);
      EventTrigger.trigger(element, 'FileAdded', {
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

export default FileTrigger;
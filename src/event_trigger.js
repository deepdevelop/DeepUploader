
var EventTrigger = {};

EventTrigger.trigger = function(element, eventName, detail={}) {
  element.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail: detail
  }));
};

export default EventTrigger;
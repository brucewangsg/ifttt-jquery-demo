$(document).ready(function () {

  // imagine that we will have to query a list of available trigger services

  $.mockAPI.get("/api/triggers", function (triggers) {
    console.log(triggers);
    $.defaultTracker.set("triggerSelections", triggers);
  });

});

$.defaultTracker.listen({
  "triggerSelections[track]" : function (oldValue, newValue) {
    console.log("selections ", newValue);

    // when there are available selections, allow enable this button
    $('.cc-this-button')[newValue.length > 0 ? "removeClass" : "addClass"]("disabled");
  },
  "triggerCategory[track]" : function (oldValue, newValue) {
    // when this trigger service get selected, e.g. RSS

    $('.cc-trigger-service-name').text(newValue.title);
    $('.cc-this-was-selected').css('display', newValue ? "block" : "none");

  }
});

$.act({
  // make this a common dropdown function
  //
  "show-dropdown-selection[click]" : function (el, ev) {
    if (el.parent().children('.cc-dropdown.on-show')[0]) {
      return;
    }

    el.parent().children('.cc-dropdown').addClass('on-show');
    el.parent().children('.cc-dropdown').css({
      display : 'block',
      width : 400,
      position : 'absolute',
      top : 40,
      left : 0,
      maxHeight : 300
    });

    // hide the selection popup
    var cancelShow = (function (el) {
      return function (ev) {
        if ($(ev.target).parents('.cc-dropdown:first')[0]) {
          return;        
        }
        el.parent().children('.cc-dropdown').removeClass('on-show');
        el.parent().children('.cc-dropdown').css({
          display : 'none'
        });
        $(document).unbind('mousedown', cancelShow);
      };
    })(el);
    $(document).bind('mousedown', cancelShow);
  },

  // Choose which trigger service inside trigger selection popup, e.g. RSS
  // 
  "choose-this[click]" : function (el, ev) {
    var serviceID = parseInt(el.attr('serviceid')||"0");
    var triggers = $.defaultTracker.get("triggerSelections");

    // find the trigger
    for (var i = 0, len = triggers.length; i < len; i++) {
      if (triggers[i].id == serviceID) {
        var trigger = triggers[i];
        $.defaultTracker.set("triggerCategory", trigger);

        // close selection popup
        $('.cc-this-selection').removeClass('on-show');
        $('.cc-this-selection').css({
          display : 'none'
        });
      }
    }
  }
});
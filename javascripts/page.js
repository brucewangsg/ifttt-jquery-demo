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

  }
});

$.act({
  "show-this-selection[click]" : function (el, ev) {
    if ($('.cc-this-selection.on-show')[0]) {
      return;
    }

    $('.cc-this-selection').addClass('on-show');
    $('.cc-this-selection').css({
      display : 'block',
      width : 400,
      position : 'absolute',
      top : 40,
      left : 0,
      maxHeight : 300
    });

    // hide the selection popup
    var cancelShow = function (ev) {
      if ($(ev.target).parents('.cc-this-selection:first')[0]) {
        return;        
      }
      $('.cc-this-selection').removeClass('on-show');
      $('.cc-this-selection').css({
        display : 'none'
      });
      $(document).unbind('mousedown', cancelShow);
    };
    $(document).bind('mousedown', cancelShow);
  },
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
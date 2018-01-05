$(document).ready(function () {

  // imagine that we will have to query a list of available trigger services

  $.mockAPI.get("/api/triggerServices", function (triggerServices) {
    console.log(triggerServices);
    $.defaultTracker.set("triggerServices", triggerServices);
  });

});

$.defaultTracker.listen({
  "triggerServices[track]" : function (oldValue, newValue) {
    console.log("selections ", newValue);

    // when there are available selections, allow enable this button
    $('.cc-this-button')[newValue.length > 0 ? "removeClass" : "addClass"]("disabled");
  },
  "triggerCategory[track]" : function (oldValue, newValue) {
    // when this trigger service get selected, e.g. RSS

    $('.cc-trigger-service-name').text(newValue.title);
    $('.cc-this-was-selected').css('display', newValue ? "block" : "none");

    $.mockAPI.get("/api/triggers", { trigger_service_id : newValue.id }, function (triggers) {
      $.defaultTracker.set("triggers", triggers);
    });
  },
  "triggers[track]" : function (oldValue, newValue) {
    if (newValue) {
      // hide all selections
      $('.cc-trigger-selection').children().css('display', 'none');      
      if (newValue.length > 0) {
        $('.cc-trigger-selection').children('.cc-no-selection').css('display', 'none');
      }
      for (var i = 0, len = newValue.length; i < len; i++) {
        var node = $('.cc-item[triggerid="'+newValue[i].id+'"]');
        node.parent().css('display', 'block'); // show selection
      }
    } 

    if (!newValue || newValue.length == 0) {
      $('.cc-trigger-selection').children().css('display', 'none');
      $('.cc-trigger-selection').children('.cc-no-selection').css('display', 'block');
    }
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
    var triggers = $.defaultTracker.get("triggerServices");

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
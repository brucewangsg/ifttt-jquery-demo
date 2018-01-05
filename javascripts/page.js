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
  "selectedTriggerService[track]" : function (oldValue, newValue) {
    // when this trigger service get selected, e.g. RSS

    $('.cc-trigger-service-name').text(newValue.title);
    $('.cc-this-was-selected').css('display', newValue ? "block" : "none");

    $.mockAPI.get("/api/triggers", { trigger_service_id : newValue.id }, function (triggers) {
      $.defaultTracker.set("triggers", triggers);
    });
  },
  "triggers[track]" : function (oldValue, newValue) {
    if (newValue) {
      // we skip the trigger selection HTML rendering, let's assume it's already done by templating engine
      // right now it's hardcoded

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
  },
  "selectedTrigger[track]" : function (oldValue, newValue) {
    $('.cc-trigger-selected').css('display', newValue && newValue.id == 1 ? 'block' : 'none');
    $('.cc-trigger-no-implementation').css('display', !newValue || newValue.id != 1 ? 'block' : 'none');

    $('.cc-choose-trigger-button').css('display', newValue ? 'none' : 'block');
    $('.cc-choose-trigger-label').css('display', newValue ? 'none' : 'block');
  },
  "triggerAttributes[track]" : function (oldValue, newValue) {
    $.defaultTracker.set("isValidTrigger", newValue.address);
  },
  "isValidTrigger[track]" : function (oldValue, newValue) {
    $('.cc-continue-button').css('display', newValue ? 'inline-block' : 'none');
  },
  // if set to true, conclude customization of trigger 
  //
  "isTriggerSceneDone[track]" : function (oldValue, newValue) {
    $('.cc-feed-address').text($.defaultTracker.get("triggerAttributes").address);
    $('.cc-trigger-summary').css('display', newValue ? 'block' : 'none');

    if (newValue) {
      $('.cc-trigger-selected').css('display', 'none');    
      $('.cc-trigger-no-implementation').css('display', 'none');          
    } else {
      $.defaultTracker.check("selectedTrigger");
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

  // Choose which trigger service inside selection popup, e.g. RSS
  // 
  "choose-this[click]" : function (el, ev) {
    var serviceID = parseInt(el.attr('serviceid')||"0");
    var triggerServices = $.defaultTracker.get("triggerServices");

    // find the trigger
    for (var i = 0, len = triggerServices.length; i < len; i++) {
      if (triggerServices[i].id == serviceID) {
        var triggerService = triggerServices[i];
        $.defaultTracker.set("selectedTriggerService", triggerService);

        // close selection popup
        $('.cc-this-selection').removeClass('on-show');
        $('.cc-this-selection').css({
          display : 'none'
        });
      }
    }
  },

  // Choose which trigger, e.g. which RSS trigger
  //
  "choose-trigger[click]" : function (el, ev) {
    var triggerID = parseInt(el.attr('triggerid')||"0");
    var triggers = $.defaultTracker.get("triggers");

    // find the trigger
    for (var i = 0, len = triggers.length; i < len; i++) {
      if (triggers[i].id == triggerID) {
        var trigger = triggers[i];
        $.defaultTracker.set("selectedTrigger", trigger);

        // close selection popup
        $('.cc-trigger-selection').removeClass('on-show');
        $('.cc-trigger-selection').css({
          display : 'none'
        });
      }
    }
  },

  // reselect another trigger
  //
  "choose-another-trigger[click]" : function (el, ev) {
    $.actor.getListener("show-dropdown-selection[click]")($('.cc-choose-trigger-button'), ev);
  },

  // e.g. input field changed
  //
  "update-trigger-attributes[change]" : function (el, ev) {
    // simple implementation of capturing attribute values
    var container = el.parents('.cc-container:first');
    var inputs = container.find('input');
    var attributes = {};
    for (var i = 0, len = inputs.length; i < len; i++) {
      attributes[inputs.eq(i).attr('name')] = inputs.eq(i).val();
    }
    $.defaultTracker.set("triggerAttributes", attributes);
  },

  // proceed with choosing action services
  // 
  "continue-choosing-trigger[click]" : function () {
    if ($.defaultTracker.get("isValidTrigger")) {
      $.defaultTracker.set("isTriggerSceneDone", true);
    }
  },

  "edit-trigger[click]" : function () {
    $.defaultTracker.set("isTriggerSceneDone", false);
  }

});
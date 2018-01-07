$(document).ready(function () {

  // imagine that we will have to query a list of available trigger services

  $.mockAPI.get("/api/triggerServices", function (triggerServices) {
    $.defaultTracker.set("triggerServices", triggerServices);
  });

});

$.defaultTracker.listen({
  "triggerServices[track]" : function (oldValue, newValue) {    
    // when there are available selections, allow enable this button
    $('.cc-this-button')[newValue.length > 0 ? "removeClass" : "addClass"]("disabled");
  },
  "selectedTriggerService[track]" : function (oldValue, newValue) {
    // when this trigger service get selected, e.g. RSS

    $('.cc-if-section').css('display', newValue ? "block" : "none");
    $('.cc-trigger-service-name').text(newValue.title);
    $('.cc-this-was-selected').css('display', newValue ? "block" : "none");

    // once a particular trigger service get loaded, 
    // we clear triggers selection and reset any previously selected trigger
    //
    $.defaultTracker.set("triggers", []);
    $.defaultTracker.set("selectedTrigger", null);

    // load triggers list under a particular service
    //
    $.mockAPI.get("/api/triggers", { trigger_service_id : newValue.id }, function (triggers) {
      $.defaultTracker.set("triggers", triggers);
    });

    // load corresponding action services
    // 
    $.mockAPI.get("/api/actionServices", { trigger_service_id : newValue.id }, function (actionServices) {
      $.defaultTracker.set("actionServices", actionServices);
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
    $('.cc-trigger-no-implementation').css('display', $.defaultTracker.get("triggers").length > 0 && (!newValue || newValue.id != 1) ? 'block' : 'none');

    $('.cc-choose-trigger-button').css('display', newValue ? 'none' : 'block');
    $('.cc-choose-trigger-label').css('display', newValue ? 'none' : 'inline-block');

    // dumb way to reset
    if (!newValue) {
      $('.cc-trigger-selected').find('input').val('');
    }

    if (!newValue) {
      $.defaultTracker.set("isTriggerSceneDone", false);
      $.defaultTracker.set("isValidTrigger", false);
    }
  },

  "triggerAttributes[track]" : function (oldValue, newValue) {
    var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    var isValid = re.test((newValue.address).toString().toLowerCase());
    $.defaultTracker.set("isValidTrigger", isValid);
  },

  "isValidTrigger[track]" : function (oldValue, newValue) {
    $('.cc-continue-button').css('display', newValue ? 'inline-block' : 'none');
  },

  // if set to true, conclude customization of trigger 
  //
  "isTriggerSceneDone[track]" : function (oldValue, newValue) {
    $('.cc-that-button')[$.defaultTracker.get("isTriggerSceneDone") && $.defaultTracker.get("actionServices") && $.defaultTracker.get("actionServices").length > 0 ? "removeClass" : "addClass"]("disabled");
    $('.cc-feed-address').text($.defaultTracker.get("triggerAttributes").address);
    $('.cc-trigger-summary').css('display', newValue ? 'block' : 'none');

    if (newValue) {
      $('.cc-trigger-selected').css('display', 'none');    
      $('.cc-trigger-no-implementation').css('display', 'none');          
    } else {
      $.defaultTracker.check("selectedTrigger");
    }

    $('.cc-continue-with-action').css('display', $.defaultTracker.get("isTriggerSceneDone") && !$.defaultTracker.get("selectedActionService") ? 'block' : 'none');
  },

  "actionServices[track]" : function (oldValue, newValue) {
    $('.cc-that-button')[$.defaultTracker.get("isTriggerSceneDone") && newValue && newValue.length > 0 ? "removeClass" : "addClass"]("disabled");

    if (newValue) {
      // we skip the trigger selection HTML rendering, let's assume it's already done by templating engine
      // right now it's hardcoded

      // hide all selections
      $('.cc-that-selection').children().css('display', 'none');      
      if (newValue.length > 0) {
        $('.cc-that-selection').children('.cc-no-selection').css('display', 'none');
      }
      for (var i = 0, len = newValue.length; i < len; i++) {
        var node = $('.cc-item[serviceid="'+newValue[i].id+'"]');
        node.parent().css('display', 'block'); // show selection
      }
    } 

    if (!newValue || newValue.length == 0) {
      $('.cc-that-selection').children().css('display', 'none');
      $('.cc-that-selection').children('.cc-no-selection').css('display', 'block');
    }
  },
  
  // when action is selected, e.g. email action
  //  
  "selectedActionService[track]" : function (oldValue, newValue) {
    // when this trigger service get selected, e.g. RSS

    $('.cc-then-section').css('display', newValue ? "block" : "none");
    $('.cc-action-service-name').text(newValue.title);
    $('.cc-that-was-selected').css('display', newValue ? "block" : "none");

    $.defaultTracker.set("actions", []);
    $.defaultTracker.set("selectedAction", null);

    // load list of actions under selected action service
    //
    $.mockAPI.get("/api/actions", { action_service_id : newValue.id }, function (actions) {
      $.defaultTracker.set("actions", actions);
    });

    $('.cc-continue-with-action').css('display', $.defaultTracker.get("isTriggerSceneDone") && !$.defaultTracker.get("selectedActionService") ? 'block' : 'none');
  },

  "actions[track]" : function (oldValue, newValue) {
    if (newValue) {
      // we skip the trigger selection HTML rendering, let's assume it's already done by templating engine
      // right now it's hardcoded

      // hide all selections
      $('.cc-action-selection').children().css('display', 'none');      
      if (newValue.length > 0) {
        $('.cc-action-selection').children('.cc-no-selection').css('display', 'none');
      }
      for (var i = 0, len = newValue.length; i < len; i++) {
        var node = $('.cc-item[actionid="'+newValue[i].id+'"]');
        node.parent().css('display', 'block'); // show selection
      }
    } 

    if (!newValue || newValue.length == 0) {
      $('.cc-action-selection').children().css('display', 'none');
      $('.cc-action-selection').children('.cc-no-selection').css('display', 'block');
    }
  },

  "selectedAction[track]" : function (oldValue, newValue) {
    $('.cc-action-selected').css('display', newValue && newValue.id == 1 ? 'block' : 'none');
    $('.cc-action-no-implementation').css('display', $.defaultTracker.get("actions").length > 0 && (!newValue || newValue.id != 1) ? 'block' : 'none');

    // dumb way to reset
    if (!newValue) {
      $('.cc-action-selected').find('input').val('');
    }

    $('.cc-choose-action-button').css('display', newValue ? 'none' : 'block');
    $('.cc-choose-action-label').css('display', newValue ? 'none' : 'inline-block');

    $('.cc-continue-with-action').css('display', $.defaultTracker.get("isTriggerSceneDone") && !$.defaultTracker.get("selectedActionService") ? 'block' : 'none');

    if (!newValue) {
      $.defaultTracker.set("isActionSceneDone", false);
      $.defaultTracker.set("isValidAction", false);
    }
  },

  "actionAttributes[track]" : function (oldValue, newValue) {
    // attributes get updated, validate the email address
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValid = re.test((newValue.email).toString().toLowerCase());
    $.defaultTracker.set("isValidAction", isValid);
  },

  "isValidAction[track]" : function (oldValue, newValue) {
    $('.cc-complete-button').css('display', newValue ? 'inline-block' : 'none');
  },

  // if set to true, conclude customization of action 
  //
  "isActionSceneDone[track]" : function (oldValue, newValue) {
    $('.cc-target-email-address').text($.defaultTracker.get("actionAttributes").email);
    $('.cc-action-summary').css('display', newValue ? 'block' : 'none');

    if (newValue) {
      $('.cc-action-selected').css('display', 'none');    
      $('.cc-action-no-implementation').css('display', 'none'); 
    } else {
      $.defaultTracker.check("selectedAction");
    }

    $('.cc-final-section').css('display', newValue ? 'block' : 'none');         
  }

});

$.act({
  "show-dropdown-selection[mousedown]" : function (el, ev) {
    if (ev) {
      ev.preventDefault();
    }
  },

  // make this a common dropdown function
  //
  "show-dropdown-selection[click]" : function (el, ev) {
    if (el.parent().children('.cc-dropdown.on-show')[0]) {
      return;
    }

    if (el.hasClass('disabled')) {
      return;
    }

    // we don't have to manipulate dropdown if we use dropdown js
    //
    var dropdownMenu = el.parent().children('.cc-dropdown');
    if (!dropdownMenu[0]) {
      return;
    }
    var originalParent = dropdownMenu.parent();

    if ($(window).width() <= 480) { // on mobile
      dropdownMenu.appendTo(document.body);
    } 

    dropdownMenu.addClass('on-show');
  
    // hide the selection popup
    var cancelShow = (function (el, dropdownMenu) {
      return function (ev) {
        if ($(ev.target).parents('.cc-dropdown:first')[0]) {
          return;        
        }
        $(document).unbind('mousedown', cancelShow);
        $(document).unbind('touchstart', cancelShow);

        dropdownMenu.removeClass('on-show');
        dropdownMenu.appendTo(originalParent);
      };
    })(el, dropdownMenu);

    $(document).bind('mousedown', cancelShow);
    $(document).bind('touchstart', cancelShow);
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

  "auto-add-http[blur]" : function (el, ev) {
    var val = el.val();
    if (val && val.length > 0) {
      var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
      var isValid = re.test((val).toString().toLowerCase());
      if (isValid && !val.match(/^http/)) {
        el.val('https://' + val);
      }
    }
  },

  "validate-url[blur]" : function (el, ev) {
    var val = el.val();
    var isValid = false;
    if (val && val.length > 0) {
      var re = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
      isValid = re.test((val).toString().toLowerCase());      
    }
    if (!isValid) {
      el.nextAll('.cc-validation-message').css('display', 'block');
    } else {
      el.nextAll('.cc-validation-message').css('display', 'none');
    }
  },

  "validate-email[blur]" : function (el, ev) {
    var val = el.val();
    var isValid = false;
    if (val && val.length > 0) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      isValid = re.test((val).toString().toLowerCase());      
    }
    if (!isValid) {
      el.nextAll('.cc-validation-message').css('display', 'block');
    } else {
      el.nextAll('.cc-validation-message').css('display', 'none');
    }
  },

  // set an alias
  "update-trigger-attributes[blur]" : "update-trigger-attributes[change]",

  // proceed with choosing action services
  // 
  "continue-choosing-trigger[click]" : function (el, ev) {
    if (ev) {
      ev.preventDefault();
    }

    if ($.defaultTracker.get("isValidTrigger")) {
      $.defaultTracker.set("isTriggerSceneDone", true);
      if ($(window).width()>480) { // don't show the next dropdown selection if it's on mobile as the dropdown will cover the screen
        $.actor.getListener("show-dropdown-selection[click]")($('.cc-that-button'), ev);    
      }
    }
  },

  "continue-choosing-trigger-form[submit]" : "continue-choosing-trigger[click]",

  "edit-trigger[click]" : function () {
    $.defaultTracker.set("isTriggerSceneDone", false);
  },

  // Choose which action service inside selection popup, e.g. RSS
  // 
  "choose-that[click]" : function (el, ev) {
    var serviceID = parseInt(el.attr('serviceid')||"0");
    var actionServices = $.defaultTracker.get("actionServices");

    // find the trigger
    for (var i = 0, len = actionServices.length; i < len; i++) {
      if (actionServices[i].id == serviceID) {
        var actionService = actionServices[i];
        $.defaultTracker.set("selectedActionService", actionService);

        // close selection popup
        $('.cc-that-selection').removeClass('on-show');
        $('.cc-that-selection').css({
          display : 'none'
        });
      }
    }
  },

  "choose-another-action-service[click]" : function (el, ev) {
    $.actor.getListener("show-dropdown-selection[click]")($('.cc-that-button'), ev);    
  },

  // Choose which trigger, e.g. which RSS trigger
  //
  "choose-action[click]" : function (el, ev) {
    var actionID = parseInt(el.attr('actionid')||"0");
    var actions = $.defaultTracker.get("actions");

    // find the trigger
    for (var i = 0, len = actions.length; i < len; i++) {
      if (actions[i].id == actionID) {
        var action = actions[i];
        $.defaultTracker.set("selectedAction", action);

        // close selection popup
        $('.cc-action-selection').removeClass('on-show');
        $('.cc-action-selection').css({
          display : 'none'
        });
      }
    }
  },

  "choose-another-action[click]" : function (el, ev) {
    $.actor.getListener("show-dropdown-selection[click]")($('.cc-choose-action-button'), ev);
  },

  // e.g. when field changed inside action customization
  //
  "update-action-attributes[change]" : function (el, ev) {
    // simple implementation of capturing attribute values
    var container = el.parents('.cc-container:first');
    var inputs = container.find('input');
    var attributes = {};
    for (var i = 0, len = inputs.length; i < len; i++) {
      attributes[inputs.eq(i).attr('name')] = inputs.eq(i).val();
    }
    $.defaultTracker.set("actionAttributes", attributes);
  },

  // set an alias
  "update-action-attributes[blur]" : "update-action-attributes[change]",

  // complete and save
  // 
  "complete[click]" : function (el, ev) {
    if (ev) {
      ev.preventDefault();
    }

    if ($.defaultTracker.get("isValidAction")) {
      $.defaultTracker.set("isActionSceneDone", true);
    }
  },

  "complete-form[submit]" : "complete[click]",

  "edit-action[click]" : function () {
    $.defaultTracker.set("isActionSceneDone", false);
  },

  "save-automation[click]" : function () {
    // save to server

    $('.cc-header-question').css('display', 'none');
    $('.cc-edit-action').css('display', 'none');
    $('.cc-edit-trigger').css('display', 'none');
    $('.cc-final-section').css('display', 'none');
    $('.cc-this-was-selected').css('display', 'none');
    $('.cc-that-was-selected').css('display', 'none');

    $('.cc-if-section').addClass('finalized');
    $('.cc-then-section').addClass('finalized');

  }

});
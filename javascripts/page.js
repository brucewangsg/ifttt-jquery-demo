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
  }
});
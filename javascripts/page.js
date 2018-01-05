$(document).ready(function () {

  // imagine that we will have to query a list of available trigger services

  $.mockAPI.get("/api/triggers", function (triggers) {
    console.log(triggers);
  });

});
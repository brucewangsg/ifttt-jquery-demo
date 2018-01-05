(function () {
  $.mockAPI = {
    get : function (path, callback) {
      if (path == "/api/triggers") {
        callback([{
          id : 1,
          title : "Twitter",
          description : "Twitter Applets can help you manage and save tweets, keep an eye on #hashtags, and much more."
        }, {
          id : 2,
          title : "Date & Time",
          description : "Find the best date and time for your scheduled task."
        }, {
          id : 3,
          title : "RSS Feed",
          description : "This service deal with Really Simple Syndicate."
        }, {
          id : 4,
          title : "SMS",
          description : "Get important notifications on your phone via SMS."
        }, {
          id : 5,
          title : "Email",
          description : "Respond to inbound emails for any smtp server."
        }, {
          id : 6,
          title : "Weather",
          description : "Today's weather report."
        }, {
          id : 7,
          title : "Phone Call",
          description : "This service can trigger Applets when you leave a voicemail at the IFTTT number."
        }, {
          id : 8,
          title : "Delicious",
          description : "Delicious is a social bookmarking web service for storing, sharing, and discovering web bookmarks."
        }, {
          id : 9,
          title : "Facebook",
          description : "Manage your profile, posting, photos and more with Facebook Applets that work with the world's largest social networking site."
        }, {
          id : 10,
          title : "Tumblr",
          description : "Tumblr is a blogging platform that allows users to post text, images, videos, links, quotes, and audio."
        }]);
      }
    }
  };  
})($);
function KVO() {
  this.stateListeners = [];
  this.pairs = {};
  return this;
};

(function() {

  var prototypes = {
    // $.track = function (key) {
    //   return $.track.get(key);
    // };
    set : function (key, newValue) {
      var oldValue = this.pairs[key];
      var changed = oldValue != newValue;
      this.pairs[key] = newValue;
      if (changed) {
        this.triggerChanged(key, oldValue, newValue);
      } 
      return changed;     
    },
    get : function (key) {
      return this.pairs[key];
    },
    listen : function (key, f) {
      if (typeof key == 'string') {
        if (f) {
          this.stateListeners[key] = this.stateListeners[key] || [];
          this.stateListeners[key].push(f);
          if (key in this.pairs && this.pairs[key] != null) {
            this.check(key);
          }
        }        
      } else { // hash 
        for (var k in key) {
          if (k.indexOf('[default]') > 0) {
            this.pairs[k.replace('[default]','')] = key[k];
          } else if (k.indexOf('[track]') > 0 && (typeof key[k] == 'function')) {
            this.listen(k.replace('[track]', ''), key[k]);
          } else if (k.indexOf('[need]') > 0 && (typeof key[k] == 'function')) {
            var replaceKey = k.replace('[need]', '');
            var oThis = this;
            this.listen(replaceKey, (function (oThis, replaceKey, ff) {
              return function (oldValue, newValue) {
                if (newValue == true) {
                  oThis.pairs[replaceKey] = false; // shortcut
                  var v = ff();
                  if (v === false) {
                    oThis.pairs[replaceKey] = true;
                  }
                }
              }
            })(oThis, replaceKey, key[k]));
          }
        }
      }
    },
    check : function (key) {
      this.triggerChanged(key, this.pairs[key], this.pairs[key]);
    },
    triggerChanged : function (key, oldValue, newValue) {
      var listeners = this.stateListeners[key] ? this.stateListeners[key] : [];
      for (var i = 0, len = listeners.length; i < len; i++) {
        listeners[i](oldValue, newValue);
      }      
    }
  };
  KVO.prototype = prototypes;

  var defaultTracker = new KVO();

  $.defaultTracker = function (key) {
    return defaultTracker.get(key);
  };

  for (var k in prototypes) {
    $.defaultTracker[k] = (function (defaultTracker, k) {
      return function () {
        return defaultTracker[k].apply(defaultTracker, arguments);
      }
    })(defaultTracker, k);
  };
})();

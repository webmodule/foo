// is Utility functions
(function (foo) {

  foo.mixin = function (obj, proto) {
    for (var prop in proto) {
      if (proto.hasOwnProperty(prop)) {
        obj[prop] = proto[prop];
      }
    }
    return obj;
  };

  foo.debounce = function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function () {
      if (context !== undefined && context !== this) {
        if (func.name && (!this.hasOwnProperty(func.name) || this[func.name] === context[func.name])) {
          this[func.name] = foo.debounce(func, wait, immediate);
          return this[func.name].apply(this, arguments);
        }
      }
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function () {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate)
            result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow)
        result = func.apply(context, args);
      return result;
    };
  };

  foo.getUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r
          : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  };

  foo.preventPropagation = function (event) {
    if (!event)
      var event = window.event;
    if (event) {
      if (event.preventDefault !== undefined) {
        event.preventDefault && event.preventDefault();
      }
      event.cancelBubble = true;
      event.returnValue = false;
      if (event.stopPropagation !== undefined) {
        event.stopPropagation();
      }
      if (event.stopImmediatePropagation !== undefined) {
        event.stopImmediatePropagation();
      }
      return false;
    }
  };

})(this);

// is Resolver
(function (foo) {
  function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  }

  function is(type, obj) {
    var clas = getType(obj);
    return obj !== undefined && obj !== null && clas === type;
  }

  is.Function = function (obj) {
    return is("Function", obj);
  };
  is.Object = function (obj) {
    return is("Object", obj);
  };
  is.Array = function (obj) {
    return is("Array", obj);
  };
  is.Null = function (obj) {
    return is("Null", obj);
  };
  is.Undefined = function (obj) {
    return is("Undefined", obj);
  };
  is.Number = function (obj) {
    return is("Number", obj);
  };
  is.String = function (obj) {
    return is("String", obj);
  };
  is.Value = function (obj) {
    var clas = getType(obj);
    return !(clas === "Undefined" || clas === "Null");
  };
  is.Empty = function (obj) {
    var clas = getType(obj);
    switch (clas) {
      case "Undefined":
      case "Null":
        return true;
        break;
      case "Boolean":
        return obj;
        break;
      case "Number":
        return obj === 0;
      case "String":
      case "Array":
        return (obj.length === 0);
        break;
      default:
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key))
            return false;
        }
        return true;
        break;
    }
    return !(is.Undefined(obj) || is.Null(obj));
  };
  is.Valid = function (condition, message) {
    if (!condition && is.String(message)) {
      throw Error(message);
    }
    return !!condition;
  };
  foo.is = is;

})(this);

(function (foo) {
  var when = (foo.is.Function(document.addEventListener))
    ? (function (f) {
    /ing/.test(document.readyState) ? document.addEventListener('DOMContentLoaded', f) : f();
  })
    : (function (f) {
    /in/.test(document.readyState) ? setTimeout(function () {
      f()
    }, 9) : f()
  });

  when.ready = function (f) {
    return when(f);
  };
  foo.when = when;
})(this);

/* eslint-disable */

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this

    do {
      if (Element.prototype.matches.call(el, s)) return el
      el = el.parentElement || el.parentNode
    } while (el !== null && el.nodeType === 1)
    return null
  }
}

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('prepend')) {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.insertBefore(docFrag, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);


// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('append')) {
      return;
    }
    Object.defineProperty(item, 'append', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function append() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.appendChild(docFrag);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;(function(constructor) {
  if (constructor &&
    constructor.prototype &&
    constructor.prototype.children == null) {
    Object.defineProperty(constructor.prototype, 'children', {
      get: function() {
        let nodes = [];
        try {
          nodes = this.childNodes;
        } catch (error) {
          console.log(error);
        }
        let i = 0, node, children = [];
        while (node = nodes[i++]) {
          if (node.nodeType === 1) {
            children.push(node);
          }
        }
        return children;
      }
    });
  }
})(window.Node || window.Element);



// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (
       !("classList" in document.createElement("_")) 
    || document.createElementNS
    && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
  ) {
  
  (function (view) {
  
  "use strict";
  
  if (!('Element' in view)) return;
  
  var
      classListProp = "classList"
    , protoProp = "prototype"
    , elemCtrProto = view.Element[protoProp]
    , objCtr = Object
    , strTrim = String[protoProp].trim || function () {
      return this.replace(/^\s+|\s+$/g, "");
    }
    , arrIndexOf = Array[protoProp].indexOf || function (item) {
      var
          i = 0
        , len = this.length
      ;
      for (; i < len; i++) {
        if (i in this && this[i] === item) {
          return i;
        }
      }
      return -1;
    }
    // Vendors: please allow content code to instantiate DOMExceptions
    , DOMEx = function (type, message) {
      this.name = type;
      this.code = DOMException[type];
      this.message = message;
    }
    , checkTokenAndGetIndex = function (classList, token) {
      if (token === "") {
        throw new DOMEx(
            "SYNTAX_ERR"
          , "The token must not be empty."
        );
      }
      if (/\s/.test(token)) {
        throw new DOMEx(
            "INVALID_CHARACTER_ERR"
          , "The token must not contain space characters."
        );
      }
      return arrIndexOf.call(classList, token);
    }
    , ClassList = function (elem) {
      var
          trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
        , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
        , i = 0
        , len = classes.length
      ;
      for (; i < len; i++) {
        this.push(classes[i]);
      }
      this._updateClassName = function () {
        elem.setAttribute("class", this.toString());
      };
    }
    , classListProto = ClassList[protoProp] = []
    , classListGetter = function () {
      return new ClassList(this);
    }
  ;
  // Most DOMException implementations don't allow calling DOMException's toString()
  // on non-DOMExceptions. Error's toString() is sufficient here.
  DOMEx[protoProp] = Error[protoProp];
  classListProto.item = function (i) {
    return this[i] || null;
  };
  classListProto.contains = function (token) {
    return ~checkTokenAndGetIndex(this, token + "");
  };
  classListProto.add = function () {
    var
        tokens = arguments
      , i = 0
      , l = tokens.length
      , token
      , updated = false
    ;
    do {
      token = tokens[i] + "";
      if (!~checkTokenAndGetIndex(this, token)) {
        this.push(token);
        updated = true;
      }
    }
    while (++i < l);
  
    if (updated) {
      this._updateClassName();
    }
  };
  classListProto.remove = function () {
    var
        tokens = arguments
      , i = 0
      , l = tokens.length
      , token
      , updated = false
      , index
    ;
    do {
      token = tokens[i] + "";
      index = checkTokenAndGetIndex(this, token);
      while (~index) {
        this.splice(index, 1);
        updated = true;
        index = checkTokenAndGetIndex(this, token);
      }
    }
    while (++i < l);
  
    if (updated) {
      this._updateClassName();
    }
  };
  classListProto.toggle = function (token, force) {
    var
        result = this.contains(token)
      , method = result ?
        force !== true && "remove"
      :
        force !== false && "add"
    ;
  
    if (method) {
      this[method](token);
    }
  
    if (force === true || force === false) {
      return force;
    } else {
      return !result;
    }
  };
  classListProto.replace = function (token, replacement_token) {
    var index = checkTokenAndGetIndex(token + "");
    if (~index) {
      this.splice(index, 1, replacement_token);
      this._updateClassName();
    }
  }
  classListProto.toString = function () {
    return this.join(" ");
  };
  
  if (objCtr.defineProperty) {
    var classListPropDesc = {
        get: classListGetter
      , enumerable: true
      , configurable: true
    };
    try {
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    } catch (ex) { // IE 8 doesn't support enumerable:true
      // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
      // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
      if (ex.number === undefined || ex.number === -0x7FF5EC54) {
        classListPropDesc.enumerable = false;
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      }
    }
  } else if (objCtr[protoProp].__defineGetter__) {
    elemCtrProto.__defineGetter__(classListProp, classListGetter);
  }
  
  }(self));
  
  }
  
  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.
  
  (function () {
    "use strict";
  
    var testElement = document.createElement("_");
  
    testElement.classList.add("c1", "c2");
  
    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains("c2")) {
      var createMethod = function(method) {
        var original = DOMTokenList.prototype[method];
  
        DOMTokenList.prototype[method] = function(token) {
          var i, len = arguments.length;
  
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
  
    testElement.classList.toggle("c3", false);
  
    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains("c3")) {
      var _toggle = DOMTokenList.prototype.toggle;
  
      DOMTokenList.prototype.toggle = function(token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
  
    }
  
    // replace() polyfill
    if (!("replace" in document.createElement("_").classList)) {
      DOMTokenList.prototype.replace = function (token, replacement_token) {
        var
            tokens = this.toString().split(" ")
          , index = tokens.indexOf(token + "")
        ;
        if (~index) {
          tokens = tokens.slice(index);
          this.remove.apply(this, tokens);
          this.add(replacement_token);
          this.add.apply(this, tokens.slice(1));
        }
      }
    }
  
    testElement = null;
  }());
  
  }
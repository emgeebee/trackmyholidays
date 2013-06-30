if("undefined" == typeof YAHOO || !YAHOO) {
  var YAHOO = {}
}
YAHOO.namespace = function() {
  var a = arguments, c = null, f, g, l;
  for(f = 0;f < a.length;f += 1) {
    l = a[f].split(".");
    c = YAHOO;
    for(g = "YAHOO" == l[0] ? 1 : 0;g < l.length;g += 1) {
      c[l[g]] = c[l[g]] || {}, c = c[l[g]]
    }
  }
  return c
};
YAHOO.log = function(a, c, f) {
  var g = YAHOO.widget.Logger;
  return g && g.log ? g.log(a, c, f) : !1
};
YAHOO.register = function(a, c, f) {
  var g = YAHOO.env.modules;
  g[a] || (g[a] = {versions:[], builds:[]});
  var g = g[a], l = f.version;
  f = f.build;
  var d = YAHOO.env.listeners;
  g.name = a;
  g.version = l;
  g.build = f;
  g.versions.push(l);
  g.builds.push(f);
  g.mainClass = c;
  for(var b = 0;b < d.length;b += 1) {
    d[b](g)
  }
  c ? (c.VERSION = l, c.BUILD = f) : YAHOO.log("mainClass is undefined for module " + a, "warn")
};
YAHOO.env = YAHOO.env || {modules:[], listeners:[]};
YAHOO.env.getVersion = function(a) {
  return YAHOO.env.modules[a] || null
};
YAHOO.env.ua = function() {
  var a = {ie:0, opera:0, gecko:0, webkit:0, mobile:null}, c = navigator.userAgent, f;
  /KHTML/.test(c) && (a.webkit = 1);
  if((f = c.match(/AppleWebKit\/([^\s]*)/)) && f[1]) {
    if(a.webkit = parseFloat(f[1]), / Mobile\//.test(c)) {
      a.mobile = "Apple"
    }else {
      if(f = c.match(/NokiaN[^\/]*/)) {
        a.mobile = f[0]
      }
    }
  }
  if(!a.webkit) {
    if((f = c.match(/Opera[\s\/]([^\s]*)/)) && f[1]) {
      if(a.opera = parseFloat(f[1]), f = c.match(/Opera Mini[^;]*/)) {
        a.mobile = f[0]
      }
    }else {
      if((f = c.match(/MSIE\s([^;]*)/)) && f[1]) {
        a.ie = parseFloat(f[1])
      }else {
        if(f = c.match(/Gecko\/([^\s]*)/)) {
          if(a.gecko = 1, (f = c.match(/rv:([^\s\)]*)/)) && f[1]) {
            a.gecko = parseFloat(f[1])
          }
        }
      }
    }
  }
  return a
}();
(function() {
  YAHOO.namespace("util", "widget", "example");
  if("undefined" !== typeof YAHOO_config) {
    var a = YAHOO_config.listener, c = YAHOO.env.listeners, f = !0, g;
    if(a) {
      for(g = 0;g < c.length;g += 1) {
        if(c[g] == a) {
          f = !1;
          break
        }
      }
      f && c.push(a)
    }
  }
})();
YAHOO.lang = YAHOO.lang || {isArray:function(a) {
  if(a) {
    var c = YAHOO.lang;
    return c.isNumber(a.length) && c.isFunction(a.splice)
  }
  return!1
}, isBoolean:function(a) {
  return"boolean" === typeof a
}, isFunction:function(a) {
  return"function" === typeof a
}, isNull:function(a) {
  return null === a
}, isNumber:function(a) {
  return"number" === typeof a && isFinite(a)
}, isObject:function(a) {
  return a && ("object" === typeof a || YAHOO.lang.isFunction(a)) || !1
}, isString:function(a) {
  return"string" === typeof a
}, isUndefined:function(a) {
  return"undefined" === typeof a
}, hasOwnProperty:function(a, c) {
  return Object.prototype.hasOwnProperty ? a.hasOwnProperty(c) : !YAHOO.lang.isUndefined(a[c]) && a.constructor.prototype[c] !== a[c]
}, _IEEnumFix:function(a, c) {
  if(YAHOO.env.ua.ie) {
    var f = ["toString", "valueOf"], g;
    for(g = 0;g < f.length;g += 1) {
      var l = f[g], d = c[l];
      YAHOO.lang.isFunction(d) && d != Object.prototype[l] && (a[l] = d)
    }
  }
}, extend:function(a, c, f) {
  if(!c || !a) {
    throw Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
  }
  var g = function() {
  };
  g.prototype = c.prototype;
  a.prototype = new g;
  a.prototype.constructor = a;
  a.superclass = c.prototype;
  c.prototype.constructor == Object.prototype.constructor && (c.prototype.constructor = c);
  if(f) {
    for(var l in f) {
      a.prototype[l] = f[l]
    }
    YAHOO.lang._IEEnumFix(a.prototype, f)
  }
}, augmentObject:function(a, c) {
  if(!c || !a) {
    throw Error("Absorb failed, verify dependencies.");
  }
  var f = arguments, g, l = f[2];
  if(l && !0 !== l) {
    for(g = 2;g < f.length;g += 1) {
      a[f[g]] = c[f[g]]
    }
  }else {
    for(g in c) {
      if(l || !a[g]) {
        a[g] = c[g]
      }
    }
    YAHOO.lang._IEEnumFix(a, c)
  }
}, augmentProto:function(a, c) {
  if(!c || !a) {
    throw Error("Augment failed, verify dependencies.");
  }
  for(var f = [a.prototype, c.prototype], g = 2;g < arguments.length;g += 1) {
    f.push(arguments[g])
  }
  YAHOO.lang.augmentObject.apply(this, f)
}, dump:function(a, c) {
  var f = YAHOO.lang, g, l, d = [];
  if(f.isObject(a)) {
    if(a instanceof Date || "nodeType" in a && "tagName" in a) {
      return a
    }
    if(f.isFunction(a)) {
      return"f(){...}"
    }
  }else {
    return a + ""
  }
  c = f.isNumber(c) ? c : 3;
  if(f.isArray(a)) {
    d.push("[");
    g = 0;
    for(l = a.length;g < l;g += 1) {
      f.isObject(a[g]) ? d.push(0 < c ? f.dump(a[g], c - 1) : "{...}") : d.push(a[g]), d.push(", ")
    }
    1 < d.length && d.pop();
    d.push("]")
  }else {
    d.push("{");
    for(g in a) {
      f.hasOwnProperty(a, g) && (d.push(g + " => "), f.isObject(a[g]) ? d.push(0 < c ? f.dump(a[g], c - 1) : "{...}") : d.push(a[g]), d.push(", "))
    }
    1 < d.length && d.pop();
    d.push("}")
  }
  return d.join("")
}, substitute:function(a, c, f) {
  for(var g, l, d, b, e, n = YAHOO.lang, w = [], v;;) {
    g = a.lastIndexOf("{");
    if(0 > g) {
      break
    }
    l = a.indexOf("}", g);
    if(g + 1 >= l) {
      break
    }
    b = v = a.substring(g + 1, l);
    e = null;
    d = b.indexOf(" ");
    -1 < d && (e = b.substring(d + 1), b = b.substring(0, d));
    d = c[b];
    f && (d = f(b, d, e));
    n.isObject(d) ? n.isArray(d) ? d = n.dump(d, parseInt(e, 10)) : (e = e || "", b = e.indexOf("dump"), -1 < b && (e = e.substring(4)), d = d.toString === Object.prototype.toString || -1 < b ? n.dump(d, parseInt(e, 10)) : d.toString()) : !n.isString(d) && !n.isNumber(d) && (d = "~-" + w.length + "-~", w[w.length] = v);
    a = a.substring(0, g) + d + a.substring(l + 1)
  }
  for(g = w.length - 1;0 <= g;g -= 1) {
    a = a.replace(RegExp("~-" + g + "-~"), "{" + w[g] + "}", "g")
  }
  return a
}, trim:function(a) {
  try {
    return a.replace(/^\s+|\s+$/g, "")
  }catch(c) {
    return a
  }
}, merge:function() {
  for(var a = {}, c = arguments, f = 0, g = c.length;f < g;f += 1) {
    YAHOO.lang.augmentObject(a, c[f], !0)
  }
  return a
}, later:function(a, c, f, g, l) {
  a = a || 0;
  c = c || {};
  var d = f, b = g, e;
  YAHOO.lang.isString(f) && (d = c[f]);
  if(!d) {
    throw new TypeError("method undefined");
  }
  YAHOO.lang.isArray(b) || (b = [g]);
  f = function() {
    d.apply(c, b)
  };
  e = l ? setInterval(f, a) : setTimeout(f, a);
  return{interval:l, cancel:function() {
    this.interval ? clearInterval(e) : clearTimeout(e)
  }}
}, isValue:function(a) {
  var c = YAHOO.lang;
  return c.isObject(a) || c.isString(a) || c.isNumber(a) || c.isBoolean(a)
}};
YAHOO.util.Lang = YAHOO.lang;
YAHOO.lang.augment = YAHOO.lang.augmentProto;
YAHOO.augment = YAHOO.lang.augmentProto;
YAHOO.extend = YAHOO.lang.extend;
YAHOO.register("yahoo", YAHOO, {version:"2.5.0", build:"895"});
(function() {
  var a = YAHOO.util, c, f, g = {}, l = {}, d = window.document;
  YAHOO.env._id_counter = YAHOO.env._id_counter || 0;
  var b = YAHOO.env.ua.opera, e = YAHOO.env.ua.webkit, n = YAHOO.env.ua.ie, w = /(-[a-z])/i, v = /^body|html$/i, t = function(a) {
    if(!w.test(a)) {
      return a
    }
    if(g[a]) {
      return g[a]
    }
    for(var b = a;w.exec(b);) {
      b = b.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase())
    }
    return g[a] = b
  }, u = function(a) {
    var b = l[a];
    b || (b = RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)"), l[a] = b);
    return b
  };
  c = d.defaultView && d.defaultView.getComputedStyle ? function(a, b) {
    var e = null;
    "float" == b && (b = "cssFloat");
    var c = d.defaultView.getComputedStyle(a, "");
    c && (e = c[t(b)]);
    return a.style[b] || e
  } : d.documentElement.currentStyle && n ? function(a, b) {
    switch(t(b)) {
      case "opacity":
        var e = 100;
        try {
          e = a.filters["DXImageTransform.Microsoft.Alpha"].opacity
        }catch(c) {
          try {
            e = a.filters("alpha").opacity
          }catch(d) {
          }
        }
        return e / 100;
      case "float":
        b = "styleFloat";
      default:
        return e = a.currentStyle ? a.currentStyle[b] : null, a.style[b] || e
    }
  } : function(a, b) {
    return a.style[b]
  };
  f = n ? function(a, b, e) {
    switch(b) {
      case "opacity":
        if(YAHOO.lang.isString(a.style.filter) && (a.style.filter = "alpha(opacity=" + 100 * e + ")", !a.currentStyle || !a.currentStyle.hasLayout)) {
          a.style.zoom = 1
        }
        break;
      case "float":
        b = "styleFloat";
      default:
        a.style[b] = e
    }
  } : function(a, b, e) {
    "float" == b && (b = "cssFloat");
    a.style[b] = e
  };
  var x = function(a, b) {
    return a && 1 == a.nodeType && (!b || b(a))
  };
  YAHOO.util.Dom = {get:function(b) {
    if(b && (b.nodeType || b.item)) {
      return b
    }
    if(YAHOO.lang.isString(b) || !b) {
      return d.getElementById(b)
    }
    if(void 0 !== b.length) {
      for(var e = [], c = 0, n = b.length;c < n;++c) {
        e[e.length] = a.Dom.get(b[c])
      }
      return e
    }
    return b
  }, getStyle:function(b, e) {
    e = t(e);
    return a.Dom.batch(b, function(a) {
      return c(a, e)
    }, a.Dom, !0)
  }, setStyle:function(b, e, c) {
    e = t(e);
    a.Dom.batch(b, function(a) {
      f(a, e, c)
    }, a.Dom, !0)
  }, getXY:function(b) {
    return a.Dom.batch(b, function(a) {
      return(null === a.parentNode || null === a.offsetParent || "none" == this.getStyle(a, "display")) && a != a.ownerDocument.body ? !1 : I(a)
    }, a.Dom, !0)
  }, getX:function(b) {
    return a.Dom.batch(b, function(b) {
      return a.Dom.getXY(b)[0]
    }, a.Dom, !0)
  }, getY:function(b) {
    return a.Dom.batch(b, function(b) {
      return a.Dom.getXY(b)[1]
    }, a.Dom, !0)
  }, setXY:function(b, e, c) {
    a.Dom.batch(b, function(a) {
      var b = this.getStyle(a, "position");
      "static" == b && (this.setStyle(a, "position", "relative"), b = "relative");
      var d = this.getXY(a);
      if(!1 === d) {
        return!1
      }
      var n = [parseInt(this.getStyle(a, "left"), 10), parseInt(this.getStyle(a, "top"), 10)];
      isNaN(n[0]) && (n[0] = "relative" == b ? 0 : a.offsetLeft);
      isNaN(n[1]) && (n[1] = "relative" == b ? 0 : a.offsetTop);
      null !== e[0] && (a.style.left = e[0] - d[0] + n[0] + "px");
      null !== e[1] && (a.style.top = e[1] - d[1] + n[1] + "px");
      c || (b = this.getXY(a), (null !== e[0] && b[0] != e[0] || null !== e[1] && b[1] != e[1]) && this.setXY(a, e, !0))
    }, a.Dom, !0)
  }, setX:function(b, e) {
    a.Dom.setXY(b, [e, null])
  }, setY:function(b, e) {
    a.Dom.setXY(b, [null, e])
  }, getRegion:function(b) {
    return a.Dom.batch(b, function(b) {
      return(null === b.parentNode || null === b.offsetParent || "none" == this.getStyle(b, "display")) && b != d.body ? !1 : a.Region.getRegion(b)
    }, a.Dom, !0)
  }, getClientWidth:function() {
    return a.Dom.getViewportWidth()
  }, getClientHeight:function() {
    return a.Dom.getViewportHeight()
  }, getElementsByClassName:function(b, e, c, n) {
    e = e || "*";
    c = c ? a.Dom.get(c) : d;
    if(!c) {
      return[]
    }
    var g = [];
    e = c.getElementsByTagName(e);
    b = u(b);
    c = 0;
    for(var f = e.length;c < f;++c) {
      b.test(e[c].className) && (g[g.length] = e[c], n && n.call(e[c], e[c]))
    }
    return g
  }, hasClass:function(b, e) {
    var c = u(e);
    return a.Dom.batch(b, function(a) {
      return c.test(a.className)
    }, a.Dom, !0)
  }, addClass:function(b, e) {
    return a.Dom.batch(b, function(a) {
      if(this.hasClass(a, e)) {
        return!1
      }
      a.className = YAHOO.lang.trim([a.className, e].join(" "));
      return!0
    }, a.Dom, !0)
  }, removeClass:function(b, e) {
    var c = u(e);
    return a.Dom.batch(b, function(a) {
      if(!e || !this.hasClass(a, e)) {
        return!1
      }
      a.className = a.className.replace(c, " ");
      this.hasClass(a, e) && this.removeClass(a, e);
      a.className = YAHOO.lang.trim(a.className);
      return!0
    }, a.Dom, !0)
  }, replaceClass:function(b, e, c) {
    if(!c || e === c) {
      return!1
    }
    var d = u(e);
    return a.Dom.batch(b, function(a) {
      if(!this.hasClass(a, e)) {
        return this.addClass(a, c), !0
      }
      a.className = a.className.replace(d, " " + c + " ");
      this.hasClass(a, e) && this.replaceClass(a, e, c);
      a.className = YAHOO.lang.trim(a.className);
      return!0
    }, a.Dom, !0)
  }, generateId:function(b, e) {
    e = e || "yui-gen";
    var c = function(a) {
      if(a && a.id) {
        return a.id
      }
      var b = e + YAHOO.env._id_counter++;
      a && (a.id = b);
      return b
    };
    return a.Dom.batch(b, c, a.Dom, !0) || c.apply(a.Dom, arguments)
  }, isAncestor:function(b, c) {
    b = a.Dom.get(b);
    c = a.Dom.get(c);
    return!b || !c ? !1 : b.contains && c.nodeType && !e ? b.contains(c) : b.compareDocumentPosition && c.nodeType ? !!(b.compareDocumentPosition(c) & 16) : c.nodeType ? !!this.getAncestorBy(c, function(a) {
      return a == b
    }) : !1
  }, inDocument:function(a) {
    return this.isAncestor(d.documentElement, a)
  }, getElementsBy:function(b, e, c, n) {
    e = e || "*";
    c = c ? a.Dom.get(c) : d;
    if(!c) {
      return[]
    }
    var g = [];
    e = c.getElementsByTagName(e);
    c = 0;
    for(var f = e.length;c < f;++c) {
      b(e[c]) && (g[g.length] = e[c], n && n(e[c]))
    }
    return g
  }, batch:function(b, e, c, d) {
    b = b && (b.tagName || b.item) ? b : a.Dom.get(b);
    if(!b || !e) {
      return!1
    }
    d = d ? c : window;
    if(b.tagName || void 0 === b.length) {
      return e.call(d, b, c)
    }
    for(var n = [], g = 0, f = b.length;g < f;++g) {
      n[n.length] = e.call(d, b[g], c)
    }
    return n
  }, getDocumentHeight:function() {
    return Math.max("CSS1Compat" != d.compatMode ? d.body.scrollHeight : d.documentElement.scrollHeight, a.Dom.getViewportHeight())
  }, getDocumentWidth:function() {
    return Math.max("CSS1Compat" != d.compatMode ? d.body.scrollWidth : d.documentElement.scrollWidth, a.Dom.getViewportWidth())
  }, getViewportHeight:function() {
    var a = self.innerHeight, e = d.compatMode;
    if((e || n) && !b) {
      a = "CSS1Compat" == e ? d.documentElement.clientHeight : d.body.clientHeight
    }
    return a
  }, getViewportWidth:function() {
    var a = self.innerWidth, b = d.compatMode;
    if(b || n) {
      a = "CSS1Compat" == b ? d.documentElement.clientWidth : d.body.clientWidth
    }
    return a
  }, getAncestorBy:function(a, b) {
    for(;a = a.parentNode;) {
      if(x(a, b)) {
        return a
      }
    }
    return null
  }, getAncestorByClassName:function(b, e) {
    b = a.Dom.get(b);
    return!b ? null : a.Dom.getAncestorBy(b, function(b) {
      return a.Dom.hasClass(b, e)
    })
  }, getAncestorByTagName:function(b, e) {
    b = a.Dom.get(b);
    return!b ? null : a.Dom.getAncestorBy(b, function(a) {
      return a.tagName && a.tagName.toUpperCase() == e.toUpperCase()
    })
  }, getPreviousSiblingBy:function(a, b) {
    for(;a;) {
      if(a = a.previousSibling, x(a, b)) {
        return a
      }
    }
    return null
  }, getPreviousSibling:function(b) {
    b = a.Dom.get(b);
    return!b ? null : a.Dom.getPreviousSiblingBy(b)
  }, getNextSiblingBy:function(a, b) {
    for(;a;) {
      if(a = a.nextSibling, x(a, b)) {
        return a
      }
    }
    return null
  }, getNextSibling:function(b) {
    b = a.Dom.get(b);
    return!b ? null : a.Dom.getNextSiblingBy(b)
  }, getFirstChildBy:function(b, e) {
    return(x(b.firstChild, e) ? b.firstChild : null) || a.Dom.getNextSiblingBy(b.firstChild, e)
  }, getFirstChild:function(b, e) {
    b = a.Dom.get(b);
    return!b ? null : a.Dom.getFirstChildBy(b)
  }, getLastChildBy:function(b, e) {
    return!b ? null : (x(b.lastChild, e) ? b.lastChild : null) || a.Dom.getPreviousSiblingBy(b.lastChild, e)
  }, getLastChild:function(b) {
    b = a.Dom.get(b);
    return a.Dom.getLastChildBy(b)
  }, getChildrenBy:function(b, e) {
    var c = a.Dom.getFirstChildBy(b, e), d = c ? [c] : [];
    a.Dom.getNextSiblingBy(c, function(a) {
      if(!e || e(a)) {
        d[d.length] = a
      }
      return!1
    });
    return d
  }, getChildren:function(b) {
    b = a.Dom.get(b);
    return a.Dom.getChildrenBy(b)
  }, getDocumentScrollLeft:function(a) {
    a = a || d;
    return Math.max(a.documentElement.scrollLeft, a.body.scrollLeft)
  }, getDocumentScrollTop:function(a) {
    a = a || d;
    return Math.max(a.documentElement.scrollTop, a.body.scrollTop)
  }, insertBefore:function(b, e) {
    b = a.Dom.get(b);
    e = a.Dom.get(e);
    return!b || !e || !e.parentNode ? null : e.parentNode.insertBefore(b, e)
  }, insertAfter:function(b, e) {
    b = a.Dom.get(b);
    e = a.Dom.get(e);
    return!b || !e || !e.parentNode ? null : e.nextSibling ? e.parentNode.insertBefore(b, e.nextSibling) : e.parentNode.appendChild(b)
  }, getClientRegion:function() {
    var b = a.Dom.getDocumentScrollTop(), e = a.Dom.getDocumentScrollLeft(), c = a.Dom.getViewportWidth() + e, d = a.Dom.getViewportHeight() + b;
    return new a.Region(b, c, d, e)
  }};
  var I = function() {
    return d.documentElement.getBoundingClientRect ? function(b) {
      var e = b.getBoundingClientRect();
      b = b.ownerDocument;
      return[e.left + a.Dom.getDocumentScrollLeft(b), e.top + a.Dom.getDocumentScrollTop(b)]
    } : function(b) {
      var c = [b.offsetLeft, b.offsetTop], d = b.offsetParent, n = e && "absolute" == a.Dom.getStyle(b, "position") && b.offsetParent == b.ownerDocument.body;
      if(d != b) {
        for(;d;) {
          c[0] += d.offsetLeft, c[1] += d.offsetTop, !n && (e && "absolute" == a.Dom.getStyle(d, "position")) && (n = !0), d = d.offsetParent
        }
      }
      n && (c[0] -= b.ownerDocument.body.offsetLeft, c[1] -= b.ownerDocument.body.offsetTop);
      for(d = b.parentNode;d.tagName && !v.test(d.tagName);) {
        a.Dom.getStyle(d, "display").search(/^inline|table-row.*$/i) && (c[0] -= d.scrollLeft, c[1] -= d.scrollTop), d = d.parentNode
      }
      return c
    }
  }()
})();
YAHOO.util.Region = function(a, c, f, g) {
  this.top = a;
  this[1] = a;
  this.right = c;
  this.bottom = f;
  this.left = g;
  this[0] = g
};
YAHOO.util.Region.prototype.contains = function(a) {
  return a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom
};
YAHOO.util.Region.prototype.getArea = function() {
  return(this.bottom - this.top) * (this.right - this.left)
};
YAHOO.util.Region.prototype.intersect = function(a) {
  var c = Math.max(this.top, a.top), f = Math.min(this.right, a.right), g = Math.min(this.bottom, a.bottom);
  a = Math.max(this.left, a.left);
  return g >= c && f >= a ? new YAHOO.util.Region(c, f, g, a) : null
};
YAHOO.util.Region.prototype.union = function(a) {
  var c = Math.min(this.top, a.top), f = Math.max(this.right, a.right), g = Math.max(this.bottom, a.bottom);
  a = Math.min(this.left, a.left);
  return new YAHOO.util.Region(c, f, g, a)
};
YAHOO.util.Region.prototype.toString = function() {
  return"Region {top: " + this.top + ", right: " + this.right + ", bottom: " + this.bottom + ", left: " + this.left + "}"
};
YAHOO.util.Region.getRegion = function(a) {
  var c = YAHOO.util.Dom.getXY(a);
  return new YAHOO.util.Region(c[1], c[0] + a.offsetWidth, c[1] + a.offsetHeight, c[0])
};
YAHOO.util.Point = function(a, c) {
  YAHOO.lang.isArray(a) && (c = a[1], a = a[0]);
  this.x = this.right = this.left = this[0] = a;
  this.y = this.top = this.bottom = this[1] = c
};
YAHOO.util.Point.prototype = new YAHOO.util.Region;
YAHOO.register("dom", YAHOO.util.Dom, {version:"2.5.0", build:"895"});
YAHOO.util.CustomEvent = function(a, c, f, g) {
  this.type = a;
  this.scope = c || window;
  this.silent = f;
  this.signature = g || YAHOO.util.CustomEvent.LIST;
  this.subscribers = [];
  "_YUICEOnSubscribe" !== a && (this.subscribeEvent = new YAHOO.util.CustomEvent("_YUICEOnSubscribe", this, !0));
  this.lastError = null
};
YAHOO.util.CustomEvent.LIST = 0;
YAHOO.util.CustomEvent.FLAT = 1;
YAHOO.util.CustomEvent.prototype = {subscribe:function(a, c, f) {
  if(!a) {
    throw Error("Invalid callback for subscriber to '" + this.type + "'");
  }
  this.subscribeEvent && this.subscribeEvent.fire(a, c, f);
  this.subscribers.push(new YAHOO.util.Subscriber(a, c, f))
}, unsubscribe:function(a, c) {
  if(!a) {
    return this.unsubscribeAll()
  }
  for(var f = !1, g = 0, l = this.subscribers.length;g < l;++g) {
    var d = this.subscribers[g];
    d && d.contains(a, c) && (this._delete(g), f = !0)
  }
  return f
}, fire:function() {
  var a = this.subscribers.length;
  if(!a && this.silent) {
    return!0
  }
  var c = [], f = !0, g, l = !1;
  for(g = 0;g < arguments.length;++g) {
    c.push(arguments[g])
  }
  for(g = 0;g < a;++g) {
    var d = this.subscribers[g];
    if(d) {
      var b = d.getScope(this.scope);
      if(this.signature == YAHOO.util.CustomEvent.FLAT) {
        var e = null;
        0 < c.length && (e = c[0]);
        try {
          f = d.fn.call(b, e, d.obj)
        }catch(n) {
          this.lastError = n
        }
      }else {
        try {
          f = d.fn.call(b, this.type, c, d.obj)
        }catch(w) {
          this.lastError = w
        }
      }
      if(!1 === f) {
        return!1
      }
    }else {
      l = !0
    }
  }
  if(l) {
    c = [];
    f = this.subscribers;
    g = 0;
    for(a = f.length;g < a;g += 1) {
      c.push(f[g])
    }
    this.subscribers = c
  }
  return!0
}, unsubscribeAll:function() {
  for(var a = 0, c = this.subscribers.length;a < c;++a) {
    this._delete(c - 1 - a)
  }
  this.subscribers = [];
  return a
}, _delete:function(a) {
  var c = this.subscribers[a];
  c && (delete c.fn, delete c.obj);
  this.subscribers[a] = null
}, toString:function() {
  return"CustomEvent: '" + this.type + "', scope: " + this.scope
}};
YAHOO.util.Subscriber = function(a, c, f) {
  this.fn = a;
  this.obj = YAHOO.lang.isUndefined(c) ? null : c;
  this.override = f
};
YAHOO.util.Subscriber.prototype.getScope = function(a) {
  return this.override ? !0 === this.override ? this.obj : this.override : a
};
YAHOO.util.Subscriber.prototype.contains = function(a, c) {
  return c ? this.fn == a && this.obj == c : this.fn == a
};
YAHOO.util.Subscriber.prototype.toString = function() {
  return"Subscriber { obj: " + this.obj + ", override: " + (this.override || "no") + " }"
};
YAHOO.util.Event || (YAHOO.util.Event = function() {
  var a = !1, c = [], f = [], g = [], l = [], d = 0, b = [], e = [], n = 0, w = {63232:38, 63233:40, 63234:37, 63235:39, 63276:33, 63277:34, 25:9};
  return{POLL_RETRYS:2E3, POLL_INTERVAL:20, EL:0, TYPE:1, FN:2, WFN:3, UNLOAD_OBJ:3, ADJ_SCOPE:4, OBJ:5, OVERRIDE:6, lastError:null, isSafari:YAHOO.env.ua.webkit, webkit:YAHOO.env.ua.webkit, isIE:YAHOO.env.ua.ie, _interval:null, _dri:null, DOMReady:!1, startInterval:function() {
    if(!this._interval) {
      var a = this;
      this._interval = setInterval(function() {
        a._tryPreloadAttach()
      }, this.POLL_INTERVAL)
    }
  }, onAvailable:function(a, e, c, n, g) {
    a = YAHOO.lang.isString(a) ? [a] : a;
    for(var f = 0;f < a.length;f += 1) {
      b.push({id:a[f], fn:e, obj:c, override:n, checkReady:g})
    }
    d = this.POLL_RETRYS;
    this.startInterval()
  }, onContentReady:function(a, b, e, c) {
    this.onAvailable(a, b, e, c, !0)
  }, onDOMReady:function(a, b, e) {
    this.DOMReady ? setTimeout(function() {
      var c = window;
      e && (c = !0 === e ? b : e);
      a.call(c, "DOMReady", [], b)
    }, 0) : this.DOMReadyEvent.subscribe(a, b, e)
  }, addListener:function(a, b, d, n, w) {
    if(!d || !d.call) {
      return!1
    }
    if(this._isValidCollection(a)) {
      for(var B = !0, A = 0, E = a.length;A < E;++A) {
        B = this.on(a[A], b, d, n, w) && B
      }
      return B
    }
    if(YAHOO.lang.isString(a)) {
      if(B = this.getEl(a)) {
        a = B
      }else {
        return this.onAvailable(a, function() {
          YAHOO.util.Event.on(a, b, d, n, w)
        }), !0
      }
    }
    if(!a) {
      return!1
    }
    if("unload" == b && n !== this) {
      return f[f.length] = [a, b, d, n, w], !0
    }
    var F = a;
    w && (F = !0 === w ? n : w);
    B = function(b) {
      return d.call(F, YAHOO.util.Event.getEvent(b, a), n)
    };
    A = [a, b, d, B, F, n, w];
    c[c.length] = A;
    if(this.useLegacyEvent(a, b)) {
      var z = this.getLegacyIndex(a, b);
      if(-1 == z || a != g[z][0]) {
        z = g.length, e[a.id + b] = z, g[z] = [a, b, a["on" + b]], l[z] = [], a["on" + b] = function(a) {
          YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(a), z)
        }
      }
      l[z].push(A)
    }else {
      try {
        this._simpleAdd(a, b, B, !1)
      }catch(R) {
        return this.lastError = R, this.removeListener(a, b, d), !1
      }
    }
    return!0
  }, fireLegacyEvent:function(a, b) {
    var e = !0, c, d, n;
    c = l[b];
    for(var f = 0, w = c.length;f < w;++f) {
      if((d = c[f]) && d[this.WFN]) {
        n = d[this.ADJ_SCOPE], d = d[this.WFN].call(n, a), e = e && d
      }
    }
    if((c = g[b]) && c[2]) {
      c[2](a)
    }
    return e
  }, getLegacyIndex:function(a, b) {
    var c = this.generateId(a) + b;
    return"undefined" == typeof e[c] ? -1 : e[c]
  }, useLegacyEvent:function(a, b) {
    if(this.webkit && ("click" == b || "dblclick" == b)) {
      var e = parseInt(this.webkit, 10);
      if(!isNaN(e) && 418 > e) {
        return!0
      }
    }
    return!1
  }, removeListener:function(a, b, e, d) {
    var n, g, w;
    if("string" == typeof a) {
      a = this.getEl(a)
    }else {
      if(this._isValidCollection(a)) {
        d = !0;
        n = 0;
        for(g = a.length;n < g;++n) {
          d = this.removeListener(a[n], b, e) && d
        }
        return d
      }
    }
    if(!e || !e.call) {
      return this.purgeElement(a, !1, b)
    }
    if("unload" == b) {
      n = 0;
      for(g = f.length;n < g;n++) {
        if((w = f[n]) && w[0] == a && w[1] == b && w[2] == e) {
          return f[n] = null, !0
        }
      }
      return!1
    }
    n = null;
    "undefined" === typeof d && (d = this._getCacheIndex(a, b, e));
    0 <= d && (n = c[d]);
    if(!a || !n) {
      return!1
    }
    if(this.useLegacyEvent(a, b)) {
      n = this.getLegacyIndex(a, b);
      var E = l[n];
      if(E) {
        n = 0;
        for(g = E.length;n < g;++n) {
          if((w = E[n]) && w[this.EL] == a && w[this.TYPE] == b && w[this.FN] == e) {
            E[n] = null;
            break
          }
        }
      }
    }else {
      try {
        this._simpleRemove(a, b, n[this.WFN], !1)
      }catch(F) {
        return this.lastError = F, !1
      }
    }
    delete c[d][this.WFN];
    delete c[d][this.FN];
    c[d] = null;
    return!0
  }, getTarget:function(a, b) {
    return this.resolveTextNode(a.target || a.srcElement)
  }, resolveTextNode:function(a) {
    try {
      if(a && 3 == a.nodeType) {
        return a.parentNode
      }
    }catch(b) {
    }
    return a
  }, getPageX:function(a) {
    var b = a.pageX;
    !b && 0 !== b && (b = a.clientX || 0, this.isIE && (b += this._getScrollLeft()));
    return b
  }, getPageY:function(a) {
    var b = a.pageY;
    !b && 0 !== b && (b = a.clientY || 0, this.isIE && (b += this._getScrollTop()));
    return b
  }, getXY:function(a) {
    return[this.getPageX(a), this.getPageY(a)]
  }, getRelatedTarget:function(a) {
    var b = a.relatedTarget;
    b || ("mouseout" == a.type ? b = a.toElement : "mouseover" == a.type && (b = a.fromElement));
    return this.resolveTextNode(b)
  }, getTime:function(a) {
    if(!a.time) {
      var b = (new Date).getTime();
      try {
        a.time = b
      }catch(e) {
        return this.lastError = e, b
      }
    }
    return a.time
  }, stopEvent:function(a) {
    this.stopPropagation(a);
    this.preventDefault(a)
  }, stopPropagation:function(a) {
    a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
  }, preventDefault:function(a) {
    a.preventDefault ? a.preventDefault() : a.returnValue = !1
  }, getEvent:function(a, b) {
    var e = a || window.event;
    if(!e) {
      for(var c = this.getEvent.caller;c && !((e = c.arguments[0]) && Event == e.constructor);) {
        c = c.caller
      }
    }
    return e
  }, getCharCode:function(a) {
    a = a.keyCode || a.charCode || 0;
    YAHOO.env.ua.webkit && a in w && (a = w[a]);
    return a
  }, _getCacheIndex:function(a, b, e) {
    for(var d = 0, n = c.length;d < n;++d) {
      var g = c[d];
      if(g && g[this.FN] == e && g[this.EL] == a && g[this.TYPE] == b) {
        return d
      }
    }
    return-1
  }, generateId:function(a) {
    var b = a.id;
    b || (b = "yuievtautoid-" + n, ++n, a.id = b);
    return b
  }, _isValidCollection:function(a) {
    try {
      return a && "string" !== typeof a && a.length && !a.tagName && !a.alert && "undefined" !== typeof a[0]
    }catch(b) {
      return!1
    }
  }, elCache:{}, getEl:function(a) {
    return"string" === typeof a ? document.getElementById(a) : a
  }, clearCache:function() {
  }, DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady", this), _load:function(b) {
    a || (a = !0, b = YAHOO.util.Event, b._ready(), b._tryPreloadAttach())
  }, _ready:function(a) {
    a = YAHOO.util.Event;
    a.DOMReady || (a.DOMReady = !0, a.DOMReadyEvent.fire(), a._simpleRemove(document, "DOMContentLoaded", a._ready))
  }, _tryPreloadAttach:function() {
    if(this.locked) {
      return!1
    }
    if(this.isIE && !this.DOMReady) {
      return this.startInterval(), !1
    }
    this.locked = !0;
    var e = !a;
    e || (e = 0 < d);
    var c = [], n = function(a, b) {
      var e = a;
      b.override && (e = !0 === b.override ? b.obj : b.override);
      b.fn.call(e, b.obj)
    }, g, f, w, l;
    g = 0;
    for(f = b.length;g < f;++g) {
      if((w = b[g]) && !w.checkReady) {
        (l = this.getEl(w.id)) ? (n(l, w), b[g] = null) : c.push(w)
      }
    }
    g = 0;
    for(f = b.length;g < f;++g) {
      if((w = b[g]) && w.checkReady) {
        if(l = this.getEl(w.id)) {
          if(a || l.nextSibling) {
            n(l, w), b[g] = null
          }
        }else {
          c.push(w)
        }
      }
    }
    d = 0 === c.length ? 0 : d - 1;
    e ? this.startInterval() : (clearInterval(this._interval), this._interval = null);
    this.locked = !1;
    return!0
  }, purgeElement:function(a, b, e) {
    a = YAHOO.lang.isString(a) ? this.getEl(a) : a;
    var c = this.getListeners(a, e), d, n;
    if(c) {
      d = 0;
      for(n = c.length;d < n;++d) {
        var g = c[d];
        this.removeListener(a, g.type, g.fn, g.index)
      }
    }
    if(b && a && a.childNodes) {
      d = 0;
      for(n = a.childNodes.length;d < n;++d) {
        this.purgeElement(a.childNodes[d], b, e)
      }
    }
  }, getListeners:function(a, b) {
    var e = [], d;
    d = b ? "unload" === b ? [f] : [c] : [c, f];
    for(var n = YAHOO.lang.isString(a) ? this.getEl(a) : a, g = 0;g < d.length;g += 1) {
      var w = d[g];
      if(w && 0 < w.length) {
        for(var l = 0, F = w.length;l < F;++l) {
          var z = w[l];
          z && (z[this.EL] === n && (!b || b === z[this.TYPE])) && e.push({type:z[this.TYPE], fn:z[this.FN], obj:z[this.OBJ], adjust:z[this.OVERRIDE], scope:z[this.ADJ_SCOPE], index:l})
        }
      }
    }
    return e.length ? e : null
  }, _unload:function(a) {
    var b = YAHOO.util.Event, e, d, n;
    e = 0;
    for(n = f.length;e < n;++e) {
      if(d = f[e]) {
        var w = window;
        d[b.ADJ_SCOPE] && (w = !0 === d[b.ADJ_SCOPE] ? d[b.UNLOAD_OBJ] : d[b.ADJ_SCOPE]);
        d[b.FN].call(w, b.getEvent(a, d[b.EL]), d[b.UNLOAD_OBJ]);
        f[e] = null
      }
    }
    f = null;
    if(c && 0 < c.length) {
      for(a = c.length;a;) {
        e = a - 1, (d = c[e]) && b.removeListener(d[b.EL], d[b.TYPE], d[b.FN], e), a--
      }
    }
    g = null;
    b._simpleRemove(window, "unload", b._unload)
  }, _getScrollLeft:function() {
    return this._getScroll()[1]
  }, _getScrollTop:function() {
    return this._getScroll()[0]
  }, _getScroll:function() {
    var a = document.documentElement, b = document.body;
    return a && (a.scrollTop || a.scrollLeft) ? [a.scrollTop, a.scrollLeft] : b ? [b.scrollTop, b.scrollLeft] : [0, 0]
  }, regCE:function() {
  }, _simpleAdd:function() {
    return window.addEventListener ? function(a, b, e, c) {
      a.addEventListener(b, e, c)
    } : window.attachEvent ? function(a, b, e, c) {
      a.attachEvent("on" + b, e)
    } : function() {
    }
  }(), _simpleRemove:function() {
    return window.removeEventListener ? function(a, b, e, c) {
      a.removeEventListener(b, e, c)
    } : window.detachEvent ? function(a, b, e) {
      a.detachEvent("on" + b, e)
    } : function() {
    }
  }()}
}(), function() {
  var a = YAHOO.util.Event;
  a.on = a.addListener;
  a.isIE ? (YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach, YAHOO.util.Event, !0), a._dri = setInterval(function() {
    var c = document.createElement("p");
    try {
      c.doScroll("left"), clearInterval(a._dri), a._dri = null, a._ready()
    }catch(f) {
    }
  }, a.POLL_INTERVAL)) : a.webkit && 525 > a.webkit ? a._dri = setInterval(function() {
    var c = document.readyState;
    if("loaded" == c || "complete" == c) {
      clearInterval(a._dri), a._dri = null, a._ready()
    }
  }, a.POLL_INTERVAL) : a._simpleAdd(document, "DOMContentLoaded", a._ready);
  a._simpleAdd(window, "load", a._load);
  a._simpleAdd(window, "unload", a._unload);
  a._tryPreloadAttach()
}());
YAHOO.util.EventProvider = function() {
};
YAHOO.util.EventProvider.prototype = {__yui_events:null, __yui_subscribers:null, subscribe:function(a, c, f, g) {
  this.__yui_events = this.__yui_events || {};
  var l = this.__yui_events[a];
  l ? l.subscribe(c, f, g) : (l = this.__yui_subscribers = this.__yui_subscribers || {}, l[a] || (l[a] = []), l[a].push({fn:c, obj:f, override:g}))
}, unsubscribe:function(a, c, f) {
  var g = this.__yui_events = this.__yui_events || {};
  if(a) {
    if(g = g[a]) {
      return g.unsubscribe(c, f)
    }
  }else {
    a = !0;
    for(var l in g) {
      YAHOO.lang.hasOwnProperty(g, l) && (a = a && g[l].unsubscribe(c, f))
    }
    return a
  }
  return!1
}, unsubscribeAll:function(a) {
  return this.unsubscribe(a)
}, createEvent:function(a, c) {
  this.__yui_events = this.__yui_events || {};
  var f = c || {}, g = this.__yui_events;
  if(!g[a]) {
    var l = new YAHOO.util.CustomEvent(a, f.scope || this, f.silent, YAHOO.util.CustomEvent.FLAT);
    g[a] = l;
    f.onSubscribeCallback && l.subscribeEvent.subscribe(f.onSubscribeCallback);
    this.__yui_subscribers = this.__yui_subscribers || {};
    if(f = this.__yui_subscribers[a]) {
      for(var d = 0;d < f.length;++d) {
        l.subscribe(f[d].fn, f[d].obj, f[d].override)
      }
    }
  }
  return g[a]
}, fireEvent:function(a, c, f, g) {
  this.__yui_events = this.__yui_events || {};
  var l = this.__yui_events[a];
  if(!l) {
    return null
  }
  for(var d = [], b = 1;b < arguments.length;++b) {
    d.push(arguments[b])
  }
  return l.fire.apply(l, d)
}, hasEvent:function(a) {
  return this.__yui_events && this.__yui_events[a] ? !0 : !1
}};
YAHOO.util.KeyListener = function(a, c, f, g) {
  function l(a, e) {
    c.shift || (c.shift = !1);
    c.alt || (c.alt = !1);
    c.ctrl || (c.ctrl = !1);
    if(a.shiftKey == c.shift && a.altKey == c.alt && a.ctrlKey == c.ctrl) {
      var n;
      if(c.keys instanceof Array) {
        for(var g = 0;g < c.keys.length;g++) {
          if(n = c.keys[g], n == a.charCode) {
            d.fire(a.charCode, a);
            break
          }else {
            if(n == a.keyCode) {
              d.fire(a.keyCode, a);
              break
            }
          }
        }
      }else {
        n = c.keys, n == a.charCode ? d.fire(a.charCode, a) : n == a.keyCode && d.fire(a.keyCode, a)
      }
    }
  }
  g || (g = YAHOO.util.KeyListener.KEYDOWN);
  var d = new YAHOO.util.CustomEvent("keyPressed");
  this.enabledEvent = new YAHOO.util.CustomEvent("enabled");
  this.disabledEvent = new YAHOO.util.CustomEvent("disabled");
  "string" == typeof a && (a = document.getElementById(a));
  "function" == typeof f ? d.subscribe(f) : d.subscribe(f.fn, f.scope, f.correctScope);
  this.enable = function() {
    this.enabled || (YAHOO.util.Event.addListener(a, g, l), this.enabledEvent.fire(c));
    this.enabled = !0
  };
  this.disable = function() {
    this.enabled && (YAHOO.util.Event.removeListener(a, g, l), this.disabledEvent.fire(c));
    this.enabled = !1
  };
  this.toString = function() {
    return"KeyListener [" + c.keys + "] " + a.tagName + (a.id ? "[" + a.id + "]" : "")
  }
};
YAHOO.util.KeyListener.KEYDOWN = "keydown";
YAHOO.util.KeyListener.KEYUP = "keyup";
YAHOO.util.KeyListener.KEY = {ALT:18, BACK_SPACE:8, CAPS_LOCK:20, CONTROL:17, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, LEFT:37, META:224, NUM_LOCK:144, PAGE_DOWN:34, PAGE_UP:33, PAUSE:19, PRINTSCREEN:44, RIGHT:39, SCROLL_LOCK:145, SHIFT:16, SPACE:32, TAB:9, UP:38};
YAHOO.register("event", YAHOO.util.Event, {version:"2.5.0", build:"895"});
YAHOO.register("yahoo-dom-event", YAHOO, {version:"2.5.0", build:"895"});
YAHOO.widget.DateMath = {DAY:"D", WEEK:"W", YEAR:"Y", MONTH:"M", ONE_DAY_MS:864E5, add:function(a, c, f) {
  var g = new Date(a.getTime());
  switch(c) {
    case this.MONTH:
      c = a.getMonth() + f;
      f = 0;
      if(0 > c) {
        for(;0 > c;) {
          c += 12, f -= 1
        }
      }else {
        if(11 < c) {
          for(;11 < c;) {
            c -= 12, f += 1
          }
        }
      }
      g.setMonth(c);
      g.setFullYear(a.getFullYear() + f);
      break;
    case this.DAY:
      g.setDate(a.getDate() + f);
      break;
    case this.YEAR:
      g.setFullYear(a.getFullYear() + f);
      break;
    case this.WEEK:
      g.setDate(a.getDate() + 7 * f)
  }
  return g
}, subtract:function(a, c, f) {
  return this.add(a, c, -1 * f)
}, before:function(a, c) {
  var f = c.getTime();
  return a.getTime() < f ? !0 : !1
}, after:function(a, c) {
  var f = c.getTime();
  return a.getTime() > f ? !0 : !1
}, between:function(a, c, f) {
  return this.after(a, c) && this.before(a, f) ? !0 : !1
}, getJan1:function(a) {
  return new Date(a, 0, 1)
}, getDayOffset:function(a, c) {
  var f = this.getJan1(c);
  return Math.ceil((a.getTime() - f.getTime()) / this.ONE_DAY_MS)
}, getWeekNumber:function(a, c) {
  a = this.clearTime(a);
  var f = new Date(a.getTime() + 4 * this.ONE_DAY_MS - a.getDay() * this.ONE_DAY_MS), g = new Date(f.getFullYear(), 0, 1), f = (f.getTime() - g.getTime()) / this.ONE_DAY_MS - 1;
  return Math.ceil(f / 7)
}, isYearOverlapWeek:function(a) {
  var c = !1;
  this.add(a, this.DAY, 6).getFullYear() != a.getFullYear() && (c = !0);
  return c
}, isMonthOverlapWeek:function(a) {
  var c = !1;
  this.add(a, this.DAY, 6).getMonth() != a.getMonth() && (c = !0);
  return c
}, findMonthStart:function(a) {
  return new Date(a.getFullYear(), a.getMonth(), 1)
}, findMonthEnd:function(a) {
  a = this.findMonthStart(a);
  a = this.add(a, this.MONTH, 1);
  return this.subtract(a, this.DAY, 1)
}, clearTime:function(a) {
  a.setHours(12, 0, 0, 0);
  return a
}};
(function() {
  YAHOO.util.Config = function(a) {
    a && this.init(a)
  };
  var a = YAHOO.lang, c = YAHOO.util.CustomEvent, f = YAHOO.util.Config;
  f.CONFIG_CHANGED_EVENT = "configChanged";
  f.BOOLEAN_TYPE = "boolean";
  f.prototype = {owner:null, queueInProgress:!1, config:null, initialConfig:null, eventQueue:null, configChangedEvent:null, init:function(a) {
    this.owner = a;
    this.configChangedEvent = this.createEvent(f.CONFIG_CHANGED_EVENT);
    this.configChangedEvent.signature = c.LIST;
    this.queueInProgress = !1;
    this.config = {};
    this.initialConfig = {};
    this.eventQueue = []
  }, checkBoolean:function(a) {
    return typeof a == f.BOOLEAN_TYPE
  }, checkNumber:function(a) {
    return!isNaN(a)
  }, fireEvent:function(a, c) {
    var d = this.config[a];
    d && d.event && d.event.fire(c)
  }, addProperty:function(a, f) {
    a = a.toLowerCase();
    this.config[a] = f;
    f.event = this.createEvent(a, {scope:this.owner});
    f.event.signature = c.LIST;
    f.key = a;
    f.handler && f.event.subscribe(f.handler, this.owner);
    this.setProperty(a, f.value, !0);
    f.suppressEvent || this.queueProperty(a, f.value)
  }, getConfig:function() {
    var c = {}, f = this.config, d, b;
    for(d in f) {
      if(a.hasOwnProperty(f, d) && (b = f[d]) && b.event) {
        c[d] = b.value
      }
    }
    return c
  }, getProperty:function(a) {
    if((a = this.config[a.toLowerCase()]) && a.event) {
      return a.value
    }
  }, resetProperty:function(c) {
    c = c.toLowerCase();
    var f = this.config[c];
    if(f && f.event) {
      if(this.initialConfig[c] && !a.isUndefined(this.initialConfig[c])) {
        return this.setProperty(c, this.initialConfig[c]), !0
      }
    }else {
      return!1
    }
  }, setProperty:function(a, c, d) {
    var b;
    a = a.toLowerCase();
    if(this.queueInProgress && !d) {
      return this.queueProperty(a, c), !0
    }
    if((b = this.config[a]) && b.event) {
      if(b.validator && !b.validator(c)) {
        return!1
      }
      b.value = c;
      d || (this.fireEvent(a, c), this.configChangedEvent.fire([a, c]));
      return!0
    }
    return!1
  }, queueProperty:function(c, f) {
    c = c.toLowerCase();
    var d = this.config[c], b = !1, e, n, w, v, t, u;
    if(d && d.event) {
      if(!a.isUndefined(f) && d.validator && !d.validator(f)) {
        return!1
      }
      a.isUndefined(f) ? f = d.value : d.value = f;
      b = !1;
      e = this.eventQueue.length;
      for(t = 0;t < e;t++) {
        if(n = this.eventQueue[t]) {
          if(w = n[0], n = n[1], w == c) {
            this.eventQueue[t] = null;
            this.eventQueue.push([c, !a.isUndefined(f) ? f : n]);
            b = !0;
            break
          }
        }
      }
      !b && !a.isUndefined(f) && this.eventQueue.push([c, f]);
      if(d.supercedes) {
        b = d.supercedes.length;
        for(n = 0;n < b;n++) {
          e = d.supercedes[n];
          w = this.eventQueue.length;
          for(u = 0;u < w;u++) {
            if(v = this.eventQueue[u]) {
              if(t = v[0], v = v[1], t == e.toLowerCase()) {
                this.eventQueue.push([t, v]);
                this.eventQueue[u] = null;
                break
              }
            }
          }
        }
      }
      return!0
    }
    return!1
  }, refireEvent:function(c) {
    c = c.toLowerCase();
    var f = this.config[c];
    f && (f.event && !a.isUndefined(f.value)) && (this.queueInProgress ? this.queueProperty(c) : this.fireEvent(c, f.value))
  }, applyConfig:function(c, f) {
    var d, b;
    if(f) {
      b = {};
      for(d in c) {
        a.hasOwnProperty(c, d) && (b[d.toLowerCase()] = c[d])
      }
      this.initialConfig = b
    }
    for(d in c) {
      a.hasOwnProperty(c, d) && this.queueProperty(d, c[d])
    }
  }, refresh:function() {
    for(var c in this.config) {
      a.hasOwnProperty(this.config, c) && this.refireEvent(c)
    }
  }, fireQueue:function() {
    var a, c, d, b;
    this.queueInProgress = !0;
    for(a = 0;a < this.eventQueue.length;a++) {
      if(c = this.eventQueue[a]) {
        d = c[0], c = c[1], b = this.config[d], b.value = c, this.eventQueue[a] = null, this.fireEvent(d, c)
      }
    }
    this.queueInProgress = !1;
    this.eventQueue = []
  }, subscribeToConfigEvent:function(a, c, d, b) {
    return(a = this.config[a.toLowerCase()]) && a.event ? (f.alreadySubscribed(a.event, c, d) || a.event.subscribe(c, d, b), !0) : !1
  }, unsubscribeFromConfigEvent:function(a, c, d) {
    return(a = this.config[a.toLowerCase()]) && a.event ? a.event.unsubscribe(c, d) : !1
  }, toString:function() {
    var a = "Config";
    this.owner && (a += " [" + this.owner.toString() + "]");
    return a
  }, outputEventQueue:function() {
    var a = "", c, d, b = this.eventQueue.length;
    for(d = 0;d < b;d++) {
      (c = this.eventQueue[d]) && (a += c[0] + "=" + c[1] + ", ")
    }
    return a
  }, destroy:function() {
    var c = this.config, f, d;
    for(f in c) {
      a.hasOwnProperty(c, f) && (d = c[f], d.event.unsubscribeAll(), d.event = null)
    }
    this.configChangedEvent.unsubscribeAll();
    this.eventQueue = this.initialConfig = this.config = this.owner = this.configChangedEvent = null
  }};
  f.alreadySubscribed = function(a, c, d) {
    var b = a.subscribers.length, e;
    if(0 < b) {
      e = b - 1;
      do {
        if((b = a.subscribers[e]) && b.obj == d && b.fn == c) {
          return!0
        }
      }while(e--)
    }
    return!1
  };
  YAHOO.lang.augmentProto(f, YAHOO.util.EventProvider)
})();
YAHOO.widget.DateMath = {DAY:"D", WEEK:"W", YEAR:"Y", MONTH:"M", ONE_DAY_MS:864E5, WEEK_ONE_JAN_DATE:1, add:function(a, c, f) {
  var g = new Date(a.getTime());
  switch(c) {
    case this.MONTH:
      c = a.getMonth() + f;
      f = 0;
      if(0 > c) {
        for(;0 > c;) {
          c += 12, f -= 1
        }
      }else {
        if(11 < c) {
          for(;11 < c;) {
            c -= 12, f += 1
          }
        }
      }
      g.setMonth(c);
      g.setFullYear(a.getFullYear() + f);
      break;
    case this.DAY:
      this._addDays(g, f);
      break;
    case this.YEAR:
      g.setFullYear(a.getFullYear() + f);
      break;
    case this.WEEK:
      this._addDays(g, 7 * f)
  }
  return g
}, _addDays:function(a, c) {
  if(YAHOO.env.ua.webkit && 420 > YAHOO.env.ua.webkit) {
    if(0 > c) {
      for(;-128 > c;c -= -128) {
        a.setDate(a.getDate() + -128)
      }
    }else {
      for(;96 < c;c -= 96) {
        a.setDate(a.getDate() + 96)
      }
    }
  }
  a.setDate(a.getDate() + c)
}, subtract:function(a, c, f) {
  return this.add(a, c, -1 * f)
}, before:function(a, c) {
  var f = c.getTime();
  return a.getTime() < f ? !0 : !1
}, after:function(a, c) {
  var f = c.getTime();
  return a.getTime() > f ? !0 : !1
}, between:function(a, c, f) {
  return this.after(a, c) && this.before(a, f) ? !0 : !1
}, getJan1:function(a) {
  return this.getDate(a, 0, 1)
}, getDayOffset:function(a, c) {
  var f = this.getJan1(c);
  return Math.ceil((a.getTime() - f.getTime()) / this.ONE_DAY_MS)
}, getWeekNumber:function(a, c, f) {
  c = c || 0;
  f = f || this.WEEK_ONE_JAN_DATE;
  a = this.clearTime(a);
  var g;
  g = a.getDay() === c ? a : this.getFirstDayOfWeek(a, c);
  var l = g.getFullYear();
  g = new Date(g.getTime() + 6 * this.ONE_DAY_MS);
  l !== g.getFullYear() && g.getDate() >= f ? c = 1 : (f = this.clearTime(this.getDate(l, 0, f)), c = this.getFirstDayOfWeek(f, c), c = Math.round((a.getTime() - c.getTime()) / this.ONE_DAY_MS), c = (c - c % 7) / 7 + 1);
  return c
}, getFirstDayOfWeek:function(a, c) {
  var f = (a.getDay() - (c || 0) + 7) % 7;
  return this.subtract(a, this.DAY, f)
}, isYearOverlapWeek:function(a) {
  var c = !1;
  this.add(a, this.DAY, 6).getFullYear() != a.getFullYear() && (c = !0);
  return c
}, isMonthOverlapWeek:function(a) {
  var c = !1;
  this.add(a, this.DAY, 6).getMonth() != a.getMonth() && (c = !0);
  return c
}, findMonthStart:function(a) {
  return this.getDate(a.getFullYear(), a.getMonth(), 1)
}, findMonthEnd:function(a) {
  a = this.findMonthStart(a);
  a = this.add(a, this.MONTH, 1);
  return this.subtract(a, this.DAY, 1)
}, clearTime:function(a) {
  a.setHours(12, 0, 0, 0);
  return a
}, getDate:function(a, c, f) {
  var g = null;
  YAHOO.lang.isUndefined(f) && (f = 1);
  100 <= a ? g = new Date(a, c, f) : (g = new Date, g.setFullYear(a), g.setMonth(c), g.setDate(f), g.setHours(0, 0, 0, 0));
  return g
}};
(function() {
  function a(a, e, c) {
    this.init.apply(this, arguments)
  }
  var c = YAHOO.util.Dom, f = YAHOO.util.Event, g = YAHOO.lang, l = YAHOO.widget.DateMath;
  a.IMG_ROOT = null;
  a.DATE = "D";
  a.MONTH_DAY = "MD";
  a.WEEKDAY = "WD";
  a.RANGE = "R";
  a.MONTH = "M";
  a.DISPLAY_DAYS = 42;
  a.STOP_RENDER = "S";
  a.SHORT = "short";
  a.LONG = "long";
  a.MEDIUM = "medium";
  a.ONE_CHAR = "1char";
  a.DEFAULT_CONFIG = {YEAR_OFFSET:{key:"year_offset", value:0, supercedes:["pagedate", "selected", "mindate", "maxdate"]}, TODAY:{key:"today", value:new Date, supercedes:["pagedate"]}, PAGEDATE:{key:"pagedate", value:null}, SELECTED:{key:"selected", value:[]}, TITLE:{key:"title", value:""}, CLOSE:{key:"close", value:!1}, IFRAME:{key:"iframe", value:YAHOO.env.ua.ie && 6 >= YAHOO.env.ua.ie ? !0 : !1}, MINDATE:{key:"mindate", value:null}, MAXDATE:{key:"maxdate", value:null}, MULTI_SELECT:{key:"multi_select", 
  value:!1}, START_WEEKDAY:{key:"start_weekday", value:0}, SHOW_WEEKDAYS:{key:"show_weekdays", value:!0}, SHOW_WEEK_HEADER:{key:"show_week_header", value:!1}, SHOW_WEEK_FOOTER:{key:"show_week_footer", value:!1}, HIDE_BLANK_WEEKS:{key:"hide_blank_weeks", value:!1}, NAV_ARROW_LEFT:{key:"nav_arrow_left", value:null}, NAV_ARROW_RIGHT:{key:"nav_arrow_right", value:null}, MONTHS_SHORT:{key:"months_short", value:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")}, MONTHS_LONG:{key:"months_long", 
  value:"January February March April May June July August September October November December".split(" ")}, WEEKDAYS_1CHAR:{key:"weekdays_1char", value:"SMTWTFS".split("")}, WEEKDAYS_SHORT:{key:"weekdays_short", value:"Su Mo Tu We Th Fr Sa".split(" ")}, WEEKDAYS_MEDIUM:{key:"weekdays_medium", value:"Sun Mon Tue Wed Thu Fri Sat".split(" ")}, WEEKDAYS_LONG:{key:"weekdays_long", value:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")}, LOCALE_MONTHS:{key:"locale_months", value:"long"}, 
  LOCALE_WEEKDAYS:{key:"locale_weekdays", value:"short"}, DATE_DELIMITER:{key:"date_delimiter", value:","}, DATE_FIELD_DELIMITER:{key:"date_field_delimiter", value:"/"}, DATE_RANGE_DELIMITER:{key:"date_range_delimiter", value:"-"}, MY_MONTH_POSITION:{key:"my_month_position", value:1}, MY_YEAR_POSITION:{key:"my_year_position", value:2}, MD_MONTH_POSITION:{key:"md_month_position", value:1}, MD_DAY_POSITION:{key:"md_day_position", value:2}, MDY_MONTH_POSITION:{key:"mdy_month_position", value:1}, MDY_DAY_POSITION:{key:"mdy_day_position", 
  value:2}, MDY_YEAR_POSITION:{key:"mdy_year_position", value:3}, MY_LABEL_MONTH_POSITION:{key:"my_label_month_position", value:1}, MY_LABEL_YEAR_POSITION:{key:"my_label_year_position", value:2}, MY_LABEL_MONTH_SUFFIX:{key:"my_label_month_suffix", value:" "}, MY_LABEL_YEAR_SUFFIX:{key:"my_label_year_suffix", value:""}, NAV:{key:"navigator", value:null}, STRINGS:{key:"strings", value:{previousMonth:"Previous Month", nextMonth:"Next Month", close:"Close"}, supercedes:["close", "title"]}};
  var d = a._DEFAULT_CONFIG = a.DEFAULT_CONFIG;
  a._EVENT_TYPES = {BEFORE_SELECT:"beforeSelect", SELECT:"select", BEFORE_DESELECT:"beforeDeselect", DESELECT:"deselect", CHANGE_PAGE:"changePage", BEFORE_RENDER:"beforeRender", RENDER:"render", BEFORE_DESTROY:"beforeDestroy", DESTROY:"destroy", RESET:"reset", CLEAR:"clear", BEFORE_HIDE:"beforeHide", HIDE:"hide", BEFORE_SHOW:"beforeShow", SHOW:"show", BEFORE_HIDE_NAV:"beforeHideNav", HIDE_NAV:"hideNav", BEFORE_SHOW_NAV:"beforeShowNav", SHOW_NAV:"showNav", BEFORE_RENDER_NAV:"beforeRenderNav", RENDER_NAV:"renderNav"};
  a.STYLES = {CSS_ROW_HEADER:"calrowhead", CSS_ROW_FOOTER:"calrowfoot", CSS_CELL:"calcell", CSS_CELL_SELECTOR:"selector", CSS_CELL_SELECTED:"selected", CSS_CELL_SELECTABLE:"selectable", CSS_CELL_RESTRICTED:"restricted", CSS_CELL_TODAY:"today", CSS_CELL_OOM:"oom", CSS_CELL_OOB:"previous", CSS_HEADER:"calheader", CSS_HEADER_TEXT:"calhead", CSS_BODY:"calbody", CSS_WEEKDAY_CELL:"calweekdaycell", CSS_WEEKDAY_ROW:"calweekdayrow", CSS_FOOTER:"calfoot", CSS_CALENDAR:"yui-calendar", CSS_SINGLE:"single", CSS_CONTAINER:"yui-calcontainer", 
  CSS_NAV_LEFT:"calnavleft", CSS_NAV_RIGHT:"calnavright", CSS_NAV:"calnav", CSS_CLOSE:"calclose", CSS_CELL_TOP:"calcelltop", CSS_CELL_LEFT:"calcellleft", CSS_CELL_RIGHT:"calcellright", CSS_CELL_BOTTOM:"calcellbottom", CSS_CELL_HOVER:"calcellhover", CSS_CELL_HIGHLIGHT1:"highlight1", CSS_CELL_HIGHLIGHT2:"highlight2", CSS_CELL_HIGHLIGHT3:"highlight3", CSS_CELL_HIGHLIGHT4:"highlight4", CSS_WITH_TITLE:"withtitle", CSS_FIXED_SIZE:"fixedsize", CSS_LINK_CLOSE:"link-close"};
  a._STYLES = a.STYLES;
  a.prototype = {Config:null, parent:null, index:-1, cells:null, cellDates:null, id:null, containerId:null, oDomContainer:null, today:null, renderStack:null, _renderStack:null, oNavigator:null, _selectedDates:null, domEventMap:null, _parseArgs:function(a) {
    var e = {id:null, container:null, config:null};
    if(a && a.length && 0 < a.length) {
      switch(a.length) {
        case 1:
          e.id = null;
          e.container = a[0];
          e.config = null;
          break;
        case 2:
          g.isObject(a[1]) && !a[1].tagName && !(a[1] instanceof String) ? (e.id = null, e.container = a[0], e.config = a[1]) : (e.id = a[0], e.container = a[1], e.config = null);
          break;
        default:
          e.id = a[0], e.container = a[1], e.config = a[2]
      }
    }
    return e
  }, init:function(a, e, d) {
    var f = this._parseArgs(arguments);
    a = f.id;
    e = f.container;
    d = f.config;
    this.oDomContainer = c.get(e);
    this.oDomContainer.id || (this.oDomContainer.id = c.generateId());
    a || (a = this.oDomContainer.id + "_t");
    this.id = a;
    this.containerId = this.oDomContainer.id;
    this.initEvents();
    this.cfg = new YAHOO.util.Config(this);
    this.Options = {};
    this.Locale = {};
    this.initStyles();
    c.addClass(this.oDomContainer, this.Style.CSS_CONTAINER);
    c.addClass(this.oDomContainer, this.Style.CSS_SINGLE);
    this.cellDates = [];
    this.cells = [];
    this.renderStack = [];
    this._renderStack = [];
    this.setupConfig();
    d && this.cfg.applyConfig(d, !0);
    this.cfg.fireQueue();
    this.today = this.cfg.getProperty("today")
  }, configIframe:function(a, e, d) {
    a = e[0];
    if(!this.parent && c.inDocument(this.oDomContainer)) {
      if(a) {
        if(a = c.getStyle(this.oDomContainer, "position"), ("absolute" == a || "relative" == a) && !c.inDocument(this.iframe)) {
          this.iframe = document.createElement("iframe"), this.iframe.src = "javascript:false;", c.setStyle(this.iframe, "opacity", "0"), YAHOO.env.ua.ie && 6 >= YAHOO.env.ua.ie && c.addClass(this.iframe, this.Style.CSS_FIXED_SIZE), this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild)
        }
      }else {
        this.iframe && (this.iframe.parentNode && this.iframe.parentNode.removeChild(this.iframe), this.iframe = null)
      }
    }
  }, configTitle:function(a, e, c) {
    (a = e[0]) ? this.createTitleBar(a) : this.cfg.getProperty(d.CLOSE.key) ? this.createTitleBar("&#160;") : this.removeTitleBar()
  }, configClose:function(a, e, c) {
    a = e[0];
    e = this.cfg.getProperty(d.TITLE.key);
    a ? (e || this.createTitleBar("&#160;"), this.createCloseButton()) : (this.removeCloseButton(), e || this.removeTitleBar())
  }, initEvents:function() {
    var b = a._EVENT_TYPES, e = YAHOO.util.CustomEvent;
    this.beforeSelectEvent = new e(b.BEFORE_SELECT);
    this.selectEvent = new e(b.SELECT);
    this.beforeDeselectEvent = new e(b.BEFORE_DESELECT);
    this.deselectEvent = new e(b.DESELECT);
    this.changePageEvent = new e(b.CHANGE_PAGE);
    this.beforeRenderEvent = new e(b.BEFORE_RENDER);
    this.renderEvent = new e(b.RENDER);
    this.beforeDestroyEvent = new e(b.BEFORE_DESTROY);
    this.destroyEvent = new e(b.DESTROY);
    this.resetEvent = new e(b.RESET);
    this.clearEvent = new e(b.CLEAR);
    this.beforeShowEvent = new e(b.BEFORE_SHOW);
    this.showEvent = new e(b.SHOW);
    this.beforeHideEvent = new e(b.BEFORE_HIDE);
    this.hideEvent = new e(b.HIDE);
    this.beforeShowNavEvent = new e(b.BEFORE_SHOW_NAV);
    this.showNavEvent = new e(b.SHOW_NAV);
    this.beforeHideNavEvent = new e(b.BEFORE_HIDE_NAV);
    this.hideNavEvent = new e(b.HIDE_NAV);
    this.beforeRenderNavEvent = new e(b.BEFORE_RENDER_NAV);
    this.renderNavEvent = new e(b.RENDER_NAV);
    this.beforeSelectEvent.subscribe(this.onBeforeSelect, this, !0);
    this.selectEvent.subscribe(this.onSelect, this, !0);
    this.beforeDeselectEvent.subscribe(this.onBeforeDeselect, this, !0);
    this.deselectEvent.subscribe(this.onDeselect, this, !0);
    this.changePageEvent.subscribe(this.onChangePage, this, !0);
    this.renderEvent.subscribe(this.onRender, this, !0);
    this.resetEvent.subscribe(this.onReset, this, !0);
    this.clearEvent.subscribe(this.onClear, this, !0)
  }, doPreviousMonthNav:function(a, e) {
    f.preventDefault(a);
    setTimeout(function() {
      e.previousMonth();
      var a = c.getElementsByClassName(e.Style.CSS_NAV_LEFT, "a", e.oDomContainer);
      if(a && a[0]) {
        try {
          a[0].focus()
        }catch(b) {
        }
      }
    }, 0)
  }, doNextMonthNav:function(a, e) {
    f.preventDefault(a);
    setTimeout(function() {
      e.nextMonth();
      var a = c.getElementsByClassName(e.Style.CSS_NAV_RIGHT, "a", e.oDomContainer);
      if(a && a[0]) {
        try {
          a[0].focus()
        }catch(b) {
        }
      }
    }, 0)
  }, doSelectCell:function(a, e) {
    var d, g, v;
    v = f.getTarget(a);
    d = v.tagName.toLowerCase();
    for(g = !1;"td" != d && !c.hasClass(v, e.Style.CSS_CELL_SELECTABLE);) {
      if(!g && ("a" == d && c.hasClass(v, e.Style.CSS_CELL_SELECTOR)) && (g = !0), v = v.parentNode, d = v.tagName.toLowerCase(), v == this.oDomContainer || "html" == d) {
        return
      }
    }
    g && f.preventDefault(a);
    d = v;
    if(c.hasClass(d, e.Style.CSS_CELL_SELECTABLE) && (v = e.getIndexFromId(d.id), -1 < v && (g = e.cellDates[v]))) {
      l.getDate(g[0], g[1] - 1, g[2]), e.Options.MULTI_SELECT ? ((d = d.getElementsByTagName("a")[0]) && d.blur(), -1 < e._indexOfSelectedFieldArray(e.cellDates[v]) ? e.deselectCell(v) : e.selectCell(v)) : ((d = d.getElementsByTagName("a")[0]) && d.blur(), e.selectCell(v))
    }
  }, doCellMouseOver:function(a, e) {
    var d;
    for(d = a ? f.getTarget(a) : this;d.tagName && "td" != d.tagName.toLowerCase();) {
      if(d = d.parentNode, !d.tagName || "html" == d.tagName.toLowerCase()) {
        return
      }
    }
    c.hasClass(d, e.Style.CSS_CELL_SELECTABLE) && c.addClass(d, e.Style.CSS_CELL_HOVER)
  }, doCellMouseOut:function(a, e) {
    var d;
    for(d = a ? f.getTarget(a) : this;d.tagName && "td" != d.tagName.toLowerCase();) {
      if(d = d.parentNode, !d.tagName || "html" == d.tagName.toLowerCase()) {
        return
      }
    }
    c.hasClass(d, e.Style.CSS_CELL_SELECTABLE) && c.removeClass(d, e.Style.CSS_CELL_HOVER)
  }, setupConfig:function() {
    var a = this.cfg;
    a.addProperty(d.TODAY.key, {value:new Date(d.TODAY.value.getTime()), supercedes:d.TODAY.supercedes, handler:this.configToday, suppressEvent:!0});
    a.addProperty(d.PAGEDATE.key, {value:d.PAGEDATE.value || new Date(d.TODAY.value.getTime()), handler:this.configPageDate});
    a.addProperty(d.SELECTED.key, {value:d.SELECTED.value.concat(), handler:this.configSelected});
    a.addProperty(d.TITLE.key, {value:d.TITLE.value, handler:this.configTitle});
    a.addProperty(d.CLOSE.key, {value:d.CLOSE.value, handler:this.configClose});
    a.addProperty(d.IFRAME.key, {value:d.IFRAME.value, handler:this.configIframe, validator:a.checkBoolean});
    a.addProperty(d.MINDATE.key, {value:d.MINDATE.value, handler:this.configMinDate});
    a.addProperty(d.MAXDATE.key, {value:d.MAXDATE.value, handler:this.configMaxDate});
    a.addProperty(d.MULTI_SELECT.key, {value:d.MULTI_SELECT.value, handler:this.configOptions, validator:a.checkBoolean});
    a.addProperty(d.START_WEEKDAY.key, {value:d.START_WEEKDAY.value, handler:this.configOptions, validator:a.checkNumber});
    a.addProperty(d.SHOW_WEEKDAYS.key, {value:d.SHOW_WEEKDAYS.value, handler:this.configOptions, validator:a.checkBoolean});
    a.addProperty(d.SHOW_WEEK_HEADER.key, {value:d.SHOW_WEEK_HEADER.value, handler:this.configOptions, validator:a.checkBoolean});
    a.addProperty(d.SHOW_WEEK_FOOTER.key, {value:d.SHOW_WEEK_FOOTER.value, handler:this.configOptions, validator:a.checkBoolean});
    a.addProperty(d.HIDE_BLANK_WEEKS.key, {value:d.HIDE_BLANK_WEEKS.value, handler:this.configOptions, validator:a.checkBoolean});
    a.addProperty(d.NAV_ARROW_LEFT.key, {value:d.NAV_ARROW_LEFT.value, handler:this.configOptions});
    a.addProperty(d.NAV_ARROW_RIGHT.key, {value:d.NAV_ARROW_RIGHT.value, handler:this.configOptions});
    a.addProperty(d.MONTHS_SHORT.key, {value:d.MONTHS_SHORT.value, handler:this.configLocale});
    a.addProperty(d.MONTHS_LONG.key, {value:d.MONTHS_LONG.value, handler:this.configLocale});
    a.addProperty(d.WEEKDAYS_1CHAR.key, {value:d.WEEKDAYS_1CHAR.value, handler:this.configLocale});
    a.addProperty(d.WEEKDAYS_SHORT.key, {value:d.WEEKDAYS_SHORT.value, handler:this.configLocale});
    a.addProperty(d.WEEKDAYS_MEDIUM.key, {value:d.WEEKDAYS_MEDIUM.value, handler:this.configLocale});
    a.addProperty(d.WEEKDAYS_LONG.key, {value:d.WEEKDAYS_LONG.value, handler:this.configLocale});
    var e = function() {
      a.refireEvent(d.LOCALE_MONTHS.key);
      a.refireEvent(d.LOCALE_WEEKDAYS.key)
    };
    a.subscribeToConfigEvent(d.START_WEEKDAY.key, e, this, !0);
    a.subscribeToConfigEvent(d.MONTHS_SHORT.key, e, this, !0);
    a.subscribeToConfigEvent(d.MONTHS_LONG.key, e, this, !0);
    a.subscribeToConfigEvent(d.WEEKDAYS_1CHAR.key, e, this, !0);
    a.subscribeToConfigEvent(d.WEEKDAYS_SHORT.key, e, this, !0);
    a.subscribeToConfigEvent(d.WEEKDAYS_MEDIUM.key, e, this, !0);
    a.subscribeToConfigEvent(d.WEEKDAYS_LONG.key, e, this, !0);
    a.addProperty(d.LOCALE_MONTHS.key, {value:d.LOCALE_MONTHS.value, handler:this.configLocaleValues});
    a.addProperty(d.LOCALE_WEEKDAYS.key, {value:d.LOCALE_WEEKDAYS.value, handler:this.configLocaleValues});
    a.addProperty(d.YEAR_OFFSET.key, {value:d.YEAR_OFFSET.value, supercedes:d.YEAR_OFFSET.supercedes, handler:this.configLocale});
    a.addProperty(d.DATE_DELIMITER.key, {value:d.DATE_DELIMITER.value, handler:this.configLocale});
    a.addProperty(d.DATE_FIELD_DELIMITER.key, {value:d.DATE_FIELD_DELIMITER.value, handler:this.configLocale});
    a.addProperty(d.DATE_RANGE_DELIMITER.key, {value:d.DATE_RANGE_DELIMITER.value, handler:this.configLocale});
    a.addProperty(d.MY_MONTH_POSITION.key, {value:d.MY_MONTH_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MY_YEAR_POSITION.key, {value:d.MY_YEAR_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MD_MONTH_POSITION.key, {value:d.MD_MONTH_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MD_DAY_POSITION.key, {value:d.MD_DAY_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MDY_MONTH_POSITION.key, {value:d.MDY_MONTH_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MDY_DAY_POSITION.key, {value:d.MDY_DAY_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MDY_YEAR_POSITION.key, {value:d.MDY_YEAR_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MY_LABEL_MONTH_POSITION.key, {value:d.MY_LABEL_MONTH_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MY_LABEL_YEAR_POSITION.key, {value:d.MY_LABEL_YEAR_POSITION.value, handler:this.configLocale, validator:a.checkNumber});
    a.addProperty(d.MY_LABEL_MONTH_SUFFIX.key, {value:d.MY_LABEL_MONTH_SUFFIX.value, handler:this.configLocale});
    a.addProperty(d.MY_LABEL_YEAR_SUFFIX.key, {value:d.MY_LABEL_YEAR_SUFFIX.value, handler:this.configLocale});
    a.addProperty(d.NAV.key, {value:d.NAV.value, handler:this.configNavigator});
    a.addProperty(d.STRINGS.key, {value:d.STRINGS.value, handler:this.configStrings, validator:function(a) {
      return g.isObject(a)
    }, supercedes:d.STRINGS.supercedes})
  }, configStrings:function(a, e, c) {
    a = g.merge(d.STRINGS.value, e[0]);
    this.cfg.setProperty(d.STRINGS.key, a, !0)
  }, configPageDate:function(a, e, c) {
    this.cfg.setProperty(d.PAGEDATE.key, this._parsePageDate(e[0]), !0)
  }, configMinDate:function(a, e, c) {
    a = e[0];
    g.isString(a) && (a = this._parseDate(a), this.cfg.setProperty(d.MINDATE.key, l.getDate(a[0], a[1] - 1, a[2])))
  }, configMaxDate:function(a, e, c) {
    a = e[0];
    g.isString(a) && (a = this._parseDate(a), this.cfg.setProperty(d.MAXDATE.key, l.getDate(a[0], a[1] - 1, a[2])))
  }, configToday:function(a, e, c) {
    a = e[0];
    g.isString(a) && (a = this._parseDate(a));
    a = l.clearTime(a);
    this.cfg.initialConfig[d.PAGEDATE.key] || this.cfg.setProperty(d.PAGEDATE.key, a);
    this.today = a;
    this.cfg.setProperty(d.TODAY.key, a, !0)
  }, configSelected:function(a, e, c) {
    a = e[0];
    e = d.SELECTED.key;
    a && g.isString(a) && this.cfg.setProperty(e, this._parseDates(a), !0);
    this._selectedDates || (this._selectedDates = this.cfg.getProperty(e))
  }, configOptions:function(a, e, c) {
    this.Options[a.toUpperCase()] = e[0]
  }, configLocale:function(a, e, c) {
    this.Locale[a.toUpperCase()] = e[0];
    this.cfg.refireEvent(d.LOCALE_MONTHS.key);
    this.cfg.refireEvent(d.LOCALE_WEEKDAYS.key)
  }, configLocaleValues:function(b, e, c) {
    b = b.toLowerCase();
    c = e[0];
    var f = this.cfg;
    e = this.Locale;
    switch(b) {
      case d.LOCALE_MONTHS.key:
        switch(c) {
          case a.SHORT:
            e.LOCALE_MONTHS = f.getProperty(d.MONTHS_SHORT.key).concat();
            break;
          case a.LONG:
            e.LOCALE_MONTHS = f.getProperty(d.MONTHS_LONG.key).concat()
        }
        break;
      case d.LOCALE_WEEKDAYS.key:
        switch(c) {
          case a.ONE_CHAR:
            e.LOCALE_WEEKDAYS = f.getProperty(d.WEEKDAYS_1CHAR.key).concat();
            break;
          case a.SHORT:
            e.LOCALE_WEEKDAYS = f.getProperty(d.WEEKDAYS_SHORT.key).concat();
            break;
          case a.MEDIUM:
            e.LOCALE_WEEKDAYS = f.getProperty(d.WEEKDAYS_MEDIUM.key).concat();
            break;
          case a.LONG:
            e.LOCALE_WEEKDAYS = f.getProperty(d.WEEKDAYS_LONG.key).concat()
        }
        b = f.getProperty(d.START_WEEKDAY.key);
        if(0 < b) {
          for(c = 0;c < b;++c) {
            e.LOCALE_WEEKDAYS.push(e.LOCALE_WEEKDAYS.shift())
          }
        }
    }
  }, configNavigator:function(a, e, c) {
    a = e[0];
    YAHOO.widget.CalendarNavigator && (!0 === a || g.isObject(a)) ? this.oNavigator || (this.oNavigator = new YAHOO.widget.CalendarNavigator(this), this.beforeRenderEvent.subscribe(function() {
      this.pages || this.oNavigator.erase()
    }, this, !0)) : this.oNavigator && (this.oNavigator.destroy(), this.oNavigator = null)
  }, initStyles:function() {
    var b = a.STYLES;
    this.Style = {CSS_ROW_HEADER:b.CSS_ROW_HEADER, CSS_ROW_FOOTER:b.CSS_ROW_FOOTER, CSS_CELL:b.CSS_CELL, CSS_CELL_SELECTOR:b.CSS_CELL_SELECTOR, CSS_CELL_SELECTED:b.CSS_CELL_SELECTED, CSS_CELL_SELECTABLE:b.CSS_CELL_SELECTABLE, CSS_CELL_RESTRICTED:b.CSS_CELL_RESTRICTED, CSS_CELL_TODAY:b.CSS_CELL_TODAY, CSS_CELL_OOM:b.CSS_CELL_OOM, CSS_CELL_OOB:b.CSS_CELL_OOB, CSS_HEADER:b.CSS_HEADER, CSS_HEADER_TEXT:b.CSS_HEADER_TEXT, CSS_BODY:b.CSS_BODY, CSS_WEEKDAY_CELL:b.CSS_WEEKDAY_CELL, CSS_WEEKDAY_ROW:b.CSS_WEEKDAY_ROW, 
    CSS_FOOTER:b.CSS_FOOTER, CSS_CALENDAR:b.CSS_CALENDAR, CSS_SINGLE:b.CSS_SINGLE, CSS_CONTAINER:b.CSS_CONTAINER, CSS_NAV_LEFT:b.CSS_NAV_LEFT, CSS_NAV_RIGHT:b.CSS_NAV_RIGHT, CSS_NAV:b.CSS_NAV, CSS_CLOSE:b.CSS_CLOSE, CSS_CELL_TOP:b.CSS_CELL_TOP, CSS_CELL_LEFT:b.CSS_CELL_LEFT, CSS_CELL_RIGHT:b.CSS_CELL_RIGHT, CSS_CELL_BOTTOM:b.CSS_CELL_BOTTOM, CSS_CELL_HOVER:b.CSS_CELL_HOVER, CSS_CELL_HIGHLIGHT1:b.CSS_CELL_HIGHLIGHT1, CSS_CELL_HIGHLIGHT2:b.CSS_CELL_HIGHLIGHT2, CSS_CELL_HIGHLIGHT3:b.CSS_CELL_HIGHLIGHT3, 
    CSS_CELL_HIGHLIGHT4:b.CSS_CELL_HIGHLIGHT4, CSS_WITH_TITLE:b.CSS_WITH_TITLE, CSS_FIXED_SIZE:b.CSS_FIXED_SIZE, CSS_LINK_CLOSE:b.CSS_LINK_CLOSE}
  }, buildMonthLabel:function() {
    return this._buildMonthLabel(this.cfg.getProperty(d.PAGEDATE.key))
  }, _buildMonthLabel:function(a) {
    var e = this.Locale.LOCALE_MONTHS[a.getMonth()] + this.Locale.MY_LABEL_MONTH_SUFFIX;
    a = a.getFullYear() + this.Locale.YEAR_OFFSET + this.Locale.MY_LABEL_YEAR_SUFFIX;
    return 2 == this.Locale.MY_LABEL_MONTH_POSITION || 1 == this.Locale.MY_LABEL_YEAR_POSITION ? a + e : e + a
  }, buildDayLabel:function(a) {
    return a.getDate()
  }, createTitleBar:function(a) {
    var e = c.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || document.createElement("div");
    e.className = YAHOO.widget.CalendarGroup.CSS_2UPTITLE;
    e.innerHTML = a;
    this.oDomContainer.insertBefore(e, this.oDomContainer.firstChild);
    c.addClass(this.oDomContainer, this.Style.CSS_WITH_TITLE);
    return e
  }, removeTitleBar:function() {
    var a = c.getElementsByClassName(YAHOO.widget.CalendarGroup.CSS_2UPTITLE, "div", this.oDomContainer)[0] || null;
    a && (f.purgeElement(a), this.oDomContainer.removeChild(a));
    c.removeClass(this.oDomContainer, this.Style.CSS_WITH_TITLE)
  }, createCloseButton:function() {
    var b = YAHOO.widget.CalendarGroup.CSS_2UPCLOSE, e = this.Style.CSS_LINK_CLOSE, n = c.getElementsByClassName(e, "a", this.oDomContainer)[0], g = this.cfg.getProperty(d.STRINGS.key), g = g && g.close ? g.close : "";
    n || (n = document.createElement("a"), f.addListener(n, "click", function(a, b) {
      b.hide();
      f.preventDefault(a)
    }, this));
    n.href = "#";
    n.className = e;
    null !== a.IMG_ROOT ? (e = c.getElementsByClassName(b, "img", n)[0] || document.createElement("img"), e.src = a.IMG_ROOT + "us/my/bn/x_d.gif", e.className = b, n.appendChild(e)) : n.innerHTML = '<span class="' + b + " " + this.Style.CSS_CLOSE + '">' + g + "</span>";
    this.oDomContainer.appendChild(n);
    return n
  }, removeCloseButton:function() {
    var a = c.getElementsByClassName(this.Style.CSS_LINK_CLOSE, "a", this.oDomContainer)[0] || null;
    a && (f.purgeElement(a), this.oDomContainer.removeChild(a))
  }, renderHeader:function(b) {
    var e = 7, c = this.cfg, f = c.getProperty(d.PAGEDATE.key), g = c.getProperty(d.STRINGS.key), t = g && g.previousMonth ? g.previousMonth : "", g = g && g.nextMonth ? g.nextMonth : "", u;
    c.getProperty(d.SHOW_WEEK_HEADER.key) && (e += 1);
    c.getProperty(d.SHOW_WEEK_FOOTER.key) && (e += 1);
    b[b.length] = "<thead>";
    b[b.length] = "<tr>";
    b[b.length] = '<th colspan="' + e + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
    b[b.length] = '<div class="' + this.Style.CSS_HEADER + '">';
    e = !1;
    this.parent ? (0 === this.index && (u = !0), this.index == this.parent.cfg.getProperty("pages") - 1 && (e = !0)) : e = u = !0;
    if(u) {
      u = this._buildMonthLabel(l.subtract(f, l.MONTH, 1));
      var x = c.getProperty(d.NAV_ARROW_LEFT.key);
      null === x && null !== a.IMG_ROOT && (x = a.IMG_ROOT + "us/tr/callt.gif");
      b[b.length] = '<a class="' + this.Style.CSS_NAV_LEFT + '"' + (null === x ? "" : ' style="background-image:url(' + x + ')"') + ' href="#">' + t + " (" + u + ")</a>"
    }
    t = this.buildMonthLabel();
    if((this.parent || this).cfg.getProperty("navigator")) {
      t = '<a class="' + this.Style.CSS_NAV + '" href="#">' + t + "</a>"
    }
    b[b.length] = t;
    e && (u = this._buildMonthLabel(l.add(f, l.MONTH, 1)), f = c.getProperty(d.NAV_ARROW_RIGHT.key), null === f && null !== a.IMG_ROOT && (f = a.IMG_ROOT + "us/tr/calrt.gif"), b[b.length] = '<a class="' + this.Style.CSS_NAV_RIGHT + '"' + (null === f ? "" : ' style="background-image:url(' + f + ')"') + ' href="#">' + g + " (" + u + ")</a>");
    b[b.length] = "</div>\n</th>\n</tr>";
    c.getProperty(d.SHOW_WEEKDAYS.key) && (b = this.buildWeekdays(b));
    b[b.length] = "</thead>";
    return b
  }, buildWeekdays:function(a) {
    a[a.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';
    this.cfg.getProperty(d.SHOW_WEEK_HEADER.key) && (a[a.length] = "<th>&#160;</th>");
    for(var e = 0;e < this.Locale.LOCALE_WEEKDAYS.length;++e) {
      a[a.length] = '<th class="' + this.Style.CSS_WEEKDAY_CELL + '">' + this.Locale.LOCALE_WEEKDAYS[e] + "</th>"
    }
    this.cfg.getProperty(d.SHOW_WEEK_FOOTER.key) && (a[a.length] = "<th>&#160;</th>");
    a[a.length] = "</tr>";
    return a
  }, renderBody:function(b, e) {
    var f = this.cfg.getProperty(d.START_WEEKDAY.key);
    this.preMonthDays = b.getDay();
    0 < f && (this.preMonthDays -= f);
    0 > this.preMonthDays && (this.preMonthDays += 7);
    this.monthDays = l.findMonthEnd(b).getDate();
    this.postMonthDays = a.DISPLAY_DAYS - this.preMonthDays - this.monthDays;
    b = l.subtract(b, l.DAY, this.preMonthDays);
    var g, v, t, u, x = this.today;
    g = this.cfg;
    var I = x.getFullYear(), B = x.getMonth(), x = x.getDate(), A = g.getProperty(d.PAGEDATE.key), E = g.getProperty(d.HIDE_BLANK_WEEKS.key), F = g.getProperty(d.SHOW_WEEK_FOOTER.key), z = g.getProperty(d.SHOW_WEEK_HEADER.key), R = g.getProperty(d.MINDATE.key), O = g.getProperty(d.MAXDATE.key);
    R && (R = l.clearTime(R));
    O && (O = l.clearTime(O));
    e[e.length] = '<tbody class="m' + (A.getMonth() + 1) + " " + this.Style.CSS_BODY + '">';
    var P = 0, V = document.createElement("div"), D = document.createElement("td");
    V.appendChild(D);
    for(var L = this.parent || this, Y = 0;6 > Y && !(g = l.getWeekNumber(b, f), v = "w" + g, 0 !== Y && !0 === E && b.getMonth() != A.getMonth());Y++) {
      e[e.length] = '<tr class="' + v + '">';
      z && (e = this.renderRowHeader(g, e));
      for(v = 0;7 > v;v++) {
        t = [];
        this.clearElement(D);
        D.className = this.Style.CSS_CELL;
        D.id = this.id + "_cell" + P;
        b.getDate() == x && (b.getMonth() == B && b.getFullYear() == I) && (t[t.length] = L.renderCellStyleToday);
        var aa = [b.getFullYear(), b.getMonth() + 1, b.getDate()];
        this.cellDates[this.cellDates.length] = aa;
        if(b.getMonth() != A.getMonth()) {
          t[t.length] = L.renderCellNotThisMonth
        }else {
          c.addClass(D, "wd" + b.getDay());
          c.addClass(D, "d" + b.getDate());
          for(var W = 0;W < this.renderStack.length;++W) {
            u = null;
            var M = this.renderStack[W], S, q, k;
            switch(M[0]) {
              case a.DATE:
                S = M[1][1];
                q = M[1][2];
                k = M[1][0];
                b.getMonth() + 1 == S && (b.getDate() == q && b.getFullYear() == k) && (u = M[2], this.renderStack.splice(W, 1));
                break;
              case a.MONTH_DAY:
                S = M[1][0];
                q = M[1][1];
                b.getMonth() + 1 == S && b.getDate() == q && (u = M[2], this.renderStack.splice(W, 1));
                break;
              case a.RANGE:
                q = M[1][0];
                S = M[1][1];
                q = l.getDate(q[0], q[1] - 1, q[2]);
                S = l.getDate(S[0], S[1] - 1, S[2]);
                b.getTime() >= q.getTime() && b.getTime() <= S.getTime() && (u = M[2], b.getTime() == S.getTime() && this.renderStack.splice(W, 1));
                break;
              case a.WEEKDAY:
                S = M[1][0];
                b.getDay() + 1 == S && (u = M[2]);
                break;
              case a.MONTH:
                S = M[1][0], b.getMonth() + 1 == S && (u = M[2])
            }
            u && (t[t.length] = u)
          }
        }
        -1 < this._indexOfSelectedFieldArray(aa) && (t[t.length] = L.renderCellStyleSelected);
        R && b.getTime() < R.getTime() || O && b.getTime() > O.getTime() ? t[t.length] = L.renderOutOfBoundsDate : (t[t.length] = L.styleCellDefault, t[t.length] = L.renderCellDefault);
        for(u = 0;u < t.length && t[u].call(L, b, D) != a.STOP_RENDER;++u) {
        }
        b.setTime(b.getTime() + l.ONE_DAY_MS);
        b = l.clearTime(b);
        0 <= P && 6 >= P && c.addClass(D, this.Style.CSS_CELL_TOP);
        0 === P % 7 && c.addClass(D, this.Style.CSS_CELL_LEFT);
        0 === (P + 1) % 7 && c.addClass(D, this.Style.CSS_CELL_RIGHT);
        t = this.postMonthDays;
        if(E && 7 <= t) {
          u = Math.floor(t / 7);
          for(aa = 0;aa < u;++aa) {
            t -= 7
          }
        }
        P >= this.preMonthDays + t + this.monthDays - 7 && c.addClass(D, this.Style.CSS_CELL_BOTTOM);
        e[e.length] = V.innerHTML;
        P++
      }
      F && (e = this.renderRowFooter(g, e));
      e[e.length] = "</tr>"
    }
    e[e.length] = "</tbody>";
    return e
  }, renderFooter:function(a) {
    return a
  }, render:function() {
    this.beforeRenderEvent.fire();
    var a = l.findMonthStart(this.cfg.getProperty(d.PAGEDATE.key));
    this.resetRenderers();
    this.cellDates.length = 0;
    f.purgeElement(this.oDomContainer, !0);
    var e = [];
    e[e.length] = '<table cellSpacing="0" class="' + this.Style.CSS_CALENDAR + " y" + (a.getFullYear() + this.Locale.YEAR_OFFSET) + '" id="' + this.id + '">';
    e = this.renderHeader(e);
    e = this.renderBody(a, e);
    e = this.renderFooter(e);
    e[e.length] = "</table>";
    this.oDomContainer.innerHTML = e.join("\n");
    this.applyListeners();
    this.cells = c.getElementsByClassName(this.Style.CSS_CELL, "td", this.id);
    this.cfg.refireEvent(d.TITLE.key);
    this.cfg.refireEvent(d.CLOSE.key);
    this.cfg.refireEvent(d.IFRAME.key);
    this.renderEvent.fire()
  }, applyListeners:function() {
    var a = this.oDomContainer, e = this.parent || this, d = c.getElementsByClassName(this.Style.CSS_NAV_LEFT, "a", a), a = c.getElementsByClassName(this.Style.CSS_NAV_RIGHT, "a", a);
    d && 0 < d.length && (this.linkLeft = d[0], f.addListener(this.linkLeft, "click", this.doPreviousMonthNav, e, !0));
    a && 0 < a.length && (this.linkRight = a[0], f.addListener(this.linkRight, "click", this.doNextMonthNav, e, !0));
    null !== e.cfg.getProperty("navigator") && this.applyNavListeners();
    if(this.domEventMap) {
      for(var w in this.domEventMap) {
        if(g.hasOwnProperty(this.domEventMap, w)) {
          a = this.domEventMap[w];
          a instanceof Array || (a = [a]);
          for(var v = 0;v < a.length;v++) {
            for(var l = a[v], d = c.getElementsByClassName(w, l.tag, this.oDomContainer), u = 0;u < d.length;u++) {
              e = d[u], f.addListener(e, l.event, l.handler, l.scope, l.correct)
            }
          }
        }
      }
    }
    f.addListener(this.oDomContainer, "click", this.doSelectCell, this);
    f.addListener(this.oDomContainer, "mouseover", this.doCellMouseOver, this);
    f.addListener(this.oDomContainer, "mouseout", this.doCellMouseOut, this)
  }, applyNavListeners:function() {
    var a = this.parent || this, e = this, d = c.getElementsByClassName(this.Style.CSS_NAV, "a", this.oDomContainer);
    0 < d.length && f.addListener(d, "click", function(d, n) {
      var g = f.getTarget(d);
      (this === g || c.isAncestor(this, g)) && f.preventDefault(d);
      if(g = a.oNavigator) {
        var l = e.cfg.getProperty("pagedate");
        g.setYear(l.getFullYear() + e.Locale.YEAR_OFFSET);
        g.setMonth(l.getMonth());
        g.show()
      }
    })
  }, getDateByCellId:function(a) {
    return(a = this.getDateFieldsByCellId(a)) ? l.getDate(a[0], a[1] - 1, a[2]) : null
  }, getDateFieldsByCellId:function(a) {
    a = this.getIndexFromId(a);
    return-1 < a ? this.cellDates[a] : null
  }, getCellIndex:function(a) {
    var e = -1;
    if(a) {
      var c = a.getMonth(), d = a.getFullYear();
      a = a.getDate();
      for(var f = this.cellDates, g = 0;g < f.length;++g) {
        var l = f[g];
        if(l[0] === d && l[1] === c + 1 && l[2] === a) {
          e = g;
          break
        }
      }
    }
    return e
  }, getIndexFromId:function(a) {
    var e = -1, c = a.lastIndexOf("_cell");
    -1 < c && (e = parseInt(a.substring(c + 5), 10));
    return e
  }, renderOutOfBoundsDate:function(b, e) {
    c.addClass(e, this.Style.CSS_CELL_OOB);
    e.innerHTML = b.getDate();
    return a.STOP_RENDER
  }, renderRowHeader:function(a, e) {
    e[e.length] = '<th class="' + this.Style.CSS_ROW_HEADER + '">' + a + "</th>";
    return e
  }, renderRowFooter:function(a, e) {
    e[e.length] = '<th class="' + this.Style.CSS_ROW_FOOTER + '">' + a + "</th>";
    return e
  }, renderCellDefault:function(a, e) {
    e.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildDayLabel(a) + "</a>"
  }, styleCellDefault:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_SELECTABLE)
  }, renderCellStyleHighlight1:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_HIGHLIGHT1)
  }, renderCellStyleHighlight2:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_HIGHLIGHT2)
  }, renderCellStyleHighlight3:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_HIGHLIGHT3)
  }, renderCellStyleHighlight4:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_HIGHLIGHT4)
  }, renderCellStyleToday:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_TODAY)
  }, renderCellStyleSelected:function(a, e) {
    c.addClass(e, this.Style.CSS_CELL_SELECTED)
  }, renderCellNotThisMonth:function(b, e) {
    c.addClass(e, this.Style.CSS_CELL_OOM);
    e.innerHTML = b.getDate();
    return a.STOP_RENDER
  }, renderBodyCellRestricted:function(b, e) {
    c.addClass(e, this.Style.CSS_CELL);
    c.addClass(e, this.Style.CSS_CELL_RESTRICTED);
    e.innerHTML = b.getDate();
    return a.STOP_RENDER
  }, addMonths:function(a) {
    var e = d.PAGEDATE.key, c = this.cfg.getProperty(e);
    a = l.add(c, l.MONTH, a);
    this.cfg.setProperty(e, a);
    this.resetRenderers();
    this.changePageEvent.fire(c, a)
  }, subtractMonths:function(a) {
    this.addMonths(-1 * a)
  }, addYears:function(a) {
    var e = d.PAGEDATE.key, c = this.cfg.getProperty(e);
    a = l.add(c, l.YEAR, a);
    this.cfg.setProperty(e, a);
    this.resetRenderers();
    this.changePageEvent.fire(c, a)
  }, subtractYears:function(a) {
    this.addYears(-1 * a)
  }, nextMonth:function() {
    this.addMonths(1)
  }, previousMonth:function() {
    this.addMonths(-1)
  }, nextYear:function() {
    this.addYears(1)
  }, previousYear:function() {
    this.addYears(-1)
  }, reset:function() {
    this.cfg.resetProperty(d.SELECTED.key);
    this.cfg.resetProperty(d.PAGEDATE.key);
    this.resetEvent.fire()
  }, clear:function() {
    this.cfg.setProperty(d.SELECTED.key, []);
    this.cfg.setProperty(d.PAGEDATE.key, new Date(this.today.getTime()));
    this.clearEvent.fire()
  }, select:function(a) {
    a = this._toFieldArray(a);
    for(var e = [], c = [], f = d.SELECTED.key, g = 0;g < a.length;++g) {
      var l = a[g];
      this.isDateOOB(this._toDate(l)) || (0 === e.length && (this.beforeSelectEvent.fire(), c = this.cfg.getProperty(f)), e.push(l), -1 == this._indexOfSelectedFieldArray(l) && (c[c.length] = l))
    }
    0 < e.length && (this.parent ? this.parent.cfg.setProperty(f, c) : this.cfg.setProperty(f, c), this.selectEvent.fire(e));
    return this.getSelectedDates()
  }, selectCell:function(a) {
    var e = this.cells[a], f = this.cellDates[a];
    a = this._toDate(f);
    if(c.hasClass(e, this.Style.CSS_CELL_SELECTABLE)) {
      this.beforeSelectEvent.fire();
      var g = d.SELECTED.key, v = this.cfg.getProperty(g), f = f.concat();
      -1 == this._indexOfSelectedFieldArray(f) && (v[v.length] = f);
      this.parent ? this.parent.cfg.setProperty(g, v) : this.cfg.setProperty(g, v);
      this.renderCellStyleSelected(a, e);
      this.selectEvent.fire([f]);
      this.doCellMouseOut.call(e, null, this)
    }
    return this.getSelectedDates()
  }, deselect:function(a) {
    a = this._toFieldArray(a);
    for(var e = [], c = [], f = d.SELECTED.key, g = 0;g < a.length;++g) {
      var l = a[g];
      this.isDateOOB(this._toDate(l)) || (0 === e.length && (this.beforeDeselectEvent.fire(), c = this.cfg.getProperty(f)), e.push(l), l = this._indexOfSelectedFieldArray(l), -1 != l && c.splice(l, 1))
    }
    0 < e.length && (this.parent ? this.parent.cfg.setProperty(f, c) : this.cfg.setProperty(f, c), this.deselectEvent.fire(e));
    return this.getSelectedDates()
  }, deselectCell:function(a) {
    var e = this.cells[a], f = this.cellDates[a];
    a = this._indexOfSelectedFieldArray(f);
    if(c.hasClass(e, this.Style.CSS_CELL_SELECTABLE)) {
      this.beforeDeselectEvent.fire();
      var g = this.cfg.getProperty(d.SELECTED.key), l = this._toDate(f), f = f.concat();
      -1 < a && (this.cfg.getProperty(d.PAGEDATE.key).getMonth() == l.getMonth() && this.cfg.getProperty(d.PAGEDATE.key).getFullYear() == l.getFullYear() && c.removeClass(e, this.Style.CSS_CELL_SELECTED), g.splice(a, 1));
      this.parent ? this.parent.cfg.setProperty(d.SELECTED.key, g) : this.cfg.setProperty(d.SELECTED.key, g);
      this.deselectEvent.fire([f])
    }
    return this.getSelectedDates()
  }, deselectAll:function() {
    this.beforeDeselectEvent.fire();
    var a = d.SELECTED.key, e = this.cfg.getProperty(a), c = e.length, e = e.concat();
    this.parent ? this.parent.cfg.setProperty(a, []) : this.cfg.setProperty(a, []);
    0 < c && this.deselectEvent.fire(e);
    return this.getSelectedDates()
  }, _toFieldArray:function(a) {
    var e = [];
    if(a instanceof Date) {
      e = [[a.getFullYear(), a.getMonth() + 1, a.getDate()]]
    }else {
      if(g.isString(a)) {
        e = this._parseDates(a)
      }else {
        if(g.isArray(a)) {
          for(var c = 0;c < a.length;++c) {
            var d = a[c];
            e[e.length] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
          }
        }
      }
    }
    return e
  }, toDate:function(a) {
    return this._toDate(a)
  }, _toDate:function(a) {
    return a instanceof Date ? a : l.getDate(a[0], a[1] - 1, a[2])
  }, _fieldArraysAreEqual:function(a, e) {
    var c = !1;
    a[0] == e[0] && (a[1] == e[1] && a[2] == e[2]) && (c = !0);
    return c
  }, _indexOfSelectedFieldArray:function(a) {
    for(var e = -1, c = this.cfg.getProperty(d.SELECTED.key), f = 0;f < c.length;++f) {
      var g = c[f];
      if(a[0] == g[0] && a[1] == g[1] && a[2] == g[2]) {
        e = f;
        break
      }
    }
    return e
  }, isDateOOM:function(a) {
    return a.getMonth() != this.cfg.getProperty(d.PAGEDATE.key).getMonth()
  }, isDateOOB:function(a) {
    var e = this.cfg.getProperty(d.MINDATE.key), c = this.cfg.getProperty(d.MAXDATE.key);
    e && (e = l.clearTime(e));
    c && (c = l.clearTime(c));
    a = new Date(a.getTime());
    a = l.clearTime(a);
    return e && a.getTime() < e.getTime() || c && a.getTime() > c.getTime()
  }, _parsePageDate:function(a) {
    if(a) {
      if(a instanceof Date) {
        a = l.findMonthStart(a)
      }else {
        var e;
        e = a.split(this.cfg.getProperty(d.DATE_FIELD_DELIMITER.key));
        a = parseInt(e[this.cfg.getProperty(d.MY_MONTH_POSITION.key) - 1], 10) - 1;
        e = parseInt(e[this.cfg.getProperty(d.MY_YEAR_POSITION.key) - 1], 10) - this.Locale.YEAR_OFFSET;
        a = l.getDate(e, a, 1)
      }
    }else {
      a = l.getDate(this.today.getFullYear(), this.today.getMonth(), 1)
    }
    return a
  }, onBeforeSelect:function() {
    !1 === this.cfg.getProperty(d.MULTI_SELECT.key) && (this.parent ? (this.parent.callChildFunction("clearAllBodyCellStyles", this.Style.CSS_CELL_SELECTED), this.parent.deselectAll()) : (this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED), this.deselectAll()))
  }, onSelect:function(a) {
  }, onBeforeDeselect:function() {
  }, onDeselect:function(a) {
  }, onChangePage:function() {
    this.render()
  }, onRender:function() {
  }, onReset:function() {
    this.render()
  }, onClear:function() {
    this.render()
  }, validate:function() {
    return!0
  }, _parseDate:function(b) {
    b = b.split(this.Locale.DATE_FIELD_DELIMITER);
    2 == b.length ? (b = [b[this.Locale.MD_MONTH_POSITION - 1], b[this.Locale.MD_DAY_POSITION - 1]], b.type = a.MONTH_DAY) : (b = [b[this.Locale.MDY_YEAR_POSITION - 1] - this.Locale.YEAR_OFFSET, b[this.Locale.MDY_MONTH_POSITION - 1], b[this.Locale.MDY_DAY_POSITION - 1]], b.type = a.DATE);
    for(var e = 0;e < b.length;e++) {
      b[e] = parseInt(b[e], 10)
    }
    return b
  }, _parseDates:function(a) {
    var e = [];
    a = a.split(this.Locale.DATE_DELIMITER);
    for(var c = 0;c < a.length;++c) {
      var d = a[c];
      if(-1 != d.indexOf(this.Locale.DATE_RANGE_DELIMITER)) {
        var f = d.split(this.Locale.DATE_RANGE_DELIMITER), d = this._parseDate(f[0]), f = this._parseDate(f[1]), d = this._parseRange(d, f), e = e.concat(d)
      }else {
        d = this._parseDate(d), e.push(d)
      }
    }
    return e
  }, _parseRange:function(a, e) {
    var c = l.add(l.getDate(a[0], a[1] - 1, a[2]), l.DAY, 1), d = l.getDate(e[0], e[1] - 1, e[2]), f = [];
    for(f.push(a);c.getTime() <= d.getTime();) {
      f.push([c.getFullYear(), c.getMonth() + 1, c.getDate()]), c = l.add(c, l.DAY, 1)
    }
    return f
  }, resetRenderers:function() {
    this.renderStack = this._renderStack.concat()
  }, removeRenderers:function() {
    this._renderStack = [];
    this.renderStack = []
  }, clearElement:function(a) {
    a.innerHTML = "&#160;";
    a.className = ""
  }, addRenderer:function(b, e) {
    for(var c = this._parseDates(b), d = 0;d < c.length;++d) {
      var f = c[d];
      2 == f.length ? f[0] instanceof Array ? this._addRenderer(a.RANGE, f, e) : this._addRenderer(a.MONTH_DAY, f, e) : 3 == f.length && this._addRenderer(a.DATE, f, e)
    }
  }, _addRenderer:function(a, e, c) {
    this.renderStack.unshift([a, e, c]);
    this._renderStack = this.renderStack.concat()
  }, addMonthRenderer:function(b, e) {
    this._addRenderer(a.MONTH, [b], e)
  }, addWeekdayRenderer:function(b, e) {
    this._addRenderer(a.WEEKDAY, [b], e)
  }, clearAllBodyCellStyles:function(a) {
    for(var e = 0;e < this.cells.length;++e) {
      c.removeClass(this.cells[e], a)
    }
  }, setMonth:function(a) {
    var e = d.PAGEDATE.key, c = this.cfg.getProperty(e);
    c.setMonth(parseInt(a, 10));
    this.cfg.setProperty(e, c)
  }, setYear:function(a) {
    var e = d.PAGEDATE.key, c = this.cfg.getProperty(e);
    c.setFullYear(parseInt(a, 10) - this.Locale.YEAR_OFFSET);
    this.cfg.setProperty(e, c)
  }, getSelectedDates:function() {
    for(var a = [], e = this.cfg.getProperty(d.SELECTED.key), c = 0;c < e.length;++c) {
      var f = e[c], f = l.getDate(f[0], f[1] - 1, f[2]);
      a.push(f)
    }
    a.sort(function(a, b) {
      return a - b
    });
    return a
  }, hide:function() {
    this.beforeHideEvent.fire() && (this.oDomContainer.style.display = "none", this.hideEvent.fire())
  }, show:function() {
    this.beforeShowEvent.fire() && (this.oDomContainer.style.display = "block", this.showEvent.fire())
  }, browser:function() {
    var a = navigator.userAgent.toLowerCase();
    return-1 != a.indexOf("opera") ? "opera" : -1 != a.indexOf("msie 7") ? "ie7" : -1 != a.indexOf("msie") ? "ie" : -1 != a.indexOf("safari") ? "safari" : -1 != a.indexOf("gecko") ? "gecko" : !1
  }(), toString:function() {
    return"Calendar " + this.id
  }, destroy:function() {
    this.beforeDestroyEvent.fire() && (this.navigator && this.navigator.destroy(), this.cfg && this.cfg.destroy(), f.purgeElement(this.oDomContainer, !0), c.removeClass(this.oDomContainer, this.Style.CSS_WITH_TITLE), c.removeClass(this.oDomContainer, this.Style.CSS_CONTAINER), c.removeClass(this.oDomContainer, this.Style.CSS_SINGLE), this.oDomContainer.innerHTML = "", this.cells = this.oDomContainer = null, this.destroyEvent.fire())
  }};
  YAHOO.widget.Calendar = a;
  YAHOO.widget.Calendar_Core = YAHOO.widget.Calendar;
  YAHOO.widget.Cal_Core = YAHOO.widget.Calendar
})();
(function() {
  function a(a, b, c) {
    0 < arguments.length && this.init.apply(this, arguments)
  }
  var c = YAHOO.util.Dom, f = YAHOO.widget.DateMath, g = YAHOO.util.Event, l = YAHOO.lang, d = YAHOO.widget.Calendar;
  a.DEFAULT_CONFIG = a._DEFAULT_CONFIG = d.DEFAULT_CONFIG;
  a.DEFAULT_CONFIG.PAGES = {key:"pages", value:2};
  var b = a.DEFAULT_CONFIG;
  a.prototype = {init:function(b, d, f) {
    var g = this._parseArgs(arguments);
    b = g.id;
    d = g.container;
    f = g.config;
    this.oDomContainer = c.get(d);
    this.oDomContainer.id || (this.oDomContainer.id = c.generateId());
    b || (b = this.oDomContainer.id + "_t");
    this.id = b;
    this.containerId = this.oDomContainer.id;
    this.initEvents();
    this.initStyles();
    this.pages = [];
    c.addClass(this.oDomContainer, a.CSS_CONTAINER);
    c.addClass(this.oDomContainer, a.CSS_MULTI_UP);
    this.cfg = new YAHOO.util.Config(this);
    this.Options = {};
    this.Locale = {};
    this.setupConfig();
    f && this.cfg.applyConfig(f, !0);
    this.cfg.fireQueue();
    YAHOO.env.ua.opera && (this.renderEvent.subscribe(this._fixWidth, this, !0), this.showEvent.subscribe(this._fixWidth, this, !0))
  }, setupConfig:function() {
    var a = this.cfg;
    a.addProperty(b.PAGES.key, {value:b.PAGES.value, validator:a.checkNumber, handler:this.configPages});
    a.addProperty(b.YEAR_OFFSET.key, {value:b.YEAR_OFFSET.value, handler:this.delegateConfig, supercedes:b.YEAR_OFFSET.supercedes, suppressEvent:!0});
    a.addProperty(b.TODAY.key, {value:new Date(b.TODAY.value.getTime()), supercedes:b.TODAY.supercedes, handler:this.configToday, suppressEvent:!1});
    a.addProperty(b.PAGEDATE.key, {value:b.PAGEDATE.value || new Date(b.TODAY.value.getTime()), handler:this.configPageDate});
    a.addProperty(b.SELECTED.key, {value:[], handler:this.configSelected});
    a.addProperty(b.TITLE.key, {value:b.TITLE.value, handler:this.configTitle});
    a.addProperty(b.CLOSE.key, {value:b.CLOSE.value, handler:this.configClose});
    a.addProperty(b.IFRAME.key, {value:b.IFRAME.value, handler:this.configIframe, validator:a.checkBoolean});
    a.addProperty(b.MINDATE.key, {value:b.MINDATE.value, handler:this.delegateConfig});
    a.addProperty(b.MAXDATE.key, {value:b.MAXDATE.value, handler:this.delegateConfig});
    a.addProperty(b.MULTI_SELECT.key, {value:b.MULTI_SELECT.value, handler:this.delegateConfig, validator:a.checkBoolean});
    a.addProperty(b.START_WEEKDAY.key, {value:b.START_WEEKDAY.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.SHOW_WEEKDAYS.key, {value:b.SHOW_WEEKDAYS.value, handler:this.delegateConfig, validator:a.checkBoolean});
    a.addProperty(b.SHOW_WEEK_HEADER.key, {value:b.SHOW_WEEK_HEADER.value, handler:this.delegateConfig, validator:a.checkBoolean});
    a.addProperty(b.SHOW_WEEK_FOOTER.key, {value:b.SHOW_WEEK_FOOTER.value, handler:this.delegateConfig, validator:a.checkBoolean});
    a.addProperty(b.HIDE_BLANK_WEEKS.key, {value:b.HIDE_BLANK_WEEKS.value, handler:this.delegateConfig, validator:a.checkBoolean});
    a.addProperty(b.NAV_ARROW_LEFT.key, {value:b.NAV_ARROW_LEFT.value, handler:this.delegateConfig});
    a.addProperty(b.NAV_ARROW_RIGHT.key, {value:b.NAV_ARROW_RIGHT.value, handler:this.delegateConfig});
    a.addProperty(b.MONTHS_SHORT.key, {value:b.MONTHS_SHORT.value, handler:this.delegateConfig});
    a.addProperty(b.MONTHS_LONG.key, {value:b.MONTHS_LONG.value, handler:this.delegateConfig});
    a.addProperty(b.WEEKDAYS_1CHAR.key, {value:b.WEEKDAYS_1CHAR.value, handler:this.delegateConfig});
    a.addProperty(b.WEEKDAYS_SHORT.key, {value:b.WEEKDAYS_SHORT.value, handler:this.delegateConfig});
    a.addProperty(b.WEEKDAYS_MEDIUM.key, {value:b.WEEKDAYS_MEDIUM.value, handler:this.delegateConfig});
    a.addProperty(b.WEEKDAYS_LONG.key, {value:b.WEEKDAYS_LONG.value, handler:this.delegateConfig});
    a.addProperty(b.LOCALE_MONTHS.key, {value:b.LOCALE_MONTHS.value, handler:this.delegateConfig});
    a.addProperty(b.LOCALE_WEEKDAYS.key, {value:b.LOCALE_WEEKDAYS.value, handler:this.delegateConfig});
    a.addProperty(b.DATE_DELIMITER.key, {value:b.DATE_DELIMITER.value, handler:this.delegateConfig});
    a.addProperty(b.DATE_FIELD_DELIMITER.key, {value:b.DATE_FIELD_DELIMITER.value, handler:this.delegateConfig});
    a.addProperty(b.DATE_RANGE_DELIMITER.key, {value:b.DATE_RANGE_DELIMITER.value, handler:this.delegateConfig});
    a.addProperty(b.MY_MONTH_POSITION.key, {value:b.MY_MONTH_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MY_YEAR_POSITION.key, {value:b.MY_YEAR_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MD_MONTH_POSITION.key, {value:b.MD_MONTH_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MD_DAY_POSITION.key, {value:b.MD_DAY_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MDY_MONTH_POSITION.key, {value:b.MDY_MONTH_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MDY_DAY_POSITION.key, {value:b.MDY_DAY_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MDY_YEAR_POSITION.key, {value:b.MDY_YEAR_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MY_LABEL_MONTH_POSITION.key, {value:b.MY_LABEL_MONTH_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MY_LABEL_YEAR_POSITION.key, {value:b.MY_LABEL_YEAR_POSITION.value, handler:this.delegateConfig, validator:a.checkNumber});
    a.addProperty(b.MY_LABEL_MONTH_SUFFIX.key, {value:b.MY_LABEL_MONTH_SUFFIX.value, handler:this.delegateConfig});
    a.addProperty(b.MY_LABEL_YEAR_SUFFIX.key, {value:b.MY_LABEL_YEAR_SUFFIX.value, handler:this.delegateConfig});
    a.addProperty(b.NAV.key, {value:b.NAV.value, handler:this.configNavigator});
    a.addProperty(b.STRINGS.key, {value:b.STRINGS.value, handler:this.configStrings, validator:function(a) {
      return l.isObject(a)
    }, supercedes:b.STRINGS.supercedes})
  }, initEvents:function() {
    var a = this, b = YAHOO.util.CustomEvent, c = function(b, c, d) {
      for(var f = 0;f < a.pages.length;++f) {
        a.pages[f][this.type + "Event"].subscribe(b, c, d)
      }
    }, f = function(b, c) {
      for(var d = 0;d < a.pages.length;++d) {
        a.pages[d][this.type + "Event"].unsubscribe(b, c)
      }
    }, g = d._EVENT_TYPES;
    a.beforeSelectEvent = new b(g.BEFORE_SELECT);
    a.beforeSelectEvent.subscribe = c;
    a.beforeSelectEvent.unsubscribe = f;
    a.selectEvent = new b(g.SELECT);
    a.selectEvent.subscribe = c;
    a.selectEvent.unsubscribe = f;
    a.beforeDeselectEvent = new b(g.BEFORE_DESELECT);
    a.beforeDeselectEvent.subscribe = c;
    a.beforeDeselectEvent.unsubscribe = f;
    a.deselectEvent = new b(g.DESELECT);
    a.deselectEvent.subscribe = c;
    a.deselectEvent.unsubscribe = f;
    a.changePageEvent = new b(g.CHANGE_PAGE);
    a.changePageEvent.subscribe = c;
    a.changePageEvent.unsubscribe = f;
    a.beforeRenderEvent = new b(g.BEFORE_RENDER);
    a.beforeRenderEvent.subscribe = c;
    a.beforeRenderEvent.unsubscribe = f;
    a.renderEvent = new b(g.RENDER);
    a.renderEvent.subscribe = c;
    a.renderEvent.unsubscribe = f;
    a.resetEvent = new b(g.RESET);
    a.resetEvent.subscribe = c;
    a.resetEvent.unsubscribe = f;
    a.clearEvent = new b(g.CLEAR);
    a.clearEvent.subscribe = c;
    a.clearEvent.unsubscribe = f;
    a.beforeShowEvent = new b(g.BEFORE_SHOW);
    a.showEvent = new b(g.SHOW);
    a.beforeHideEvent = new b(g.BEFORE_HIDE);
    a.hideEvent = new b(g.HIDE);
    a.beforeShowNavEvent = new b(g.BEFORE_SHOW_NAV);
    a.showNavEvent = new b(g.SHOW_NAV);
    a.beforeHideNavEvent = new b(g.BEFORE_HIDE_NAV);
    a.hideNavEvent = new b(g.HIDE_NAV);
    a.beforeRenderNavEvent = new b(g.BEFORE_RENDER_NAV);
    a.renderNavEvent = new b(g.RENDER_NAV);
    a.beforeDestroyEvent = new b(g.BEFORE_DESTROY);
    a.destroyEvent = new b(g.DESTROY)
  }, configPages:function(a, d, f) {
    a = d[0];
    d = b.PAGEDATE.key;
    var g;
    f = null;
    for(var l = 0;l < a;++l) {
      var u = this.id + "_" + l, x = this.containerId + "_" + l, I = this.cfg.getConfig();
      I.close = !1;
      I.title = !1;
      I.navigator = null;
      0 < l && (g = new Date(f), this._setMonthOnDate(g, g.getMonth() + l), I.pageDate = g);
      g = this.constructChild(u, x, I);
      c.removeClass(g.oDomContainer, this.Style.CSS_SINGLE);
      c.addClass(g.oDomContainer, "groupcal");
      0 === l && (f = g.cfg.getProperty(d), c.addClass(g.oDomContainer, "first-of-type"));
      l == a - 1 && c.addClass(g.oDomContainer, "last-of-type");
      g.parent = this;
      g.index = l;
      this.pages[this.pages.length] = g
    }
  }, configPageDate:function(a, c, d) {
    a = c[0];
    var f;
    c = b.PAGEDATE.key;
    for(d = 0;d < this.pages.length;++d) {
      var g = this.pages[d];
      if(0 === d) {
        f = g._parsePageDate(a), g.cfg.setProperty(c, f)
      }else {
        var l = new Date(f);
        this._setMonthOnDate(l, l.getMonth() + d);
        g.cfg.setProperty(c, l)
      }
    }
  }, configSelected:function(a, c, d) {
    var f = b.SELECTED.key;
    this.delegateConfig(a, c, d);
    a = 0 < this.pages.length ? this.pages[0].cfg.getProperty(f) : [];
    this.cfg.setProperty(f, a, !0)
  }, delegateConfig:function(a, b, c) {
    b = b[0];
    for(var d = 0;d < this.pages.length;d++) {
      c = this.pages[d], c.cfg.setProperty(a, b)
    }
  }, setChildFunction:function(a, c) {
    for(var d = this.cfg.getProperty(b.PAGES.key), f = 0;f < d;++f) {
      this.pages[f][a] = c
    }
  }, callChildFunction:function(a, c) {
    for(var d = this.cfg.getProperty(b.PAGES.key), f = 0;f < d;++f) {
      var g = this.pages[f];
      g[a] && g[a].call(g, c)
    }
  }, constructChild:function(a, b, c) {
    var f = document.getElementById(b);
    f || (f = document.createElement("div"), f.id = b, this.oDomContainer.appendChild(f));
    return new d(a, b, c)
  }, setMonth:function(a) {
    a = parseInt(a, 10);
    for(var c, d = b.PAGEDATE.key, f = 0;f < this.pages.length;++f) {
      var g = this.pages[f], l = g.cfg.getProperty(d);
      0 === f ? c = l.getFullYear() : l.setFullYear(c);
      this._setMonthOnDate(l, a + f);
      g.cfg.setProperty(d, l)
    }
  }, setYear:function(a) {
    var c = b.PAGEDATE.key;
    a = parseInt(a, 10);
    for(var d = 0;d < this.pages.length;++d) {
      var f = this.pages[d];
      1 == f.cfg.getProperty(c).getMonth() + 1 && 0 < d && (a += 1);
      f.setYear(a)
    }
  }, render:function() {
    this.renderHeader();
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].render()
    }
    this.renderFooter()
  }, select:function(a) {
    for(var b = 0;b < this.pages.length;++b) {
      this.pages[b].select(a)
    }
    return this.getSelectedDates()
  }, selectCell:function(a) {
    for(var b = 0;b < this.pages.length;++b) {
      this.pages[b].selectCell(a)
    }
    return this.getSelectedDates()
  }, deselect:function(a) {
    for(var b = 0;b < this.pages.length;++b) {
      this.pages[b].deselect(a)
    }
    return this.getSelectedDates()
  }, deselectAll:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].deselectAll()
    }
    return this.getSelectedDates()
  }, deselectCell:function(a) {
    for(var b = 0;b < this.pages.length;++b) {
      this.pages[b].deselectCell(a)
    }
    return this.getSelectedDates()
  }, reset:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].reset()
    }
  }, clear:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].clear()
    }
    this.cfg.setProperty(b.SELECTED.key, []);
    this.cfg.setProperty(b.PAGEDATE.key, new Date(this.pages[0].today.getTime()));
    this.render()
  }, nextMonth:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].nextMonth()
    }
  }, previousMonth:function() {
    for(var a = this.pages.length - 1;0 <= a;--a) {
      this.pages[a].previousMonth()
    }
  }, nextYear:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].nextYear()
    }
  }, previousYear:function() {
    for(var a = 0;a < this.pages.length;++a) {
      this.pages[a].previousYear()
    }
  }, getSelectedDates:function() {
    for(var a = [], c = this.cfg.getProperty(b.SELECTED.key), d = 0;d < c.length;++d) {
      var g = c[d], g = f.getDate(g[0], g[1] - 1, g[2]);
      a.push(g)
    }
    a.sort(function(a, b) {
      return a - b
    });
    return a
  }, addRenderer:function(a, b) {
    for(var c = 0;c < this.pages.length;++c) {
      this.pages[c].addRenderer(a, b)
    }
  }, addMonthRenderer:function(a, b) {
    for(var c = 0;c < this.pages.length;++c) {
      this.pages[c].addMonthRenderer(a, b)
    }
  }, addWeekdayRenderer:function(a, b) {
    for(var c = 0;c < this.pages.length;++c) {
      this.pages[c].addWeekdayRenderer(a, b)
    }
  }, removeRenderers:function() {
    this.callChildFunction("removeRenderers")
  }, renderHeader:function() {
  }, renderFooter:function() {
  }, addMonths:function(a) {
    this.callChildFunction("addMonths", a)
  }, subtractMonths:function(a) {
    this.callChildFunction("subtractMonths", a)
  }, addYears:function(a) {
    this.callChildFunction("addYears", a)
  }, subtractYears:function(a) {
    this.callChildFunction("subtractYears", a)
  }, getCalendarPage:function(a) {
    var b = null;
    if(a) {
      var c = a.getFullYear();
      a = a.getMonth();
      for(var d = this.pages, f = 0;f < d.length;++f) {
        var g = d[f].cfg.getProperty("pagedate");
        if(g.getFullYear() === c && g.getMonth() === a) {
          b = d[f];
          break
        }
      }
    }
    return b
  }, _setMonthOnDate:function(a, b) {
    if(YAHOO.env.ua.webkit && 420 > YAHOO.env.ua.webkit && (0 > b || 11 < b)) {
      var c = f.add(a, f.MONTH, b - a.getMonth());
      a.setTime(c.getTime())
    }else {
      a.setMonth(b)
    }
  }, _fixWidth:function() {
    for(var a = 0, b = 0;b < this.pages.length;++b) {
      a += this.pages[b].oDomContainer.offsetWidth
    }
    0 < a && (this.oDomContainer.style.width = a + "px")
  }, toString:function() {
    return"CalendarGroup " + this.id
  }, destroy:function() {
    if(this.beforeDestroyEvent.fire()) {
      this.navigator && this.navigator.destroy();
      this.cfg && this.cfg.destroy();
      g.purgeElement(this.oDomContainer, !0);
      c.removeClass(this.oDomContainer, a.CSS_CONTAINER);
      c.removeClass(this.oDomContainer, a.CSS_MULTI_UP);
      for(var b = 0, d = this.pages.length;b < d;b++) {
        this.pages[b].destroy(), this.pages[b] = null
      }
      this.oDomContainer.innerHTML = "";
      this.oDomContainer = null;
      this.destroyEvent.fire()
    }
  }};
  a.CSS_CONTAINER = "yui-calcontainer";
  a.CSS_MULTI_UP = "multi";
  a.CSS_2UPTITLE = "title";
  a.CSS_2UPCLOSE = "close-icon";
  YAHOO.lang.augmentProto(a, d, "buildDayLabel", "buildMonthLabel", "renderOutOfBoundsDate", "renderRowHeader", "renderRowFooter", "renderCellDefault", "styleCellDefault", "renderCellStyleHighlight1", "renderCellStyleHighlight2", "renderCellStyleHighlight3", "renderCellStyleHighlight4", "renderCellStyleToday", "renderCellStyleSelected", "renderCellNotThisMonth", "renderBodyCellRestricted", "initStyles", "configTitle", "configClose", "configIframe", "configStrings", "configToday", "configNavigator", 
  "createTitleBar", "createCloseButton", "removeTitleBar", "removeCloseButton", "hide", "show", "toDate", "_toDate", "_parseArgs", "browser");
  YAHOO.widget.CalGrp = a;
  YAHOO.widget.CalendarGroup = a;
  YAHOO.widget.Calendar2up = function(a, b, c) {
    this.init(a, b, c)
  };
  YAHOO.extend(YAHOO.widget.Calendar2up, a);
  YAHOO.widget.Cal2up = YAHOO.widget.Calendar2up
})();
YAHOO.widget.CalendarNavigator = function(a) {
  this.init(a)
};
(function() {
  var a = YAHOO.widget.CalendarNavigator;
  a.CLASSES = {NAV:"yui-cal-nav", NAV_VISIBLE:"yui-cal-nav-visible", MASK:"yui-cal-nav-mask", YEAR:"yui-cal-nav-y", MONTH:"yui-cal-nav-m", BUTTONS:"yui-cal-nav-b", BUTTON:"yui-cal-nav-btn", ERROR:"yui-cal-nav-e", YEAR_CTRL:"yui-cal-nav-yc", MONTH_CTRL:"yui-cal-nav-mc", INVALID:"yui-invalid", DEFAULT:"yui-default"};
  a.DEFAULT_CONFIG = {strings:{month:"Month", year:"Year", submit:"Okay", cancel:"Cancel", invalidYear:"Year needs to be a number"}, monthFormat:YAHOO.widget.Calendar.LONG, initialFocus:"year"};
  a._DEFAULT_CFG = a.DEFAULT_CONFIG;
  a.ID_SUFFIX = "_nav";
  a.MONTH_SUFFIX = "_month";
  a.YEAR_SUFFIX = "_year";
  a.ERROR_SUFFIX = "_error";
  a.CANCEL_SUFFIX = "_cancel";
  a.SUBMIT_SUFFIX = "_submit";
  a.YR_MAX_DIGITS = 4;
  a.YR_MINOR_INC = 1;
  a.YR_MAJOR_INC = 10;
  a.UPDATE_DELAY = 50;
  a.YR_PATTERN = /^\d+$/;
  a.TRIM = /^\s*(.*?)\s*$/
})();
YAHOO.widget.CalendarNavigator.prototype = {id:null, cal:null, navEl:null, maskEl:null, yearEl:null, monthEl:null, errorEl:null, submitEl:null, cancelEl:null, firstCtrl:null, lastCtrl:null, _doc:null, _year:null, _month:0, __rendered:!1, init:function(a) {
  var c = a.oDomContainer;
  this.cal = a;
  this.id = c.id + YAHOO.widget.CalendarNavigator.ID_SUFFIX;
  this._doc = c.ownerDocument;
  this.__isIEQuirks = (a = YAHOO.env.ua.ie) && (6 >= a || "BackCompat" == this._doc.compatMode)
}, show:function() {
  var a = YAHOO.widget.CalendarNavigator.CLASSES;
  this.cal.beforeShowNavEvent.fire() && (this.__rendered || this.render(), this.clearErrors(), this._updateMonthUI(), this._updateYearUI(), this._show(this.navEl, !0), this.setInitialFocus(), this.showMask(), YAHOO.util.Dom.addClass(this.cal.oDomContainer, a.NAV_VISIBLE), this.cal.showNavEvent.fire())
}, hide:function() {
  var a = YAHOO.widget.CalendarNavigator.CLASSES;
  this.cal.beforeHideNavEvent.fire() && (this._show(this.navEl, !1), this.hideMask(), YAHOO.util.Dom.removeClass(this.cal.oDomContainer, a.NAV_VISIBLE), this.cal.hideNavEvent.fire())
}, showMask:function() {
  this._show(this.maskEl, !0);
  this.__isIEQuirks && this._syncMask()
}, hideMask:function() {
  this._show(this.maskEl, !1)
}, getMonth:function() {
  return this._month
}, getYear:function() {
  return this._year
}, setMonth:function(a) {
  0 <= a && 12 > a && (this._month = a);
  this._updateMonthUI()
}, setYear:function(a) {
  var c = YAHOO.widget.CalendarNavigator.YR_PATTERN;
  YAHOO.lang.isNumber(a) && c.test(a + "") && (this._year = a);
  this._updateYearUI()
}, render:function() {
  this.cal.beforeRenderNavEvent.fire();
  this.__rendered || (this.createNav(), this.createMask(), this.applyListeners(), this.__rendered = !0);
  this.cal.renderNavEvent.fire()
}, createNav:function() {
  var a = YAHOO.widget.CalendarNavigator, c = this._doc, f = c.createElement("div");
  f.className = a.CLASSES.NAV;
  var g = this.renderNavContents([]);
  f.innerHTML = g.join("");
  this.cal.oDomContainer.appendChild(f);
  this.navEl = f;
  this.yearEl = c.getElementById(this.id + a.YEAR_SUFFIX);
  this.monthEl = c.getElementById(this.id + a.MONTH_SUFFIX);
  this.errorEl = c.getElementById(this.id + a.ERROR_SUFFIX);
  this.submitEl = c.getElementById(this.id + a.SUBMIT_SUFFIX);
  this.cancelEl = c.getElementById(this.id + a.CANCEL_SUFFIX);
  YAHOO.env.ua.gecko && (this.yearEl && "text" == this.yearEl.type) && this.yearEl.setAttribute("autocomplete", "off");
  this._setFirstLastElements()
}, createMask:function() {
  var a = YAHOO.widget.CalendarNavigator.CLASSES, c = this._doc.createElement("div");
  c.className = a.MASK;
  this.cal.oDomContainer.appendChild(c);
  this.maskEl = c
}, _syncMask:function() {
  var a = this.cal.oDomContainer;
  a && this.maskEl && (a = YAHOO.util.Dom.getRegion(a), YAHOO.util.Dom.setStyle(this.maskEl, "width", a.right - a.left + "px"), YAHOO.util.Dom.setStyle(this.maskEl, "height", a.bottom - a.top + "px"))
}, renderNavContents:function(a) {
  var c = YAHOO.widget.CalendarNavigator, f = c.CLASSES;
  a[a.length] = '<div class="' + f.MONTH + '">';
  this.renderMonth(a);
  a[a.length] = "</div>";
  a[a.length] = '<div class="' + f.YEAR + '">';
  this.renderYear(a);
  a[a.length] = "</div>";
  a[a.length] = '<div class="' + f.BUTTONS + '">';
  this.renderButtons(a);
  a[a.length] = "</div>";
  a[a.length] = '<div class="' + f.ERROR + '" id="' + this.id + c.ERROR_SUFFIX + '"></div>';
  return a
}, renderMonth:function(a) {
  var c = YAHOO.widget.CalendarNavigator, f = c.CLASSES, c = this.id + c.MONTH_SUFFIX, g = this.__getCfg("monthFormat");
  if((g = this.cal.cfg.getProperty(g == YAHOO.widget.Calendar.SHORT ? "MONTHS_SHORT" : "MONTHS_LONG")) && 0 < g.length) {
    a[a.length] = '<label for="' + c + '">';
    a[a.length] = this.__getCfg("month", !0);
    a[a.length] = "</label>";
    a[a.length] = '<select name="' + c + '" id="' + c + '" class="' + f.MONTH_CTRL + '">';
    for(f = 0;f < g.length;f++) {
      a[a.length] = '<option value="' + f + '">', a[a.length] = g[f], a[a.length] = "</option>"
    }
    a[a.length] = "</select>"
  }
  return a
}, renderYear:function(a) {
  var c = YAHOO.widget.CalendarNavigator, f = c.CLASSES, g = this.id + c.YEAR_SUFFIX, c = c.YR_MAX_DIGITS;
  a[a.length] = '<label for="' + g + '">';
  a[a.length] = this.__getCfg("year", !0);
  a[a.length] = "</label>";
  a[a.length] = '<input type="text" name="' + g + '" id="' + g + '" class="' + f.YEAR_CTRL + '" maxlength="' + c + '"/>';
  return a
}, renderButtons:function(a) {
  var c = YAHOO.widget.CalendarNavigator.CLASSES;
  a[a.length] = '<span class="' + c.BUTTON + " " + c.DEFAULT + '">';
  a[a.length] = '<button type="button" id="' + this.id + '_submit">';
  a[a.length] = this.__getCfg("submit", !0);
  a[a.length] = "</button>";
  a[a.length] = "</span>";
  a[a.length] = '<span class="' + c.BUTTON + '">';
  a[a.length] = '<button type="button" id="' + this.id + '_cancel">';
  a[a.length] = this.__getCfg("cancel", !0);
  a[a.length] = "</button>";
  a[a.length] = "</span>";
  return a
}, applyListeners:function() {
  var a = YAHOO.util.Event;
  a.on(this.submitEl, "click", this.submit, this, !0);
  a.on(this.cancelEl, "click", this.cancel, this, !0);
  a.on(this.yearEl, "blur", function() {
    this.validate() && this.setYear(this._getYearFromUI())
  }, this, !0);
  a.on(this.monthEl, "change", function() {
    this.setMonth(this._getMonthFromUI())
  }, this, !0);
  if(this.__isIEQuirks) {
    YAHOO.util.Event.on(this.cal.oDomContainer, "resize", this._syncMask, this, !0)
  }
  this.applyKeyListeners()
}, purgeListeners:function() {
  var a = YAHOO.util.Event;
  a.removeListener(this.submitEl, "click", this.submit);
  a.removeListener(this.cancelEl, "click", this.cancel);
  a.removeListener(this.yearEl, "blur");
  a.removeListener(this.monthEl, "change");
  this.__isIEQuirks && a.removeListener(this.cal.oDomContainer, "resize", this._syncMask);
  this.purgeKeyListeners()
}, applyKeyListeners:function() {
  var a = YAHOO.util.Event, c = YAHOO.env.ua, f = c.ie || c.webkit ? "keydown" : "keypress", c = c.ie || c.opera || c.webkit ? "keydown" : "keypress";
  a.on(this.yearEl, "keypress", this._handleEnterKey, this, !0);
  a.on(this.yearEl, f, this._handleDirectionKeys, this, !0);
  a.on(this.lastCtrl, c, this._handleTabKey, this, !0);
  a.on(this.firstCtrl, c, this._handleShiftTabKey, this, !0)
}, purgeKeyListeners:function() {
  var a = YAHOO.util.Event, c = YAHOO.env.ua, f = c.ie || c.webkit ? "keydown" : "keypress", c = c.ie || c.opera || c.webkit ? "keydown" : "keypress";
  a.removeListener(this.yearEl, "keypress", this._handleEnterKey);
  a.removeListener(this.yearEl, f, this._handleDirectionKeys);
  a.removeListener(this.lastCtrl, c, this._handleTabKey);
  a.removeListener(this.firstCtrl, c, this._handleShiftTabKey)
}, submit:function() {
  if(this.validate()) {
    this.hide();
    this.setMonth(this._getMonthFromUI());
    this.setYear(this._getYearFromUI());
    var a = this.cal, c = YAHOO.widget.CalendarNavigator.UPDATE_DELAY;
    if(0 < c) {
      var f = this;
      window.setTimeout(function() {
        f._update(a)
      }, c)
    }else {
      this._update(a)
    }
  }
}, _update:function(a) {
  var c = YAHOO.widget.DateMath.getDate(this.getYear() - a.cfg.getProperty("YEAR_OFFSET"), this.getMonth(), 1);
  a.cfg.setProperty("pagedate", c);
  a.render()
}, cancel:function() {
  this.hide()
}, validate:function() {
  if(null !== this._getYearFromUI()) {
    return this.clearErrors(), !0
  }
  this.setYearError();
  this.setError(this.__getCfg("invalidYear", !0));
  return!1
}, setError:function(a) {
  this.errorEl && (this.errorEl.innerHTML = a, this._show(this.errorEl, !0))
}, clearError:function() {
  this.errorEl && (this.errorEl.innerHTML = "", this._show(this.errorEl, !1))
}, setYearError:function() {
  YAHOO.util.Dom.addClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID)
}, clearYearError:function() {
  YAHOO.util.Dom.removeClass(this.yearEl, YAHOO.widget.CalendarNavigator.CLASSES.INVALID)
}, clearErrors:function() {
  this.clearError();
  this.clearYearError()
}, setInitialFocus:function() {
  var a = this.submitEl, c = this.__getCfg("initialFocus");
  if(c && c.toLowerCase) {
    if(c = c.toLowerCase(), "year" == c) {
      a = this.yearEl;
      try {
        this.yearEl.select()
      }catch(f) {
      }
    }else {
      "month" == c && (a = this.monthEl)
    }
  }
  if(a && YAHOO.lang.isFunction(a.focus)) {
    try {
      a.focus()
    }catch(g) {
    }
  }
}, erase:function() {
  if(this.__rendered) {
    this.purgeListeners();
    this.lastCtrl = this.firstCtrl = this.cancelEl = this.submitEl = this.errorEl = this.monthEl = this.yearEl = null;
    this.navEl && (this.navEl.innerHTML = "");
    var a = this.navEl.parentNode;
    a && a.removeChild(this.navEl);
    this.navEl = null;
    (a = this.maskEl.parentNode) && a.removeChild(this.maskEl);
    this.maskEl = null;
    this.__rendered = !1
  }
}, destroy:function() {
  this.erase();
  this.id = this.cal = this._doc = null
}, _show:function(a, c) {
  a && YAHOO.util.Dom.setStyle(a, "display", c ? "block" : "none")
}, _getMonthFromUI:function() {
  return this.monthEl ? this.monthEl.selectedIndex : 0
}, _getYearFromUI:function() {
  var a = YAHOO.widget.CalendarNavigator, c = null;
  if(this.yearEl) {
    var f = this.yearEl.value, f = f.replace(a.TRIM, "$1");
    a.YR_PATTERN.test(f) && (c = parseInt(f, 10))
  }
  return c
}, _updateYearUI:function() {
  this.yearEl && null !== this._year && (this.yearEl.value = this._year)
}, _updateMonthUI:function() {
  this.monthEl && (this.monthEl.selectedIndex = this._month)
}, _setFirstLastElements:function() {
  this.firstCtrl = this.monthEl;
  this.lastCtrl = this.cancelEl;
  this.__isMac && (YAHOO.env.ua.webkit && 420 > YAHOO.env.ua.webkit && (this.firstCtrl = this.monthEl, this.lastCtrl = this.yearEl), YAHOO.env.ua.gecko && (this.lastCtrl = this.firstCtrl = this.yearEl))
}, _handleEnterKey:function(a) {
  var c = YAHOO.util.KeyListener.KEY;
  YAHOO.util.Event.getCharCode(a) == c.ENTER && (YAHOO.util.Event.preventDefault(a), this.submit())
}, _handleDirectionKeys:function(a) {
  var c = YAHOO.util.Event, f = YAHOO.util.KeyListener.KEY, g = YAHOO.widget.CalendarNavigator, l = this.yearEl.value ? parseInt(this.yearEl.value, 10) : null;
  if(isFinite(l)) {
    var d = !1;
    switch(c.getCharCode(a)) {
      case f.UP:
        this.yearEl.value = l + g.YR_MINOR_INC;
        d = !0;
        break;
      case f.DOWN:
        this.yearEl.value = Math.max(l - g.YR_MINOR_INC, 0);
        d = !0;
        break;
      case f.PAGE_UP:
        this.yearEl.value = l + g.YR_MAJOR_INC;
        d = !0;
        break;
      case f.PAGE_DOWN:
        this.yearEl.value = Math.max(l - g.YR_MAJOR_INC, 0), d = !0
    }
    if(d) {
      c.preventDefault(a);
      try {
        this.yearEl.select()
      }catch(b) {
      }
    }
  }
}, _handleTabKey:function(a) {
  var c = YAHOO.util.Event, f = YAHOO.util.KeyListener.KEY;
  if(c.getCharCode(a) == f.TAB && !a.shiftKey) {
    try {
      c.preventDefault(a), this.firstCtrl.focus()
    }catch(g) {
    }
  }
}, _handleShiftTabKey:function(a) {
  var c = YAHOO.util.Event, f = YAHOO.util.KeyListener.KEY;
  if(a.shiftKey && c.getCharCode(a) == f.TAB) {
    try {
      c.preventDefault(a), this.lastCtrl.focus()
    }catch(g) {
    }
  }
}, __getCfg:function(a, c) {
  var f = YAHOO.widget.CalendarNavigator.DEFAULT_CONFIG, g = this.cal.cfg.getProperty("navigator");
  return c ? !0 !== g && g.strings && g.strings[a] ? g.strings[a] : f.strings[a] : !0 !== g && g[a] ? g[a] : f[a]
}, __isMac:-1 != navigator.userAgent.toLowerCase().indexOf("macintosh")};
YAHOO.register("calendar", YAHOO.widget.Calendar, {version:"2.8.0r4", build:"2449"});
(function(a, c) {
  function f(a) {
    var b = Ga[a] = {};
    return h.each(a.split(ea), function(a, y) {
      b[y] = !0
    }), b
  }
  function g(a, b, d) {
    if(d === c && 1 === a.nodeType) {
      if(d = "data-" + b.replace(jb, "-$1").toLowerCase(), d = a.getAttribute(d), "string" == typeof d) {
        try {
          d = "true" === d ? !0 : "false" === d ? !1 : "null" === d ? null : +d + "" === d ? +d : kb.test(d) ? h.parseJSON(d) : d
        }catch(e) {
        }
        h.data(a, b, d)
      }else {
        d = c
      }
    }
    return d
  }
  function l(a) {
    for(var b in a) {
      if(!("data" === b && h.isEmptyObject(a[b])) && "toJSON" !== b) {
        return!1
      }
    }
    return!0
  }
  function d() {
    return!1
  }
  function b() {
    return!0
  }
  function e(a) {
    return!a || !a.parentNode || 11 === a.parentNode.nodeType
  }
  function n(a, b) {
    do {
      a = a[b]
    }while(a && 1 !== a.nodeType);
    return a
  }
  function w(a, b, c) {
    b = b || 0;
    if(h.isFunction(b)) {
      return h.grep(a, function(a, y) {
        return!!b.call(a, y, a) === c
      })
    }
    if(b.nodeType) {
      return h.grep(a, function(a, y) {
        return a === b === c
      })
    }
    if("string" == typeof b) {
      var d = h.grep(a, function(a) {
        return 1 === a.nodeType
      });
      if(lb.test(b)) {
        return h.filter(b, d, !c)
      }
      b = h.filter(b, d)
    }
    return h.grep(a, function(a, y) {
      return 0 <= h.inArray(a, b) === c
    })
  }
  function v(a) {
    var b = Ha.split("|");
    a = a.createDocumentFragment();
    if(a.createElement) {
      for(;b.length;) {
        a.createElement(b.pop())
      }
    }
    return a
  }
  function t(a, b) {
    if(1 === b.nodeType && h.hasData(a)) {
      var c, d, e;
      d = h._data(a);
      var k = h._data(b, d), f = d.events;
      if(f) {
        for(c in delete k.handle, k.events = {}, f) {
          d = 0;
          for(e = f[c].length;d < e;d++) {
            h.event.add(b, c, f[c][d])
          }
        }
      }
      k.data && (k.data = h.extend({}, k.data))
    }
  }
  function u(a, b) {
    var c;
    1 === b.nodeType && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), h.support.html5Clone && a.innerHTML && !h.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Ia.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.selected = a.defaultSelected : "input" === c || "textarea" === 
    c ? b.defaultValue = a.defaultValue : "script" === c && b.text !== a.text && (b.text = a.text), b.removeAttribute(h.expando))
  }
  function x(a) {
    return"undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName("*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll("*") : []
  }
  function I(a) {
    Ia.test(a.type) && (a.defaultChecked = a.checked)
  }
  function B(a, b) {
    if(b in a) {
      return b
    }
    for(var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, h = Ja.length;h--;) {
      if(b = Ja[h] + c, b in a) {
        return b
      }
    }
    return d
  }
  function A(a, b) {
    return a = b || a, "none" === h.css(a, "display") || !h.contains(a.ownerDocument, a)
  }
  function E(a, b) {
    for(var c, d, e = [], k = 0, f = a.length;k < f;k++) {
      c = a[k], c.style && (e[k] = h._data(c, "olddisplay"), b ? (!e[k] && "none" === c.style.display && (c.style.display = ""), "" === c.style.display && A(c) && (e[k] = h._data(c, "olddisplay", O(c.nodeName)))) : (d = X(c, "display"), !e[k] && "none" !== d && h._data(c, "olddisplay", d)))
    }
    for(k = 0;k < f;k++) {
      if(c = a[k], c.style && (!b || "none" === c.style.display || "" === c.style.display)) {
        c.style.display = b ? e[k] || "" : "none"
      }
    }
    return a
  }
  function F(a, b, c) {
    return(a = nb.exec(b)) ? Math.max(0, a[1] - (c || 0)) + (a[2] || "px") : b
  }
  function z(a, b, c, d) {
    b = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0;
    for(var e = 0;4 > b;b += 2) {
      "margin" === c && (e += h.css(a, c + da[b], !0)), d ? ("content" === c && (e -= parseFloat(X(a, "padding" + da[b])) || 0), "margin" !== c && (e -= parseFloat(X(a, "border" + da[b] + "Width")) || 0)) : (e += parseFloat(X(a, "padding" + da[b])) || 0, "padding" !== c && (e += parseFloat(X(a, "border" + da[b] + "Width")) || 0))
    }
    return e
  }
  function R(a, b, c) {
    var d = "width" === b ? a.offsetWidth : a.offsetHeight, e = !0, k = h.support.boxSizing && "border-box" === h.css(a, "boxSizing");
    if(0 >= d) {
      d = X(a, b);
      if(0 > d || null == d) {
        d = a.style[b]
      }
      if(ra.test(d)) {
        return d
      }
      e = k && (h.support.boxSizingReliable || d === a.style[b]);
      d = parseFloat(d) || 0
    }
    return d + z(a, b, c || (k ? "border" : "content"), e) + "px"
  }
  function O(a) {
    if(xa[a]) {
      return xa[a]
    }
    var b = h("<" + a + ">").appendTo(r.body), c = b.css("display");
    b.remove();
    if("none" === c || "" === c) {
      ka = r.body.appendChild(ka || h.extend(r.createElement("iframe"), {frameBorder:0, width:0, height:0}));
      if(!la || !ka.createElement) {
        la = (ka.contentWindow || ka.contentDocument).document, la.write("<!doctype html><html><body>"), la.close()
      }
      b = la.body.appendChild(la.createElement(a));
      c = X(b, "display");
      r.body.removeChild(ka)
    }
    return xa[a] = c, c
  }
  function P(a, b, c, d) {
    var e;
    if(h.isArray(b)) {
      h.each(b, function(b, C) {
        c || ob.test(a) ? d(a, C) : P(a + "[" + ("object" == typeof C ? b : "") + "]", C, c, d)
      })
    }else {
      if(!c && "object" === h.type(b)) {
        for(e in b) {
          P(a + "[" + e + "]", b[e], c, d)
        }
      }else {
        d(a, b)
      }
    }
  }
  function V(a) {
    return function(b, c) {
      "string" != typeof b && (c = b, b = "*");
      var d, e, k = b.toLowerCase().split(ea), f = 0, m = k.length;
      if(h.isFunction(c)) {
        for(;f < m;f++) {
          d = k[f], (e = /^\+/.test(d)) && (d = d.substr(1) || "*"), d = a[d] = a[d] || [], d[e ? "unshift" : "push"](c)
        }
      }
    }
  }
  function D(a, b, d, h, e, k) {
    e = e || b.dataTypes[0];
    k = k || {};
    k[e] = !0;
    var f;
    e = a[e];
    for(var m = 0, g = e ? e.length : 0, p = a === ya;m < g && (p || !f);m++) {
      f = e[m](b, d, h), "string" == typeof f && (!p || k[f] ? f = c : (b.dataTypes.unshift(f), f = D(a, b, d, h, f, k)))
    }
    return(p || !f) && !k["*"] && (f = D(a, b, d, h, "*", k)), f
  }
  function L(a, b) {
    var d, e, k = h.ajaxSettings.flatOptions || {};
    for(d in b) {
      b[d] !== c && ((k[d] ? a : e || (e = {}))[d] = b[d])
    }
    e && h.extend(!0, a, e)
  }
  function Y() {
    try {
      return new a.XMLHttpRequest
    }catch(y) {
    }
  }
  function aa() {
    return setTimeout(function() {
      sa = c
    }, 0), sa = h.now()
  }
  function W(a, b) {
    h.each(b, function(b, c) {
      for(var d = (qa[b] || []).concat(qa["*"]), C = 0, h = d.length;C < h && !d[C].call(a, b, c);C++) {
      }
    })
  }
  function M(a, b, c) {
    var d = 0, e = ta.length, k = h.Deferred().always(function() {
      delete f.elem
    }), f = function() {
      for(var b = sa || aa(), b = Math.max(0, m.startTime + m.duration - b), c = 1 - (b / m.duration || 0), d = 0, C = m.tweens.length;d < C;d++) {
        m.tweens[d].run(c)
      }
      return k.notifyWith(a, [m, c, b]), 1 > c && C ? b : (k.resolveWith(a, [m]), !1)
    }, m = k.promise({elem:a, props:h.extend({}, b), opts:h.extend(!0, {specialEasing:{}}, c), originalProperties:b, originalOptions:c, startTime:sa || aa(), duration:c.duration, tweens:[], createTween:function(b, c, d) {
      b = h.Tween(a, m.opts, b, c, m.opts.specialEasing[b] || m.opts.easing);
      return m.tweens.push(b), b
    }, stop:function(b) {
      for(var c = 0, d = b ? m.tweens.length : 0;c < d;c++) {
        m.tweens[c].run(1)
      }
      return b ? k.resolveWith(a, [m, b]) : k.rejectWith(a, [m, b]), this
    }});
    c = m.props;
    for(S(c, m.opts.specialEasing);d < e;d++) {
      if(b = ta[d].call(m, a, c, m.opts)) {
        return b
      }
    }
    return W(m, c), h.isFunction(m.opts.start) && m.opts.start.call(a, m), h.fx.timer(h.extend(f, {anim:m, queue:m.opts.queue, elem:a})), m.progress(m.opts.progress).done(m.opts.done, m.opts.complete).fail(m.opts.fail).always(m.opts.always)
  }
  function S(a, b) {
    var c, d, e, k, f;
    for(c in a) {
      if(d = h.camelCase(c), e = b[d], k = a[c], h.isArray(k) && (e = k[1], k = a[c] = k[0]), c !== d && (a[d] = k, delete a[c]), (f = h.cssHooks[d]) && "expand" in f) {
        for(c in k = f.expand(k), delete a[d], k) {
          c in a || (a[c] = k[c], b[c] = e)
        }
      }else {
        b[d] = e
      }
    }
  }
  function q(a, b, c, d, h) {
    return new q.prototype.init(a, b, c, d, h)
  }
  function k(a, b) {
    for(var c, d = {height:a}, h = 0;4 > h;h += 2 - b) {
      c = da[h], d["margin" + c] = d["padding" + c] = a
    }
    return b && (d.opacity = d.width = a), d
  }
  function m(a) {
    return h.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
  }
  var p, s, r = a.document, N = a.location, H = a.navigator, K = a.jQuery, fa = a.$, ga = Array.prototype.push, Z = Array.prototype.slice, ma = Array.prototype.indexOf, za = Object.prototype.toString, Q = Object.prototype.hasOwnProperty, na = String.prototype.trim, h = function(a, b) {
    return new h.fn.init(a, b, p)
  }, oa = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, Ka = /\S/, ea = /\s+/, pb = Ka.test(" ") ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g, qb = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, La = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, rb = /^[\],:{}\s]*$/, sb = /(?:^|:|,)(?:\s*\[)+/g, tb = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, ub = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, vb = /^-ms-/, wb = /-([\da-z])/gi, xb = function(a, b) {
    return(b + "").toUpperCase()
  }, ua = function() {
    r.addEventListener ? (r.removeEventListener("DOMContentLoaded", ua, !1), h.ready()) : "complete" === r.readyState && (r.detachEvent("onreadystatechange", ua), h.ready())
  }, Ma = {};
  h.fn = h.prototype = {constructor:h, init:function(a, b, d) {
    var e, k;
    if(!a) {
      return this
    }
    if(a.nodeType) {
      return this.context = this[0] = a, this.length = 1, this
    }
    if("string" == typeof a) {
      "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && 3 <= a.length ? e = [null, a, null] : e = qb.exec(a);
      if(e && (e[1] || !b)) {
        if(e[1]) {
          return b = b instanceof h ? b[0] : b, k = b && b.nodeType ? b.ownerDocument || b : r, a = h.parseHTML(e[1], k, !0), La.test(e[1]) && h.isPlainObject(b) && this.attr.call(a, b, !0), h.merge(this, a)
        }
        if((b = r.getElementById(e[2])) && b.parentNode) {
          if(b.id !== e[2]) {
            return d.find(a)
          }
          this.length = 1;
          this[0] = b
        }
        return this.context = r, this.selector = a, this
      }
      return!b || b.jquery ? (b || d).find(a) : this.constructor(b).find(a)
    }
    return h.isFunction(a) ? d.ready(a) : (a.selector !== c && (this.selector = a.selector, this.context = a.context), h.makeArray(a, this))
  }, selector:"", jquery:"1.8.0", length:0, size:function() {
    return this.length
  }, toArray:function() {
    return Z.call(this)
  }, get:function(a) {
    return null == a ? this.toArray() : 0 > a ? this[this.length + a] : this[a]
  }, pushStack:function(a, b, c) {
    a = h.merge(this.constructor(), a);
    return a.prevObject = this, a.context = this.context, "find" === b ? a.selector = this.selector + (this.selector ? " " : "") + c : b && (a.selector = this.selector + "." + b + "(" + c + ")"), a
  }, each:function(a, b) {
    return h.each(this, a, b)
  }, ready:function(a) {
    return h.ready.promise().done(a), this
  }, eq:function(a) {
    return a = +a, -1 === a ? this.slice(a) : this.slice(a, a + 1)
  }, first:function() {
    return this.eq(0)
  }, last:function() {
    return this.eq(-1)
  }, slice:function() {
    return this.pushStack(Z.apply(this, arguments), "slice", Z.call(arguments).join(","))
  }, map:function(a) {
    return this.pushStack(h.map(this, function(b, c) {
      return a.call(b, c, b)
    }))
  }, end:function() {
    return this.prevObject || this.constructor(null)
  }, push:ga, sort:[].sort, splice:[].splice};
  h.fn.init.prototype = h.fn;
  h.extend = h.fn.extend = function() {
    var a, b, d, e, k, f, m = arguments[0] || {}, g = 1, p = arguments.length, q = !1;
    "boolean" == typeof m && (q = m, m = arguments[1] || {}, g = 2);
    "object" != typeof m && !h.isFunction(m) && (m = {});
    for(p === g && (m = this, --g);g < p;g++) {
      if(null != (a = arguments[g])) {
        for(b in a) {
          d = m[b], e = a[b], m !== e && (q && e && (h.isPlainObject(e) || (k = h.isArray(e))) ? (k ? (k = !1, f = d && h.isArray(d) ? d : []) : f = d && h.isPlainObject(d) ? d : {}, m[b] = h.extend(q, f, e)) : e !== c && (m[b] = e))
        }
      }
    }
    return m
  };
  h.extend({noConflict:function(b) {
    return a.$ === h && (a.$ = fa), b && a.jQuery === h && (a.jQuery = K), h
  }, isReady:!1, readyWait:1, holdReady:function(a) {
    a ? h.readyWait++ : h.ready(!0)
  }, ready:function(a) {
    if(!(!0 === a ? --h.readyWait : h.isReady)) {
      if(!r.body) {
        return setTimeout(h.ready, 1)
      }
      h.isReady = !0;
      !0 !== a && 0 < --h.readyWait || (s.resolveWith(r, [h]), h.fn.trigger && h(r).trigger("ready").off("ready"))
    }
  }, isFunction:function(a) {
    return"function" === h.type(a)
  }, isArray:Array.isArray || function(a) {
    return"array" === h.type(a)
  }, isWindow:function(a) {
    return null != a && a == a.window
  }, isNumeric:function(a) {
    return!isNaN(parseFloat(a)) && isFinite(a)
  }, type:function(a) {
    return null == a ? String(a) : Ma[za.call(a)] || "object"
  }, isPlainObject:function(a) {
    if(!a || "object" !== h.type(a) || a.nodeType || h.isWindow(a)) {
      return!1
    }
    try {
      if(a.constructor && !Q.call(a, "constructor") && !Q.call(a.constructor.prototype, "isPrototypeOf")) {
        return!1
      }
    }catch(b) {
      return!1
    }
    for(var d in a) {
    }
    return d === c || Q.call(a, d)
  }, isEmptyObject:function(a) {
    for(var b in a) {
      return!1
    }
    return!0
  }, error:function(a) {
    throw Error(a);
  }, parseHTML:function(a, b, c) {
    var d;
    return!a || "string" != typeof a ? null : ("boolean" == typeof b && (c = b, b = 0), b = b || r, (d = La.exec(a)) ? [b.createElement(d[1])] : (d = h.buildFragment([a], b, c ? null : []), h.merge([], (d.cacheable ? h.clone(d.fragment) : d.fragment).childNodes)))
  }, parseJSON:function(b) {
    if(!b || "string" != typeof b) {
      return null
    }
    b = h.trim(b);
    if(a.JSON && a.JSON.parse) {
      return a.JSON.parse(b)
    }
    if(rb.test(b.replace(tb, "@").replace(ub, "]").replace(sb, ""))) {
      return(new Function("return " + b))()
    }
    h.error("Invalid JSON: " + b)
  }, parseXML:function(b) {
    var d, e;
    if(!b || "string" != typeof b) {
      return null
    }
    try {
      a.DOMParser ? (e = new DOMParser, d = e.parseFromString(b, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(b))
    }catch(k) {
      d = c
    }
    return(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && h.error("Invalid XML: " + b), d
  }, noop:function() {
  }, globalEval:function(b) {
    b && Ka.test(b) && (a.execScript || function(b) {
      a.eval.call(a, b)
    })(b)
  }, camelCase:function(a) {
    return a.replace(vb, "ms-").replace(wb, xb)
  }, nodeName:function(a, b) {
    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
  }, each:function(a, b, d) {
    var e, k = 0, f = a.length, m = f === c || h.isFunction(a);
    if(d) {
      if(m) {
        for(e in a) {
          if(!1 === b.apply(a[e], d)) {
            break
          }
        }
      }else {
        for(;k < f && !1 !== b.apply(a[k++], d);) {
        }
      }
    }else {
      if(m) {
        for(e in a) {
          if(!1 === b.call(a[e], e, a[e])) {
            break
          }
        }
      }else {
        for(;k < f && !1 !== b.call(a[k], k, a[k++]);) {
        }
      }
    }
    return a
  }, trim:na ? function(a) {
    return null == a ? "" : na.call(a)
  } : function(a) {
    return null == a ? "" : a.toString().replace(pb, "")
  }, makeArray:function(a, b) {
    var c, d = b || [];
    return null != a && (c = h.type(a), null == a.length || "string" === c || "function" === c || "regexp" === c || h.isWindow(a) ? ga.call(d, a) : h.merge(d, a)), d
  }, inArray:function(a, b, c) {
    var d;
    if(b) {
      if(ma) {
        return ma.call(b, a, c)
      }
      d = b.length;
      for(c = c ? 0 > c ? Math.max(0, d + c) : c : 0;c < d;c++) {
        if(c in b && b[c] === a) {
          return c
        }
      }
    }
    return-1
  }, merge:function(a, b) {
    var d = b.length, h = a.length, e = 0;
    if("number" == typeof d) {
      for(;e < d;e++) {
        a[h++] = b[e]
      }
    }else {
      for(;b[e] !== c;) {
        a[h++] = b[e++]
      }
    }
    return a.length = h, a
  }, grep:function(a, b, c) {
    var d, h = [], e = 0, k = a.length;
    for(c = !!c;e < k;e++) {
      d = !!b(a[e], e), c !== d && h.push(a[e])
    }
    return h
  }, map:function(a, b, d) {
    var e, k, f = [], m = 0, g = a.length;
    if(a instanceof h || g !== c && "number" == typeof g && (0 < g && a[0] && a[g - 1] || 0 === g || h.isArray(a))) {
      for(;m < g;m++) {
        e = b(a[m], m, d), null != e && (f[f.length] = e)
      }
    }else {
      for(k in a) {
        e = b(a[k], k, d), null != e && (f[f.length] = e)
      }
    }
    return f.concat.apply([], f)
  }, guid:1, proxy:function(a, b) {
    var d, e, k;
    return"string" == typeof b && (d = a[b], b = a, a = d), h.isFunction(a) ? (e = Z.call(arguments, 2), k = function() {
      return a.apply(b, e.concat(Z.call(arguments)))
    }, k.guid = a.guid = a.guid || k.guid || h.guid++, k) : c
  }, access:function(a, b, d, e, k, f, m) {
    var g, p = null == d, q = 0, s = a.length;
    if(d && "object" == typeof d) {
      for(q in d) {
        h.access(a, b, q, d[q], 1, f, e)
      }
      k = 1
    }else {
      if(e !== c) {
        g = m === c && h.isFunction(e);
        p && (g ? (g = b, b = function(a, b, c) {
          return g.call(h(a), c)
        }) : (b.call(a, e), b = null));
        if(b) {
          for(;q < s;q++) {
            b(a[q], d, g ? e.call(a[q], q, b(a[q], d)) : e, m)
          }
        }
        k = 1
      }
    }
    return k ? a : p ? b.call(a) : s ? b(a[0], d) : f
  }, now:function() {
    return(new Date).getTime()
  }});
  h.ready.promise = function(b) {
    if(!s) {
      if(s = h.Deferred(), "complete" === r.readyState || "loading" !== r.readyState && r.addEventListener) {
        setTimeout(h.ready, 1)
      }else {
        if(r.addEventListener) {
          r.addEventListener("DOMContentLoaded", ua, !1), a.addEventListener("load", h.ready, !1)
        }else {
          r.attachEvent("onreadystatechange", ua);
          a.attachEvent("onload", h.ready);
          var c = !1;
          try {
            c = null == a.frameElement && r.documentElement
          }catch(d) {
          }
          c && c.doScroll && function ja() {
            if(!h.isReady) {
              try {
                c.doScroll("left")
              }catch(a) {
                return setTimeout(ja, 50)
              }
              h.ready()
            }
          }()
        }
      }
    }
    return s.promise(b)
  };
  h.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
    Ma["[object " + b + "]"] = b.toLowerCase()
  });
  p = h(r);
  var Ga = {};
  h.Callbacks = function(a) {
    a = "string" == typeof a ? Ga[a] || f(a) : h.extend({}, a);
    var b, d, e, k, m, g, p = [], q = !a.once && [], s = function(c) {
      b = a.memory && c;
      d = !0;
      g = k || 0;
      k = 0;
      m = p.length;
      for(e = !0;p && g < m;g++) {
        if(!1 === p[g].apply(c[0], c[1]) && a.stopOnFalse) {
          b = !1;
          break
        }
      }
      e = !1;
      p && (q ? q.length && s(q.shift()) : b ? p = [] : r.disable())
    }, r = {add:function() {
      if(p) {
        var c = p.length;
        (function yb(b) {
          h.each(b, function(b, c) {
            h.isFunction(c) && (!a.unique || !r.has(c)) ? p.push(c) : c && c.length && yb(c)
          })
        })(arguments);
        e ? m = p.length : b && (k = c, s(b))
      }
      return this
    }, remove:function() {
      return p && h.each(arguments, function(a, b) {
        for(var c;-1 < (c = h.inArray(b, p, c));) {
          p.splice(c, 1), e && (c <= m && m--, c <= g && g--)
        }
      }), this
    }, has:function(a) {
      return-1 < h.inArray(a, p)
    }, empty:function() {
      return p = [], this
    }, disable:function() {
      return p = q = b = c, this
    }, disabled:function() {
      return!p
    }, lock:function() {
      return q = c, b || r.disable(), this
    }, locked:function() {
      return!q
    }, fireWith:function(a, b) {
      return b = b || [], b = [a, b.slice ? b.slice() : b], p && (!d || q) && (e ? q.push(b) : s(b)), this
    }, fire:function() {
      return r.fireWith(this, arguments), this
    }, fired:function() {
      return!!d
    }};
    return r
  };
  h.extend({Deferred:function(a) {
    var b = [["resolve", "done", h.Callbacks("once memory"), "resolved"], ["reject", "fail", h.Callbacks("once memory"), "rejected"], ["notify", "progress", h.Callbacks("memory")]], c = "pending", d = {state:function() {
      return c
    }, always:function() {
      return e.done(arguments).fail(arguments), this
    }, then:function() {
      var a = arguments;
      return h.Deferred(function(c) {
        h.each(b, function(b, d) {
          var y = d[0], k = a[b];
          e[d[1]](h.isFunction(k) ? function() {
            var a = k.apply(this, arguments);
            a && h.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[y + "With"](this === e ? c : this, [a])
          } : c[y])
        });
        a = null
      }).promise()
    }, promise:function(a) {
      return"object" == typeof a ? h.extend(a, d) : d
    }}, e = {};
    return d.pipe = d.then, h.each(b, function(a, y) {
      var h = y[2], k = y[3];
      d[y[1]] = h.add;
      k && h.add(function() {
        c = k
      }, b[a ^ 1][2].disable, b[2][2].lock);
      e[y[0]] = h.fire;
      e[y[0] + "With"] = h.fireWith
    }), d.promise(e), a && a.call(e, e), e
  }, when:function(a) {
    var b = 0, c = Z.call(arguments), d = c.length, e = 1 !== d || a && h.isFunction(a.promise) ? d : 0, k = 1 === e ? a : h.Deferred(), f = function(a, b, c) {
      return function(d) {
        b[a] = this;
        c[a] = 1 < arguments.length ? Z.call(arguments) : d;
        c === m ? k.notifyWith(b, c) : --e || k.resolveWith(b, c)
      }
    }, m, g, p;
    if(1 < d) {
      m = Array(d);
      g = Array(d);
      for(p = Array(d);b < d;b++) {
        c[b] && h.isFunction(c[b].promise) ? c[b].promise().done(f(b, p, c)).fail(k.reject).progress(f(b, g, m)) : --e
      }
    }
    return e || k.resolveWith(p, c), k.promise()
  }});
  h.support = function() {
    var b, c, d, e, k, f, m, g, p = r.createElement("div");
    p.setAttribute("className", "t");
    p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    c = p.getElementsByTagName("*");
    d = p.getElementsByTagName("a")[0];
    d.style.cssText = "top:1px;float:left;opacity:.5";
    if(!c || !c.length || !d) {
      return{}
    }
    e = r.createElement("select");
    k = e.appendChild(r.createElement("option"));
    c = p.getElementsByTagName("input")[0];
    b = {leadingWhitespace:3 === p.firstChild.nodeType, tbody:!p.getElementsByTagName("tbody").length, htmlSerialize:!!p.getElementsByTagName("link").length, style:/top/.test(d.getAttribute("style")), hrefNormalized:"/a" === d.getAttribute("href"), opacity:/^0.5/.test(d.style.opacity), cssFloat:!!d.style.cssFloat, checkOn:"on" === c.value, optSelected:k.selected, getSetAttribute:"t" !== p.className, enctype:!!r.createElement("form").enctype, html5Clone:"<:nav></:nav>" !== r.createElement("nav").cloneNode(!0).outerHTML, 
    boxModel:"CSS1Compat" === r.compatMode, submitBubbles:!0, changeBubbles:!0, focusinBubbles:!1, deleteExpando:!0, noCloneEvent:!0, inlineBlockNeedsLayout:!1, shrinkWrapBlocks:!1, reliableMarginRight:!0, boxSizingReliable:!0, pixelPosition:!1};
    c.checked = !0;
    b.noCloneChecked = c.cloneNode(!0).checked;
    e.disabled = !0;
    b.optDisabled = !k.disabled;
    try {
      delete p.test
    }catch(q) {
      b.deleteExpando = !1
    }
    !p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", g = function() {
      b.noCloneEvent = !1
    }), p.cloneNode(!0).fireEvent("onclick"), p.detachEvent("onclick", g));
    c = r.createElement("input");
    c.value = "t";
    c.setAttribute("type", "radio");
    b.radioValue = "t" === c.value;
    c.setAttribute("checked", "checked");
    c.setAttribute("name", "t");
    p.appendChild(c);
    d = r.createDocumentFragment();
    d.appendChild(p.lastChild);
    b.checkClone = d.cloneNode(!0).cloneNode(!0).lastChild.checked;
    b.appendChecked = c.checked;
    d.removeChild(c);
    d.appendChild(p);
    if(p.attachEvent) {
      for(f in{submit:!0, change:!0, focusin:!0}) {
        c = "on" + f, (m = c in p) || (p.setAttribute(c, "return;"), m = "function" == typeof p[c]), b[f + "Bubbles"] = m
      }
    }
    return h(function() {
      var c, d, e, h, k = r.getElementsByTagName("body")[0];
      k && (c = r.createElement("div"), c.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", k.insertBefore(c, k.firstChild), d = r.createElement("div"), c.appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = d.getElementsByTagName("td"), e[0].style.cssText = "padding:0;margin:0;border:0;display:none", m = 0 === e[0].offsetHeight, e[0].style.display = "", e[1].style.display = "none", b.reliableHiddenOffsets = m && 0 === 
      e[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", b.boxSizing = 4 === d.offsetWidth, b.doesNotIncludeMarginInBodyOffset = 1 !== k.offsetTop, a.getComputedStyle && (b.pixelPosition = "1%" !== (a.getComputedStyle(d, null) || {}).top, b.boxSizingReliable = "4px" === (a.getComputedStyle(d, null) || {width:"4px"}).width, h = 
      r.createElement("div"), h.style.cssText = d.style.cssText = "padding:0;margin:0;border:0;display:block;overflow:hidden;", h.style.marginRight = h.style.width = "0", d.style.width = "1px", d.appendChild(h), b.reliableMarginRight = !parseFloat((a.getComputedStyle(h, null) || {}).marginRight)), "undefined" != typeof d.style.zoom && (d.innerHTML = "", d.style.cssText = "padding:0;margin:0;border:0;display:block;overflow:hidden;width:1px;padding:1px;display:inline;zoom:1", b.inlineBlockNeedsLayout = 
      3 === d.offsetWidth, d.style.display = "block", d.style.overflow = "visible", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", b.shrinkWrapBlocks = 3 !== d.offsetWidth, c.style.zoom = 1), k.removeChild(c))
    }), d.removeChild(p), c = d = e = k = c = d = p = null, b
  }();
  var kb = /^(?:\{.*\}|\[.*\])$/, jb = /([A-Z])/g;
  h.extend({cache:{}, deletedIds:[], uuid:0, expando:"jQuery" + (h.fn.jquery + Math.random()).replace(/\D/g, ""), noData:{embed:!0, object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet:!0}, hasData:function(a) {
    return a = a.nodeType ? h.cache[a[h.expando]] : a[h.expando], !!a && !l(a)
  }, data:function(a, b, d, e) {
    if(h.acceptData(a)) {
      var k, f, m = h.expando, g = "string" == typeof b, p = a.nodeType, q = p ? h.cache : a, s = p ? a[m] : a[m] && m;
      if(s && q[s] && (e || q[s].data) || !(g && d === c)) {
        s || (p ? a[m] = s = h.deletedIds.pop() || ++h.uuid : s = m);
        q[s] || (q[s] = {}, p || (q[s].toJSON = h.noop));
        if("object" == typeof b || "function" == typeof b) {
          e ? q[s] = h.extend(q[s], b) : q[s].data = h.extend(q[s].data, b)
        }
        return k = q[s], e || (k.data || (k.data = {}), k = k.data), d !== c && (k[h.camelCase(b)] = d), g ? (f = k[b], null == f && (f = k[h.camelCase(b)])) : f = k, f
      }
    }
  }, removeData:function(a, b, c) {
    if(h.acceptData(a)) {
      var d, e, k, f = a.nodeType, m = f ? h.cache : a, g = f ? a[h.expando] : h.expando;
      if(m[g]) {
        if(b && (d = c ? m[g] : m[g].data)) {
          h.isArray(b) || (b in d ? b = [b] : (b = h.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
          e = 0;
          for(k = b.length;e < k;e++) {
            delete d[b[e]]
          }
          if(!(c ? l : h.isEmptyObject)(d)) {
            return
          }
        }
        if(!c && (delete m[g].data, !l(m[g]))) {
          return
        }
        f ? h.cleanData([a], !0) : h.support.deleteExpando || m != m.window ? delete m[g] : m[g] = null
      }
    }
  }, _data:function(a, b, c) {
    return h.data(a, b, c, !0)
  }, acceptData:function(a) {
    var b = a.nodeName && h.noData[a.nodeName.toLowerCase()];
    return!b || !0 !== b && a.getAttribute("classid") === b
  }});
  h.fn.extend({data:function(a, b) {
    var d, e, k, f, m, p = this[0], q = 0, s = null;
    if(a === c) {
      if(this.length && (s = h.data(p), 1 === p.nodeType && !h._data(p, "parsedAttrs"))) {
        k = p.attributes;
        for(m = k.length;q < m;q++) {
          f = k[q].name, 0 === f.indexOf("data-") && (f = h.camelCase(f.substring(5)), g(p, f, s[f]))
        }
        h._data(p, "parsedAttrs", !0)
      }
      return s
    }
    return"object" == typeof a ? this.each(function() {
      h.data(this, a)
    }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", h.access(this, function(b) {
      if(b === c) {
        return s = this.triggerHandler("getData" + e, [d[0]]), s === c && p && (s = h.data(p, a), s = g(p, a, s)), s === c && d[1] ? this.data(d[0]) : s
      }
      d[1] = b;
      this.each(function() {
        var c = h(this);
        c.triggerHandler("setData" + e, d);
        h.data(this, a, b);
        c.triggerHandler("changeData" + e, d)
      })
    }, null, b, 1 < arguments.length, null, !1))
  }, removeData:function(a) {
    return this.each(function() {
      h.removeData(this, a)
    })
  }});
  h.extend({queue:function(a, b, c) {
    var d;
    if(a) {
      return b = (b || "fx") + "queue", d = h._data(a, b), c && (!d || h.isArray(c) ? d = h._data(a, b, h.makeArray(c)) : d.push(c)), d || []
    }
  }, dequeue:function(a, b) {
    b = b || "fx";
    var c = h.queue(a, b), d = c.shift(), e = h._queueHooks(a, b), k = function() {
      h.dequeue(a, b)
    };
    "inprogress" === d && (d = c.shift());
    d && ("fx" === b && c.unshift("inprogress"), delete e.stop, d.call(a, k, e));
    !c.length && e && e.empty.fire()
  }, _queueHooks:function(a, b) {
    var c = b + "queueHooks";
    return h._data(a, c) || h._data(a, c, {empty:h.Callbacks("once memory").add(function() {
      h.removeData(a, b + "queue", !0);
      h.removeData(a, c, !0)
    })})
  }});
  h.fn.extend({queue:function(a, b) {
    var d = 2;
    return"string" != typeof a && (b = a, a = "fx", d--), arguments.length < d ? h.queue(this[0], a) : b === c ? this : this.each(function() {
      var c = h.queue(this, a, b);
      h._queueHooks(this, a);
      "fx" === a && "inprogress" !== c[0] && h.dequeue(this, a)
    })
  }, dequeue:function(a) {
    return this.each(function() {
      h.dequeue(this, a)
    })
  }, delay:function(a, b) {
    return a = h.fx ? h.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
      var d = setTimeout(b, a);
      c.stop = function() {
        clearTimeout(d)
      }
    })
  }, clearQueue:function(a) {
    return this.queue(a || "fx", [])
  }, promise:function(a, b) {
    var d, e = 1, k = h.Deferred(), f = this, m = this.length, g = function() {
      --e || k.resolveWith(f, [f])
    };
    "string" != typeof a && (b = a, a = c);
    for(a = a || "fx";m--;) {
      (d = h._data(f[m], a + "queueHooks")) && d.empty && (e++, d.empty.add(g))
    }
    return g(), k.promise(b)
  }});
  var ba, Na, Oa, Pa = /[\t\r\n]/g, zb = /\r/g, Ab = /^(?:button|input)$/i, Bb = /^(?:button|input|object|select|textarea)$/i, Cb = /^a(?:rea|)$/i, Qa = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, Ra = h.support.getSetAttribute;
  h.fn.extend({attr:function(a, b) {
    return h.access(this, h.attr, a, b, 1 < arguments.length)
  }, removeAttr:function(a) {
    return this.each(function() {
      h.removeAttr(this, a)
    })
  }, prop:function(a, b) {
    return h.access(this, h.prop, a, b, 1 < arguments.length)
  }, removeProp:function(a) {
    return a = h.propFix[a] || a, this.each(function() {
      try {
        this[a] = c, delete this[a]
      }catch(b) {
      }
    })
  }, addClass:function(a) {
    var b, c, d, e, k, f, m;
    if(h.isFunction(a)) {
      return this.each(function(b) {
        h(this).addClass(a.call(this, b, this.className))
      })
    }
    if(a && "string" == typeof a) {
      b = a.split(ea);
      c = 0;
      for(d = this.length;c < d;c++) {
        if(e = this[c], 1 === e.nodeType) {
          if(!e.className && 1 === b.length) {
            e.className = a
          }else {
            k = " " + e.className + " ";
            f = 0;
            for(m = b.length;f < m;f++) {
              ~k.indexOf(" " + b[f] + " ") || (k += b[f] + " ")
            }
            e.className = h.trim(k)
          }
        }
      }
    }
    return this
  }, removeClass:function(a) {
    var b, d, e, k, f, m, g;
    if(h.isFunction(a)) {
      return this.each(function(b) {
        h(this).removeClass(a.call(this, b, this.className))
      })
    }
    if(a && "string" == typeof a || a === c) {
      b = (a || "").split(ea);
      m = 0;
      for(g = this.length;m < g;m++) {
        if(e = this[m], 1 === e.nodeType && e.className) {
          d = (" " + e.className + " ").replace(Pa, " ");
          k = 0;
          for(f = b.length;k < f;k++) {
            for(;-1 < d.indexOf(" " + b[k] + " ");) {
              d = d.replace(" " + b[k] + " ", " ")
            }
          }
          e.className = a ? h.trim(d) : ""
        }
      }
    }
    return this
  }, toggleClass:function(a, b) {
    var c = typeof a, d = "boolean" == typeof b;
    return h.isFunction(a) ? this.each(function(c) {
      h(this).toggleClass(a.call(this, c, this.className, b), b)
    }) : this.each(function() {
      if("string" === c) {
        for(var e, k = 0, f = h(this), m = b, g = a.split(ea);e = g[k++];) {
          m = d ? m : !f.hasClass(e), f[m ? "addClass" : "removeClass"](e)
        }
      }else {
        if("undefined" === c || "boolean" === c) {
          this.className && h._data(this, "__className__", this.className), this.className = this.className || !1 === a ? "" : h._data(this, "__className__") || ""
        }
      }
    })
  }, hasClass:function(a) {
    a = " " + a + " ";
    for(var b = 0, c = this.length;b < c;b++) {
      if(1 === this[b].nodeType && -1 < (" " + this[b].className + " ").replace(Pa, " ").indexOf(a)) {
        return!0
      }
    }
    return!1
  }, val:function(a) {
    var b, d, e, k = this[0];
    if(arguments.length) {
      return e = h.isFunction(a), this.each(function(d) {
        var k, f = h(this);
        if(1 === this.nodeType && (e ? k = a.call(this, d, f.val()) : k = a, null == k ? k = "" : "number" == typeof k ? k += "" : h.isArray(k) && (k = h.map(k, function(a) {
          return null == a ? "" : a + ""
        })), b = h.valHooks[this.type] || h.valHooks[this.nodeName.toLowerCase()], !b || !("set" in b) || b.set(this, k, "value") === c)) {
          this.value = k
        }
      })
    }
    if(k) {
      return b = h.valHooks[k.type] || h.valHooks[k.nodeName.toLowerCase()], b && "get" in b && (d = b.get(k, "value")) !== c ? d : (d = k.value, "string" == typeof d ? d.replace(zb, "") : null == d ? "" : d)
    }
  }});
  h.extend({valHooks:{option:{get:function(a) {
    var b = a.attributes.value;
    return!b || b.specified ? a.value : a.text
  }}, select:{get:function(a) {
    var b, c, d = a.selectedIndex, e = [], k = a.options, f = "select-one" === a.type;
    if(0 > d) {
      return null
    }
    a = f ? d : 0;
    for(c = f ? d + 1 : k.length;a < c;a++) {
      if(b = k[a], b.selected && (h.support.optDisabled ? !b.disabled : null === b.getAttribute("disabled")) && (!b.parentNode.disabled || !h.nodeName(b.parentNode, "optgroup"))) {
        b = h(b).val();
        if(f) {
          return b
        }
        e.push(b)
      }
    }
    return f && !e.length && k.length ? h(k[d]).val() : e
  }, set:function(a, b) {
    var c = h.makeArray(b);
    return h(a).find("option").each(function() {
      this.selected = 0 <= h.inArray(h(this).val(), c)
    }), c.length || (a.selectedIndex = -1), c
  }}}, attrFn:{}, attr:function(a, b, d, e) {
    var k, f, m = a.nodeType;
    if(a && !(3 === m || 8 === m || 2 === m)) {
      if(e && h.isFunction(h.fn[b])) {
        return h(a)[b](d)
      }
      if("undefined" == typeof a.getAttribute) {
        return h.prop(a, b, d)
      }
      (e = 1 !== m || !h.isXMLDoc(a)) && (b = b.toLowerCase(), f = h.attrHooks[b] || (Qa.test(b) ? Na : ba));
      if(d !== c) {
        if(null === d) {
          h.removeAttr(a, b);
          return
        }
        return f && "set" in f && e && (k = f.set(a, d, b)) !== c ? k : (a.setAttribute(b, "" + d), d)
      }
      return f && "get" in f && e && null !== (k = f.get(a, b)) ? k : (k = a.getAttribute(b), null === k ? c : k)
    }
  }, removeAttr:function(a, b) {
    var c, d, e, k, f = 0;
    if(b && 1 === a.nodeType) {
      for(d = b.split(ea);f < d.length;f++) {
        (e = d[f]) && (c = h.propFix[e] || e, k = Qa.test(e), k || h.attr(a, e, ""), a.removeAttribute(Ra ? e : c), k && c in a && (a[c] = !1))
      }
    }
  }, attrHooks:{type:{set:function(a, b) {
    if(Ab.test(a.nodeName) && a.parentNode) {
      h.error("type property can't be changed")
    }else {
      if(!h.support.radioValue && "radio" === b && h.nodeName(a, "input")) {
        var c = a.value;
        return a.setAttribute("type", b), c && (a.value = c), b
      }
    }
  }}, value:{get:function(a, b) {
    return ba && h.nodeName(a, "button") ? ba.get(a, b) : b in a ? a.value : null
  }, set:function(a, b, c) {
    if(ba && h.nodeName(a, "button")) {
      return ba.set(a, b, c)
    }
    a.value = b
  }}}, propFix:{tabindex:"tabIndex", readonly:"readOnly", "for":"htmlFor", "class":"className", maxlength:"maxLength", cellspacing:"cellSpacing", cellpadding:"cellPadding", rowspan:"rowSpan", colspan:"colSpan", usemap:"useMap", frameborder:"frameBorder", contenteditable:"contentEditable"}, prop:function(a, b, d) {
    var e, k, f, m = a.nodeType;
    if(a && !(3 === m || 8 === m || 2 === m)) {
      return f = 1 !== m || !h.isXMLDoc(a), f && (b = h.propFix[b] || b, k = h.propHooks[b]), d !== c ? k && "set" in k && (e = k.set(a, d, b)) !== c ? e : a[b] = d : k && "get" in k && null !== (e = k.get(a, b)) ? e : a[b]
    }
  }, propHooks:{tabIndex:{get:function(a) {
    var b = a.getAttributeNode("tabindex");
    return b && b.specified ? parseInt(b.value, 10) : Bb.test(a.nodeName) || Cb.test(a.nodeName) && a.href ? 0 : c
  }}}});
  Na = {get:function(a, b) {
    var d, e = h.prop(a, b);
    return!0 === e || "boolean" != typeof e && (d = a.getAttributeNode(b)) && !1 !== d.nodeValue ? b.toLowerCase() : c
  }, set:function(a, b, c) {
    var d;
    return!1 === b ? h.removeAttr(a, c) : (d = h.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
  }};
  Ra || (Oa = {name:!0, id:!0, coords:!0}, ba = h.valHooks.button = {get:function(a, b) {
    var d;
    return d = a.getAttributeNode(b), d && (Oa[b] ? "" !== d.value : d.specified) ? d.value : c
  }, set:function(a, b, c) {
    var d = a.getAttributeNode(c);
    return d || (d = r.createAttribute(c), a.setAttributeNode(d)), d.value = b + ""
  }}, h.each(["width", "height"], function(a, b) {
    h.attrHooks[b] = h.extend(h.attrHooks[b], {set:function(a, c) {
      if("" === c) {
        return a.setAttribute(b, "auto"), c
      }
    }})
  }), h.attrHooks.contenteditable = {get:ba.get, set:function(a, b, c) {
    "" === b && (b = "false");
    ba.set(a, b, c)
  }});
  h.support.hrefNormalized || h.each(["href", "src", "width", "height"], function(a, b) {
    h.attrHooks[b] = h.extend(h.attrHooks[b], {get:function(a) {
      a = a.getAttribute(b, 2);
      return null === a ? c : a
    }})
  });
  h.support.style || (h.attrHooks.style = {get:function(a) {
    return a.style.cssText.toLowerCase() || c
  }, set:function(a, b) {
    return a.style.cssText = "" + b
  }});
  h.support.optSelected || (h.propHooks.selected = h.extend(h.propHooks.selected, {get:function(a) {
    a = a.parentNode;
    return a && (a.selectedIndex, a.parentNode && a.parentNode.selectedIndex), null
  }}));
  h.support.enctype || (h.propFix.enctype = "encoding");
  h.support.checkOn || h.each(["radio", "checkbox"], function() {
    h.valHooks[this] = {get:function(a) {
      return null === a.getAttribute("value") ? "on" : a.value
    }}
  });
  h.each(["radio", "checkbox"], function() {
    h.valHooks[this] = h.extend(h.valHooks[this], {set:function(a, b) {
      if(h.isArray(b)) {
        return a.checked = 0 <= h.inArray(h(a).val(), b)
      }
    }})
  });
  var Aa = /^(?:textarea|input|select)$/i, Sa = /^([^\.]*|)(?:\.(.+)|)$/, Db = /(?:^|\s)hover(\.\S+|)\b/, Eb = /^key/, Fb = /^(?:mouse|contextmenu)|click/, Ta = /^(?:focusinfocus|focusoutblur)$/, Ua = function(a) {
    return h.event.special.hover ? a : a.replace(Db, "mouseenter$1 mouseleave$1")
  };
  h.event = {add:function(a, b, d, e, k) {
    var f, m, g, p, q, s, r, n, l;
    if(!(3 === a.nodeType || 8 === a.nodeType || !b || !d || !(f = h._data(a)))) {
      d.handler && (r = d, d = r.handler, k = r.selector);
      d.guid || (d.guid = h.guid++);
      (g = f.events) || (f.events = g = {});
      (m = f.handle) || (f.handle = m = function(a) {
        return"undefined" != typeof h && (!a || h.event.triggered !== a.type) ? h.event.dispatch.apply(m.elem, arguments) : c
      }, m.elem = a);
      b = h.trim(Ua(b)).split(" ");
      for(f = 0;f < b.length;f++) {
        p = Sa.exec(b[f]) || [];
        q = p[1];
        s = (p[2] || "").split(".").sort();
        l = h.event.special[q] || {};
        q = (k ? l.delegateType : l.bindType) || q;
        l = h.event.special[q] || {};
        p = h.extend({type:q, origType:p[1], data:e, handler:d, guid:d.guid, selector:k, namespace:s.join(".")}, r);
        n = g[q];
        if(!n && (n = g[q] = [], n.delegateCount = 0, !l.setup || !1 === l.setup.call(a, e, s, m))) {
          a.addEventListener ? a.addEventListener(q, m, !1) : a.attachEvent && a.attachEvent("on" + q, m)
        }
        l.add && (l.add.call(a, p), p.handler.guid || (p.handler.guid = d.guid));
        k ? n.splice(n.delegateCount++, 0, p) : n.push(p);
        h.event.global[q] = !0
      }
      a = null
    }
  }, global:{}, remove:function(a, b, c, d, e) {
    var k, f, m, g, p, q, s, r, n, l, N = h.hasData(a) && h._data(a);
    if(N && (s = N.events)) {
      b = h.trim(Ua(b || "")).split(" ");
      for(k = 0;k < b.length;k++) {
        if(f = Sa.exec(b[k]) || [], m = g = f[1], f = f[2], m) {
          r = h.event.special[m] || {};
          m = (d ? r.delegateType : r.bindType) || m;
          n = s[m] || [];
          p = n.length;
          f = f ? RegExp("(^|\\.)" + f.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          for(q = 0;q < n.length;q++) {
            l = n[q], (e || g === l.origType) && (!c || c.guid === l.guid) && (!f || f.test(l.namespace)) && (!d || d === l.selector || "**" === d && l.selector) && (n.splice(q--, 1), l.selector && n.delegateCount--, r.remove && r.remove.call(a, l))
          }
          0 === n.length && p !== n.length && ((!r.teardown || !1 === r.teardown.call(a, f, N.handle)) && h.removeEvent(a, m, N.handle), delete s[m])
        }else {
          for(m in s) {
            h.event.remove(a, m + b[k], c, d, !0)
          }
        }
      }
      h.isEmptyObject(s) && (delete N.handle, h.removeData(a, "events", !0))
    }
  }, customEvent:{getData:!0, setData:!0, changeData:!0}, trigger:function(b, d, e, k) {
    if(!e || 3 !== e.nodeType && 8 !== e.nodeType) {
      var f, m, g, p, q, s, n, l = b.type || b;
      p = [];
      if(!Ta.test(l + h.event.triggered) && (0 <= l.indexOf("!") && (l = l.slice(0, -1), f = !0), 0 <= l.indexOf(".") && (p = l.split("."), l = p.shift(), p.sort()), e && !h.event.customEvent[l] || h.event.global[l])) {
        if(b = "object" == typeof b ? b[h.expando] ? b : new h.Event(l, b) : new h.Event(l), b.type = l, b.isTrigger = !0, b.exclusive = f, b.namespace = p.join("."), b.namespace_re = b.namespace ? RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, p = 0 > l.indexOf(":") ? "on" + l : "", e) {
          if(b.result = c, b.target || (b.target = e), d = null != d ? h.makeArray(d) : [], d.unshift(b), q = h.event.special[l] || {}, !(q.trigger && !1 === q.trigger.apply(e, d))) {
            n = [[e, q.bindType || l]];
            if(!k && !q.noBubble && !h.isWindow(e)) {
              m = q.delegateType || l;
              f = Ta.test(m + l) ? e : e.parentNode;
              for(g = e;f;f = f.parentNode) {
                n.push([f, m]), g = f
              }
              g === (e.ownerDocument || r) && n.push([g.defaultView || g.parentWindow || a, m])
            }
            for(m = 0;m < n.length && !b.isPropagationStopped();m++) {
              f = n[m][0], b.type = n[m][1], (s = (h._data(f, "events") || {})[b.type] && h._data(f, "handle")) && s.apply(f, d), (s = p && f[p]) && h.acceptData(f) && !1 === s.apply(f, d) && b.preventDefault()
            }
            return b.type = l, !k && !b.isDefaultPrevented() && (!q._default || !1 === q._default.apply(e.ownerDocument, d)) && ("click" !== l || !h.nodeName(e, "a")) && h.acceptData(e) && p && e[l] && ("focus" !== l && "blur" !== l || 0 !== b.target.offsetWidth) && !h.isWindow(e) && (g = e[p], g && (e[p] = null), h.event.triggered = l, e[l](), h.event.triggered = c, g && (e[p] = g)), b.result
          }
        }else {
          for(m in e = h.cache, e) {
            e[m].events && e[m].events[l] && h.event.trigger(b, d, e[m].handle.elem, !0)
          }
        }
      }
    }
  }, dispatch:function(b) {
    b = h.event.fix(b || a.event);
    var d, e, k, f, m, g, p, q = (h._data(this, "events") || {})[b.type] || [], s = q.delegateCount, r = [].slice.call(arguments), n = !b.exclusive && !b.namespace, l = h.event.special[b.type] || {}, N = [];
    r[0] = b;
    b.delegateTarget = this;
    if(!(l.preDispatch && !1 === l.preDispatch.call(this, b))) {
      if(s && (!b.button || "click" !== b.type)) {
        k = h(this);
        k.context = this;
        for(e = b.target;e != this;e = e.parentNode || this) {
          if(!0 !== e.disabled || "click" !== b.type) {
            m = {};
            g = [];
            k[0] = e;
            for(d = 0;d < s;d++) {
              f = q[d], p = f.selector, m[p] === c && (m[p] = k.is(p)), m[p] && g.push(f)
            }
            g.length && N.push({elem:e, matches:g})
          }
        }
      }
      q.length > s && N.push({elem:this, matches:q.slice(s)});
      for(d = 0;d < N.length && !b.isPropagationStopped();d++) {
        k = N[d];
        b.currentTarget = k.elem;
        for(e = 0;e < k.matches.length && !b.isImmediatePropagationStopped();e++) {
          if(f = k.matches[e], n || !b.namespace && !f.namespace || b.namespace_re && b.namespace_re.test(f.namespace)) {
            b.data = f.data, b.handleObj = f, f = ((h.event.special[f.origType] || {}).handle || f.handler).apply(k.elem, r), f !== c && (b.result = f, !1 === f && (b.preventDefault(), b.stopPropagation()))
          }
        }
      }
      return l.postDispatch && l.postDispatch.call(this, b), b.result
    }
  }, props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks:{}, keyHooks:{props:["char", "charCode", "key", "keyCode"], filter:function(a, b) {
    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
  }}, mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter:function(a, b) {
    var d, e, k, h = b.button, f = b.fromElement;
    return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || r, e = d.documentElement, k = d.body, a.pageX = b.clientX + (e && e.scrollLeft || k && k.scrollLeft || 0) - (e && e.clientLeft || k && k.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || k && k.scrollTop || 0) - (e && e.clientTop || k && k.clientTop || 0)), !a.relatedTarget && f && (a.relatedTarget = f === a.target ? b.toElement : f), !a.which && h !== c && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0), 
    a
  }}, fix:function(a) {
    if(a[h.expando]) {
      return a
    }
    var b, c, d = a, e = h.event.fixHooks[a.type] || {}, k = e.props ? this.props.concat(e.props) : this.props;
    a = h.Event(d);
    for(b = k.length;b;) {
      c = k[--b], a[c] = d[c]
    }
    return a.target || (a.target = d.srcElement || r), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, e.filter ? e.filter(a, d) : a
  }, special:{ready:{setup:h.bindReady}, load:{noBubble:!0}, focus:{delegateType:"focusin"}, blur:{delegateType:"focusout"}, beforeunload:{setup:function(a, b, c) {
    h.isWindow(this) && (this.onbeforeunload = c)
  }, teardown:function(a, b) {
    this.onbeforeunload === b && (this.onbeforeunload = null)
  }}}, simulate:function(a, b, c, d) {
    a = h.extend(new h.Event, c, {type:a, isSimulated:!0, originalEvent:{}});
    d ? h.event.trigger(a, null, b) : h.event.dispatch.call(b, a);
    a.isDefaultPrevented() && c.preventDefault()
  }};
  h.event.handle = h.event.dispatch;
  h.removeEvent = r.removeEventListener ? function(a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1)
  } : function(a, b, c) {
    b = "on" + b;
    a.detachEvent && ("undefined" == typeof a[b] && (a[b] = null), a.detachEvent(b, c))
  };
  h.Event = function(a, c) {
    if(this instanceof h.Event) {
      a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || !1 === a.returnValue || a.getPreventDefault && a.getPreventDefault() ? b : d) : this.type = a, c && h.extend(this, c), this.timeStamp = a && a.timeStamp || h.now(), this[h.expando] = !0
    }else {
      return new h.Event(a, c)
    }
  };
  h.Event.prototype = {preventDefault:function() {
    this.isDefaultPrevented = b;
    var a = this.originalEvent;
    a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
  }, stopPropagation:function() {
    this.isPropagationStopped = b;
    var a = this.originalEvent;
    a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
  }, stopImmediatePropagation:function() {
    this.isImmediatePropagationStopped = b;
    this.stopPropagation()
  }, isDefaultPrevented:d, isPropagationStopped:d, isImmediatePropagationStopped:d};
  h.each({mouseenter:"mouseover", mouseleave:"mouseout"}, function(a, b) {
    h.event.special[a] = {delegateType:b, bindType:b, handle:function(a) {
      var c, d = a.relatedTarget, e = a.handleObj;
      if(!d || d !== this && !h.contains(this, d)) {
        a.type = e.origType, c = e.handler.apply(this, arguments), a.type = b
      }
      return c
    }}
  });
  h.support.submitBubbles || (h.event.special.submit = {setup:function() {
    if(h.nodeName(this, "form")) {
      return!1
    }
    h.event.add(this, "click._submit keypress._submit", function(a) {
      a = a.target;
      (a = h.nodeName(a, "input") || h.nodeName(a, "button") ? a.form : c) && !h._data(a, "_submit_attached") && (h.event.add(a, "submit._submit", function(a) {
        a._submit_bubble = !0
      }), h._data(a, "_submit_attached", !0))
    })
  }, postDispatch:function(a) {
    a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && h.event.simulate("submit", this.parentNode, a, !0))
  }, teardown:function() {
    if(h.nodeName(this, "form")) {
      return!1
    }
    h.event.remove(this, "._submit")
  }});
  h.support.changeBubbles || (h.event.special.change = {setup:function() {
    if(Aa.test(this.nodeName)) {
      if("checkbox" === this.type || "radio" === this.type) {
        h.event.add(this, "propertychange._change", function(a) {
          "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
        }), h.event.add(this, "click._change", function(a) {
          this._just_changed && !a.isTrigger && (this._just_changed = !1);
          h.event.simulate("change", this, a, !0)
        })
      }
      return!1
    }
    h.event.add(this, "beforeactivate._change", function(a) {
      a = a.target;
      Aa.test(a.nodeName) && !h._data(a, "_change_attached") && (h.event.add(a, "change._change", function(a) {
        this.parentNode && !a.isSimulated && !a.isTrigger && h.event.simulate("change", this.parentNode, a, !0)
      }), h._data(a, "_change_attached", !0))
    })
  }, handle:function(a) {
    var b = a.target;
    if(this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type) {
      return a.handleObj.handler.apply(this, arguments)
    }
  }, teardown:function() {
    return h.event.remove(this, "._change"), Aa.test(this.nodeName)
  }});
  h.support.focusinBubbles || h.each({focus:"focusin", blur:"focusout"}, function(a, b) {
    var c = 0, d = function(a) {
      h.event.simulate(b, a.target, h.event.fix(a), !0)
    };
    h.event.special[b] = {setup:function() {
      0 === c++ && r.addEventListener(a, d, !0)
    }, teardown:function() {
      0 === --c && r.removeEventListener(a, d, !0)
    }}
  });
  h.fn.extend({on:function(a, b, e, k, f) {
    var m, g;
    if("object" == typeof a) {
      "string" != typeof b && (e = e || b, b = c);
      for(g in a) {
        this.on(g, b, e, a[g], f)
      }
      return this
    }
    null == e && null == k ? (k = b, e = b = c) : null == k && ("string" == typeof b ? (k = e, e = c) : (k = e, e = b, b = c));
    if(!1 === k) {
      k = d
    }else {
      if(!k) {
        return this
      }
    }
    return 1 === f && (m = k, k = function(a) {
      return h().off(a), m.apply(this, arguments)
    }, k.guid = m.guid || (m.guid = h.guid++)), this.each(function() {
      h.event.add(this, a, k, e, b)
    })
  }, one:function(a, b, c, d) {
    return this.on(a, b, c, d, 1)
  }, off:function(a, b, e) {
    var k, f;
    if(a && a.preventDefault && a.handleObj) {
      return k = a.handleObj, h(a.delegateTarget).off(k.namespace ? k.origType + "." + k.namespace : k.origType, k.selector, k.handler), this
    }
    if("object" == typeof a) {
      for(f in a) {
        this.off(f, b, a[f])
      }
      return this
    }
    if(!1 === b || "function" == typeof b) {
      e = b, b = c
    }
    return!1 === e && (e = d), this.each(function() {
      h.event.remove(this, a, e, b)
    })
  }, bind:function(a, b, c) {
    return this.on(a, null, b, c)
  }, unbind:function(a, b) {
    return this.off(a, null, b)
  }, live:function(a, b, c) {
    return h(this.context).on(a, this.selector, b, c), this
  }, die:function(a, b) {
    return h(this.context).off(a, this.selector || "**", b), this
  }, delegate:function(a, b, c, d) {
    return this.on(b, a, c, d)
  }, undelegate:function(a, b, c) {
    return 1 == arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
  }, trigger:function(a, b) {
    return this.each(function() {
      h.event.trigger(a, b, this)
    })
  }, triggerHandler:function(a, b) {
    if(this[0]) {
      return h.event.trigger(a, b, this[0], !0)
    }
  }, toggle:function(a) {
    var b = arguments, c = a.guid || h.guid++, d = 0, e = function(c) {
      var e = (h._data(this, "lastToggle" + a.guid) || 0) % d;
      return h._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
    };
    for(e.guid = c;d < b.length;) {
      b[d++].guid = c
    }
    return this.click(e)
  }, hover:function(a, b) {
    return this.mouseenter(a).mouseleave(b || a)
  }});
  h.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
    h.fn[b] = function(a, c) {
      return null == c && (c = a, a = null), 0 < arguments.length ? this.on(b, null, a, c) : this.trigger(b)
    };
    Eb.test(b) && (h.event.fixHooks[b] = h.event.keyHooks);
    Fb.test(b) && (h.event.fixHooks[b] = h.event.mouseHooks)
  });
  (function(a, b) {
    function c(a, b, d, e) {
      for(var k = 0, h = b.length;k < h;k++) {
        G(a, b[k], d, e)
      }
    }
    function d(a, b, e, k, h, f) {
      var m, g = J.setFilters[b.toLowerCase()];
      return g || G.error(b), (a || !(m = h)) && c(a || "*", k, m = [], h), 0 < m.length ? g(m, e, f) : []
    }
    function e(a, k, h, f, m) {
      for(var g, y, p, q, s, r, l, n = 0, N = m.length, ja = D.POS, ca = RegExp("^" + ja.source + "(?!" + t + ")", "i"), mb = function() {
        for(var a = 1, c = arguments.length - 2;a < c;a++) {
          arguments[a] === b && (g[a] = b)
        }
      };n < N;n++) {
        ja.exec("");
        a = m[n];
        q = [];
        p = 0;
        for(s = f;g = ja.exec(a);) {
          if(y = ja.lastIndex = g.index + g[0].length, y > p) {
            l = a.slice(p, g.index);
            p = y;
            r = [k];
            fa.test(l) && (s && (r = s), s = f);
            if(y = Q.test(l)) {
              l = l.slice(0, -5).replace(fa, "$&*")
            }
            1 < g.length && g[0].replace(ca, mb);
            s = d(l, g[1], g[2], r, s, y)
          }
        }
        s ? (q = q.concat(s), (l = a.slice(p)) && ")" !== l ? fa.test(l) ? c(l, q, h, f) : G(l, k, h, f ? f.concat(s) : s) : B.apply(h, q)) : G(a, k, h, f)
      }
      return 1 === N ? h : G.uniqueSort(h)
    }
    function k(a, b, c) {
      var d = b.dir, e = I++;
      return a || (a = function(a) {
        return a === c
      }), b.first ? function(b, c) {
        for(;b = b[d];) {
          if(1 === b.nodeType) {
            return a(b, c) && b
          }
        }
      } : function(b, c) {
        for(var k, h = e + "." + p, f = h + "." + g;b = b[d];) {
          if(1 === b.nodeType) {
            if((k = b[H]) === f) {
              return b.sizset
            }
            if("string" == typeof k && 0 === k.indexOf(h)) {
              if(b.sizset) {
                return b
              }
            }else {
              b[H] = f;
              if(a(b, c)) {
                return b.sizset = !0, b
              }
              b.sizset = !1
            }
          }
        }
      }
    }
    function f(a, b) {
      return a ? function(c, d) {
        var e = b(c, d);
        return e && a(!0 === e ? c : e, d)
      } : b
    }
    function m(a) {
      return function(b, c) {
        for(var d, e = 0;d = a[e];e++) {
          if(d(b, c)) {
            return!0
          }
        }
        return!1
      }
    }
    var g, p, q, s, r, l = a.document, n = l.documentElement, N = !1, w = !0, I = 0, v = [].slice, B = [].push, H = ("sizcache" + Math.random()).replace(".", ""), t = "[\\x20\\t\\r\\n\\f]", u = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("w", "w#"), u = "\\[" + t + "*((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)" + t + "*(?:([*^$|!~]?=)" + t + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + u + ")|)|)" + t + "*\\]", K = t + "*([\\x20\\t\\r\\n\\f>+~])" + t + "*", A = "(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|" + u + "|" + 
    ":((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)".replace(2, 7) + "|[^\\\\(),])+", F = RegExp("^" + t + "+|((?:^|[^\\\\])(?:\\\\.)*)" + t + "+$", "g"), fa = RegExp("^" + K), E = RegExp(A + "?(?=" + t + "*,|$)", "g"), x = RegExp("^(?:(?!,)(?:(?:^|,)" + t + "*" + A + ")*?|" + t + "*(.*?))(\\)|$)"), ga = RegExp(A.slice(19, -6) + "\\x20\\t\\r\\n\\f>+~])+|" + K, "g"), z = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, 
    Z = /[\x20\t\r\n\f]*[+~]/, Q = /:not\($/, za = /h\d/i, R = /input|select|textarea|button/i, O = /\\(?!\\)/g, D = {ID:/^#((?:\\.|[-\w]|[^\x00-\xa0])+)/, CLASS:/^\.((?:\\.|[-\w]|[^\x00-\xa0])+)/, NAME:/^\[name=['"]?((?:\\.|[-\w]|[^\x00-\xa0])+)['"]?\]/, TAG:RegExp("^(" + "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+".replace("[-", "[-\\*") + ")"), ATTR:RegExp("^" + u), PSEUDO:RegExp("^:((?:\\\\.|[-\\w]|[^\\x00-\\xa0])+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)"), 
    CHILD:RegExp("^:(only|nth|last|first)-child(?:\\(" + t + "*(even|odd|(([+-]|)(\\d*)n|)" + t + "*(?:([+-]|)" + t + "*(\\d+)|))" + t + "*\\)|)", "i"), POS:RegExp(":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)", "ig"), needsContext:RegExp("^" + t + "*[>+~]|:(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)", "i")}, W = {}, ma = [], na = {}, M = [], u = function(a) {
      return a.sizzleFilter = !0, a
    }, K = function(a) {
      return function(b) {
        return"input" === b.nodeName.toLowerCase() && b.type === a
      }
    }, A = function(a) {
      return function(b) {
        var c = b.nodeName.toLowerCase();
        return("input" === c || "button" === c) && b.type === a
      }
    }, L = function(a) {
      var b = !1, c = l.createElement("div");
      try {
        b = a(c)
      }catch(d) {
      }
      return b
    }, P = L(function(a) {
      a.innerHTML = "<select></select>";
      a = typeof a.lastChild.getAttribute("multiple");
      return"boolean" !== a && "string" !== a
    }), V = L(function(a) {
      a.id = H + 0;
      a.innerHTML = "<a name='" + H + "'></a><div name='" + H + "'></div>";
      n.insertBefore(a, n.firstChild);
      var b = l.getElementsByName && l.getElementsByName(H).length === 2 + l.getElementsByName(H + 0).length;
      return r = !l.getElementById(H), n.removeChild(a), b
    }), S = L(function(a) {
      return a.appendChild(l.createComment("")), 0 === a.getElementsByTagName("*").length
    }), Y = L(function(a) {
      return a.innerHTML = "<a href='#'></a>", a.firstChild && "undefined" !== typeof a.firstChild.getAttribute && "#" === a.firstChild.getAttribute("href")
    }), aa = L(function(a) {
      return a.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !a.getElementsByClassName || 0 === a.getElementsByClassName("e").length ? !1 : (a.lastChild.className = "e", 1 !== a.getElementsByClassName("e").length)
    }), G = function(a, b, c, d) {
      c = c || [];
      b = b || l;
      var e, k, h, f, m = b.nodeType;
      if(1 !== m && 9 !== m) {
        return[]
      }
      if(!a || "string" != typeof a) {
        return c
      }
      h = U(b);
      if(!h && !d && (e = z.exec(a))) {
        if(f = e[1]) {
          if(9 === m) {
            k = b.getElementById(f);
            if(!k || !k.parentNode) {
              return c
            }
            if(k.id === f) {
              return c.push(k), c
            }
          }else {
            if(b.ownerDocument && (k = b.ownerDocument.getElementById(f)) && oa(b, k) && k.id === f) {
              return c.push(k), c
            }
          }
        }else {
          if(e[2]) {
            return B.apply(c, v.call(b.getElementsByTagName(a), 0)), c
          }
          if((f = e[3]) && aa && b.getElementsByClassName) {
            return B.apply(c, v.call(b.getElementsByClassName(f), 0)), c
          }
        }
      }
      return da(a, b, c, d, h)
    }, J = G.selectors = {cacheLength:50, match:D, order:["ID", "TAG"], attrHandle:{}, createPseudo:u, find:{ID:r ? function(a, b, c) {
      if("undefined" !== typeof b.getElementById && !c) {
        return(a = b.getElementById(a)) && a.parentNode ? [a] : []
      }
    } : function(a, c, d) {
      if("undefined" !== typeof c.getElementById && !d) {
        return(c = c.getElementById(a)) ? c.id === a || "undefined" !== typeof c.getAttributeNode && c.getAttributeNode("id").value === a ? [c] : b : []
      }
    }, TAG:S ? function(a, b) {
      if("undefined" !== typeof b.getElementsByTagName) {
        return b.getElementsByTagName(a)
      }
    } : function(a, b) {
      var c = b.getElementsByTagName(a);
      if("*" === a) {
        for(var d, e = [], k = 0;d = c[k];k++) {
          1 === d.nodeType && e.push(d)
        }
        return e
      }
      return c
    }}, relative:{">":{dir:"parentNode", first:!0}, " ":{dir:"parentNode"}, "+":{dir:"previousSibling", first:!0}, "~":{dir:"previousSibling"}}, preFilter:{ATTR:function(a) {
      return a[1] = a[1].replace(O, ""), a[3] = (a[4] || a[5] || "").replace(O, ""), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
    }, CHILD:function(a) {
      return a[1] = a[1].toLowerCase(), "nth" === a[1] ? (a[2] || G.error(a[0]), a[3] = +(a[3] ? a[4] + (a[5] || 1) : 2 * ("even" === a[2] || "odd" === a[2])), a[4] = +(a[6] + a[7] || "odd" === a[2])) : a[2] && G.error(a[0]), a
    }, PSEUDO:function(a) {
      var b, c = a[4];
      return D.CHILD.test(a[0]) ? null : (c && (b = x.exec(c)) && b.pop() && (a[0] = a[0].slice(0, b[0].length - c.length - 1), c = b[0].slice(0, -1)), a.splice(2, 3, c || a[3]), a)
    }}, filter:{ID:r ? function(a) {
      return a = a.replace(O, ""), function(b) {
        return b.getAttribute("id") === a
      }
    } : function(a) {
      return a = a.replace(O, ""), function(b) {
        return(b = "undefined" !== typeof b.getAttributeNode && b.getAttributeNode("id")) && b.value === a
      }
    }, TAG:function(a) {
      return"*" === a ? function() {
        return!0
      } : (a = a.replace(O, "").toLowerCase(), function(b) {
        return b.nodeName && b.nodeName.toLowerCase() === a
      })
    }, CLASS:function(a) {
      var b = W[a];
      return b || (b = W[a] = RegExp("(^|" + t + ")" + a + "(" + t + "|$)"), ma.push(a), ma.length > J.cacheLength && delete W[ma.shift()]), function(a) {
        return b.test(a.className || "undefined" !== typeof a.getAttribute && a.getAttribute("class") || "")
      }
    }, ATTR:function(a, b, c) {
      return b ? function(d) {
        d = G.attr(d, a);
        var e = d + "";
        if(null == d) {
          return"!=" === b
        }
        switch(b) {
          case "=":
            return e === c;
          case "!=":
            return e !== c;
          case "^=":
            return c && 0 === e.indexOf(c);
          case "*=":
            return c && -1 < e.indexOf(c);
          case "$=":
            return c && e.substr(e.length - c.length) === c;
          case "~=":
            return-1 < (" " + e + " ").indexOf(c);
          case "|=":
            return e === c || e.substr(0, c.length + 1) === c + "-"
        }
      } : function(b) {
        return null != G.attr(b, a)
      }
    }, CHILD:function(a, b, c, d) {
      if("nth" === a) {
        var e = I++;
        return function(a) {
          var b, k, h = 0, f = a;
          if(1 === c && 0 === d) {
            return!0
          }
          if((b = a.parentNode) && (b[H] !== e || !a.sizset)) {
            for(f = b.firstChild;f && !(1 === f.nodeType && (f.sizset = ++h, f === a));f = f.nextSibling) {
            }
            b[H] = e
          }
          return k = a.sizset - d, 0 === c ? 0 === k : 0 === k % c && 0 <= k / c
        }
      }
      return function(b) {
        var c = b;
        switch(a) {
          case "only":
          ;
          case "first":
            for(;c = c.previousSibling;) {
              if(1 === c.nodeType) {
                return!1
              }
            }
            if("first" === a) {
              return!0
            }
            c = b;
          case "last":
            for(;c = c.nextSibling;) {
              if(1 === c.nodeType) {
                return!1
              }
            }
            return!0
        }
      }
    }, PSEUDO:function(a, b, c, d) {
      var e = J.pseudos[a] || J.pseudos[a.toLowerCase()];
      return e || G.error("unsupported pseudo: " + a), e.sizzleFilter ? e(b, c, d) : e
    }}, pseudos:{not:u(function(a, b, c) {
      var d = ea(a.replace(F, "$1"), b, c);
      return function(a) {
        return!d(a)
      }
    }), enabled:function(a) {
      return!1 === a.disabled
    }, disabled:function(a) {
      return!0 === a.disabled
    }, checked:function(a) {
      var b = a.nodeName.toLowerCase();
      return"input" === b && !!a.checked || "option" === b && !!a.selected
    }, selected:function(a) {
      return a.parentNode && a.parentNode.selectedIndex, !0 === a.selected
    }, parent:function(a) {
      return!J.pseudos.empty(a)
    }, empty:function(a) {
      var b;
      for(a = a.firstChild;a;) {
        if("@" < a.nodeName || 3 === (b = a.nodeType) || 4 === b) {
          return!1
        }
        a = a.nextSibling
      }
      return!0
    }, contains:u(function(a) {
      return function(b) {
        return-1 < (b.textContent || b.innerText || ba(b)).indexOf(a)
      }
    }), has:u(function(a) {
      return function(b) {
        return 0 < G(a, b).length
      }
    }), header:function(a) {
      return za.test(a.nodeName)
    }, text:function(a) {
      var b, c;
      return"input" === a.nodeName.toLowerCase() && "text" === (b = a.type) && (null == (c = a.getAttribute("type")) || c.toLowerCase() === b)
    }, radio:K("radio"), checkbox:K("checkbox"), file:K("file"), password:K("password"), image:K("image"), submit:A("submit"), reset:A("reset"), button:function(a) {
      var b = a.nodeName.toLowerCase();
      return"input" === b && "button" === a.type || "button" === b
    }, input:function(a) {
      return R.test(a.nodeName)
    }, focus:function(a) {
      var b = a.ownerDocument;
      return a === b.activeElement && (!b.hasFocus || b.hasFocus()) && (!!a.type || !!a.href)
    }, active:function(a) {
      return a === a.ownerDocument.activeElement
    }}, setFilters:{first:function(a, b, c) {
      return c ? a.slice(1) : [a[0]]
    }, last:function(a, b, c) {
      b = a.pop();
      return c ? a : [b]
    }, even:function(a, b, c) {
      b = [];
      c = c ? 1 : 0;
      for(var d = a.length;c < d;c += 2) {
        b.push(a[c])
      }
      return b
    }, odd:function(a, b, c) {
      b = [];
      c = c ? 0 : 1;
      for(var d = a.length;c < d;c += 2) {
        b.push(a[c])
      }
      return b
    }, lt:function(a, b, c) {
      return c ? a.slice(+b) : a.slice(0, +b)
    }, gt:function(a, b, c) {
      return c ? a.slice(0, +b + 1) : a.slice(+b + 1)
    }, eq:function(a, b, c) {
      b = a.splice(+b, 1);
      return c ? a : b
    }}};
    J.setFilters.nth = J.setFilters.eq;
    J.filters = J.pseudos;
    Y || (J.attrHandle = {href:function(a) {
      return a.getAttribute("href", 2)
    }, type:function(a) {
      return a.getAttribute("type")
    }});
    V && (J.order.push("NAME"), J.find.NAME = function(a, b) {
      if("undefined" !== typeof b.getElementsByName) {
        return b.getElementsByName(a)
      }
    });
    aa && (J.order.splice(1, 0, "CLASS"), J.find.CLASS = function(a, b, c) {
      if("undefined" !== typeof b.getElementsByClassName && !c) {
        return b.getElementsByClassName(a)
      }
    });
    try {
      v.call(n.childNodes, 0)[0].nodeType
    }catch(X) {
      v = function(a) {
        for(var b, c = [];b = this[a];a++) {
          c.push(b)
        }
        return c
      }
    }
    var U = G.isXML = function(a) {
      return(a = a && (a.ownerDocument || a).documentElement) ? "HTML" !== a.nodeName : !1
    }, oa = G.contains = n.compareDocumentPosition ? function(a, b) {
      return!!(a.compareDocumentPosition(b) & 16)
    } : n.contains ? function(a, b) {
      var c = 9 === a.nodeType ? a.documentElement : a, d = b.parentNode;
      return a === d || !(!d || !(1 === d.nodeType && c.contains && c.contains(d)))
    } : function(a, b) {
      for(;b = b.parentNode;) {
        if(b === a) {
          return!0
        }
      }
      return!1
    }, ba = G.getText = function(a) {
      var b, c = "", d = 0;
      if(b = a.nodeType) {
        if(1 === b || 9 === b || 11 === b) {
          if("string" == typeof a.textContent) {
            return a.textContent
          }
          for(a = a.firstChild;a;a = a.nextSibling) {
            c += ba(a)
          }
        }else {
          if(3 === b || 4 === b) {
            return a.nodeValue
          }
        }
      }else {
        for(;b = a[d];d++) {
          c += ba(b)
        }
      }
      return c
    };
    G.attr = function(a, b) {
      var c, d = U(a);
      return d || (b = b.toLowerCase()), J.attrHandle[b] ? J.attrHandle[b](a) : P || d ? a.getAttribute(b) : (c = a.getAttributeNode(b), c ? "boolean" == typeof a[b] ? a[b] ? b : null : c.specified ? c.value : null : null)
    };
    G.error = function(a) {
      throw Error("Syntax error, unrecognized expression: " + a);
    };
    [0, 0].sort(function() {
      return w = 0
    });
    n.compareDocumentPosition ? q = function(a, b) {
      return a === b ? (N = !0, 0) : (!a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition : a.compareDocumentPosition(b) & 4) ? -1 : 1
    } : (q = function(a, b) {
      if(a === b) {
        return N = !0, 0
      }
      if(a.sourceIndex && b.sourceIndex) {
        return a.sourceIndex - b.sourceIndex
      }
      var c, d, e = [], k = [];
      c = a.parentNode;
      d = b.parentNode;
      var h = c;
      if(c === d) {
        return s(a, b)
      }
      if(!c) {
        return-1
      }
      if(!d) {
        return 1
      }
      for(;h;) {
        e.unshift(h), h = h.parentNode
      }
      for(h = d;h;) {
        k.unshift(h), h = h.parentNode
      }
      c = e.length;
      d = k.length;
      for(h = 0;h < c && h < d;h++) {
        if(e[h] !== k[h]) {
          return s(e[h], k[h])
        }
      }
      return h === c ? s(a, k[h], -1) : s(e[h], b, 1)
    }, s = function(a, b, c) {
      if(a === b) {
        return c
      }
      for(a = a.nextSibling;a;) {
        if(a === b) {
          return-1
        }
        a = a.nextSibling
      }
      return 1
    });
    G.uniqueSort = function(a) {
      var b, c = 1;
      if(q && (N = w, a.sort(q), N)) {
        for(;b = a[c];c++) {
          b === a[c - 1] && a.splice(c--, 1)
        }
      }
      return a
    };
    var ea = G.compile = function(a, b, c) {
      var d, e, h, g = na[a];
      if(g && g.context === b) {
        return g
      }
      var y, p = [];
      d = 0;
      for(var q = x.exec(a), s = !q.pop() && !q.pop(), C = s && a.match(E) || [""], r = J.preFilter, T = J.filter, n = !c && b !== l;null != (h = C[d]) && s;d++) {
        p.push(e = []);
        for(n && (h = " " + h);h;) {
          s = !1;
          if(q = fa.exec(h)) {
            h = h.slice(q[0].length), s = e.push({part:q.pop().replace(F, " "), captures:q})
          }
          for(y in T) {
            (q = D[y].exec(h)) && (!r[y] || (q = r[y](q, b, c))) && (h = h.slice(q.shift().length), s = e.push({part:y, captures:q}))
          }
          if(!s) {
            break
          }
        }
      }
      e = (s || G.error(a), p);
      for(h = 0;d = e[h];h++) {
        y = e;
        p = h;
        q = b;
        s = c;
        r = C = void 0;
        for(T = 0;C = d[T];T++) {
          J.relative[C.part] ? r = k(r, J.relative[C.part], q) : (C.captures.push(q, s), r = f(r, J.filter[C.part].apply(null, C.captures)))
        }
        y[p] = r
      }
      return g = na[a] = m(e), g.context = b, g.runs = g.dirruns = 0, M.push(a), M.length > J.cacheLength && delete na[M.shift()], g
    };
    G.matches = function(a, b) {
      return G(a, null, null, b)
    };
    G.matchesSelector = function(a, b) {
      return 0 < G(b, null, null, [a]).length
    };
    var da = function(a, b, c, d, k) {
      a = a.replace(F, "$1");
      var h, f, m, y, q, s, C = a.match(E);
      f = a.match(ga);
      m = b.nodeType;
      if(D.POS.test(a)) {
        return e(a, b, c, d, C)
      }
      if(d) {
        h = v.call(d, 0)
      }else {
        if(C && 1 === C.length) {
          if(1 < f.length && 9 === m && !k && (C = D.ID.exec(f[0]))) {
            b = J.find.ID(C[1], b, k)[0];
            if(!b) {
              return c
            }
            a = a.slice(f.shift().length)
          }
          d = (C = Z.exec(f[0])) && !C.index && b.parentNode || b;
          s = f.pop();
          y = s.split(":not")[0];
          f = 0;
          for(m = J.order.length;f < m;f++) {
            if(q = J.order[f], C = D[q].exec(y)) {
              if(h = J.find[q]((C[1] || "").replace(O, ""), d, k), null != h) {
                y === s && (a = a.slice(0, a.length - s.length) + y.replace(D[q], ""), a || B.apply(c, v.call(h, 0)));
                break
              }
            }
          }
        }
      }
      if(a) {
        k = ea(a, b, k);
        p = k.dirruns++;
        null == h && (h = J.find.TAG("*", Z.test(a) && b.parentNode || b));
        for(f = 0;a = h[f];f++) {
          g = k.runs++, k(a, b) && c.push(a)
        }
      }
      return c
    };
    l.querySelectorAll && function() {
      var a, b = da, c = /'|\\/g, d = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, e = [], k = [":active"], h = n.matchesSelector || n.mozMatchesSelector || n.webkitMatchesSelector || n.oMatchesSelector || n.msMatchesSelector;
      L(function(a) {
        a.innerHTML = "<select><option selected></option></select>";
        a.querySelectorAll("[selected]").length || e.push("\\[" + t + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
        a.querySelectorAll(":checked").length || e.push(":checked")
      });
      L(function(a) {
        a.innerHTML = "<p test=''></p>";
        a.querySelectorAll("[test^='']").length && e.push("[*^$]=" + t + "*(?:\"\"|'')");
        a.innerHTML = "<input type='hidden'>";
        a.querySelectorAll(":enabled").length || e.push(":enabled", ":disabled")
      });
      e = e.length && RegExp(e.join("|"));
      da = function(a, d, k, h, f) {
        if(!h && !f && (!e || !e.test(a))) {
          if(9 === d.nodeType) {
            try {
              return B.apply(k, v.call(d.querySelectorAll(a), 0)), k
            }catch(m) {
            }
          }else {
            if(1 === d.nodeType && "object" !== d.nodeName.toLowerCase()) {
              var g = d.getAttribute("id"), y = g || H, p = Z.test(a) && d.parentNode || d;
              g ? y = y.replace(c, "\\$&") : d.setAttribute("id", y);
              try {
                return B.apply(k, v.call(p.querySelectorAll(a.replace(E, "[id='" + y + "'] $&")), 0)), k
              }catch(q) {
              }finally {
                g || d.removeAttribute("id")
              }
            }
          }
        }
        return b(a, d, k, h, f)
      };
      h && (L(function(b) {
        a = h.call(b, "div");
        try {
          h.call(b, "[test!='']:sizzle"), k.push(J.match.PSEUDO)
        }catch(c) {
        }
      }), k = RegExp(k.join("|")), G.matchesSelector = function(b, c) {
        c = c.replace(d, "='$1']");
        if(!U(b) && !k.test(c) && (!e || !e.test(c))) {
          try {
            var f = h.call(b, c);
            if(f || a || b.document && 11 !== b.document.nodeType) {
              return f
            }
          }catch(m) {
          }
        }
        return 0 < G(c, null, null, [b]).length
      })
    }();
    G.attr = h.attr;
    h.find = G;
    h.expr = G.selectors;
    h.expr[":"] = h.expr.pseudos;
    h.unique = G.uniqueSort;
    h.text = G.getText;
    h.isXMLDoc = G.isXML;
    h.contains = G.contains
  })(a);
  var Gb = /Until$/, Hb = /^(?:parents|prev(?:Until|All))/, lb = /^.[^:#\[\.,]*$/, Va = h.expr.match.needsContext, Ib = {children:!0, contents:!0, next:!0, prev:!0};
  h.fn.extend({find:function(a) {
    var b, c, d, e, k, f, m = this;
    if("string" != typeof a) {
      return h(a).filter(function() {
        b = 0;
        for(c = m.length;b < c;b++) {
          if(h.contains(m[b], this)) {
            return!0
          }
        }
      })
    }
    f = this.pushStack("", "find", a);
    b = 0;
    for(c = this.length;b < c;b++) {
      if(d = f.length, h.find(a, this[b], f), 0 < b) {
        for(e = d;e < f.length;e++) {
          for(k = 0;k < d;k++) {
            if(f[k] === f[e]) {
              f.splice(e--, 1);
              break
            }
          }
        }
      }
    }
    return f
  }, has:function(a) {
    var b, c = h(a, this), d = c.length;
    return this.filter(function() {
      for(b = 0;b < d;b++) {
        if(h.contains(this, c[b])) {
          return!0
        }
      }
    })
  }, not:function(a) {
    return this.pushStack(w(this, a, !1), "not", a)
  }, filter:function(a) {
    return this.pushStack(w(this, a, !0), "filter", a)
  }, is:function(a) {
    return!!a && ("string" == typeof a ? Va.test(a) ? 0 <= h(a, this.context).index(this[0]) : 0 < h.filter(a, this).length : 0 < this.filter(a).length)
  }, closest:function(a, b) {
    for(var c, d = 0, e = this.length, k = [], f = Va.test(a) || "string" != typeof a ? h(a, b || this.context) : 0;d < e;d++) {
      for(c = this[d];c && c.ownerDocument && c !== b && 11 !== c.nodeType;) {
        if(f ? -1 < f.index(c) : h.find.matchesSelector(c, a)) {
          k.push(c);
          break
        }
        c = c.parentNode
      }
    }
    return k = 1 < k.length ? h.unique(k) : k, this.pushStack(k, "closest", a)
  }, index:function(a) {
    return a ? "string" == typeof a ? h.inArray(this[0], h(a)) : h.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
  }, add:function(a, b) {
    var c = "string" == typeof a ? h(a, b) : h.makeArray(a && a.nodeType ? [a] : a), d = h.merge(this.get(), c);
    return this.pushStack(e(c[0]) || e(d[0]) ? d : h.unique(d))
  }, addBack:function(a) {
    return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
  }});
  h.fn.andSelf = h.fn.addBack;
  h.each({parent:function(a) {
    return(a = a.parentNode) && 11 !== a.nodeType ? a : null
  }, parents:function(a) {
    return h.dir(a, "parentNode")
  }, parentsUntil:function(a, b, c) {
    return h.dir(a, "parentNode", c)
  }, next:function(a) {
    return n(a, "nextSibling")
  }, prev:function(a) {
    return n(a, "previousSibling")
  }, nextAll:function(a) {
    return h.dir(a, "nextSibling")
  }, prevAll:function(a) {
    return h.dir(a, "previousSibling")
  }, nextUntil:function(a, b, c) {
    return h.dir(a, "nextSibling", c)
  }, prevUntil:function(a, b, c) {
    return h.dir(a, "previousSibling", c)
  }, siblings:function(a) {
    return h.sibling((a.parentNode || {}).firstChild, a)
  }, children:function(a) {
    return h.sibling(a.firstChild)
  }, contents:function(a) {
    return h.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : h.merge([], a.childNodes)
  }}, function(a, b) {
    h.fn[a] = function(c, d) {
      var e = h.map(this, b, c);
      return Gb.test(a) || (d = c), d && "string" == typeof d && (e = h.filter(d, e)), e = 1 < this.length && !Ib[a] ? h.unique(e) : e, 1 < this.length && Hb.test(a) && (e = e.reverse()), this.pushStack(e, a, Z.call(arguments).join(","))
    }
  });
  h.extend({filter:function(a, b, c) {
    return c && (a = ":not(" + a + ")"), 1 === b.length ? h.find.matchesSelector(b[0], a) ? [b[0]] : [] : h.find.matches(a, b)
  }, dir:function(a, b, d) {
    var e = [];
    for(a = a[b];a && 9 !== a.nodeType && (d === c || 1 !== a.nodeType || !h(a).is(d));) {
      1 === a.nodeType && e.push(a), a = a[b]
    }
    return e
  }, sibling:function(a, b) {
    for(var c = [];a;a = a.nextSibling) {
      1 === a.nodeType && a !== b && c.push(a)
    }
    return c
  }});
  var Ha = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Jb = / jQuery\d+="(?:null|\d+)"/g, Ba = /^\s+/, Wa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Xa = /<([\w:]+)/, Kb = /<tbody/i, Lb = /<|&#?\w+;/, Mb = /<(?:script|style|link)/i, Nb = /<(?:script|object|embed|option|style)/i, Ca = RegExp("<(?:" + Ha + ")[\\s/>]", "i"), Ia = /^(?:checkbox|radio)$/, 
  Ya = /checked\s*(?:[^=]|=\s*.checked.)/i, Ob = /\/(java|ecma)script/i, Pb = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, U = {option:[1, "<select multiple='multiple'>", "</select>"], legend:[1, "<fieldset>", "</fieldset>"], thead:[1, "<table>", "</table>"], tr:[2, "<table><tbody>", "</tbody></table>"], td:[3, "<table><tbody><tr>", "</tr></tbody></table>"], col:[2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area:[1, "<map>", "</map>"], _default:[0, "", ""]}, Za = v(r), Da = Za.appendChild(r.createElement("div"));
  U.optgroup = U.option;
  U.tbody = U.tfoot = U.colgroup = U.caption = U.thead;
  U.th = U.td;
  h.support.htmlSerialize || (U._default = [1, "X<div>", "</div>"]);
  h.fn.extend({text:function(a) {
    return h.access(this, function(a) {
      return a === c ? h.text(this) : this.empty().append((this[0] && this[0].ownerDocument || r).createTextNode(a))
    }, null, a, arguments.length)
  }, wrapAll:function(a) {
    if(h.isFunction(a)) {
      return this.each(function(b) {
        h(this).wrapAll(a.call(this, b))
      })
    }
    if(this[0]) {
      var b = h(a, this[0].ownerDocument).eq(0).clone(!0);
      this[0].parentNode && b.insertBefore(this[0]);
      b.map(function() {
        for(var a = this;a.firstChild && 1 === a.firstChild.nodeType;) {
          a = a.firstChild
        }
        return a
      }).append(this)
    }
    return this
  }, wrapInner:function(a) {
    return h.isFunction(a) ? this.each(function(b) {
      h(this).wrapInner(a.call(this, b))
    }) : this.each(function() {
      var b = h(this), c = b.contents();
      c.length ? c.wrapAll(a) : b.append(a)
    })
  }, wrap:function(a) {
    var b = h.isFunction(a);
    return this.each(function(c) {
      h(this).wrapAll(b ? a.call(this, c) : a)
    })
  }, unwrap:function() {
    return this.parent().each(function() {
      h.nodeName(this, "body") || h(this).replaceWith(this.childNodes)
    }).end()
  }, append:function() {
    return this.domManip(arguments, !0, function(a) {
      (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(a)
    })
  }, prepend:function() {
    return this.domManip(arguments, !0, function(a) {
      (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(a, this.firstChild)
    })
  }, before:function() {
    if(!e(this[0])) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this)
      })
    }
    if(arguments.length) {
      var a = h.clean(arguments);
      return this.pushStack(h.merge(a, this), "before", this.selector)
    }
  }, after:function() {
    if(!e(this[0])) {
      return this.domManip(arguments, !1, function(a) {
        this.parentNode.insertBefore(a, this.nextSibling)
      })
    }
    if(arguments.length) {
      var a = h.clean(arguments);
      return this.pushStack(h.merge(this, a), "after", this.selector)
    }
  }, remove:function(a, b) {
    for(var c, d = 0;null != (c = this[d]);d++) {
      if(!a || h.filter(a, [c]).length) {
        !b && 1 === c.nodeType && (h.cleanData(c.getElementsByTagName("*")), h.cleanData([c])), c.parentNode && c.parentNode.removeChild(c)
      }
    }
    return this
  }, empty:function() {
    for(var a, b = 0;null != (a = this[b]);b++) {
      for(1 === a.nodeType && h.cleanData(a.getElementsByTagName("*"));a.firstChild;) {
        a.removeChild(a.firstChild)
      }
    }
    return this
  }, clone:function(a, b) {
    return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
      return h.clone(this, a, b)
    })
  }, html:function(a) {
    return h.access(this, function(a) {
      var b = this[0] || {}, d = 0, e = this.length;
      if(a === c) {
        return 1 === b.nodeType ? b.innerHTML.replace(Jb, "") : c
      }
      if("string" == typeof a && !Mb.test(a) && (h.support.htmlSerialize || !Ca.test(a)) && (h.support.leadingWhitespace || !Ba.test(a)) && !U[(Xa.exec(a) || ["", ""])[1].toLowerCase()]) {
        a = a.replace(Wa, "<$1></$2>");
        try {
          for(;d < e;d++) {
            b = this[d] || {}, 1 === b.nodeType && (h.cleanData(b.getElementsByTagName("*")), b.innerHTML = a)
          }
          b = 0
        }catch(k) {
        }
      }
      b && this.empty().append(a)
    }, null, a, arguments.length)
  }, replaceWith:function(a) {
    return e(this[0]) ? this.length ? this.pushStack(h(h.isFunction(a) ? a() : a), "replaceWith", a) : this : h.isFunction(a) ? this.each(function(b) {
      var c = h(this), d = c.html();
      c.replaceWith(a.call(this, b, d))
    }) : ("string" != typeof a && (a = h(a).detach()), this.each(function() {
      var b = this.nextSibling, c = this.parentNode;
      h(this).remove();
      b ? h(b).before(a) : h(c).append(a)
    }))
  }, detach:function(a) {
    return this.remove(a, !0)
  }, domManip:function(a, b, d) {
    a = [].concat.apply([], a);
    var e, k, f, m = 0, g = a[0], p = [], q = this.length;
    if(!h.support.checkClone && 1 < q && "string" == typeof g && Ya.test(g)) {
      return this.each(function() {
        h(this).domManip(a, b, d)
      })
    }
    if(h.isFunction(g)) {
      return this.each(function(e) {
        var k = h(this);
        a[0] = g.call(this, e, b ? k.html() : c);
        k.domManip(a, b, d)
      })
    }
    if(this[0]) {
      e = h.buildFragment(a, this, p);
      f = e.fragment;
      k = f.firstChild;
      1 === f.childNodes.length && (f = k);
      if(k) {
        b = b && h.nodeName(k, "tr");
        for(e = e.cacheable || q - 1;m < q;m++) {
          d.call(b && h.nodeName(this[m], "table") ? this[m].getElementsByTagName("tbody")[0] || this[m].appendChild(this[m].ownerDocument.createElement("tbody")) : this[m], m === e ? f : h.clone(f, !0, !0))
        }
      }
      f = k = null;
      p.length && h.each(p, function(a, b) {
        b.src ? h.ajax ? h.ajax({url:b.src, type:"GET", dataType:"script", async:!1, global:!1, "throws":!0}) : h.error("no ajax") : h.globalEval((b.text || b.textContent || b.innerHTML || "").replace(Pb, ""));
        b.parentNode && b.parentNode.removeChild(b)
      })
    }
    return this
  }});
  h.buildFragment = function(a, b, d) {
    var e, k, f, m = a[0];
    return b = b || r, b = (b[0] || b).ownerDocument || b[0] || b, "undefined" == typeof b.createDocumentFragment && (b = r), 1 === a.length && "string" == typeof m && 512 > m.length && b === r && "<" === m.charAt(0) && !Nb.test(m) && (h.support.checkClone || !Ya.test(m)) && (h.support.html5Clone || !Ca.test(m)) && (k = !0, e = h.fragments[m], f = e !== c), e || (e = b.createDocumentFragment(), h.clean(a, b, e, d), k && (h.fragments[m] = f && e)), {fragment:e, cacheable:k}
  };
  h.fragments = {};
  h.each({appendTo:"append", prependTo:"prepend", insertBefore:"before", insertAfter:"after", replaceAll:"replaceWith"}, function(a, b) {
    h.fn[a] = function(c) {
      var d, e = 0, k = [];
      c = h(c);
      var f = c.length;
      d = 1 === this.length && this[0].parentNode;
      if((null == d || d && 11 === d.nodeType && 1 === d.childNodes.length) && 1 === f) {
        return c[b](this[0]), this
      }
      for(;e < f;e++) {
        d = (0 < e ? this.clone(!0) : this).get(), h(c[e])[b](d), k = k.concat(d)
      }
      return this.pushStack(k, a, c.selector)
    }
  });
  h.extend({clone:function(a, b, c) {
    var d, e, k, f;
    h.support.html5Clone || h.isXMLDoc(a) || !Ca.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (Da.innerHTML = a.outerHTML, Da.removeChild(f = Da.firstChild));
    if((!h.support.noCloneEvent || !h.support.noCloneChecked) && (1 === a.nodeType || 11 === a.nodeType) && !h.isXMLDoc(a)) {
      u(a, f);
      d = x(a);
      e = x(f);
      for(k = 0;d[k];++k) {
        e[k] && u(d[k], e[k])
      }
    }
    if(b && (t(a, f), c)) {
      d = x(a);
      e = x(f);
      for(k = 0;d[k];++k) {
        t(d[k], e[k])
      }
    }
    return f
  }, clean:function(a, b, c, d) {
    var e, k, f, m, g, p, q, s = 0, l = [];
    if(!b || "undefined" == typeof b.createDocumentFragment) {
      b = r
    }
    for(k = b === r && Za;null != (f = a[s]);s++) {
      if("number" == typeof f && (f += ""), f) {
        if("string" == typeof f) {
          if(Lb.test(f)) {
            k = k || v(b);
            p = p || k.appendChild(b.createElement("div"));
            f = f.replace(Wa, "<$1></$2>");
            e = (Xa.exec(f) || ["", ""])[1].toLowerCase();
            m = U[e] || U._default;
            g = m[0];
            for(p.innerHTML = m[1] + f + m[2];g--;) {
              p = p.lastChild
            }
            if(!h.support.tbody) {
              g = Kb.test(f);
              m = "table" === e && !g ? p.firstChild && p.firstChild.childNodes : "<table>" === m[1] && !g ? p.childNodes : [];
              for(e = m.length - 1;0 <= e;--e) {
                h.nodeName(m[e], "tbody") && !m[e].childNodes.length && m[e].parentNode.removeChild(m[e])
              }
            }
            !h.support.leadingWhitespace && Ba.test(f) && p.insertBefore(b.createTextNode(Ba.exec(f)[0]), p.firstChild);
            f = p.childNodes;
            p = k.lastChild
          }else {
            f = b.createTextNode(f)
          }
        }
        f.nodeType ? l.push(f) : l = h.merge(l, f)
      }
    }
    p && (k.removeChild(p), f = p = k = null);
    if(!h.support.appendChecked) {
      for(s = 0;null != (f = l[s]);s++) {
        h.nodeName(f, "input") ? I(f) : "undefined" != typeof f.getElementsByTagName && h.grep(f.getElementsByTagName("input"), I)
      }
    }
    if(c) {
      a = function(a) {
        if(!a.type || Ob.test(a.type)) {
          return d ? d.push(a.parentNode ? a.parentNode.removeChild(a) : a) : c.appendChild(a)
        }
      };
      for(s = 0;null != (f = l[s]);s++) {
        if(!h.nodeName(f, "script") || !a(f)) {
          c.appendChild(f), "undefined" != typeof f.getElementsByTagName && (q = h.grep(h.merge([], f.getElementsByTagName("script")), a), l.splice.apply(l, [s + 1, 0].concat(q)), s += q.length)
        }
      }
    }
    return l
  }, cleanData:function(a, b) {
    for(var c, d, e, k, f = 0, m = h.expando, g = h.cache, p = h.support.deleteExpando, q = h.event.special;null != (e = a[f]);f++) {
      if(b || h.acceptData(e)) {
        if(c = (d = e[m]) && g[d]) {
          if(c.events) {
            for(k in c.events) {
              q[k] ? h.event.remove(e, k) : h.removeEvent(e, k, c.handle)
            }
          }
          g[d] && (delete g[d], p ? delete e[m] : e.removeAttribute ? e.removeAttribute(m) : e[m] = null, h.deletedIds.push(d))
        }
      }
    }
  }});
  (function() {
    var a, b;
    h.uaMatch = function(a) {
      a = a.toLowerCase();
      a = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || 0 > a.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
      return{browser:a[1] || "", version:a[2] || "0"}
    };
    a = h.uaMatch(H.userAgent);
    b = {};
    a.browser && (b[a.browser] = !0, b.version = a.version);
    b.webkit && (b.safari = !0);
    h.browser = b;
    h.sub = function() {
      function a(b, c) {
        return new a.fn.init(b, c)
      }
      h.extend(!0, a, this);
      a.superclass = this;
      a.fn = a.prototype = this();
      a.fn.constructor = a;
      a.sub = this.sub;
      a.fn.init = function(c, d) {
        return d && d instanceof h && !(d instanceof a) && (d = a(d)), h.fn.init.call(this, c, d, b)
      };
      a.fn.init.prototype = a.fn;
      var b = a(r);
      return a
    }
  })();
  var X, ka, la, Ea = /alpha\([^)]*\)/i, Qb = /opacity=([^)]*)/, Rb = /^(top|right|bottom|left)$/, $a = /^margin/, nb = RegExp("^(" + oa + ")(.*)$", "i"), ra = RegExp("^(" + oa + ")(?!px)[a-z%]+$", "i"), Sb = RegExp("^([-+])=(" + oa + ")", "i"), xa = {}, Tb = {position:"absolute", visibility:"hidden", display:"block"}, ab = {letterSpacing:0, fontWeight:400, lineHeight:1}, da = ["Top", "Right", "Bottom", "Left"], Ja = ["Webkit", "O", "Moz", "ms"], Ub = h.fn.toggle;
  h.fn.extend({css:function(a, b) {
    return h.access(this, function(a, b, d) {
      return d !== c ? h.style(a, b, d) : h.css(a, b)
    }, a, b, 1 < arguments.length)
  }, show:function() {
    return E(this, !0)
  }, hide:function() {
    return E(this)
  }, toggle:function(a, b) {
    var c = "boolean" == typeof a;
    return h.isFunction(a) && h.isFunction(b) ? Ub.apply(this, arguments) : this.each(function() {
      (c ? a : A(this)) ? h(this).show() : h(this).hide()
    })
  }});
  h.extend({cssHooks:{opacity:{get:function(a, b) {
    if(b) {
      var c = X(a, "opacity");
      return"" === c ? "1" : c
    }
  }}}, cssNumber:{fillOpacity:!0, fontWeight:!0, lineHeight:!0, opacity:!0, orphans:!0, widows:!0, zIndex:!0, zoom:!0}, cssProps:{"float":h.support.cssFloat ? "cssFloat" : "styleFloat"}, style:function(a, b, d, e) {
    if(a && !(3 === a.nodeType || 8 === a.nodeType || !a.style)) {
      var k, f, m, g = h.camelCase(b), p = a.style;
      b = h.cssProps[g] || (h.cssProps[g] = B(p, g));
      m = h.cssHooks[b] || h.cssHooks[g];
      if(d === c) {
        return m && "get" in m && (k = m.get(a, !1, e)) !== c ? k : p[b]
      }
      f = typeof d;
      "string" === f && (k = Sb.exec(d)) && (d = (k[1] + 1) * k[2] + parseFloat(h.css(a, b)), f = "number");
      if(!(null == d || "number" === f && isNaN(d))) {
        if("number" === f && !h.cssNumber[g] && (d += "px"), !m || !("set" in m) || (d = m.set(a, d, e)) !== c) {
          try {
            p[b] = d
          }catch(q) {
          }
        }
      }
    }
  }, css:function(a, b, d, e) {
    var k, f, m, g = h.camelCase(b);
    return b = h.cssProps[g] || (h.cssProps[g] = B(a.style, g)), m = h.cssHooks[b] || h.cssHooks[g], m && "get" in m && (k = m.get(a, !0, e)), k === c && (k = X(a, b)), "normal" === k && b in ab && (k = ab[b]), d || e !== c ? (f = parseFloat(k), d || h.isNumeric(f) ? f || 0 : k) : k
  }, swap:function(a, b, c) {
    var d, e = {};
    for(d in b) {
      e[d] = a.style[d], a.style[d] = b[d]
    }
    c = c.call(a);
    for(d in b) {
      a.style[d] = e[d]
    }
    return c
  }});
  a.getComputedStyle ? X = function(a, b) {
    var c, d, e, k, f = getComputedStyle(a, null), m = a.style;
    return f && (c = f[b], "" === c && !h.contains(a.ownerDocument.documentElement, a) && (c = h.style(a, b)), ra.test(c) && $a.test(b) && (d = m.width, e = m.minWidth, k = m.maxWidth, m.minWidth = m.maxWidth = m.width = c, c = f.width, m.width = d, m.minWidth = e, m.maxWidth = k)), c
  } : r.documentElement.currentStyle && (X = function(a, b) {
    var c, d, e = a.currentStyle && a.currentStyle[b], k = a.style;
    return null == e && k && k[b] && (e = k[b]), ra.test(e) && !Rb.test(b) && (c = k.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), k.left = "fontSize" === b ? "1em" : e, e = k.pixelLeft + "px", k.left = c, d && (a.runtimeStyle.left = d)), "" === e ? "auto" : e
  });
  h.each(["height", "width"], function(a, b) {
    h.cssHooks[b] = {get:function(a, c, d) {
      if(c) {
        return 0 !== a.offsetWidth || "none" !== X(a, "display") ? R(a, b, d) : h.swap(a, Tb, function() {
          return R(a, b, d)
        })
      }
    }, set:function(a, c, d) {
      return F(a, c, d ? z(a, b, d, h.support.boxSizing && "border-box" === h.css(a, "boxSizing")) : 0)
    }}
  });
  h.support.opacity || (h.cssHooks.opacity = {get:function(a, b) {
    return Qb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
  }, set:function(a, b) {
    var c = a.style, d = a.currentStyle, e = h.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", k = d && d.filter || c.filter || "";
    c.zoom = 1;
    if(1 <= b && ("" === h.trim(k.replace(Ea, "")) && c.removeAttribute) && (c.removeAttribute("filter"), d && !d.filter)) {
      return
    }
    c.filter = Ea.test(k) ? k.replace(Ea, e) : k + " " + e
  }});
  h(function() {
    h.support.reliableMarginRight || (h.cssHooks.marginRight = {get:function(a, b) {
      return h.swap(a, {display:"inline-block"}, function() {
        if(b) {
          return X(a, "marginRight")
        }
      })
    }});
    !h.support.pixelPosition && h.fn.position && h.each(["top", "left"], function(a, b) {
      h.cssHooks[b] = {get:function(a, c) {
        if(c) {
          var d = X(a, b);
          return ra.test(d) ? h(a).position()[b] + "px" : d
        }
      }}
    })
  });
  h.expr && h.expr.filters && (h.expr.filters.hidden = function(a) {
    return 0 === a.offsetWidth && 0 === a.offsetHeight || !h.support.reliableHiddenOffsets && "none" === (a.style && a.style.display || X(a, "display"))
  }, h.expr.filters.visible = function(a) {
    return!h.expr.filters.hidden(a)
  });
  h.each({margin:"", padding:"", border:"Width"}, function(a, b) {
    h.cssHooks[a + b] = {expand:function(c) {
      var d = "string" == typeof c ? c.split(" ") : [c], e = {};
      for(c = 0;4 > c;c++) {
        e[a + da[c] + b] = d[c] || d[c - 2] || d[0]
      }
      return e
    }};
    $a.test(a) || (h.cssHooks[a + b].set = F)
  });
  var Vb = /%20/g, ob = /\[\]$/, bb = /\r?\n/g, Wb = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, Xb = /^(?:select|textarea)/i;
  h.fn.extend({serialize:function() {
    return h.param(this.serializeArray())
  }, serializeArray:function() {
    return this.map(function() {
      return this.elements ? h.makeArray(this.elements) : this
    }).filter(function() {
      return this.name && !this.disabled && (this.checked || Xb.test(this.nodeName) || Wb.test(this.type))
    }).map(function(a, b) {
      var c = h(this).val();
      return null == c ? null : h.isArray(c) ? h.map(c, function(a, c) {
        return{name:b.name, value:a.replace(bb, "\r\n")}
      }) : {name:b.name, value:c.replace(bb, "\r\n")}
    }).get()
  }});
  h.param = function(a, b) {
    var d, e = [], k = function(a, b) {
      b = h.isFunction(b) ? b() : null == b ? "" : b;
      e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
    };
    b === c && (b = h.ajaxSettings && h.ajaxSettings.traditional);
    if(h.isArray(a) || a.jquery && !h.isPlainObject(a)) {
      h.each(a, function() {
        k(this.name, this.value)
      })
    }else {
      for(d in a) {
        P(d, a[d], b, k)
      }
    }
    return e.join("&").replace(Vb, "+")
  };
  var ha, ia, Yb = /#.*$/, Zb = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, $b = /^(?:GET|HEAD)$/, ac = /^\/\//, cb = /\?/, bc = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, cc = /([?&])_=[^&]*/, db = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, eb = h.fn.load, ya = {}, fb = {}, gb = ["*/"] + ["*"];
  try {
    ha = N.href
  }catch(jc) {
    ha = r.createElement("a"), ha.href = "", ha = ha.href
  }
  ia = db.exec(ha.toLowerCase()) || [];
  h.fn.load = function(a, b, d) {
    if("string" != typeof a && eb) {
      return eb.apply(this, arguments)
    }
    if(!this.length) {
      return this
    }
    var e, k, f, m = this, g = a.indexOf(" ");
    return 0 <= g && (e = a.slice(g, a.length), a = a.slice(0, g)), h.isFunction(b) ? (d = b, b = c) : "object" == typeof b && (k = "POST"), h.ajax({url:a, type:k, dataType:"html", data:b, complete:function(a, b) {
      d && m.each(d, f || [a.responseText, b, a])
    }}).done(function(a) {
      f = arguments;
      m.html(e ? h("<div>").append(a.replace(bc, "")).find(e) : a)
    }), this
  };
  h.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
    h.fn[b] = function(a) {
      return this.on(b, a)
    }
  });
  h.each(["get", "post"], function(a, b) {
    h[b] = function(a, d, e, k) {
      return h.isFunction(d) && (k = k || e, e = d, d = c), h.ajax({type:b, url:a, data:d, success:e, dataType:k})
    }
  });
  h.extend({getScript:function(a, b) {
    return h.get(a, c, b, "script")
  }, getJSON:function(a, b, c) {
    return h.get(a, b, c, "json")
  }, ajaxSetup:function(a, b) {
    return b ? L(a, h.ajaxSettings) : (b = a, a = h.ajaxSettings), L(a, b), a
  }, ajaxSettings:{url:ha, isLocal:/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test(ia[1]), global:!0, type:"GET", contentType:"application/x-www-form-urlencoded; charset=UTF-8", processData:!0, async:!0, accepts:{xml:"application/xml, text/xml", html:"text/html", text:"text/plain", json:"application/json, text/javascript", "*":gb}, contents:{xml:/xml/, html:/html/, json:/json/}, responseFields:{xml:"responseXML", text:"responseText"}, converters:{"* text":a.String, "text html":!0, 
  "text json":h.parseJSON, "text xml":h.parseXML}, flatOptions:{context:!0, url:!0}}, ajaxPrefilter:V(ya), ajaxTransport:V(fb), ajax:function(a, b) {
    function d(a, b, f, p) {
      var s, y, C, v, t, H = b;
      if(2 !== B) {
        B = 2;
        g && clearTimeout(g);
        m = c;
        k = p || "";
        u.readyState = 0 < a ? 4 : 0;
        if(f) {
          v = r;
          p = u;
          var K, T, A, fa, F = v.contents, ca = v.dataTypes, E = v.responseFields;
          for(T in E) {
            T in f && (p[E[T]] = f[T])
          }
          for(;"*" === ca[0];) {
            ca.shift(), K === c && (K = v.mimeType || p.getResponseHeader("content-type"))
          }
          if(K) {
            for(T in F) {
              if(F[T] && F[T].test(K)) {
                ca.unshift(T);
                break
              }
            }
          }
          if(ca[0] in f) {
            A = ca[0]
          }else {
            for(T in f) {
              if(!ca[0] || v.converters[T + " " + ca[0]]) {
                A = T;
                break
              }
              fa || (fa = T)
            }
            A = A || fa
          }
          f = A ? (A !== ca[0] && ca.unshift(A), f[A]) : void 0;
          v = f
        }
        if(200 <= a && 300 > a || 304 === a) {
          if(r.ifModified && (t = u.getResponseHeader("Last-Modified"), t && (h.lastModified[e] = t), t = u.getResponseHeader("Etag"), t && (h.etag[e] = t)), 304 === a) {
            H = "notmodified", s = !0
          }else {
            var x;
            a: {
              s = r;
              y = v;
              var ga, H = s.dataTypes.slice();
              f = H[0];
              K = {};
              T = 0;
              s.dataFilter && (y = s.dataFilter(y, s.dataType));
              if(H[1]) {
                for(x in s.converters) {
                  K[x.toLowerCase()] = s.converters[x]
                }
              }
              for(;C = H[++T];) {
                if("*" !== C) {
                  if("*" !== f && f !== C) {
                    x = K[f + " " + C] || K["* " + C];
                    if(!x) {
                      for(ga in K) {
                        if(t = ga.split(" "), t[1] === C && (x = K[f + " " + t[0]] || K["* " + t[0]])) {
                          !0 === x ? x = K[ga] : !0 !== K[ga] && (C = t[0], H.splice(T--, 0, C));
                          break
                        }
                      }
                    }
                    if(!0 !== x) {
                      if(x && s["throws"]) {
                        y = x(y)
                      }else {
                        try {
                          y = x(y)
                        }catch(Z) {
                          x = {state:"parsererror", error:x ? Z : "No conversion from " + f + " to " + C};
                          break a
                        }
                      }
                    }
                  }
                  f = C
                }
              }
              x = {state:"success", data:y}
            }
            s = x;
            H = s.state;
            y = s.data;
            C = s.error;
            s = !C
          }
        }else {
          if(C = H, !H || a) {
            H = "error", 0 > a && (a = 0)
          }
        }
        u.status = a;
        u.statusText = "" + (b || H);
        s ? N.resolveWith(l, [y, H, u]) : N.rejectWith(l, [u, H, C]);
        u.statusCode(I);
        I = c;
        q && n.trigger("ajax" + (s ? "Success" : "Error"), [u, r, s ? y : C]);
        w.fireWith(l, [u, H]);
        q && (n.trigger("ajaxComplete", [u, r]), --h.active || h.event.trigger("ajaxStop"))
      }
    }
    "object" == typeof a && (b = a, a = c);
    b = b || {};
    var e, k, f, m, g, p, q, s, r = h.ajaxSetup({}, b), l = r.context || r, n = l !== r && (l.nodeType || l instanceof h) ? h(l) : h.event, N = h.Deferred(), w = h.Callbacks("once memory"), I = r.statusCode || {}, v = {}, t = {}, B = 0, H = "canceled", u = {readyState:0, setRequestHeader:function(a, b) {
      if(!B) {
        var c = a.toLowerCase();
        a = t[c] = t[c] || a;
        v[a] = b
      }
      return this
    }, getAllResponseHeaders:function() {
      return 2 === B ? k : null
    }, getResponseHeader:function(a) {
      var b;
      if(2 === B) {
        if(!f) {
          for(f = {};b = Zb.exec(k);) {
            f[b[1].toLowerCase()] = b[2]
          }
        }
        b = f[a.toLowerCase()]
      }
      return b === c ? null : b
    }, overrideMimeType:function(a) {
      return B || (r.mimeType = a), this
    }, abort:function(a) {
      return a = a || H, m && m.abort(a), d(0, a), this
    }};
    N.promise(u);
    u.success = u.done;
    u.error = u.fail;
    u.complete = w.add;
    u.statusCode = function(a) {
      if(a) {
        var b;
        if(2 > B) {
          for(b in a) {
            I[b] = [I[b], a[b]]
          }
        }else {
          b = a[u.status], u.always(b)
        }
      }
      return this
    };
    r.url = ((a || r.url) + "").replace(Yb, "").replace(ac, ia[1] + "//");
    r.dataTypes = h.trim(r.dataType || "*").toLowerCase().split(ea);
    null == r.crossDomain && (p = db.exec(r.url.toLowerCase()), r.crossDomain = !(!p || p[1] == ia[1] && p[2] == ia[2] && (p[3] || ("http:" === p[1] ? 80 : 443)) == (ia[3] || ("http:" === ia[1] ? 80 : 443))));
    r.data && r.processData && "string" != typeof r.data && (r.data = h.param(r.data, r.traditional));
    D(ya, r, b, u);
    if(2 === B) {
      return u
    }
    q = r.global;
    r.type = r.type.toUpperCase();
    r.hasContent = !$b.test(r.type);
    q && 0 === h.active++ && h.event.trigger("ajaxStart");
    if(!r.hasContent && (r.data && (r.url += (cb.test(r.url) ? "&" : "?") + r.data, delete r.data), e = r.url, !1 === r.cache)) {
      p = h.now();
      var K = r.url.replace(cc, "$1_=" + p);
      r.url = K + (K === r.url ? (cb.test(r.url) ? "&" : "?") + "_=" + p : "")
    }
    (r.data && r.hasContent && !1 !== r.contentType || b.contentType) && u.setRequestHeader("Content-Type", r.contentType);
    r.ifModified && (e = e || r.url, h.lastModified[e] && u.setRequestHeader("If-Modified-Since", h.lastModified[e]), h.etag[e] && u.setRequestHeader("If-None-Match", h.etag[e]));
    u.setRequestHeader("Accept", r.dataTypes[0] && r.accepts[r.dataTypes[0]] ? r.accepts[r.dataTypes[0]] + ("*" !== r.dataTypes[0] ? ", " + gb + "; q=0.01" : "") : r.accepts["*"]);
    for(s in r.headers) {
      u.setRequestHeader(s, r.headers[s])
    }
    if(!r.beforeSend || !1 !== r.beforeSend.call(l, u, r) && 2 !== B) {
      H = "abort";
      for(s in{success:1, error:1, complete:1}) {
        u[s](r[s])
      }
      if(m = D(fb, r, b, u)) {
        u.readyState = 1;
        q && n.trigger("ajaxSend", [u, r]);
        r.async && 0 < r.timeout && (g = setTimeout(function() {
          u.abort("timeout")
        }, r.timeout));
        try {
          B = 1, m.send(v, d)
        }catch(A) {
          if(2 > B) {
            d(-1, A)
          }else {
            throw A;
          }
        }
      }else {
        d(-1, "No Transport")
      }
      return u
    }
    return u.abort()
  }, active:0, lastModified:{}, etag:{}});
  var hb = [], dc = /\?/, va = /(=)\?(?=&|$)|\?\?/, ec = h.now();
  h.ajaxSetup({jsonp:"callback", jsonpCallback:function() {
    var a = hb.pop() || h.expando + "_" + ec++;
    return this[a] = !0, a
  }});
  h.ajaxPrefilter("json jsonp", function(b, d, e) {
    var k, f, m, g = b.data, p = b.url, q = !1 !== b.jsonp, s = q && va.test(p), r = q && !s && "string" == typeof g && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && va.test(g);
    if("jsonp" === b.dataTypes[0] || s || r) {
      return k = b.jsonpCallback = h.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, f = a[k], s ? b.url = p.replace(va, "$1" + k) : r ? b.data = g.replace(va, "$1" + k) : q && (b.url += (dc.test(p) ? "&" : "?") + b.jsonp + "=" + k), b.converters["script json"] = function() {
        return m || h.error(k + " was not called"), m[0]
      }, b.dataTypes[0] = "json", a[k] = function() {
        m = arguments
      }, e.always(function() {
        a[k] = f;
        b[k] && (b.jsonpCallback = d.jsonpCallback, hb.push(k));
        m && h.isFunction(f) && f(m[0]);
        m = f = c
      }), "script"
    }
  });
  h.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents:{script:/javascript|ecmascript/}, converters:{"text script":function(a) {
    return h.globalEval(a), a
  }}});
  h.ajaxPrefilter("script", function(a) {
    a.cache === c && (a.cache = !1);
    a.crossDomain && (a.type = "GET", a.global = !1)
  });
  h.ajaxTransport("script", function(a) {
    if(a.crossDomain) {
      var b, d = r.head || r.getElementsByTagName("head")[0] || r.documentElement;
      return{send:function(e, k) {
        b = r.createElement("script");
        b.async = "async";
        a.scriptCharset && (b.charset = a.scriptCharset);
        b.src = a.url;
        b.onload = b.onreadystatechange = function(a, e) {
          if(e || !b.readyState || /loaded|complete/.test(b.readyState)) {
            b.onload = b.onreadystatechange = null, d && b.parentNode && d.removeChild(b), b = c, e || k(200, "success")
          }
        };
        d.insertBefore(b, d.firstChild)
      }, abort:function() {
        b && b.onload(0, 1)
      }}
    }
  });
  var pa, Fa = a.ActiveXObject ? function() {
    for(var a in pa) {
      pa[a](0, 1)
    }
  } : !1, fc = 0;
  h.ajaxSettings.xhr = a.ActiveXObject ? function() {
    var b;
    if(!(b = !this.isLocal && Y())) {
      a: {
        try {
          b = new a.ActiveXObject("Microsoft.XMLHTTP");
          break a
        }catch(c) {
        }
        b = void 0
      }
    }
    return b
  } : Y;
  (function(a) {
    h.extend(h.support, {ajax:!!a, cors:!!a && "withCredentials" in a})
  })(h.ajaxSettings.xhr());
  h.support.ajax && h.ajaxTransport(function(b) {
    if(!b.crossDomain || h.support.cors) {
      var d;
      return{send:function(e, k) {
        var f, m, g = b.xhr();
        b.username ? g.open(b.type, b.url, b.async, b.username, b.password) : g.open(b.type, b.url, b.async);
        if(b.xhrFields) {
          for(m in b.xhrFields) {
            g[m] = b.xhrFields[m]
          }
        }
        b.mimeType && g.overrideMimeType && g.overrideMimeType(b.mimeType);
        !b.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
        try {
          for(m in e) {
            g.setRequestHeader(m, e[m])
          }
        }catch(p) {
        }
        g.send(b.hasContent && b.data || null);
        d = function(a, e) {
          var m, p, q, s, r;
          try {
            if(d && (e || 4 === g.readyState)) {
              if(d = c, f && (g.onreadystatechange = h.noop, Fa && delete pa[f]), e) {
                4 !== g.readyState && g.abort()
              }else {
                m = g.status;
                q = g.getAllResponseHeaders();
                s = {};
                (r = g.responseXML) && r.documentElement && (s.xml = r);
                try {
                  s.text = g.responseText
                }catch(l) {
                }
                try {
                  p = g.statusText
                }catch(n) {
                  p = ""
                }
                !m && b.isLocal && !b.crossDomain ? m = s.text ? 200 : 404 : 1223 === m && (m = 204)
              }
            }
          }catch(N) {
            e || k(-1, N)
          }
          s && k(m, p, s, q)
        };
        b.async ? 4 === g.readyState ? setTimeout(d, 0) : (f = ++fc, Fa && (pa || (pa = {}, h(a).unload(Fa)), pa[f] = d), g.onreadystatechange = d) : d()
      }, abort:function() {
        d && d(0, 1)
      }}
    }
  });
  var sa, wa, gc = /^(?:toggle|show|hide)$/, hc = RegExp("^(?:([-+])=|)(" + oa + ")([a-z%]*)$", "i"), ic = /queueHooks$/, ta = [function(a, b, c) {
    var d, e, k, f, m, g, p = this, q = a.style, s = {}, r = [], l = a.nodeType && A(a);
    c.queue || (m = h._queueHooks(a, "fx"), null == m.unqueued && (m.unqueued = 0, g = m.empty.fire, m.empty.fire = function() {
      m.unqueued || g()
    }), m.unqueued++, p.always(function() {
      p.always(function() {
        m.unqueued--;
        h.queue(a, "fx").length || m.empty.fire()
      })
    }));
    1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [q.overflow, q.overflowX, q.overflowY], "inline" === h.css(a, "display") && "none" === h.css(a, "float") && (!h.support.inlineBlockNeedsLayout || "inline" === O(a.nodeName) ? q.display = "inline-block" : q.zoom = 1));
    c.overflow && (q.overflow = "hidden", h.support.shrinkWrapBlocks || p.done(function() {
      q.overflow = c.overflow[0];
      q.overflowX = c.overflow[1];
      q.overflowY = c.overflow[2]
    }));
    for(d in b) {
      e = b[d], gc.exec(e) && (delete b[d], e !== (l ? "hide" : "show") && r.push(d))
    }
    if(e = r.length) {
      k = h._data(a, "fxshow") || h._data(a, "fxshow", {});
      l ? h(a).show() : p.done(function() {
        h(a).hide()
      });
      p.done(function() {
        var b;
        h.removeData(a, "fxshow", !0);
        for(b in s) {
          h.style(a, b, s[b])
        }
      });
      for(d = 0;d < e;d++) {
        b = r[d], f = p.createTween(b, l ? k[b] : 0), s[b] = k[b] || h.style(a, b), b in k || (k[b] = f.start, l && (f.end = f.start, f.start = "width" === b || "height" === b ? 1 : 0))
      }
    }
  }], qa = {"*":[function(a, b) {
    var c, d, e, k = this.createTween(a, b), f = hc.exec(b), m = k.cur(), g = +m || 0, p = 1;
    if(f) {
      c = +f[2];
      d = f[3] || (h.cssNumber[a] ? "" : "px");
      if("px" !== d && g) {
        g = h.css(k.elem, a, !0) || c || 1;
        do {
          e = p = p || ".5", g /= p, h.style(k.elem, a, g + d), p = k.cur() / m
        }while(1 !== p && p !== e)
      }
      k.unit = d;
      k.start = g;
      k.end = f[1] ? g + (f[1] + 1) * c : c
    }
    return k
  }]};
  h.Animation = h.extend(M, {tweener:function(a, b) {
    h.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
    for(var c, d = 0, e = a.length;d < e;d++) {
      c = a[d], qa[c] = qa[c] || [], qa[c].unshift(b)
    }
  }, prefilter:function(a, b) {
    b ? ta.unshift(a) : ta.push(a)
  }});
  h.Tween = q;
  q.prototype = {constructor:q, init:function(a, b, c, d, e, k) {
    this.elem = a;
    this.prop = c;
    this.easing = e || "swing";
    this.options = b;
    this.start = this.now = this.cur();
    this.end = d;
    this.unit = k || (h.cssNumber[c] ? "" : "px")
  }, cur:function() {
    var a = q.propHooks[this.prop];
    return a && a.get ? a.get(this) : q.propHooks._default.get(this)
  }, run:function(a) {
    var b, c = q.propHooks[this.prop];
    return this.pos = b = h.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration), this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : q.propHooks._default.set(this), this
  }};
  q.prototype.init.prototype = q.prototype;
  q.propHooks = {_default:{get:function(a) {
    var b;
    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = h.css(a.elem, a.prop, !1, ""), !b || "auto" === b ? 0 : b) : a.elem[a.prop]
  }, set:function(a) {
    h.fx.step[a.prop] ? h.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[h.cssProps[a.prop]] || h.cssHooks[a.prop]) ? h.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
  }}};
  q.propHooks.scrollTop = q.propHooks.scrollLeft = {set:function(a) {
    a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
  }};
  h.each(["toggle", "show", "hide"], function(a, b) {
    var c = h.fn[b];
    h.fn[b] = function(d, e, f) {
      return null == d || "boolean" == typeof d || !a && h.isFunction(d) && h.isFunction(e) ? c.apply(this, arguments) : this.animate(k(b, !0), d, e, f)
    }
  });
  h.fn.extend({fadeTo:function(a, b, c, d) {
    return this.filter(A).css("opacity", 0).show().end().animate({opacity:b}, a, c, d)
  }, animate:function(a, b, c, d) {
    var e = h.isEmptyObject(a), k = h.speed(b, c, d);
    b = function() {
      var b = M(this, h.extend({}, a), k);
      e && b.stop(!0)
    };
    return e || !1 === k.queue ? this.each(b) : this.queue(k.queue, b)
  }, stop:function(a, b, d) {
    var e = function(a) {
      var b = a.stop;
      delete a.stop;
      b(d)
    };
    return"string" != typeof a && (d = b, b = a, a = c), b && !1 !== a && this.queue(a || "fx", []), this.each(function() {
      var b = !0, c = null != a && a + "queueHooks", k = h.timers, f = h._data(this);
      if(c) {
        f[c] && f[c].stop && e(f[c])
      }else {
        for(c in f) {
          f[c] && f[c].stop && ic.test(c) && e(f[c])
        }
      }
      for(c = k.length;c--;) {
        k[c].elem === this && (null == a || k[c].queue === a) && (k[c].anim.stop(d), b = !1, k.splice(c, 1))
      }
      (b || !d) && h.dequeue(this, a)
    })
  }});
  h.each({slideDown:k("show"), slideUp:k("hide"), slideToggle:k("toggle"), fadeIn:{opacity:"show"}, fadeOut:{opacity:"hide"}, fadeToggle:{opacity:"toggle"}}, function(a, b) {
    h.fn[a] = function(a, c, d) {
      return this.animate(b, a, c, d)
    }
  });
  h.speed = function(a, b, c) {
    var d = a && "object" == typeof a ? h.extend({}, a) : {complete:c || !c && b || h.isFunction(a) && a, duration:a, easing:c && b || b && !h.isFunction(b) && b};
    d.duration = h.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in h.fx.speeds ? h.fx.speeds[d.duration] : h.fx.speeds._default;
    if(null == d.queue || !0 === d.queue) {
      d.queue = "fx"
    }
    return d.old = d.complete, d.complete = function() {
      h.isFunction(d.old) && d.old.call(this);
      d.queue && h.dequeue(this, d.queue)
    }, d
  };
  h.easing = {linear:function(a) {
    return a
  }, swing:function(a) {
    return 0.5 - Math.cos(a * Math.PI) / 2
  }};
  h.timers = [];
  h.fx = q.prototype.init;
  h.fx.tick = function() {
    for(var a, b = h.timers, c = 0;c < b.length;c++) {
      a = b[c], !a() && b[c] === a && b.splice(c--, 1)
    }
    b.length || h.fx.stop()
  };
  h.fx.timer = function(a) {
    a() && h.timers.push(a) && !wa && (wa = setInterval(h.fx.tick, h.fx.interval))
  };
  h.fx.interval = 13;
  h.fx.stop = function() {
    clearInterval(wa);
    wa = null
  };
  h.fx.speeds = {slow:600, fast:200, _default:400};
  h.fx.step = {};
  h.expr && h.expr.filters && (h.expr.filters.animated = function(a) {
    return h.grep(h.timers, function(b) {
      return a === b.elem
    }).length
  });
  var ib = /^(?:body|html)$/i;
  h.fn.offset = function(a) {
    if(arguments.length) {
      return a === c ? this : this.each(function(b) {
        h.offset.setOffset(this, a, b)
      })
    }
    var b, d, e, k, f, g, p, q, s, r, l = this[0], n = l && l.ownerDocument;
    if(n) {
      return(e = n.body) === l ? h.offset.bodyOffset(l) : (d = n.documentElement, h.contains(d, l) ? (b = l.getBoundingClientRect(), k = m(n), f = d.clientTop || e.clientTop || 0, g = d.clientLeft || e.clientLeft || 0, p = k.pageYOffset || d.scrollTop, q = k.pageXOffset || d.scrollLeft, s = b.top + p - f, r = b.left + q - g, {top:s, left:r}) : {top:0, left:0})
    }
  };
  h.offset = {bodyOffset:function(a) {
    var b = a.offsetTop, c = a.offsetLeft;
    return h.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(h.css(a, "marginTop")) || 0, c += parseFloat(h.css(a, "marginLeft")) || 0), {top:b, left:c}
  }, setOffset:function(a, b, c) {
    var d = h.css(a, "position");
    "static" === d && (a.style.position = "relative");
    var e = h(a), k = e.offset(), f = h.css(a, "top"), m = h.css(a, "left"), g = {}, p = {}, q, s;
    ("absolute" === d || "fixed" === d) && -1 < h.inArray("auto", [f, m]) ? (p = e.position(), q = p.top, s = p.left) : (q = parseFloat(f) || 0, s = parseFloat(m) || 0);
    h.isFunction(b) && (b = b.call(a, c, k));
    null != b.top && (g.top = b.top - k.top + q);
    null != b.left && (g.left = b.left - k.left + s);
    "using" in b ? b.using.call(a, g) : e.css(g)
  }};
  h.fn.extend({position:function() {
    if(this[0]) {
      var a = this[0], b = this.offsetParent(), c = this.offset(), d = ib.test(b[0].nodeName) ? {top:0, left:0} : b.offset();
      return c.top -= parseFloat(h.css(a, "marginTop")) || 0, c.left -= parseFloat(h.css(a, "marginLeft")) || 0, d.top += parseFloat(h.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(h.css(b[0], "borderLeftWidth")) || 0, {top:c.top - d.top, left:c.left - d.left}
    }
  }, offsetParent:function() {
    return this.map(function() {
      for(var a = this.offsetParent || r.body;a && !ib.test(a.nodeName) && "static" === h.css(a, "position");) {
        a = a.offsetParent
      }
      return a || r.body
    })
  }});
  h.each({scrollLeft:"pageXOffset", scrollTop:"pageYOffset"}, function(a, b) {
    var d = /Y/.test(b);
    h.fn[a] = function(e) {
      return h.access(this, function(a, e, k) {
        var f = m(a);
        if(k === c) {
          return f ? b in f ? f[b] : f.document.documentElement[e] : a[e]
        }
        f ? f.scrollTo(d ? h(f).scrollLeft() : k, d ? k : h(f).scrollTop()) : a[e] = k
      }, a, e, arguments.length, null)
    }
  });
  h.each({Height:"height", Width:"width"}, function(a, b) {
    h.each({padding:"inner" + a, content:b, "":"outer" + a}, function(d, e) {
      h.fn[e] = function(e, k) {
        var f = arguments.length && (d || "boolean" != typeof e), m = d || (!0 === e || !0 === k ? "margin" : "border");
        return h.access(this, function(b, d, e) {
          var k;
          return h.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (k = b.documentElement, Math.max(b.body["scroll" + a], k["scroll" + a], b.body["offset" + a], k["offset" + a], k["client" + a])) : e === c ? h.css(b, d, e, m) : h.style(b, d, e, m)
        }, b, f ? e : c, f)
      }
    })
  });
  a.jQuery = a.$ = h;
  "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
    return h
  })
})(window);
(function(a, c) {
  function f(b, c) {
    var d, f, l, t = b.nodeName.toLowerCase();
    return"area" === t ? (d = b.parentNode, f = d.name, b.href && f && "map" === d.nodeName.toLowerCase() ? (l = a("img[usemap=#" + f + "]")[0], !!l && g(l)) : !1) : (/input|select|textarea|button|object/.test(t) ? !b.disabled : "a" === t ? b.href || c : c) && g(b)
  }
  function g(b) {
    return a.expr.filters.visible(b) && !a(b).parents().addBack().filter(function() {
      return"hidden" === a.css(this, "visibility")
    }).length
  }
  var l = 0, d = /^ui-id-\d+$/;
  a.ui = a.ui || {};
  a.extend(a.ui, {version:"1.10.2", keyCode:{BACKSPACE:8, COMMA:188, DELETE:46, DOWN:40, END:35, ENTER:13, ESCAPE:27, HOME:36, LEFT:37, NUMPAD_ADD:107, NUMPAD_DECIMAL:110, NUMPAD_DIVIDE:111, NUMPAD_ENTER:108, NUMPAD_MULTIPLY:106, NUMPAD_SUBTRACT:109, PAGE_DOWN:34, PAGE_UP:33, PERIOD:190, RIGHT:39, SPACE:32, TAB:9, UP:38}});
  a.fn.extend({focus:function(b) {
    return function(c, d) {
      return"number" == typeof c ? this.each(function() {
        var b = this;
        setTimeout(function() {
          a(b).focus();
          d && d.call(b)
        }, c)
      }) : b.apply(this, arguments)
    }
  }(a.fn.focus), scrollParent:function() {
    var b;
    return b = a.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
      return/(relative|absolute|fixed)/.test(a.css(this, "position")) && /(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
    }).eq(0) : this.parents().filter(function() {
      return/(auto|scroll)/.test(a.css(this, "overflow") + a.css(this, "overflow-y") + a.css(this, "overflow-x"))
    }).eq(0), /fixed/.test(this.css("position")) || !b.length ? a(document) : b
  }, zIndex:function(b) {
    if(b !== c) {
      return this.css("zIndex", b)
    }
    if(this.length) {
      var d, f;
      for(b = a(this[0]);b.length && b[0] !== document;) {
        if(d = b.css("position"), ("absolute" === d || "relative" === d || "fixed" === d) && (f = parseInt(b.css("zIndex"), 10), !isNaN(f) && 0 !== f)) {
          return f
        }
        b = b.parent()
      }
    }
    return 0
  }, uniqueId:function() {
    return this.each(function() {
      this.id || (this.id = "ui-id-" + ++l)
    })
  }, removeUniqueId:function() {
    return this.each(function() {
      d.test(this.id) && a(this).removeAttr("id")
    })
  }});
  a.extend(a.expr[":"], {data:a.expr.createPseudo ? a.expr.createPseudo(function(b) {
    return function(c) {
      return!!a.data(c, b)
    }
  }) : function(b, c, d) {
    return!!a.data(b, d[3])
  }, focusable:function(b) {
    return f(b, !isNaN(a.attr(b, "tabindex")))
  }, tabbable:function(b) {
    var c = a.attr(b, "tabindex"), d = isNaN(c);
    return(d || 0 <= c) && f(b, !d)
  }});
  a("<a>").outerWidth(1).jquery || a.each(["Width", "Height"], function(b, d) {
    function f(b, c, d, e) {
      return a.each(g, function() {
        c -= parseFloat(a.css(b, "padding" + this)) || 0;
        d && (c -= parseFloat(a.css(b, "border" + this + "Width")) || 0);
        e && (c -= parseFloat(a.css(b, "margin" + this)) || 0)
      }), c
    }
    var g = "Width" === d ? ["Left", "Right"] : ["Top", "Bottom"], l = d.toLowerCase(), t = {innerWidth:a.fn.innerWidth, innerHeight:a.fn.innerHeight, outerWidth:a.fn.outerWidth, outerHeight:a.fn.outerHeight};
    a.fn["inner" + d] = function(b) {
      return b === c ? t["inner" + d].call(this) : this.each(function() {
        a(this).css(l, f(this, b) + "px")
      })
    };
    a.fn["outer" + d] = function(b, c) {
      return"number" != typeof b ? t["outer" + d].call(this, b) : this.each(function() {
        a(this).css(l, f(this, b, !0, c) + "px")
      })
    }
  });
  a.fn.addBack || (a.fn.addBack = function(a) {
    return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
  });
  a("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (a.fn.removeData = function(b) {
    return function(c) {
      return arguments.length ? b.call(this, a.camelCase(c)) : b.call(this)
    }
  }(a.fn.removeData));
  a.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
  a.support.selectstart = "onselectstart" in document.createElement("div");
  a.fn.extend({disableSelection:function() {
    return this.bind((a.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(a) {
      a.preventDefault()
    })
  }, enableSelection:function() {
    return this.unbind(".ui-disableSelection")
  }});
  a.extend(a.ui, {plugin:{add:function(b, c, d) {
    var f;
    b = a.ui[b].prototype;
    for(f in d) {
      b.plugins[f] = b.plugins[f] || [], b.plugins[f].push([c, d[f]])
    }
  }, call:function(a, c, d) {
    var f = a.plugins[c];
    if(f && a.element[0].parentNode && 11 !== a.element[0].parentNode.nodeType) {
      for(c = 0;f.length > c;c++) {
        a.options[f[c][0]] && f[c][1].apply(a.element, d)
      }
    }
  }}, hasScroll:function(b, c) {
    if("hidden" === a(b).css("overflow")) {
      return!1
    }
    var d = c && "left" === c ? "scrollLeft" : "scrollTop";
    return 0 < b[d] ? !0 : (b[d] = 1, b[d] = 0, !1)
  }})
})(jQuery);
(function(a, c) {
  var f = 0, g = Array.prototype.slice, l = a.cleanData;
  a.cleanData = function(c) {
    for(var b, e = 0;null != (b = c[e]);e++) {
      try {
        a(b).triggerHandler("remove")
      }catch(f) {
      }
    }
    l(c)
  };
  a.widget = function(d, b, e) {
    var f, g, l, t, u = {}, x = d.split(".")[0];
    d = d.split(".")[1];
    f = x + "-" + d;
    e || (e = b, b = a.Widget);
    a.expr[":"][f.toLowerCase()] = function(b) {
      return!!a.data(b, f)
    };
    a[x] = a[x] || {};
    g = a[x][d];
    l = a[x][d] = function(a, b) {
      return this._createWidget ? (arguments.length && this._createWidget(a, b), c) : new l(a, b)
    };
    a.extend(l, g, {version:e.version, _proto:a.extend({}, e), _childConstructors:[]});
    t = new b;
    t.options = a.widget.extend({}, t.options);
    a.each(e, function(d, e) {
      return a.isFunction(e) ? (u[d] = function() {
        var a = function() {
          return b.prototype[d].apply(this, arguments)
        }, c = function(a) {
          return b.prototype[d].apply(this, a)
        };
        return function() {
          var b, d = this._super, f = this._superApply;
          return this._super = a, this._superApply = c, b = e.apply(this, arguments), this._super = d, this._superApply = f, b
        }
      }(), c) : (u[d] = e, c)
    });
    l.prototype = a.widget.extend(t, {widgetEventPrefix:g ? t.widgetEventPrefix : d}, u, {constructor:l, namespace:x, widgetName:d, widgetFullName:f});
    g ? (a.each(g._childConstructors, function(b, c) {
      var d = c.prototype;
      a.widget(d.namespace + "." + d.widgetName, l, c._proto)
    }), delete g._childConstructors) : b._childConstructors.push(l);
    a.widget.bridge(d, l)
  };
  a.widget.extend = function(d) {
    for(var b, e, f = g.call(arguments, 1), l = 0, v = f.length;v > l;l++) {
      for(b in f[l]) {
        e = f[l][b], f[l].hasOwnProperty(b) && e !== c && (d[b] = a.isPlainObject(e) ? a.isPlainObject(d[b]) ? a.widget.extend({}, d[b], e) : a.widget.extend({}, e) : e)
      }
    }
    return d
  };
  a.widget.bridge = function(d, b) {
    var e = b.prototype.widgetFullName || d;
    a.fn[d] = function(f) {
      var l = "string" == typeof f, v = g.call(arguments, 1), t = this;
      return f = !l && v.length ? a.widget.extend.apply(null, [f].concat(v)) : f, l ? this.each(function() {
        var b, g = a.data(this, e);
        return g ? a.isFunction(g[f]) && "_" !== f.charAt(0) ? (b = g[f].apply(g, v), b !== g && b !== c ? (t = b && b.jquery ? t.pushStack(b.get()) : b, !1) : c) : a.error("no such method '" + f + "' for " + d + " widget instance") : a.error("cannot call methods on " + d + " prior to initialization; attempted to call method '" + f + "'")
      }) : this.each(function() {
        var c = a.data(this, e);
        c ? c.option(f || {})._init() : a.data(this, e, new b(f, this))
      }), t
    }
  };
  a.Widget = function() {
  };
  a.Widget._childConstructors = [];
  a.Widget.prototype = {widgetName:"widget", widgetEventPrefix:"", defaultElement:"<div>", options:{disabled:!1, create:null}, _createWidget:function(c, b) {
    b = a(b || this.defaultElement || this)[0];
    this.element = a(b);
    this.uuid = f++;
    this.eventNamespace = "." + this.widgetName + this.uuid;
    this.options = a.widget.extend({}, this.options, this._getCreateOptions(), c);
    this.bindings = a();
    this.hoverable = a();
    this.focusable = a();
    b !== this && (a.data(b, this.widgetFullName, this), this._on(!0, this.element, {remove:function(a) {
      a.target === b && this.destroy()
    }}), this.document = a(b.style ? b.ownerDocument : b.document || b), this.window = a(this.document[0].defaultView || this.document[0].parentWindow));
    this._create();
    this._trigger("create", null, this._getCreateEventData());
    this._init()
  }, _getCreateOptions:a.noop, _getCreateEventData:a.noop, _create:a.noop, _init:a.noop, destroy:function() {
    this._destroy();
    this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName));
    this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
    this.bindings.unbind(this.eventNamespace);
    this.hoverable.removeClass("ui-state-hover");
    this.focusable.removeClass("ui-state-focus")
  }, _destroy:a.noop, widget:function() {
    return this.element
  }, option:function(d, b) {
    var e, f, g, l = d;
    if(0 === arguments.length) {
      return a.widget.extend({}, this.options)
    }
    if("string" == typeof d) {
      if(l = {}, e = d.split("."), d = e.shift(), e.length) {
        f = l[d] = a.widget.extend({}, this.options[d]);
        for(g = 0;e.length - 1 > g;g++) {
          f[e[g]] = f[e[g]] || {}, f = f[e[g]]
        }
        if(d = e.pop(), b === c) {
          return f[d] === c ? null : f[d]
        }
        f[d] = b
      }else {
        if(b === c) {
          return this.options[d] === c ? null : this.options[d]
        }
        l[d] = b
      }
    }
    return this._setOptions(l), this
  }, _setOptions:function(a) {
    for(var b in a) {
      this._setOption(b, a[b])
    }
    return this
  }, _setOption:function(a, b) {
    return this.options[a] = b, "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!b).attr("aria-disabled", b), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
  }, enable:function() {
    return this._setOption("disabled", !1)
  }, disable:function() {
    return this._setOption("disabled", !0)
  }, _on:function(d, b, e) {
    var f, g = this;
    "boolean" != typeof d && (e = b, b = d, d = !1);
    e ? (b = f = a(b), this.bindings = this.bindings.add(b)) : (e = b, b = this.element, f = this.widget());
    a.each(e, function(e, l) {
      function u() {
        return d || !0 !== g.options.disabled && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof l ? g[l] : l).apply(g, arguments) : c
      }
      "string" != typeof l && (u.guid = l.guid = l.guid || u.guid || a.guid++);
      var x = e.match(/^(\w+)\s*(.*)$/), I = x[1] + g.eventNamespace;
      (x = x[2]) ? f.delegate(x, I, u) : b.bind(I, u)
    })
  }, _off:function(a, b) {
    b = (b || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
    a.unbind(b).undelegate(b)
  }, _delay:function(a, b) {
    var c = this;
    return setTimeout(function() {
      return("string" == typeof a ? c[a] : a).apply(c, arguments)
    }, b || 0)
  }, _hoverable:function(c) {
    this.hoverable = this.hoverable.add(c);
    this._on(c, {mouseenter:function(b) {
      a(b.currentTarget).addClass("ui-state-hover")
    }, mouseleave:function(b) {
      a(b.currentTarget).removeClass("ui-state-hover")
    }})
  }, _focusable:function(c) {
    this.focusable = this.focusable.add(c);
    this._on(c, {focusin:function(b) {
      a(b.currentTarget).addClass("ui-state-focus")
    }, focusout:function(b) {
      a(b.currentTarget).removeClass("ui-state-focus")
    }})
  }, _trigger:function(c, b, e) {
    var f, g = this.options[c];
    if(e = e || {}, b = a.Event(b), b.type = (c === this.widgetEventPrefix ? c : this.widgetEventPrefix + c).toLowerCase(), b.target = this.element[0], c = b.originalEvent) {
      for(f in c) {
        f in b || (b[f] = c[f])
      }
    }
    return this.element.trigger(b, e), !(a.isFunction(g) && !1 === g.apply(this.element[0], [b].concat(e)) || b.isDefaultPrevented())
  }};
  a.each({show:"fadeIn", hide:"fadeOut"}, function(c, b) {
    a.Widget.prototype["_" + c] = function(e, f, g) {
      "string" == typeof f && (f = {effect:f});
      var l, t = f ? !0 === f || "number" == typeof f ? b : f.effect || b : c;
      f = f || {};
      "number" == typeof f && (f = {duration:f});
      l = !a.isEmptyObject(f);
      f.complete = g;
      f.delay && e.delay(f.delay);
      l && a.effects && a.effects.effect[t] ? e[c](f) : t !== c && e[t] ? e[t](f.duration, f.easing, g) : e.queue(function(b) {
        a(this)[c]();
        g && g.call(e[0]);
        b()
      })
    }
  })
})(jQuery);
(function(a) {
  var c = !1;
  a(document).mouseup(function() {
    c = !1
  });
  a.widget("ui.mouse", {version:"1.10.2", options:{cancel:"input,textarea,button,select,option", distance:1, delay:0}, _mouseInit:function() {
    var c = this;
    this.element.bind("mousedown." + this.widgetName, function(a) {
      return c._mouseDown(a)
    }).bind("click." + this.widgetName, function(g) {
      return!0 === a.data(g.target, c.widgetName + ".preventClickEvent") ? (a.removeData(g.target, c.widgetName + ".preventClickEvent"), g.stopImmediatePropagation(), !1) : void 0
    });
    this.started = !1
  }, _mouseDestroy:function() {
    this.element.unbind("." + this.widgetName);
    this._mouseMoveDelegate && a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
  }, _mouseDown:function(f) {
    if(!c) {
      this._mouseStarted && this._mouseUp(f);
      this._mouseDownEvent = f;
      var g = this, l = 1 === f.which, d = "string" == typeof this.options.cancel && f.target.nodeName ? a(f.target).closest(this.options.cancel).length : !1;
      return l && !d && this._mouseCapture(f) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
        g.mouseDelayMet = !0
      }, this.options.delay)), this._mouseDistanceMet(f) && this._mouseDelayMet(f) && (this._mouseStarted = !1 !== this._mouseStart(f), !this._mouseStarted) ? (f.preventDefault(), !0) : (!0 === a.data(f.target, this.widgetName + ".preventClickEvent") && a.removeData(f.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(a) {
        return g._mouseMove(a)
      }, this._mouseUpDelegate = function(a) {
        return g._mouseUp(a)
      }, a(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), f.preventDefault(), c = !0, !0)) : !0
    }
  }, _mouseMove:function(c) {
    return a.ui.ie && (!document.documentMode || 9 > document.documentMode) && !c.button ? this._mouseUp(c) : this._mouseStarted ? (this._mouseDrag(c), c.preventDefault()) : (this._mouseDistanceMet(c) && this._mouseDelayMet(c) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, c), this._mouseStarted ? this._mouseDrag(c) : this._mouseUp(c)), !this._mouseStarted)
  }, _mouseUp:function(c) {
    return a(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, c.target === this._mouseDownEvent.target && a.data(c.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(c)), !1
  }, _mouseDistanceMet:function(a) {
    return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
  }, _mouseDelayMet:function() {
    return this.mouseDelayMet
  }, _mouseStart:function() {
  }, _mouseDrag:function() {
  }, _mouseStop:function() {
  }, _mouseCapture:function() {
    return!0
  }})
})(jQuery);
(function(a, c) {
  function f(a, b, c) {
    return[parseFloat(a[0]) * (u.test(a[0]) ? b / 100 : 1), parseFloat(a[1]) * (u.test(a[1]) ? c / 100 : 1)]
  }
  function g(b) {
    var c = b[0];
    return 9 === c.nodeType ? {width:b.width(), height:b.height(), offset:{top:0, left:0}} : a.isWindow(c) ? {width:b.width(), height:b.height(), offset:{top:b.scrollTop(), left:b.scrollLeft()}} : c.preventDefault ? {width:0, height:0, offset:{top:c.pageY, left:c.pageX}} : {width:b.outerWidth(), height:b.outerHeight(), offset:b.offset()}
  }
  a.ui = a.ui || {};
  var l, d = Math.max, b = Math.abs, e = Math.round, n = /left|center|right/, w = /top|center|bottom/, v = /[\+\-]\d+(\.[\d]+)?%?/, t = /^\w+/, u = /%$/, x = a.fn.position;
  a.position = {scrollbarWidth:function() {
    if(l !== c) {
      return l
    }
    var b, d, e = a("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), f = e.children()[0];
    return a("body").append(e), b = f.offsetWidth, e.css("overflow", "scroll"), d = f.offsetWidth, b === d && (d = e[0].clientWidth), e.remove(), l = b - d
  }, getScrollInfo:function(b) {
    var c = b.isWindow ? "" : b.element.css("overflow-x"), d = b.isWindow ? "" : b.element.css("overflow-y"), c = "scroll" === c || "auto" === c && b.width < b.element[0].scrollWidth;
    return{width:"scroll" === d || "auto" === d && b.height < b.element[0].scrollHeight ? a.position.scrollbarWidth() : 0, height:c ? a.position.scrollbarWidth() : 0}
  }, getWithinInfo:function(b) {
    b = a(b || window);
    var c = a.isWindow(b[0]);
    return{element:b, isWindow:c, offset:b.offset() || {left:0, top:0}, scrollLeft:b.scrollLeft(), scrollTop:b.scrollTop(), width:c ? b.width() : b.outerWidth(), height:c ? b.height() : b.outerHeight()}
  }};
  a.fn.position = function(c) {
    if(!c || !c.of) {
      return x.apply(this, arguments)
    }
    c = a.extend({}, c);
    var l, u, E, F, z, R, O = a(c.of), P = a.position.getWithinInfo(c.within), V = a.position.getScrollInfo(P), D = (c.collision || "flip").split(" "), L = {};
    return R = g(O), O[0].preventDefault && (c.at = "left top"), u = R.width, E = R.height, F = R.offset, z = a.extend({}, F), a.each(["my", "at"], function() {
      var a, b, d = (c[this] || "").split(" ");
      1 === d.length && (d = n.test(d[0]) ? d.concat(["center"]) : w.test(d[0]) ? ["center"].concat(d) : ["center", "center"]);
      d[0] = n.test(d[0]) ? d[0] : "center";
      d[1] = w.test(d[1]) ? d[1] : "center";
      a = v.exec(d[0]);
      b = v.exec(d[1]);
      L[this] = [a ? a[0] : 0, b ? b[0] : 0];
      c[this] = [t.exec(d[0])[0], t.exec(d[1])[0]]
    }), 1 === D.length && (D[1] = D[0]), "right" === c.at[0] ? z.left += u : "center" === c.at[0] && (z.left += u / 2), "bottom" === c.at[1] ? z.top += E : "center" === c.at[1] && (z.top += E / 2), l = f(L.at, u, E), z.left += l[0], z.top += l[1], this.each(function() {
      var g, n, t = a(this), v = t.outerWidth(), w = t.outerHeight(), q = parseInt(a.css(this, "marginLeft"), 10) || 0, k = parseInt(a.css(this, "marginTop"), 10) || 0, m = v + q + (parseInt(a.css(this, "marginRight"), 10) || 0) + V.width, p = w + k + (parseInt(a.css(this, "marginBottom"), 10) || 0) + V.height, s = a.extend({}, z), r = f(L.my, t.outerWidth(), t.outerHeight());
      "right" === c.my[0] ? s.left -= v : "center" === c.my[0] && (s.left -= v / 2);
      "bottom" === c.my[1] ? s.top -= w : "center" === c.my[1] && (s.top -= w / 2);
      s.left += r[0];
      s.top += r[1];
      a.support.offsetFractions || (s.left = e(s.left), s.top = e(s.top));
      g = {marginLeft:q, marginTop:k};
      a.each(["left", "top"], function(b, d) {
        a.ui.position[D[b]] && a.ui.position[D[b]][d](s, {targetWidth:u, targetHeight:E, elemWidth:v, elemHeight:w, collisionPosition:g, collisionWidth:m, collisionHeight:p, offset:[l[0] + r[0], l[1] + r[1]], my:c.my, at:c.at, within:P, elem:t})
      });
      c.using && (n = function(a) {
        var e = F.left - s.left, k = e + u - v, f = F.top - s.top, m = f + E - w, g = {target:{element:O, left:F.left, top:F.top, width:u, height:E}, element:{element:t, left:s.left, top:s.top, width:v, height:w}, horizontal:0 > k ? "left" : 0 < e ? "right" : "center", vertical:0 > m ? "top" : 0 < f ? "bottom" : "middle"};
        v > u && u > b(e + k) && (g.horizontal = "center");
        w > E && E > b(f + m) && (g.vertical = "middle");
        g.important = d(b(e), b(k)) > d(b(f), b(m)) ? "horizontal" : "vertical";
        c.using.call(this, a, g)
      });
      t.offset(a.extend(s, {using:n}))
    })
  };
  a.ui.position = {fit:{left:function(a, b) {
    var c, e = b.within, f = e.isWindow ? e.scrollLeft : e.offset.left, e = e.width, g = a.left - b.collisionPosition.marginLeft, l = f - g, n = g + b.collisionWidth - e - f;
    b.collisionWidth > e ? 0 < l && 0 >= n ? (c = a.left + l + b.collisionWidth - e - f, a.left += l - c) : a.left = 0 < n && 0 >= l ? f : l > n ? f + e - b.collisionWidth : f : 0 < l ? a.left += l : 0 < n ? a.left -= n : a.left = d(a.left - g, a.left)
  }, top:function(a, b) {
    var c, e = b.within, e = e.isWindow ? e.scrollTop : e.offset.top, f = b.within.height, g = a.top - b.collisionPosition.marginTop, l = e - g, n = g + b.collisionHeight - f - e;
    b.collisionHeight > f ? 0 < l && 0 >= n ? (c = a.top + l + b.collisionHeight - f - e, a.top += l - c) : a.top = 0 < n && 0 >= l ? e : l > n ? e + f - b.collisionHeight : e : 0 < l ? a.top += l : 0 < n ? a.top -= n : a.top = d(a.top - g, a.top)
  }}, flip:{left:function(a, c) {
    var d, e, f = c.within, g = f.offset.left + f.scrollLeft, l = f.width, f = f.isWindow ? f.scrollLeft : f.offset.left, n = a.left - c.collisionPosition.marginLeft, t = n - f, n = n + c.collisionWidth - l - f, u = "left" === c.my[0] ? -c.elemWidth : "right" === c.my[0] ? c.elemWidth : 0, v = "left" === c.at[0] ? c.targetWidth : "right" === c.at[0] ? -c.targetWidth : 0, w = -2 * c.offset[0];
    0 > t ? (d = a.left + u + v + w + c.collisionWidth - l - g, (0 > d || b(t) > d) && (a.left += u + v + w)) : 0 < n && (e = a.left - c.collisionPosition.marginLeft + u + v + w - f, (0 < e || n > b(e)) && (a.left += u + v + w))
  }, top:function(a, c) {
    var d, e, f = c.within, g = f.offset.top + f.scrollTop, l = f.height, f = f.isWindow ? f.scrollTop : f.offset.top, n = a.top - c.collisionPosition.marginTop, t = n - f, n = n + c.collisionHeight - l - f, u = "top" === c.my[1] ? -c.elemHeight : "bottom" === c.my[1] ? c.elemHeight : 0, v = "top" === c.at[1] ? c.targetHeight : "bottom" === c.at[1] ? -c.targetHeight : 0, w = -2 * c.offset[1];
    0 > t ? (e = a.top + u + v + w + c.collisionHeight - l - g, a.top + u + v + w > t && (0 > e || b(t) > e) && (a.top += u + v + w)) : 0 < n && (d = a.top - c.collisionPosition.marginTop + u + v + w - f, a.top + u + v + w > n && (0 < d || n > b(d)) && (a.top += u + v + w))
  }}, flipfit:{left:function() {
    a.ui.position.flip.left.apply(this, arguments);
    a.ui.position.fit.left.apply(this, arguments)
  }, top:function() {
    a.ui.position.flip.top.apply(this, arguments);
    a.ui.position.fit.top.apply(this, arguments)
  }}};
  (function() {
    var b, c, d, e, f = document.getElementsByTagName("body")[0];
    d = document.createElement("div");
    b = document.createElement(f ? "div" : "body");
    c = {visibility:"hidden", width:0, height:0, border:0, margin:0, background:"none"};
    f && a.extend(c, {position:"absolute", left:"-1000px", top:"-1000px"});
    for(e in c) {
      b.style[e] = c[e]
    }
    b.appendChild(d);
    c = f || document.documentElement;
    c.insertBefore(b, c.firstChild);
    d.style.cssText = "position: absolute; left: 10.7432222px;";
    d = a(d).offset().left;
    a.support.offsetFractions = 10 < d && 11 > d;
    b.innerHTML = "";
    c.removeChild(b)
  })()
})(jQuery);
(function(a, c) {
  function f(a) {
    return 1 < a.hash.length && decodeURIComponent(a.href.replace(l, "")) === decodeURIComponent(location.href.replace(l, ""))
  }
  var g = 0, l = /#.*$/;
  a.widget("ui.tabs", {version:"1.10.2", delay:300, options:{active:null, collapsible:!1, event:"click", heightStyle:"content", hide:null, show:null, activate:null, beforeActivate:null, beforeLoad:null, load:null}, _create:function() {
    var c = this, b = this.options;
    this.running = !1;
    this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", b.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(b) {
      a(this).is(".ui-state-disabled") && b.preventDefault()
    }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
      a(this).closest("li").is(".ui-state-disabled") && this.blur()
    });
    this._processTabs();
    b.active = this._initialActive();
    a.isArray(b.disabled) && (b.disabled = a.unique(b.disabled.concat(a.map(this.tabs.filter(".ui-state-disabled"), function(a) {
      return c.tabs.index(a)
    }))).sort());
    this.active = !1 !== this.options.active && this.anchors.length ? this._findActive(b.active) : a();
    this._refresh();
    this.active.length && this.load(b.active)
  }, _initialActive:function() {
    var d = this.options.active, b = this.options.collapsible, e = location.hash.substring(1);
    return null === d && (e && this.tabs.each(function(b, f) {
      return a(f).attr("aria-controls") === e ? (d = b, !1) : c
    }), null === d && (d = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === d || -1 === d) && (d = this.tabs.length ? 0 : !1)), !1 !== d && (d = this.tabs.index(this.tabs.eq(d)), -1 === d && (d = b ? !1 : 0)), !b && !1 === d && this.anchors.length && (d = 0), d
  }, _getCreateEventData:function() {
    return{tab:this.active, panel:this.active.length ? this._getPanelForTab(this.active) : a()}
  }, _tabKeydown:function(d) {
    var b = a(this.document[0].activeElement).closest("li"), e = this.tabs.index(b), f = !0;
    if(!this._handlePageNav(d)) {
      switch(d.keyCode) {
        case a.ui.keyCode.RIGHT:
        ;
        case a.ui.keyCode.DOWN:
          e++;
          break;
        case a.ui.keyCode.UP:
        ;
        case a.ui.keyCode.LEFT:
          f = !1;
          e--;
          break;
        case a.ui.keyCode.END:
          e = this.anchors.length - 1;
          break;
        case a.ui.keyCode.HOME:
          e = 0;
          break;
        case a.ui.keyCode.SPACE:
          return d.preventDefault(), clearTimeout(this.activating), this._activate(e), c;
        case a.ui.keyCode.ENTER:
          return d.preventDefault(), clearTimeout(this.activating), this._activate(e === this.options.active ? !1 : e), c;
        default:
          return
      }
      d.preventDefault();
      clearTimeout(this.activating);
      e = this._focusNextTab(e, f);
      d.ctrlKey || (b.attr("aria-selected", "false"), this.tabs.eq(e).attr("aria-selected", "true"), this.activating = this._delay(function() {
        this.option("active", e)
      }, this.delay))
    }
  }, _panelKeydown:function(c) {
    this._handlePageNav(c) || c.ctrlKey && c.keyCode === a.ui.keyCode.UP && (c.preventDefault(), this.active.focus())
  }, _handlePageNav:function(d) {
    return d.altKey && d.keyCode === a.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : d.altKey && d.keyCode === a.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : c
  }, _findNextTab:function(c, b) {
    for(var e = this.tabs.length - 1;-1 !== a.inArray((c > e && (c = 0), 0 > c && (c = e), c), this.options.disabled);) {
      c = b ? c + 1 : c - 1
    }
    return c
  }, _focusNextTab:function(a, b) {
    return a = this._findNextTab(a, b), this.tabs.eq(a).focus(), a
  }, _setOption:function(a, b) {
    return"active" === a ? (this._activate(b), c) : "disabled" === a ? (this._setupDisabled(b), c) : (this._super(a, b), "collapsible" === a && (this.element.toggleClass("ui-tabs-collapsible", b), b || !1 !== this.options.active || this._activate(0)), "event" === a && this._setupEvents(b), "heightStyle" === a && this._setupHeightStyle(b), c)
  }, _tabId:function(a) {
    return a.attr("aria-controls") || "ui-tabs-" + ++g
  }, _sanitizeSelector:function(a) {
    return a ? a.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
  }, refresh:function() {
    var c = this.options, b = this.tablist.children(":has(a[href])");
    c.disabled = a.map(b.filter(".ui-state-disabled"), function(a) {
      return b.index(a)
    });
    this._processTabs();
    !1 !== c.active && this.anchors.length ? this.active.length && !a.contains(this.tablist[0], this.active[0]) ? this.tabs.length === c.disabled.length ? (c.active = !1, this.active = a()) : this._activate(this._findNextTab(Math.max(0, c.active - 1), !1)) : c.active = this.tabs.index(this.active) : (c.active = !1, this.active = a());
    this._refresh()
  }, _refresh:function() {
    this._setupDisabled(this.options.disabled);
    this._setupEvents(this.options.event);
    this._setupHeightStyle(this.options.heightStyle);
    this.tabs.not(this.active).attr({"aria-selected":"false", tabIndex:-1});
    this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false", "aria-hidden":"true"});
    this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true", tabIndex:0}), this._getPanelForTab(this.active).show().attr({"aria-expanded":"true", "aria-hidden":"false"})) : this.tabs.eq(0).attr("tabIndex", 0)
  }, _processTabs:function() {
    var c = this;
    this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
    this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab", tabIndex:-1});
    this.anchors = this.tabs.map(function() {
      return a("a", this)[0]
    }).addClass("ui-tabs-anchor").attr({role:"presentation", tabIndex:-1});
    this.panels = a();
    this.anchors.each(function(b, e) {
      var g, l, v, t = a(e).uniqueId().attr("id"), u = a(e).closest("li"), x = u.attr("aria-controls");
      f(e) ? (g = e.hash, l = c.element.find(c._sanitizeSelector(g))) : (v = c._tabId(u), g = "#" + v, l = c.element.find(g), l.length || (l = c._createPanel(v), l.insertAfter(c.panels[b - 1] || c.tablist)), l.attr("aria-live", "polite"));
      l.length && (c.panels = c.panels.add(l));
      x && u.data("ui-tabs-aria-controls", x);
      u.attr({"aria-controls":g.substring(1), "aria-labelledby":t});
      l.attr("aria-labelledby", t)
    });
    this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
  }, _getList:function() {
    return this.element.find("ol,ul").eq(0)
  }, _createPanel:function(c) {
    return a("<div>").attr("id", c).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
  }, _setupDisabled:function(c) {
    a.isArray(c) && (c.length ? c.length === this.anchors.length && (c = !0) : c = !1);
    for(var b, e = 0;b = this.tabs[e];e++) {
      !0 === c || -1 !== a.inArray(e, c) ? a(b).addClass("ui-state-disabled").attr("aria-disabled", "true") : a(b).removeClass("ui-state-disabled").removeAttr("aria-disabled")
    }
    this.options.disabled = c
  }, _setupEvents:function(c) {
    var b = {click:function(a) {
      a.preventDefault()
    }};
    c && a.each(c.split(" "), function(a, c) {
      b[c] = "_eventHandler"
    });
    this._off(this.anchors.add(this.tabs).add(this.panels));
    this._on(this.anchors, b);
    this._on(this.tabs, {keydown:"_tabKeydown"});
    this._on(this.panels, {keydown:"_panelKeydown"});
    this._focusable(this.tabs);
    this._hoverable(this.tabs)
  }, _setupHeightStyle:function(c) {
    var b, e = this.element.parent();
    "fill" === c ? (b = e.height(), b -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function() {
      var c = a(this), d = c.css("position");
      "absolute" !== d && "fixed" !== d && (b -= c.outerHeight(!0))
    }), this.element.children().not(this.panels).each(function() {
      b -= a(this).outerHeight(!0)
    }), this.panels.each(function() {
      a(this).height(Math.max(0, b - a(this).innerHeight() + a(this).height()))
    }).css("overflow", "auto")) : "auto" === c && (b = 0, this.panels.each(function() {
      b = Math.max(b, a(this).height("").height())
    }).height(b))
  }, _eventHandler:function(c) {
    var b = this.options, e = this.active, f = a(c.currentTarget).closest("li"), g = f[0] === e[0], l = g && b.collapsible, t = l ? a() : this._getPanelForTab(f), u = e.length ? this._getPanelForTab(e) : a(), e = {oldTab:e, oldPanel:u, newTab:l ? a() : f, newPanel:t};
    c.preventDefault();
    f.hasClass("ui-state-disabled") || f.hasClass("ui-tabs-loading") || this.running || g && !b.collapsible || !1 === this._trigger("beforeActivate", c, e) || (b.active = l ? !1 : this.tabs.index(f), this.active = g ? a() : f, this.xhr && this.xhr.abort(), u.length || t.length || a.error("jQuery UI Tabs: Mismatching fragment identifier."), t.length && this.load(this.tabs.index(f), c), this._toggle(c, e))
  }, _toggle:function(c, b) {
    function e() {
      g.running = !1;
      g._trigger("activate", c, b)
    }
    function f() {
      b.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
      l.length && g.options.show ? g._show(l, g.options.show, e) : (l.show(), e())
    }
    var g = this, l = b.newPanel, t = b.oldPanel;
    this.running = !0;
    t.length && this.options.hide ? this._hide(t, this.options.hide, function() {
      b.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
      f()
    }) : (b.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), t.hide(), f());
    t.attr({"aria-expanded":"false", "aria-hidden":"true"});
    b.oldTab.attr("aria-selected", "false");
    l.length && t.length ? b.oldTab.attr("tabIndex", -1) : l.length && this.tabs.filter(function() {
      return 0 === a(this).attr("tabIndex")
    }).attr("tabIndex", -1);
    l.attr({"aria-expanded":"true", "aria-hidden":"false"});
    b.newTab.attr({"aria-selected":"true", tabIndex:0})
  }, _activate:function(c) {
    var b;
    c = this._findActive(c);
    c[0] !== this.active[0] && (c.length || (c = this.active), b = c.find(".ui-tabs-anchor")[0], this._eventHandler({target:b, currentTarget:b, preventDefault:a.noop}))
  }, _findActive:function(c) {
    return!1 === c ? a() : this.tabs.eq(c)
  }, _getIndex:function(a) {
    return"string" == typeof a && (a = this.anchors.index(this.anchors.filter("[href$='" + a + "']"))), a
  }, _destroy:function() {
    this.xhr && this.xhr.abort();
    this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
    this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
    this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
    this.tabs.add(this.panels).each(function() {
      a.data(this, "ui-tabs-destroy") ? a(this).remove() : a(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
    });
    this.tabs.each(function() {
      var c = a(this), b = c.data("ui-tabs-aria-controls");
      b ? c.attr("aria-controls", b).removeData("ui-tabs-aria-controls") : c.removeAttr("aria-controls")
    });
    this.panels.show();
    "content" !== this.options.heightStyle && this.panels.css("height", "")
  }, enable:function(d) {
    var b = this.options.disabled;
    !1 !== b && (d === c ? b = !1 : (d = this._getIndex(d), b = a.isArray(b) ? a.map(b, function(a) {
      return a !== d ? a : null
    }) : a.map(this.tabs, function(a, b) {
      return b !== d ? b : null
    })), this._setupDisabled(b))
  }, disable:function(d) {
    var b = this.options.disabled;
    if(!0 !== b) {
      if(d === c) {
        b = !0
      }else {
        if(d = this._getIndex(d), -1 !== a.inArray(d, b)) {
          return
        }
        b = a.isArray(b) ? a.merge([d], b).sort() : [d]
      }
      this._setupDisabled(b)
    }
  }, load:function(c, b) {
    c = this._getIndex(c);
    var e = this, g = this.tabs.eq(c), l = g.find(".ui-tabs-anchor"), v = this._getPanelForTab(g), t = {tab:g, panel:v};
    f(l[0]) || (this.xhr = a.ajax(this._ajaxSettings(l, b, t)), this.xhr && "canceled" !== this.xhr.statusText && (g.addClass("ui-tabs-loading"), v.attr("aria-busy", "true"), this.xhr.success(function(a) {
      setTimeout(function() {
        v.html(a);
        e._trigger("load", b, t)
      }, 1)
    }).complete(function(a, b) {
      setTimeout(function() {
        "abort" === b && e.panels.stop(!1, !0);
        g.removeClass("ui-tabs-loading");
        v.removeAttr("aria-busy");
        a === e.xhr && delete e.xhr
      }, 1)
    })))
  }, _ajaxSettings:function(c, b, e) {
    var f = this;
    return{url:c.attr("href"), beforeSend:function(c, d) {
      return f._trigger("beforeLoad", b, a.extend({jqXHR:c, ajaxSettings:d}, e))
    }}
  }, _getPanelForTab:function(c) {
    c = a(c).attr("aria-controls");
    return this.element.find(this._sanitizeSelector("#" + c))
  }})
})(jQuery);
(function() {
  var a, c, f, g, l, d, b, e, n, w, v, t, u, x, I, B, A, E, F, z, R, O, P, V, D, L, Y, aa = [].indexOf || function(a) {
    for(var b = 0, c = this.length;c > b;b++) {
      if(b in this && this[b] === a) {
        return b
      }
    }
    return-1
  }, W = {}.hasOwnProperty, M = function(a, b) {
    function c() {
      this.constructor = a
    }
    for(var d in b) {
      W.call(b, d) && (a[d] = b[d])
    }
    return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
  };
  if(a = function() {
    return null
  }, a.Util = {}, a.EventSource = function() {
    function a(b) {
      this._cancelable = b && b.cancelable;
      this._listeners = []
    }
    return a.prototype.addListener = function(a) {
      if("function" != typeof a) {
        throw new TypeError("Invalid listener type; expected function");
      }
      return 0 > aa.call(this._listeners, a) && this._listeners.push(a), this
    }, a.prototype.removeListener = function(a) {
      var b, c, d, e, f;
      if(this._listeners.indexOf) {
        a = this._listeners.indexOf(a), -1 !== a && this._listeners.splice(a, 1)
      }else {
        f = this._listeners;
        b = d = 0;
        for(e = f.length;e > d;b = ++d) {
          if(c = f[b], c === a) {
            this._listeners.splice(b, 1);
            break
          }
        }
      }
      return this
    }, a.prototype.dispatch = function(a) {
      var b, c, d, e, f;
      f = this._listeners;
      d = 0;
      for(e = f.length;e > d;d++) {
        if(b = f[d], c = b(a), this._cancelable && !1 === c) {
          return!1
        }
      }
      return!0
    }, a
  }(), a.ApiError = function() {
    function a(b, c, d) {
      var e;
      if(this.method = c, this.url = d, this.status = b.status, b.responseType) {
        try {
          e = b.response || b.responseText
        }catch(f) {
          try {
            e = b.responseText
          }catch(g) {
            e = null
          }
        }
      }else {
        try {
          e = b.responseText
        }catch(q) {
          e = null
        }
      }
      if(e) {
        try {
          this.responseText = "" + e, this.response = JSON.parse(e)
        }catch(l) {
          this.response = null
        }
      }else {
        this.responseText = "(no response)", this.response = null
      }
    }
    return a.prototype.status = void 0, a.prototype.method = void 0, a.prototype.url = void 0, a.prototype.responseText = void 0, a.prototype.response = void 0, a.NETWORK_ERROR = 0, a.INVALID_PARAM = 400, a.INVALID_TOKEN = 401, a.OAUTH_ERROR = 403, a.NOT_FOUND = 404, a.INVALID_METHOD = 405, a.RATE_LIMITED = 503, a.OVER_QUOTA = 507, a.prototype.toString = function() {
      return"Dropbox API error " + this.status + " from " + this.method + " " + this.url + " :: " + this.responseText
    }, a.prototype.inspect = function() {
      return"" + this
    }, a
  }(), a.AuthDriver = function() {
    function b() {
    }
    return b.prototype.url = function(b) {
      return"https://some.url?dboauth_token=" + a.Xhr.urlEncode(b)
    }, b.prototype.doAuthorize = function(a, b, c, d) {
      return d("oauth-token")
    }, b.prototype.onAuthStateChange = function(a, b) {
      return b()
    }, b
  }(), a.Drivers = {}, "undefined" != typeof window ? window.atob && window.btoa ? (u = function(a) {
    return window.atob(a)
  }, A = function(a) {
    return window.btoa(a)
  }) : (E = function(a, b, c) {
    var d, e;
    e = 3 - b;
    a <<= 8 * e;
    for(d = 3;d >= e;) {
      c.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(63 & a >> 6 * d)), d -= 1
    }
    for(d = b;3 > d;) {
      c.push("="), d += 1
    }
    return null
  }, x = function(a, b, c) {
    var d;
    d = 4 - b;
    a <<= 6 * d;
    for(b = 2;b >= d;) {
      c.push(String.fromCharCode(255 & a >> 8 * b)), b -= 1
    }
    return null
  }, A = function(a) {
    var b, c, d, e, f, g;
    e = [];
    d = f = c = b = 0;
    for(g = a.length;0 <= g ? g > f : f > g;d = 0 <= g ? ++f : --f) {
      b = b << 8 | a.charCodeAt(d), c += 1, 3 === c && (E(b, c, e), b = c = 0)
    }
    return 0 < c && E(b, c, e), e.join("")
  }, u = function(a) {
    var b, c, d, e, f, g, l;
    f = [];
    e = g = d = b = 0;
    for(l = a.length;(0 <= l ? l > g : g > l) && (c = a.charAt(e), "=" !== c);e = 0 <= l ? ++g : --g) {
      b = b << 6 | "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(c), d += 1, 4 === d && (x(b, d, f), b = d = 0)
    }
    return 0 < d && x(b, d, f), f.join("")
  }) : (u = function(a) {
    var b;
    a = new Buffer(a, "base64");
    var c, d, e;
    e = [];
    b = c = 0;
    for(d = a.length;0 <= d ? d > c : c > d;b = 0 <= d ? ++c : --c) {
      e.push(String.fromCharCode(a[b]))
    }
    return e.join("")
  }, A = function(a) {
    var b, c, d = Buffer, e, f, g;
    g = [];
    c = e = 0;
    for(f = a.length;0 <= f ? f > e : e > f;c = 0 <= f ? ++e : --e) {
      g.push(a.charCodeAt(c))
    }
    return b = new d(g), b.toString("base64")
  }), a.Util.atob = u, a.Util.btoa = A, a.Client = function() {
    function b(c) {
      var d = this;
      this.sandbox = c.sandbox || !1;
      this.apiServer = c.server || this.defaultApiServer();
      this.authServer = c.authServer || this.defaultAuthServer();
      this.fileServer = c.fileServer || this.defaultFileServer();
      this.downloadServer = c.downloadServer || this.defaultDownloadServer();
      this.onXhr = new a.EventSource({cancelable:!0});
      this.onError = new a.EventSource;
      this.onAuthStateChange = new a.EventSource;
      this.xhrOnErrorHandler = function(a, b) {
        return d.handleXhrError(a, b)
      };
      this.oauth = new a.Oauth(c);
      this._credentials = this.authError = this.authState = this.uid = this.filter = this.driver = null;
      this.setCredentials(c);
      this.setupUrls()
    }
    return b.prototype.authDriver = function(a) {
      return this.driver = a, this
    }, b.prototype.onXhr = null, b.prototype.onError = null, b.prototype.onAuthStateChange = null, b.prototype.dropboxUid = function() {
      return this.uid
    }, b.prototype.credentials = function() {
      return this._credentials || this.computeCredentials(), this._credentials
    }, b.prototype.authenticate = function(a, b) {
      var c, d, e, f = this;
      if(b || "function" != typeof a || (b = a, a = null), c = a && "interactive" in a ? a.interactive : !0, !this.driver && this.authState !== g.DONE) {
        throw Error("Call authDriver to set an authentication driver");
      }
      if(this.authState === g.ERROR) {
        throw Error("Client got in an error state. Call reset() to reuse it!");
      }
      return d = null, e = function() {
        var a;
        if(d !== f.authState && (null !== d && f.onAuthStateChange.dispatch(f), d = f.authState, f.driver && f.driver.onAuthStateChange)) {
          return f.driver.onAuthStateChange(f, e), void 0
        }
        switch(f.authState) {
          case g.RESET:
            return c ? f.requestToken(function(a, b) {
              var c, d;
              return a ? (f.authError = a, f.authState = g.ERROR) : (c = b.oauth_token, d = b.oauth_token_secret, f.oauth.setToken(c, d), f.authState = g.REQUEST), f._credentials = null, e()
            }) : (b && b(null, f), void 0);
          case g.REQUEST:
            return c ? (a = f.authorizeUrl(f.oauth.token), f.driver.doAuthorize(a, f.oauth.token, f.oauth.tokenSecret, function() {
              return f.authState = g.AUTHORIZED, f._credentials = null, e()
            })) : (b && b(null, f), void 0);
          case g.AUTHORIZED:
            return f.getAccessToken(function(a, b) {
              return a ? (f.authError = a, f.authState = g.ERROR) : (f.oauth.setToken(b.oauth_token, b.oauth_token_secret), f.uid = b.uid, f.authState = g.DONE), f._credentials = null, e()
            });
          case g.DONE:
            b && b(null, f);
            break;
          case g.SIGNED_OFF:
            return f.authState = g.RESET, f.reset(), e();
          case g.ERROR:
            b && b(f.authError, f)
        }
      }, e(), this
    }, b.prototype.isAuthenticated = function() {
      return this.authState === g.DONE
    }, b.prototype.signOut = function(b) {
      var c, d = this;
      return c = new a.Xhr("POST", this.urls.signOut), c.signWithOauth(this.oauth), this.dispatchXhr(c, function(a) {
        return a ? (b && b(a), void 0) : (d.authState = g.RESET, d.reset(), d.authState = g.SIGNED_OFF, d.onAuthStateChange.dispatch(d), d.driver && d.driver.onAuthStateChange ? d.driver.onAuthStateChange(d, function() {
          return b ? b(a) : void 0
        }) : b ? b(a) : void 0)
      })
    }, b.prototype.signOff = function(a) {
      return this.signOut(a)
    }, b.prototype.getUserInfo = function(b, c) {
      var d, e;
      return c || "function" != typeof b || (c = b, b = null), d = !1, b && b.httpCache && (d = !0), e = new a.Xhr("GET", this.urls.accountInfo), e.signWithOauth(this.oauth, d), this.dispatchXhr(e, function(b, d) {
        return c(b, a.UserInfo.parse(d), d)
      })
    }, b.prototype.readFile = function(b, c, d) {
      var e, f, g, l, q, n, t;
      return d || "function" != typeof c || (d = c, c = null), f = {}, n = "text", l = null, e = !1, c && (c.versionTag ? f.rev = c.versionTag : c.rev && (f.rev = c.rev), c.arrayBuffer ? n = "arraybuffer" : c.blob ? n = "blob" : c.buffer ? n = "buffer" : c.binary && (n = "b"), c.length ? (null != c.start ? (q = c.start, g = c.start + c.length - 1) : (q = "", g = c.length), l = "bytes=" + q + "-" + g) : null != c.start && (l = "bytes=" + c.start + "-"), c.httpCache && (e = !0)), t = new a.Xhr("GET", 
      "" + this.urls.getFile + "/" + this.urlEncodePath(b)), t.setParams(f).signWithOauth(this.oauth, e), t.setResponseType(n), l && (l && t.setHeader("Range", l), t.reportResponseHeaders()), this.dispatchXhr(t, function(b, c, e, f) {
        var k;
        return k = f ? a.RangeInfo.parse(f["content-range"]) : null, d(b, c, a.Stat.parse(e), k)
      })
    }, b.prototype.writeFile = function(b, c, d, e) {
      var f;
      return e || "function" != typeof d || (e = d, d = null), f = a.Xhr.canSendForms && "object" == typeof c, f ? this.writeFileUsingForm(b, c, d, e) : this.writeFileUsingPut(b, c, d, e)
    }, b.prototype.writeFileUsingForm = function(b, c, d, e) {
      var f, g, l, q;
      return l = b.lastIndexOf("/"), -1 === l ? (f = b, b = "") : (f = b.substring(l), b = b.substring(0, l)), g = {file:f}, d && (d.noOverwrite && (g.overwrite = "false"), d.lastVersionTag ? g.parent_rev = d.lastVersionTag : (d.parentRev || d.parent_rev) && (g.parent_rev = d.parentRev || d.parent_rev)), q = new a.Xhr("POST", "" + this.urls.postFile + "/" + this.urlEncodePath(b)), q.setParams(g).signWithOauth(this.oauth).setFileField("file", f, c, "application/octet-stream"), delete g.file, this.dispatchXhr(q, 
      function(b, c) {
        return e ? e(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.writeFileUsingPut = function(b, c, d, e) {
      var f, g;
      return f = {}, d && (d.noOverwrite && (f.overwrite = "false"), d.lastVersionTag ? f.parent_rev = d.lastVersionTag : (d.parentRev || d.parent_rev) && (f.parent_rev = d.parentRev || d.parent_rev)), g = new a.Xhr("POST", "" + this.urls.putFile + "/" + this.urlEncodePath(b)), g.setBody(c).setParams(f).signWithOauth(this.oauth), this.dispatchXhr(g, function(b, c) {
        return e ? e(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.resumableUploadStep = function(b, c, d) {
      var e, f;
      return c ? (e = {offset:c.offset}, c.tag && (e.upload_id = c.tag)) : e = {offset:0}, f = new a.Xhr("POST", this.urls.chunkedUpload), f.setBody(b).setParams(e).signWithOauth(this.oauth), this.dispatchXhr(f, function(b, c) {
        return b && b.status === a.ApiError.INVALID_PARAM && b.response && b.response.upload_id && b.response.offset ? d(null, a.UploadCursor.parse(b.response)) : d(b, a.UploadCursor.parse(c))
      })
    }, b.prototype.resumableUploadFinish = function(b, c, d, e) {
      var f, g;
      return e || "function" != typeof d || (e = d, d = null), f = {upload_id:c.tag}, d && (d.lastVersionTag ? f.parent_rev = d.lastVersionTag : (d.parentRev || d.parent_rev) && (f.parent_rev = d.parentRev || d.parent_rev), d.noOverwrite && (f.overwrite = "false")), g = new a.Xhr("POST", "" + this.urls.commitChunkedUpload + "/" + this.urlEncodePath(b)), g.setParams(f).signWithOauth(this.oauth), this.dispatchXhr(g, function(b, c) {
        return e ? e(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.stat = function(b, c, d) {
      var e, f, g;
      return d || "function" != typeof c || (d = c, c = null), f = {}, e = !1, c && (null != c.version && (f.rev = c.version), (c.removed || c.deleted) && (f.include_deleted = "true"), c.readDir && (f.list = "true", !0 !== c.readDir && (f.file_limit = "" + c.readDir)), c.cacheHash && (f.hash = c.cacheHash), c.httpCache && (e = !0)), f.include_deleted || (f.include_deleted = "false"), f.list || (f.list = "false"), g = new a.Xhr("GET", "" + this.urls.metadata + "/" + this.urlEncodePath(b)), g.setParams(f).signWithOauth(this.oauth, 
      e), this.dispatchXhr(g, function(b, c) {
        var e, f, k;
        k = a.Stat.parse(c);
        if(null != c && c.contents) {
          var g, m, l, q;
          l = c.contents;
          q = [];
          g = 0;
          for(m = l.length;m > g;g++) {
            f = l[g], q.push(a.Stat.parse(f))
          }
          f = q
        }else {
          f = void 0
        }
        return e = f, d(b, k, e)
      })
    }, b.prototype.readdir = function(a, b, c) {
      var d;
      return c || "function" != typeof b || (c = b, b = null), d = {readDir:!0}, b && (null != b.limit && (d.readDir = b.limit), b.versionTag && (d.versionTag = b.versionTag), (b.removed || b.deleted) && (d.removed = b.removed || b.deleted), b.httpCache && (d.httpCache = b.httpCache)), this.stat(a, d, function(a, b, d) {
        var e, f;
        if(d) {
          var k, g, m;
          m = [];
          k = 0;
          for(g = d.length;g > k;k++) {
            f = d[k], m.push(f.name)
          }
          f = m
        }else {
          f = null
        }
        return e = f, c(a, e, b, d)
      })
    }, b.prototype.metadata = function(a, b, c) {
      return this.stat(a, b, c)
    }, b.prototype.makeUrl = function(b, c, d) {
      var e, f, g, l, q, n = this;
      return d || "function" != typeof c || (d = c, c = null), f = c && (c["long"] || c.longUrl || c.downloadHack) ? {short_url:"false"} : {}, b = this.urlEncodePath(b), g = "" + this.urls.shares + "/" + b, e = !1, l = !1, c && (c.downloadHack ? (e = !0, l = !0) : c.download && (e = !0, g = "" + this.urls.media + "/" + b)), q = (new a.Xhr("POST", g)).setParams(f).signWithOauth(this.oauth), this.dispatchXhr(q, function(b, c) {
        return l && (null != c ? c.url : void 0) && (c.url = c.url.replace(n.authServer, n.downloadServer)), d(b, a.PublicUrl.parse(c, e))
      })
    }, b.prototype.history = function(b, c, d) {
      var e, f, g;
      return d || "function" != typeof c || (d = c, c = null), f = {}, e = !1, c && (null != c.limit && (f.rev_limit = c.limit), c.httpCache && (e = !0)), g = new a.Xhr("GET", "" + this.urls.revisions + "/" + this.urlEncodePath(b)), g.setParams(f).signWithOauth(this.oauth, e), this.dispatchXhr(g, function(b, c) {
        var e, f;
        if(c) {
          var k, g, m;
          m = [];
          k = 0;
          for(g = c.length;g > k;k++) {
            e = c[k], m.push(a.Stat.parse(e))
          }
          e = m
        }else {
          e = void 0
        }
        return f = e, d(b, f)
      })
    }, b.prototype.revisions = function(a, b, c) {
      return this.history(a, b, c)
    }, b.prototype.thumbnailUrl = function(a, b) {
      var c;
      return c = this.thumbnailXhr(a, b), c.paramsToUrl().url
    }, b.prototype.readThumbnail = function(b, c, d) {
      var e, f;
      return d || "function" != typeof c || (d = c, c = null), e = "b", c && c.blob && (e = "blob"), f = this.thumbnailXhr(b, c), f.setResponseType(e), this.dispatchXhr(f, function(b, c, e) {
        return d(b, c, a.Stat.parse(e))
      })
    }, b.prototype.thumbnailXhr = function(b, c) {
      var d, e;
      return d = {}, c && (c.format ? d.format = c.format : c.png && (d.format = "png"), c.size && (d.size = c.size)), e = new a.Xhr("GET", "" + this.urls.thumbnails + "/" + this.urlEncodePath(b)), e.setParams(d).signWithOauth(this.oauth)
    }, b.prototype.revertFile = function(b, c, d) {
      var e;
      return e = new a.Xhr("POST", "" + this.urls.restore + "/" + this.urlEncodePath(b)), e.setParams({rev:c}).signWithOauth(this.oauth), this.dispatchXhr(e, function(b, c) {
        return d ? d(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.restore = function(a, b, c) {
      return this.revertFile(a, b, c)
    }, b.prototype.findByName = function(b, c, d, e) {
      var f, g, l;
      return e || "function" != typeof d || (e = d, d = null), g = {query:c}, f = !1, d && (null != d.limit && (g.file_limit = d.limit), (d.removed || d.deleted) && (g.include_deleted = !0), d.httpCache && (f = !0)), l = new a.Xhr("GET", "" + this.urls.search + "/" + this.urlEncodePath(b)), l.setParams(g).signWithOauth(this.oauth, f), this.dispatchXhr(l, function(b, c) {
        var d, f;
        if(c) {
          var k, g, m;
          m = [];
          k = 0;
          for(g = c.length;g > k;k++) {
            d = c[k], m.push(a.Stat.parse(d))
          }
          d = m
        }else {
          d = void 0
        }
        return f = d, e(b, f)
      })
    }, b.prototype.search = function(a, b, c, d) {
      return this.findByName(a, b, c, d)
    }, b.prototype.makeCopyReference = function(b, c) {
      var d;
      return d = new a.Xhr("GET", "" + this.urls.copyRef + "/" + this.urlEncodePath(b)), d.signWithOauth(this.oauth), this.dispatchXhr(d, function(b, d) {
        return c(b, a.CopyReference.parse(d))
      })
    }, b.prototype.copyRef = function(a, b) {
      return this.makeCopyReference(a, b)
    }, b.prototype.pullChanges = function(b, c) {
      var d, e;
      return c || "function" != typeof b || (c = b, b = null), d = b ? b.cursorTag ? {cursor:b.cursorTag} : {cursor:b} : {}, e = new a.Xhr("POST", this.urls.delta), e.setParams(d).signWithOauth(this.oauth), this.dispatchXhr(e, function(b, d) {
        return c(b, a.PulledChanges.parse(d))
      })
    }, b.prototype.delta = function(a, b) {
      return this.pullChanges(a, b)
    }, b.prototype.mkdir = function(b, c) {
      var d;
      return d = new a.Xhr("POST", this.urls.fileopsCreateFolder), d.setParams({root:this.fileRoot, path:this.normalizePath(b)}).signWithOauth(this.oauth), this.dispatchXhr(d, function(b, d) {
        return c ? c(b, a.Stat.parse(d)) : void 0
      })
    }, b.prototype.remove = function(b, c) {
      var d;
      return d = new a.Xhr("POST", this.urls.fileopsDelete), d.setParams({root:this.fileRoot, path:this.normalizePath(b)}).signWithOauth(this.oauth), this.dispatchXhr(d, function(b, d) {
        return c ? c(b, a.Stat.parse(d)) : void 0
      })
    }, b.prototype.unlink = function(a, b) {
      return this.remove(a, b)
    }, b.prototype["delete"] = function(a, b) {
      return this.remove(a, b)
    }, b.prototype.copy = function(b, c, d) {
      var e, f, g;
      return d || "function" != typeof e || (d = e, e = null), f = {root:this.fileRoot, to_path:this.normalizePath(c)}, b instanceof a.CopyReference ? f.from_copy_ref = b.tag : f.from_path = this.normalizePath(b), g = new a.Xhr("POST", this.urls.fileopsCopy), g.setParams(f).signWithOauth(this.oauth), this.dispatchXhr(g, function(b, c) {
        return d ? d(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.move = function(b, c, d) {
      var e, f;
      return d || "function" != typeof e || (d = e, e = null), f = new a.Xhr("POST", this.urls.fileopsMove), f.setParams({root:this.fileRoot, from_path:this.normalizePath(b), to_path:this.normalizePath(c)}).signWithOauth(this.oauth), this.dispatchXhr(f, function(b, c) {
        return d ? d(b, a.Stat.parse(c)) : void 0
      })
    }, b.prototype.reset = function() {
      var a;
      return this.uid = null, this.oauth.setToken(null, ""), a = this.authState, this.authState = g.RESET, a !== this.authState && this.onAuthStateChange.dispatch(this), this.authError = null, this._credentials = null, this
    }, b.prototype.setCredentials = function(a) {
      var b;
      return b = this.authState, this.oauth.reset(a), this.uid = a.uid || null, this.authState = a.authState ? a.authState : a.token ? g.DONE : g.RESET, this.authError = null, this._credentials = null, b !== this.authState && this.onAuthStateChange.dispatch(this), this
    }, b.prototype.appHash = function() {
      return this.oauth.appHash()
    }, b.prototype.setupUrls = function() {
      return this.fileRoot = this.sandbox ? "sandbox" : "dropbox", this.urls = {requestToken:"" + this.apiServer + "/1/oauth/request_token", authorize:"" + this.authServer + "/1/oauth/authorize", accessToken:"" + this.apiServer + "/1/oauth/access_token", signOut:"" + this.apiServer + "/1/unlink_access_token", accountInfo:"" + this.apiServer + "/1/account/info", getFile:"" + this.fileServer + "/1/files/" + this.fileRoot, postFile:"" + this.fileServer + "/1/files/" + this.fileRoot, putFile:"" + this.fileServer + 
      "/1/files_put/" + this.fileRoot, metadata:"" + this.apiServer + "/1/metadata/" + this.fileRoot, delta:"" + this.apiServer + "/1/delta", revisions:"" + this.apiServer + "/1/revisions/" + this.fileRoot, restore:"" + this.apiServer + "/1/restore/" + this.fileRoot, search:"" + this.apiServer + "/1/search/" + this.fileRoot, shares:"" + this.apiServer + "/1/shares/" + this.fileRoot, media:"" + this.apiServer + "/1/media/" + this.fileRoot, copyRef:"" + this.apiServer + "/1/copy_ref/" + this.fileRoot, 
      thumbnails:"" + this.fileServer + "/1/thumbnails/" + this.fileRoot, chunkedUpload:"" + this.fileServer + "/1/chunked_upload", commitChunkedUpload:"" + this.fileServer + "/1/commit_chunked_upload/" + this.fileRoot, fileopsCopy:"" + this.apiServer + "/1/fileops/copy", fileopsCreateFolder:"" + this.apiServer + "/1/fileops/create_folder", fileopsDelete:"" + this.apiServer + "/1/fileops/delete", fileopsMove:"" + this.apiServer + "/1/fileops/move"}
    }, b.prototype.authState = null, b.ERROR = 0, b.RESET = 1, b.REQUEST = 2, b.AUTHORIZED = 3, b.DONE = 4, b.SIGNED_OFF = 5, b.prototype.urlEncodePath = function(b) {
      return a.Xhr.urlEncodeValue(this.normalizePath(b)).replace(/%2F/gi, "/")
    }, b.prototype.normalizePath = function(a) {
      var b;
      if("/" === a.substring(0, 1)) {
        for(b = 1;"/" === a.substring(b, b + 1);) {
          b += 1
        }
        return a.substring(b)
      }
      return a
    }, b.prototype.requestToken = function(b) {
      var c;
      return c = (new a.Xhr("POST", this.urls.requestToken)).signWithOauth(this.oauth), this.dispatchXhr(c, b)
    }, b.prototype.authorizeUrl = function(b) {
      var c;
      return c = {oauth_token:b, oauth_callback:this.driver.url(b)}, "" + this.urls.authorize + "?" + a.Xhr.urlEncode(c)
    }, b.prototype.getAccessToken = function(b) {
      var c;
      return c = (new a.Xhr("POST", this.urls.accessToken)).signWithOauth(this.oauth), this.dispatchXhr(c, b)
    }, b.prototype.dispatchXhr = function(a, b) {
      var c;
      return a.setCallback(b), a.onError = this.xhrOnErrorHandler, a.prepare(), c = a.xhr, this.onXhr.dispatch(a) && a.send(), c
    }, b.prototype.handleXhrError = function(b, c) {
      var d = this;
      return b.status === a.ApiError.INVALID_TOKEN && this.authState === g.DONE && (this.authError = b, this.authState = g.ERROR, this.onAuthStateChange.dispatch(this), this.driver && this.driver.onAuthStateChange) ? (this.driver.onAuthStateChange(this, function() {
        return d.onError.dispatch(b), c(b)
      }), null) : (this.onError.dispatch(b), c(b), null)
    }, b.prototype.defaultApiServer = function() {
      return"https://api.dropbox.com"
    }, b.prototype.defaultAuthServer = function() {
      return this.apiServer.replace("api.", "www.")
    }, b.prototype.defaultFileServer = function() {
      return this.apiServer.replace("api.", "api-content.")
    }, b.prototype.defaultDownloadServer = function() {
      return this.apiServer.replace("api.", "dl.")
    }, b.prototype.computeCredentials = function() {
      var a;
      return a = {key:this.oauth.key, sandbox:this.sandbox}, this.oauth.secret && (a.secret = this.oauth.secret), this.oauth.token && (a.token = this.oauth.token, a.tokenSecret = this.oauth.tokenSecret), this.uid && (a.uid = this.uid), this.authState !== g.ERROR && this.authState !== g.RESET && this.authState !== g.DONE && this.authState !== g.SIGNED_OFF && (a.authState = this.authState), this.apiServer !== this.defaultApiServer() && (a.server = this.apiServer), this.authServer !== this.defaultAuthServer() && 
      (a.authServer = this.authServer), this.fileServer !== this.defaultFileServer() && (a.fileServer = this.fileServer), this.downloadServer !== this.defaultDownloadServer() && (a.downloadServer = this.downloadServer), this._credentials = a
    }, b
  }(), g = a.Client, a.Drivers.BrowserBase = function() {
    function b(a) {
      this.rememberUser = (null != a ? a.rememberUser : void 0) || !1;
      this.useQuery = (null != a ? a.useQuery : void 0) || !1;
      this.scope = (null != a ? a.scope : void 0) || "default";
      this.storageKey = null;
      this.dbTokenRe = /(#|\?|&)dboauth_token=([^&#]+)(&|#|$)/;
      this.rejectedRe = /(#|\?|&)not_approved=true(&|#|$)/;
      this.tokenRe = /(#|\?|&)oauth_token=([^&#]+)(&|#|$)/
    }
    return b.prototype.onAuthStateChange = function(a, b) {
      var c = this;
      switch(this.setStorageKey(a), a.authState) {
        case g.RESET:
          return this.loadCredentials(function(d) {
            return d ? d.authState ? (a.setCredentials(d), b()) : c.rememberUser ? (a.setCredentials(d), a.getUserInfo(function(d) {
              return d ? (a.reset(), c.forgetCredentials(b)) : b()
            })) : (c.forgetCredentials(), b()) : b()
          });
        case g.REQUEST:
          return this.storeCredentials(a.credentials(), b);
        case g.DONE:
          return this.rememberUser ? this.storeCredentials(a.credentials(), b) : this.forgetCredentials(b);
        case g.SIGNED_OFF:
          return this.forgetCredentials(b);
        case g.ERROR:
          return this.forgetCredentials(b);
        default:
          return b(), this
      }
    }, b.prototype.setStorageKey = function(a) {
      return this.storageKey = "dropbox-auth:" + this.scope + ":" + a.appHash(), this
    }, b.prototype.storeCredentials = function(a, b) {
      return localStorage.setItem(this.storageKey, JSON.stringify(a)), b(), this
    }, b.prototype.loadCredentials = function(a) {
      var b;
      if(b = localStorage.getItem(this.storageKey), !b) {
        return a(null), this
      }
      try {
        a(JSON.parse(b))
      }catch(c) {
        a(null)
      }
      return this
    }, b.prototype.forgetCredentials = function(a) {
      return localStorage.removeItem(this.storageKey), a(), this
    }, b.prototype.computeUrl = function(a) {
      var b, c, d, e;
      return e = "_dropboxjs_scope=" + encodeURIComponent(this.scope) + "&dboauth_token=", c = a, -1 === c.indexOf("#") ? b = null : (d = c.split("#", 2), c = d[0], b = d[1]), this.useQuery ? (c += -1 === c.indexOf("?") ? "?" + e : "&" + e, b ? [c, "#" + b] : [c, ""]) : [c + "#?" + e, ""]
    }, b.prototype.locationToken = function(b) {
      var c, d, e;
      return c = b || a.Drivers.BrowserBase.currentLocation(), e = "_dropboxjs_scope=" + encodeURIComponent(this.scope) + "&", -1 === ("function" == typeof c.indexOf ? c.indexOf(e) : void 0) ? null : this.rejectedRe.test(c) ? (d = this.dbTokenRe.exec(c), d ? decodeURIComponent(d[2]) : null) : (d = this.tokenRe.exec(c), d ? decodeURIComponent(d[2]) : null)
    }, b.currentLocation = function() {
      return window.location.href
    }, b
  }(), a.Drivers.Redirect = function(b) {
    function c(b) {
      c.__super__.constructor.call(this, b);
      b = this.computeUrl(a.Drivers.BrowserBase.currentLocation());
      this.receiverUrl1 = b[0];
      this.receiverUrl2 = b[1]
    }
    return M(c, b), c.prototype.onAuthStateChange = function(a, b) {
      var d, e = this;
      return d = function() {
        return function() {
          return c.__super__.onAuthStateChange.call(e, a, b)
        }
      }(), this.setStorageKey(a), a.authState === g.RESET ? this.loadCredentials(function(a) {
        return a && a.authState ? a.token === e.locationToken() && a.authState === g.REQUEST ? (a.authState = g.AUTHORIZED, e.storeCredentials(a, d)) : e.forgetCredentials(d) : d()
      }) : d()
    }, c.prototype.url = function(a) {
      return this.receiverUrl1 + encodeURIComponent(a) + this.receiverUrl2
    }, c.prototype.doAuthorize = function(a) {
      return window.location.assign(a)
    }, c
  }(a.Drivers.BrowserBase), a.Drivers.Popup = function(b) {
    function c(a) {
      c.__super__.constructor.call(this, a);
      a = this.computeUrl(this.baseUrl(a));
      this.receiverUrl1 = a[0];
      this.receiverUrl2 = a[1]
    }
    return M(c, b), c.prototype.onAuthStateChange = function(a, b) {
      var d, e = this;
      return d = function() {
        return function() {
          return c.__super__.onAuthStateChange.call(e, a, b)
        }
      }(), this.setStorageKey(a), a.authState === g.RESET ? this.loadCredentials(function(a) {
        return a && a.authState ? e.forgetCredentials(d) : d()
      }) : d()
    }, c.prototype.doAuthorize = function(a, b, c, d) {
      return this.listenForMessage(b, d), this.openWindow(a)
    }, c.prototype.url = function(a) {
      return this.receiverUrl1 + encodeURIComponent(a) + this.receiverUrl2
    }, c.prototype.baseUrl = function(b) {
      var c;
      if(b) {
        if(b.receiverUrl) {
          return b.receiverUrl
        }
        if(b.receiverFile) {
          return c = a.Drivers.BrowserBase.currentLocation().split("/"), c[c.length - 1] = b.receiverFile, c.join("/")
        }
      }
      return a.Drivers.BrowserBase.currentLocation()
    }, c.prototype.openWindow = function(a) {
      return window.open(a, "_dropboxOauthSigninWindow", this.popupWindowSpec(980, 700))
    }, c.prototype.popupWindowSpec = function(a, b) {
      var c, d, e, f, k, g, l, q, n, t;
      return k = null != (l = window.screenX) ? l : window.screenLeft, g = null != (q = window.screenY) ? q : window.screenTop, f = null != (n = window.outerWidth) ? n : document.documentElement.clientWidth, c = null != (t = window.outerHeight) ? t : document.documentElement.clientHeight, d = Math.round(k + (f - a) / 2), e = Math.round(g + (c - b) / 2.5), k > d && (d = k), g > e && (e = g), "width=" + a + ",height=" + b + "," + ("left=" + d + ",top=" + e) + "dialog=yes,dependent=yes,scrollbars=yes,location=yes"
    }, c.prototype.listenForMessage = function(b, c) {
      var d, e = this;
      return d = function(f) {
        var k;
        return k = f.data ? f.data : f, e.locationToken(k) === b ? (b = null, window.removeEventListener("message", d), a.Drivers.Popup.onMessage.removeListener(d), c()) : void 0
      }, window.addEventListener("message", d, !1), a.Drivers.Popup.onMessage.addListener(d)
    }, c.oauthReceiver = function() {
      return window.addEventListener("load", function() {
        var a;
        if(a = window.opener, window.parent !== window.top && (a || (a = window.parent)), a) {
          try {
            a.postMessage(window.location.href, "*")
          }catch(b) {
          }
          try {
            a.Dropbox.Drivers.Popup.onMessage.dispatch(window.location.href)
          }catch(c) {
          }
        }
        return window.close()
      })
    }, c.onMessage = new a.EventSource, c
  }(a.Drivers.BrowserBase), c = null, f = null, "undefined" != typeof chrome && null !== chrome && (chrome.runtime && (chrome.runtime.onMessage && (c = chrome.runtime.onMessage), chrome.runtime.sendMessage && (f = function(a) {
    return chrome.runtime.sendMessage(a)
  })), chrome.extension && (chrome.extension.onMessage && (c || (c = chrome.extension.onMessage)), chrome.extension.sendMessage && (f || (f = function(a) {
    return chrome.extension.sendMessage(a)
  }))), c || function() {
    var b, c;
    return c = function(b) {
      return b.Dropbox ? (a.Drivers.Chrome.prototype.onMessage = b.Dropbox.Drivers.Chrome.onMessage, a.Drivers.Chrome.prototype.sendMessage = b.Dropbox.Drivers.Chrome.sendMessage) : (b.Dropbox = a, a.Drivers.Chrome.prototype.onMessage = new a.EventSource, a.Drivers.Chrome.prototype.sendMessage = function(b) {
        return a.Drivers.Chrome.prototype.onMessage.dispatch(b)
      })
    }, chrome.extension && chrome.extension.getBackgroundPage && (b = chrome.extension.getBackgroundPage()) ? c(b) : chrome.runtime && chrome.runtime.getBackgroundPage ? chrome.runtime.getBackgroundPage(function(a) {
      return c(a)
    }) : void 0
  }()), a.Drivers.Chrome = function(b) {
    function d(a) {
      d.__super__.constructor.call(this, a);
      a = a && a.receiverPath || "chrome_oauth_receiver.html";
      this.useQuery = this.rememberUser = !0;
      a = this.computeUrl(this.expandUrl(a));
      this.receiverUrl = a[0];
      this.receiverUrl2 = a[1];
      this.storageKey = "dropbox_js_" + this.scope + "_credentials"
    }
    return M(d, b), d.prototype.onMessage = c, d.prototype.sendMessage = f, d.prototype.expandUrl = function(a) {
      return chrome.runtime && chrome.runtime.getURL ? chrome.runtime.getURL(a) : chrome.extension && chrome.extension.getURL ? chrome.extension.getURL(a) : a
    }, d.prototype.onAuthStateChange = function(b, c) {
      var d = this;
      switch(b.authState) {
        case a.Client.RESET:
          return this.loadCredentials(function(a) {
            if(a) {
              if(a.authState) {
                return d.forgetCredentials(c)
              }
              b.setCredentials(a)
            }
            return c()
          });
        case a.Client.DONE:
          return this.storeCredentials(b.credentials(), c);
        case a.Client.SIGNED_OFF:
          return this.forgetCredentials(c);
        case a.Client.ERROR:
          return this.forgetCredentials(c);
        default:
          return c()
      }
    }, d.prototype.doAuthorize = function(a, b, c, d) {
      var e, f, g, k, l = this;
      return null != (f = chrome.identity) && f.launchWebAuthFlow ? chrome.identity.launchWebAuthFlow({url:a, interactive:!0}, function(a) {
        return l.locationToken(a) === b ? d() : void 0
      }) : null != (g = chrome.experimental) && null != (k = g.identity) && k.launchWebAuthFlow ? chrome.experimental.identity.launchWebAuthFlow({url:a, interactive:!0}, function(a) {
        return l.locationToken(a) === b ? d() : void 0
      }) : (e = {handle:null}, this.listenForMessage(b, e, d), this.openWindow(a, function(a) {
        return e.handle = a
      }))
    }, d.prototype.openWindow = function(a, b) {
      return chrome.tabs && chrome.tabs.create ? (chrome.tabs.create({url:a, active:!0, pinned:!1}, function(a) {
        return b(a)
      }), this) : this
    }, d.prototype.closeWindow = function(a) {
      return chrome.tabs && chrome.tabs.remove && a.id ? (chrome.tabs.remove(a.id), this) : chrome.app && chrome.app.window && a.close ? (a.close(), this) : this
    }, d.prototype.url = function(a) {
      return this.receiverUrl + encodeURIComponent(a)
    }, d.prototype.listenForMessage = function(a, b, c) {
      var d, e = this;
      return d = function(f, g) {
        return g && g.tab && g.tab.url.substring(0, e.receiverUrl.length) !== e.receiverUrl || !f.dropbox_oauth_receiver_href ? void 0 : e.locationToken(f.dropbox_oauth_receiver_href) === a ? (b.handle && e.closeWindow(b.handle), e.onMessage.removeListener(d), c()) : void 0
      }, this.onMessage.addListener(d)
    }, d.prototype.storeCredentials = function(a, b) {
      var c;
      return c = {}, c[this.storageKey] = a, chrome.storage.local.set(c, b), this
    }, d.prototype.loadCredentials = function(a) {
      var b = this;
      return chrome.storage.local.get(this.storageKey, function(c) {
        return a(c[b.storageKey] || null)
      }), this
    }, d.prototype.forgetCredentials = function(a) {
      return chrome.storage.local.remove(this.storageKey, a), this
    }, d.oauthReceiver = function() {
      return window.addEventListener("load", function() {
        var b;
        return b = new a.Drivers.Chrome, b.sendMessage({dropbox_oauth_receiver_href:window.location.href}), window.close ? window.close() : void 0
      })
    }, d
  }(a.Drivers.BrowserBase), a.Drivers.NodeServer = function() {
    function a(b) {
      this.port = (null != b ? b.port : void 0) || 8912;
      this.faviconFile = (null != b ? b.favicon : void 0) || null;
      this.fs = require("fs");
      this.http = require("http");
      this.open = require("open");
      this.callbacks = {};
      this.nodeUrl = require("url");
      this.createApp()
    }
    return a.prototype.url = function(a) {
      return"http://localhost:" + this.port + "/oauth_callback?dboauth_token=" + encodeURIComponent(a)
    }, a.prototype.doAuthorize = function(a, b, c, d) {
      return this.callbacks[b] = d, this.openBrowser(a)
    }, a.prototype.openBrowser = function(a) {
      if(!a.match(/^https?:\/\//)) {
        throw Error("Not a http/https URL: " + a);
      }
      return this.open(a)
    }, a.prototype.createApp = function() {
      var a = this;
      return this.app = this.http.createServer(function(b, c) {
        return a.doRequest(b, c)
      }), this.app.listen(this.port)
    }, a.prototype.closeServer = function() {
      return this.app.close()
    }, a.prototype.doRequest = function(a, b) {
      var c, d, e, f, g = this;
      return f = this.nodeUrl.parse(a.url, !0), "/oauth_callback" === f.pathname && ("true" === f.query.not_approved ? (d = !0, e = f.query.dboauth_token) : (d = !1, e = f.query.oauth_token), this.callbacks[e] && (this.callbacks[e](d), delete this.callbacks[e])), c = "", a.on("data", function(a) {
        return c += a
      }), a.on("end", function() {
        return g.faviconFile && "/favicon.ico" === f.pathname ? g.sendFavicon(b) : g.closeBrowser(b)
      })
    }, a.prototype.closeBrowser = function(a) {
      return a.writeHead(200, {"Content-Length":104, "Content-Type":"text/html"}), a.write('<!doctype html>\n<script type="text/javascript">window.close();\x3c/script>\n<p>Please close this window.</p>'), a.end()
    }, a.prototype.sendFavicon = function(a) {
      return this.fs.readFile(this.faviconFile, function(b, c) {
        return a.writeHead(200, {"Content-Length":c.length, "Content-Type":"image/x-icon"}), a.write(c), a.end()
      })
    }, a
  }(), I = function(a, b) {
    return t(R(D(a), D(b), a.length, b.length))
  }, B = function(a) {
    return t(V(D(a), a.length))
  }, "undefined" != typeof require) {
    try {
      F = require("crypto"), F.createHmac && F.createHash && (I = function(a, b) {
        var c;
        return c = F.createHmac("sha1", b), c.update(a), c.digest("base64")
      }, B = function(a) {
        var b;
        return b = F.createHash("sha1"), b.update(a), b.digest("base64")
      })
    }catch(S) {
    }
  }
  if(a.Util.hmac = I, a.Util.sha1 = B, R = function(a, b, c, d) {
    var e, f, g, l;
    return 16 < b.length && (b = V(b, d)), g = function() {
      var a, c;
      c = [];
      for(f = a = 0;16 > a;f = ++a) {
        c.push(909522486 ^ b[f])
      }
      return c
    }(), l = function() {
      var a, c;
      c = [];
      for(f = a = 0;16 > a;f = ++a) {
        c.push(1549556828 ^ b[f])
      }
      return c
    }(), e = V(g.concat(a), 64 + c), V(l.concat(e), 84)
  }, V = function(a, b) {
    var c, d, e, f, g, l, n, t, u, w, x, z, Q, A, h, B, D;
    a[b >> 2] |= 1 << 31 - ((3 & b) << 3);
    a[(b + 8 >> 6 << 4) + 15] = b << 3;
    B = Array(80);
    c = 1732584193;
    e = -271733879;
    g = -1732584194;
    n = 271733878;
    u = -1009589776;
    z = 0;
    for(h = a.length;h > z;) {
      d = c;
      f = e;
      l = g;
      t = n;
      w = u;
      for(Q = D = 0;80 > D;Q = ++D) {
        B[Q] = 16 > Q ? a[z + Q] : P(B[Q - 3] ^ B[Q - 8] ^ B[Q - 14] ^ B[Q - 16], 1), 20 > Q ? (x = e & g | ~e & n, A = 1518500249) : 40 > Q ? (x = e ^ g ^ n, A = 1859775393) : 60 > Q ? (x = e & g | e & n | g & n, A = -1894007588) : (x = e ^ g ^ n, A = -899497514), Q = v(v(P(c, 5), x), v(v(u, B[Q]), A)), u = n, n = g, g = P(e, 30), e = c, c = Q
      }
      c = v(c, d);
      e = v(e, f);
      g = v(g, l);
      n = v(n, t);
      u = v(u, w);
      z += 16
    }
    return[c, e, g, n, u]
  }, P = function(a, b) {
    return a << b | a >>> 32 - b
  }, v = function(a, b) {
    var c, d;
    return d = (65535 & a) + (65535 & b), c = (a >> 16) + (b >> 16) + (d >> 16), c << 16 | 65535 & d
  }, t = function(a) {
    var b, c, d, e, f;
    e = "";
    b = 0;
    for(d = 4 * a.length;d > b;) {
      c = b, f = (255 & a[c >> 2] >> (3 - (3 & c) << 3)) << 16, c += 1, f |= (255 & a[c >> 2] >> (3 - (3 & c) << 3)) << 8, c += 1, f |= 255 & a[c >> 2] >> (3 - (3 & c) << 3), e += Y[63 & f >> 18], e += Y[63 & f >> 12], b += 1, e += b >= d ? "=" : Y[63 & f >> 6], b += 1, e += b >= d ? "=" : Y[63 & f], b += 1
    }
    return e
  }, Y = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", D = function(a) {
    var b, c, d, e;
    b = [];
    c = d = 0;
    for(e = a.length;0 <= e ? e > d : d > e;c = 0 <= e ? ++d : --d) {
      b[c >> 2] |= (a.charCodeAt(c) & 255) << (3 - (3 & c) << 3)
    }
    return b
  }, a.Oauth = function() {
    function b(a) {
      this._appHash = this.tokenSecret = this.token = this.secret = this.s = this.key = this.k = null;
      this.reset(a)
    }
    return b.prototype.reset = function(a) {
      var b, c;
      if(a.secret) {
        this.k = this.key = a.key, this.s = this.secret = a.secret, this._appHash = null
      }else {
        if(a.key) {
          this.key = a.key, this.secret = null, b = u(z(this.key).split("|", 2)[1]), c = b.split("?", 2), b = c[0], c = c[1], this.k = decodeURIComponent(b), this.s = decodeURIComponent(c), this._appHash = null
        }else {
          if(!this.k) {
            throw Error("No API key supplied");
          }
        }
      }
      return a.token ? this.setToken(a.token, a.tokenSecret) : this.setToken(null, "")
    }, b.prototype.setToken = function(b, c) {
      if(b && !c) {
        throw Error("No secret supplied with the user token");
      }
      return this.token = b, this.tokenSecret = c || "", this.hmacKey = a.Xhr.urlEncodeValue(this.s) + "&" + a.Xhr.urlEncodeValue(c), null
    }, b.prototype.authHeader = function(b, c, d) {
      var e, f, g;
      this.addAuthParams(b, c, d);
      c = [];
      for(e in d) {
        "oauth_" === e.substring(0, 6) && c.push(e)
      }
      c.sort();
      b = [];
      f = 0;
      for(g = c.length;g > f;f++) {
        e = c[f], b.push(a.Xhr.urlEncodeValue(e) + '="' + a.Xhr.urlEncodeValue(d[e]) + '"'), delete d[e]
      }
      return"OAuth " + b.join(",")
    }, b.prototype.addAuthParams = function(a, b, c) {
      return this.boilerplateParams(c), c.oauth_signature = this.signature(a, b, c), c
    }, b.prototype.boilerplateParams = function(b) {
      return b.oauth_consumer_key = this.k, b.oauth_nonce = a.Oauth.nonce(), b.oauth_signature_method = "HMAC-SHA1", this.token && (b.oauth_token = this.token), b.oauth_timestamp = Math.floor(Date.now() / 1E3), b.oauth_version = "1.0", b
    }, b.nonce = function() {
      return Math.random().toString(36)
    }, b.prototype.signature = function(b, c, d) {
      var e;
      return e = b.toUpperCase() + "&" + a.Xhr.urlEncodeValue(c) + "&" + a.Xhr.urlEncodeValue(a.Xhr.urlEncode(d)), I(e, this.hmacKey)
    }, b.prototype.appHash = function() {
      return this._appHash ? this._appHash : this._appHash = B(this.k).replace(/\=/g, "")
    }, b
  }(), null == Date.now && (Date.now = function() {
    return(new Date).getTime()
  }), z = function(a, b) {
    var c, d, e, f, g, l, n, t, v, w, x;
    b ? (b = [encodeURIComponent(a), encodeURIComponent(b)].join("?"), a = function() {
      var b, d, e;
      e = [];
      c = b = 0;
      for(d = a.length / 2;0 <= d ? d > b : b > d;c = 0 <= d ? ++b : --b) {
        e.push(16 * (15 & a.charCodeAt(2 * c)) + (15 & a.charCodeAt(2 * c + 1)))
      }
      return e
    }()) : (v = a.split("|", 2), a = v[0], b = v[1], a = u(a), a = function() {
      var b, d, e;
      e = [];
      c = b = 0;
      for(d = a.length;0 <= d ? d > b : b > d;c = 0 <= d ? ++b : --b) {
        e.push(a.charCodeAt(c))
      }
      return e
    }(), b = u(b));
    f = function() {
      x = [];
      for(t = 0;256 > t;t++) {
        x.push(t)
      }
      return x
    }.apply(this);
    for(g = v = l = 0;256 > v;g = ++v) {
      l = (l + f[c] + a[g % a.length]) % 256, w = [f[l], f[g]], f[g] = w[0], f[l] = w[1]
    }
    return g = l = 0, e = function() {
      var a, c, e, h;
      h = [];
      n = a = 0;
      for(c = b.length;0 <= c ? c > a : a > c;n = 0 <= c ? ++a : --a) {
        g = (g + 1) % 256, l = (l + f[g]) % 256, e = [f[l], f[g]], f[g] = e[0], f[l] = e[1], d = f[(f[g] + f[l]) % 256], h.push(String.fromCharCode((d ^ b.charCodeAt(n)) % 256))
      }
      return h
    }(), a = function() {
      var b, d, e;
      e = [];
      c = b = 0;
      for(d = a.length;0 <= d ? d > b : b > d;c = 0 <= d ? ++b : --b) {
        e.push(String.fromCharCode(a[c]))
      }
      return e
    }(), [A(a.join("")), A(e.join(""))].join("|")
  }, a.Util.encodeKey = z, a.PulledChanges = function() {
    function b(c) {
      this.blankSlate = c.reset || !1;
      this.cursorTag = c.cursor;
      this.shouldPullAgain = c.has_more;
      this.shouldBackOff = !this.shouldPullAgain;
      if(c.cursor && c.cursor.length) {
        var d, e, f, g;
        f = c.entries;
        g = [];
        d = 0;
        for(e = f.length;e > d;d++) {
          c = f[d], g.push(a.PullChange.parse(c))
        }
        c = g
      }else {
        c = []
      }
      this.changes = c
    }
    return b.parse = function(b) {
      return b && "object" == typeof b ? new a.PulledChanges(b) : b
    }, b.prototype.blankSlate = void 0, b.prototype.cursorTag = void 0, b.prototype.changes = void 0, b.prototype.shouldPullAgain = void 0, b.prototype.shouldBackOff = void 0, b.prototype.cursor = function() {
      return this.cursorTag
    }, b
  }(), a.PullChange = function() {
    function b(c) {
      this.path = c[0];
      (this.stat = a.Stat.parse(c[1])) ? this.wasRemoved = !1 : (this.stat = null, this.wasRemoved = !0)
    }
    return b.parse = function(b) {
      return b && "object" == typeof b ? new a.PullChange(b) : b
    }, b.prototype.path = void 0, b.prototype.wasRemoved = void 0, b.prototype.stat = void 0, b
  }(), a.RangeInfo = function() {
    function b(a) {
      var c;
      (c = /^bytes (\d*)-(\d*)\/(.*)$/.exec(a)) ? (this.start = parseInt(c[1]), this.end = parseInt(c[2]), this.size = "*" === c[3] ? null : parseInt(c[3])) : (this.start = 0, this.end = 0, this.size = null)
    }
    return b.parse = function(b) {
      return"string" == typeof b ? new a.RangeInfo(b) : b
    }, b.prototype.start = null, b.prototype.size = null, b.prototype.end = null, b
  }(), a.PublicUrl = function() {
    function b(a, c) {
      this.url = a.url;
      this.expiresAt = new Date(Date.parse(a.expires));
      this.isDirect = !0 === c ? !0 : !1 === c ? !1 : "direct" in a ? a.direct : 864E5 >= Date.now() - this.expiresAt;
      this.isPreview = !this.isDirect;
      this._json = null
    }
    return b.parse = function(b, c) {
      return b && "object" == typeof b ? new a.PublicUrl(b, c) : b
    }, b.prototype.url = null, b.prototype.expiresAt = null, b.prototype.isDirect = null, b.prototype.isPreview = null, b.prototype.json = function() {
      return this._json || (this._json = {url:this.url, expires:"" + this.expiresAt, direct:this.isDirect})
    }, b
  }(), a.CopyReference = function() {
    function b(a) {
      "object" == typeof a ? (this.tag = a.copy_ref, this.expiresAt = new Date(Date.parse(a.expires)), this._json = a) : (this.tag = a, this.expiresAt = new Date(1E3 * Math.ceil(Date.now() / 1E3)), this._json = null)
    }
    return b.parse = function(b) {
      return!b || "object" != typeof b && "string" != typeof b ? b : new a.CopyReference(b)
    }, b.prototype.tag = null, b.prototype.expiresAt = null, b.prototype.json = function() {
      return this._json || (this._json = {copy_ref:this.tag, expires:"" + this.expiresAt})
    }, b
  }(), a.Stat = function() {
    function b(a) {
      var c, d, e, f;
      switch(this._json = a, this.path = a.path, "/" !== this.path.substring(0, 1) && (this.path = "/" + this.path), c = this.path.length - 1, 0 <= c && "/" === this.path.substring(c) && (this.path = this.path.substring(0, c)), d = this.path.lastIndexOf("/"), this.name = this.path.substring(d + 1), this.isFolder = a.is_dir || !1, this.isFile = !this.isFolder, this.isRemoved = a.is_deleted || !1, this.typeIcon = a.icon, this.modifiedAt = null != (e = a.modified) && e.length ? new Date(Date.parse(a.modified)) : 
      null, this.clientModifiedAt = null != (f = a.client_mtime) && f.length ? new Date(Date.parse(a.client_mtime)) : null, a.root) {
        case "dropbox":
          this.inAppFolder = !1;
          break;
        case "app_folder":
          this.inAppFolder = !0;
          break;
        default:
          this.inAppFolder = null
      }
      this.size = a.bytes || 0;
      this.humanSize = a.size || "";
      this.hasThumbnail = a.thumb_exists || !1;
      this.isFolder ? (this.versionTag = a.hash, this.mimeType = a.mime_type || "inode/directory") : (this.versionTag = a.rev, this.mimeType = a.mime_type || "application/octet-stream")
    }
    return b.parse = function(b) {
      return b && "object" == typeof b ? new a.Stat(b) : b
    }, b.prototype.path = null, b.prototype.name = null, b.prototype.inAppFolder = null, b.prototype.isFolder = null, b.prototype.isFile = null, b.prototype.isRemoved = null, b.prototype.typeIcon = null, b.prototype.versionTag = null, b.prototype.mimeType = null, b.prototype.size = null, b.prototype.humanSize = null, b.prototype.hasThumbnail = null, b.prototype.modifiedAt = null, b.prototype.clientModifiedAt = null, b.prototype.json = function() {
      return this._json
    }, b
  }(), a.UploadCursor = function() {
    function b(a) {
      this.replace(a)
    }
    return b.parse = function(b) {
      return!b || "object" != typeof b && "string" != typeof b ? b : new a.UploadCursor(b)
    }, b.prototype.tag = null, b.prototype.offset = null, b.prototype.expiresAt = null, b.prototype.json = function() {
      return this._json || (this._json = {upload_id:this.tag, offset:this.offset, expires:"" + this.expiresAt})
    }, b.prototype.replace = function(a) {
      return"object" == typeof a ? (this.tag = a.upload_id || null, this.offset = a.offset || 0, this.expiresAt = new Date(Date.parse(a.expires) || Date.now()), this._json = a) : (this.tag = a || null, this.offset = 0, this.expiresAt = new Date(1E3 * Math.floor(Date.now() / 1E3)), this._json = null), this
    }, b
  }(), a.UserInfo = function() {
    function b(a) {
      var c;
      this._json = a;
      this.name = a.display_name;
      this.email = a.email;
      this.countryCode = a.country || null;
      this.uid = "" + a.uid;
      a.public_app_url ? (this.publicAppUrl = a.public_app_url, c = this.publicAppUrl.length - 1, 0 <= c && "/" === this.publicAppUrl.substring(c) && (this.publicAppUrl = this.publicAppUrl.substring(0, c))) : this.publicAppUrl = null;
      this.referralUrl = a.referral_link;
      this.quota = a.quota_info.quota;
      this.privateBytes = a.quota_info.normal || 0;
      this.sharedBytes = a.quota_info.shared || 0;
      this.usedQuota = this.privateBytes + this.sharedBytes
    }
    return b.parse = function(b) {
      return b && "object" == typeof b ? new a.UserInfo(b) : b
    }, b.prototype.name = null, b.prototype.email = null, b.prototype.countryCode = null, b.prototype.uid = null, b.prototype.referralUrl = null, b.prototype.publicAppUrl = null, b.prototype.quota = null, b.prototype.usedQuota = null, b.prototype.privateBytes = null, b.prototype.sharedBytes = null, b.prototype.json = function() {
      return this._json
    }, b
  }(), "undefined" != typeof window && null !== window ? (!window.XDomainRequest || "withCredentials" in new XMLHttpRequest ? (n = window.XMLHttpRequest, e = !1, d = -1 === window.navigator.userAgent.indexOf("Firefox")) : (n = window.XDomainRequest, e = !0, d = !1), b = !0) : (n = require("xhr2"), e = !1, d = !1, b = !1), "undefined" == typeof Uint8Array ? (l = null, w = !1) : (Object.getPrototypeOf ? l = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array(0))).constructor : Object.__proto__ && 
  (l = (new Uint8Array(0)).__proto__.__proto__.constructor), w = l !== Object), a.Xhr = function() {
    function c(a, b) {
      this.method = a;
      this.isGet = "GET" === this.method;
      this.url = b;
      this.wantHeaders = !1;
      this.headers = {};
      this.body = this.params = null;
      this.preflight = !(this.isGet || "POST" === this.method);
      this.completed = this.signed = !1;
      this.onError = this.xhr = this.callback = this.responseType = null
    }
    return c.Request = n, c.ieXdr = e, c.canSendForms = d, c.doesPreflight = b, c.ArrayBufferView = l, c.sendArrayBufferView = w, c.prototype.xhr = null, c.prototype.onError = null, c.prototype.setParams = function(a) {
      if(this.signed) {
        throw Error("setParams called after addOauthParams or addOauthHeader");
      }
      if(this.params) {
        throw Error("setParams cannot be called twice");
      }
      return this.params = a, this
    }, c.prototype.setCallback = function(a) {
      return this.callback = a, this
    }, c.prototype.signWithOauth = function(b, c) {
      return a.Xhr.ieXdr ? this.addOauthParams(b) : this.preflight || !a.Xhr.doesPreflight ? this.addOauthHeader(b) : this.isGet && c ? this.addOauthHeader(b) : this.addOauthParams(b)
    }, c.prototype.addOauthParams = function(a) {
      if(this.signed) {
        throw Error("Request already has an OAuth signature");
      }
      return this.params || (this.params = {}), a.addAuthParams(this.method, this.url, this.params), this.signed = !0, this
    }, c.prototype.addOauthHeader = function(a) {
      if(this.signed) {
        throw Error("Request already has an OAuth signature");
      }
      return this.params || (this.params = {}), this.signed = !0, this.setHeader("Authorization", a.authHeader(this.method, this.url, this.params))
    }, c.prototype.setBody = function(a) {
      if(this.isGet) {
        throw Error("setBody cannot be called on GET requests");
      }
      if(null !== this.body) {
        throw Error("Request already has a body");
      }
      return"string" == typeof a || "undefined" != typeof FormData && a instanceof FormData || (this.headers["Content-Type"] = "application/octet-stream", this.preflight = !0), this.body = a, this
    }, c.prototype.setResponseType = function(a) {
      return this.responseType = a, this
    }, c.prototype.setHeader = function(a, b) {
      var c;
      if(this.headers[a]) {
        throw c = this.headers[a], Error("HTTP header " + a + " already set to " + c);
      }
      if("Content-Type" === a) {
        throw Error("Content-Type is automatically computed based on setBody");
      }
      return this.preflight = !0, this.headers[a] = b, this
    }, c.prototype.reportResponseHeaders = function() {
      return this.wantHeaders = !0
    }, c.prototype.setFileField = function(b, c, d, e) {
      var f, g;
      if(null !== this.body) {
        throw Error("Request already has a body");
      }
      if(this.isGet) {
        throw Error("setFileField cannot be called on GET requests");
      }
      return"object" == typeof d && "undefined" != typeof Blob ? ("undefined" != typeof ArrayBuffer && (d instanceof ArrayBuffer ? a.Xhr.sendArrayBufferView && (d = new Uint8Array(d)) : !a.Xhr.sendArrayBufferView && 0 === d.byteOffset && d.buffer instanceof ArrayBuffer && (d = d.buffer)), e || (e = "application/octet-stream"), d = new Blob([d], {type:e}), "undefined" != typeof File && d instanceof File && (d = new Blob([d], {type:d.type})), g = d instanceof Blob) : g = !1, g ? (this.body = new FormData, 
      this.body.append(b, d, c)) : (e || (e = "application/octet-stream"), f = this.multipartBoundary(), this.headers["Content-Type"] = "multipart/form-data; boundary=" + f, this.body = ["--", f, '\r\nContent-Disposition: form-data; name="', b, '"; filename="', c, '"\r\nContent-Type: ', e, "\r\nContent-Transfer-Encoding: binary\r\n\r\n", d, "\r\n--", f, "--\r\n"].join(""))
    }, c.prototype.multipartBoundary = function() {
      return[Date.now().toString(36), Math.random().toString(36)].join("----")
    }, c.prototype.paramsToUrl = function() {
      var b;
      return this.params && (b = a.Xhr.urlEncode(this.params), 0 !== b.length && (this.url = [this.url, "?", b].join("")), this.params = null), this
    }, c.prototype.paramsToBody = function() {
      if(this.params) {
        if(null !== this.body) {
          throw Error("Request already has a body");
        }
        if(this.isGet) {
          throw Error("paramsToBody cannot be called on GET requests");
        }
        this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        this.body = a.Xhr.urlEncode(this.params);
        this.params = null
      }
      return this
    }, c.prototype.prepare = function() {
      var b, c, d, e = this;
      if(c = a.Xhr.ieXdr, this.isGet || null !== this.body || c ? (this.paramsToUrl(), null !== this.body && "string" == typeof this.body && (this.headers["Content-Type"] = "text/plain; charset=utf8")) : this.paramsToBody(), this.xhr = new a.Xhr.Request, c ? (this.xhr.onload = function() {
        return e.onXdrLoad()
      }, this.xhr.onerror = function() {
        return e.onXdrError()
      }, this.xhr.ontimeout = function() {
        return e.onXdrError()
      }, this.xhr.onprogress = function() {
      }) : this.xhr.onreadystatechange = function() {
        return e.onReadyStateChange()
      }, this.xhr.open(this.method, this.url, !0), !c) {
        for(b in c = this.headers, c) {
          W.call(c, b) && (d = c[b], this.xhr.setRequestHeader(b, d))
        }
      }
      return this.responseType && ("b" === this.responseType ? this.xhr.overrideMimeType && this.xhr.overrideMimeType("text/plain; charset=x-user-defined") : this.xhr.responseType = this.responseType), this
    }, c.prototype.send = function(b) {
      if(this.callback = b || this.callback, null !== this.body) {
        b = this.body;
        a.Xhr.sendArrayBufferView && b instanceof ArrayBuffer && (b = new Uint8Array(b));
        try {
          this.xhr.send(b)
        }catch(c) {
          if(a.Xhr.sendArrayBufferView || "undefined" == typeof Blob) {
            throw c;
          }
          b = new Blob([b], {type:"application/octet-stream"});
          this.xhr.send(b)
        }
      }else {
        this.xhr.send()
      }
      return this
    }, c.urlEncode = function(a) {
      var b, c, d;
      b = [];
      for(c in a) {
        d = a[c], b.push(this.urlEncodeValue(c) + "=" + this.urlEncodeValue(d))
      }
      return b.sort().join("&")
    }, c.urlEncodeValue = function(a) {
      return encodeURIComponent("" + a).replace(/\!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A")
    }, c.urlDecode = function(a) {
      var b, c, d, e;
      c = {};
      e = a.split("&");
      a = 0;
      for(d = e.length;d > a;a++) {
        b = e[a], b = b.split("="), c[decodeURIComponent(b[0])] = decodeURIComponent(b[1])
      }
      return c
    }, c.prototype.onReadyStateChange = function() {
      var b, c, d, e, f, g, l;
      if(4 !== this.xhr.readyState || this.completed) {
        return!0
      }
      if(this.completed = !0, 200 > this.xhr.status || 300 <= this.xhr.status) {
        return c = new a.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(c, this.callback) : this.callback(c), !0
      }
      if(this.wantHeaders ? (b = this.xhr.getAllResponseHeaders(), d = b ? a.Xhr.parseResponseHeaders(b) : this.guessResponseHeaders(), e = d["x-dropbox-metadata"]) : (d = void 0, e = this.xhr.getResponseHeader("x-dropbox-metadata")), null != e ? e.length : void 0) {
        try {
          f = JSON.parse(e)
        }catch(n) {
          f = void 0
        }
      }else {
        f = void 0
      }
      if(this.responseType) {
        if("b" === this.responseType) {
          c = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response;
          b = [];
          e = g = 0;
          for(l = c.length;0 <= l ? l > g : g > l;e = 0 <= l ? ++g : --g) {
            b.push(String.fromCharCode(255 & c.charCodeAt(e)))
          }
          b = b.join("");
          this.callback(null, b, f, d)
        }else {
          this.callback(null, this.xhr.response, f, d)
        }
        return!0
      }
      switch(b = null != this.xhr.responseText ? this.xhr.responseText : this.xhr.response, this.xhr.getResponseHeader("Content-Type")) {
        case "application/x-www-form-urlencoded":
          this.callback(null, a.Xhr.urlDecode(b), f, d);
          break;
        case "application/json":
        ;
        case "text/javascript":
          this.callback(null, JSON.parse(b), f, d);
          break;
        default:
          this.callback(null, b, f, d)
      }
      return!0
    }, c.parseResponseHeaders = function(a) {
      var b, c, d, e, f, g;
      c = {};
      a = a.split("\n");
      f = 0;
      for(g = a.length;g > f;f++) {
        d = a[f], b = d.indexOf(":"), e = d.substring(0, b).trim().toLowerCase(), b = d.substring(b + 1).trim(), c[e] = b
      }
      return c
    }, c.prototype.guessResponseHeaders = function() {
      var a, b, c, d, e, f;
      a = {};
      f = "cache-control content-language content-range content-type expires last-modified pragma x-dropbox-metadata".split(" ");
      d = 0;
      for(e = f.length;e > d;d++) {
        b = f[d], (c = this.xhr.getResponseHeader(b)) && (a[b] = c)
      }
      return a
    }, c.prototype.onXdrLoad = function() {
      var b, c;
      if(this.completed) {
        return!0
      }
      if(this.completed = !0, c = this.xhr.responseText, b = this.wantHeaders ? {"content-type":this.xhr.contentType} : void 0, this.responseType) {
        return this.callback(null, c, void 0, b), !0
      }
      switch(this.xhr.contentType) {
        case "application/x-www-form-urlencoded":
          this.callback(null, a.Xhr.urlDecode(c), void 0, b);
          break;
        case "application/json":
        ;
        case "text/javascript":
          this.callback(null, JSON.parse(c), void 0, b);
          break;
        default:
          this.callback(null, c, void 0, b)
      }
      return!0
    }, c.prototype.onXdrError = function() {
      var b;
      return this.completed ? !0 : (this.completed = !0, b = new a.ApiError(this.xhr, this.method, this.url), this.onError ? this.onError(b, this.callback) : this.callback(b), !0)
    }, c
  }(), "undefined" != typeof module && "exports" in module) {
    module.exports = a
  }else {
    if("undefined" == typeof window || null === window) {
      throw Error("This library only supports node.js and modern browsers.");
    }
    if(window.Dropbox) {
      for(O in a) {
        W.call(a, O) && (L = a[O], window.Dropbox[O] = L)
      }
    }else {
      window.Dropbox = a
    }
  }
}).call(this);
var showError = function(a) {
  console.log(a)
};
function gotServerDates(a) {
  showError("GOT SERVER DATES");
  showError(a);
  bankHolidays = a = $.parseJSON(a);
  serverVersion = a["-issue"];
  for(checkdate in dateList) {
    if(currdate = dateList[checkdate], currdate.isBankHoliday) {
      for(dateRangeItem in dateListObject.removeHoliday(checkdate), checkdate.split("/"), dateRange) {
        var c = dateRangeItem.split(",");
        a = c[0].split("/");
        var c = c[c.length - 1].split("/"), f = new Date;
        f.setFullYear(a[2], a[0] - 1, a[1]);
        a = new Date;
        for(a.setFullYear(c[2], c[0] - 1, c[1]);f <= a;) {
          workingDateFromDateObject(f), -1 < weekendDays.indexOf(f.getDay()) && dateListObject.addHoliday(workingDateFromDateObject(f), !0, dateRange[dateRangeItem].holidayNotes, dateRangeItem, dateRange[dateRangeItem].dateRangeFormattedString), f.setDate(f.getDate() + 1)
        }
      }
    }
  }
  loadBankHolidaysFromXml();
  renderDatesToCalendar()
}
function gotBankHolidayOptions(a) {
  showError("GOT HOLIDAY OPTIONS");
  showError(a);
  a = $.parseJSON(a);
  for(thiscountry in a) {
    $("#bankHolidays").append('<option value="' + thiscountry + '">' + thiscountry + "</option>"), $("#startup-bankHolidays").append('<option value="' + thiscountry + '">' + thiscountry + "</option>")
  }
  $("#bankHolidays").val(country)
}
function writeDatesBackToXML() {
  dates.dateList[currentYear] || (dates.dateList[currentYear] = {});
  currentYearNode.date = [];
  dates.dateList[currentYear] = currentYearNode;
  for(date in dateList) {
    !0 == dateList[date].isHoliday ? dates.dateList[currentYear].date.push({"-id":date, "-dateRangeFormatted":dateRange[dateList[date].dateRange].dateRangeFormattedString, "-dateRange":dateList[date].dateRange, "-notes":dateRange[dateList[date].dateRange].holidayNotes, "-halfday":dateList[date].halfday, "-isBankHoliday":!1}) : dates.dateList[currentYear].date.push({"-id":date, "-notes":dateList.holidayNotes, "-isBankHoliday":!0})
  }
  0 != month && (dates["-yearStart"] = month);
  dates["-country"] = country;
  dates["-dateFormat"] = dateFormat;
  dates["-weekendDays"] = weekendDays.join()
}
function saveXML() {
  writeDatesBackToXML();
  var a = JSON.stringify(dates);
  setLocalStorage(a);
  null != client && client.isAuthenticated() && client.writeFile("savedHolidayDates.json", a, function(a, f) {
    if(a) {
      return showError(a)
    }
  })
}
function loadFromDropbox() {
  showError("loading from dropbox");
  client.readFile("savedHolidayDates.json", function(a, c) {
    if(a) {
      return showError(a)
    }
    dates = $.parseJSON(c);
    gotNewDates(dates);
    setStartYear(dates)
  })
}
function loadFromLocal() {
  usingDropbox = !1;
  !0 == isLocalStorage() ? (showError("loading from local storage"), dates = $.parseJSON(getLocalStorage())) : (dates = defaultDates, firstTimeUser = !0, showError("loading default dates"));
  gotNewDates(dates);
  setStartYear(dates)
}
function doLoad() {
  tryDropboxLoad()
}
function gotNewDates(a) {
  showError(a);
  loadHolidaysFromXml(a);
  loadBankHolidaysFromXml();
  renderDatesToCalendar()
}
function loadBankHolidaysFromXml() {
  if(null != bankHolidays && bankHolidays.bankHolidaydateList) {
    for(var a = currentYear, c;a <= currentYear + 1;) {
      for(index in bankHolidays.bankHolidaydateList[a]) {
        c = bankHolidays.bankHolidaydateList[a][index], dateListObject.addHoliday(index, !1, c.notes)
      }
      a++
    }
  }
}
function loadHolidaysFromXml(a) {
  dateListObject.clearDateList();
  var c, f, g;
  carriedOver = 0;
  timeAllowed = _TIMEALLOWED;
  country = a["-country"];
  dateFormat = dates["-dateFormat"];
  void 0 === dateFormat && (dateFormat = "uk", setDateFormat());
  month = dates["-yearStart"];
  if(null != dates["-weekendDays"]) {
    weekendDays = dates["-weekendDays"].split(",");
    for(var l = weekendDays.length - 1;0 <= l;l--) {
      $('input[name="weekend"][value="' + weekendDays[l] + '"]').prop("checked", !0)
    }
  }
  showError("dateFormat = " + dateFormat);
  showError("country = " + country);
  setCountry();
  setDateFormat();
  currentYearNode = a.dateList[currentYear];
  showError("loading date " + currentYear);
  if(null == currentYearNode) {
    currentYearNode = {}, currentYearNode["-carriedOver"] = carriedOver, currentYearNode["-timeAllowed"] = timeAllowed, currentYearNode.date = []
  }else {
    currentYearNode["-carriedOver"] && (carriedOver = currentYearNode["-carriedOver"]);
    currentYearNode["-timeAllowed"] && (timeAllowed = currentYearNode["-timeAllowed"]);
    for(l = 0;l < currentYearNode.date.length;l++) {
      a = currentYearNode.date[l], c = a["-id"], f = "", a["-dateRange"] && (f = a["-dateRange"]), g = "", a["-dateRangeFormatted"] && (g = a["-dateRangeFormatted"]), halfday = a["-halfday"] ? a["-halfday"] : !1, notes = "", a["-notes"] && (notes = a["-notes"]), dateListObject.addHoliday(c, !0 == a["-isBankHoliday"] ? !1 : !0, notes, f, g, halfday)
    }
  }
}
function setMonth(a) {
  if(!0 == (!0 == a ? confirm("Are you sure you want to change the start month? Doing this will erase all dates saved.") : !0)) {
    month = $("#monthstart").val(), showError(month), month = parseInt(month - 1), dates["-yearStart"] = month, dates.dateList = {}, window.dateList = {}, window.dateRange = {}, YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()), renderDatesToCalendar(), holidayTakenSoFar(), YAHOO.calendar.cal1.setMonth(month), YAHOO.calendar.cal1.render(), updateTotalSpareDays(), saveXML()
  }
}
var startDropbox = function() {
  client = new Dropbox.Client({key:"EBhC3DUlS5A=|kbF6WcFI0ZOEcAiUEHKFAuX1N54D22DYxcpFHOIyhg==", sandbox:!0});
  client.authDriver(new Dropbox.Drivers.Redirect({rememberUser:!0}));
  client.authenticate({interactive:!1}, function(a, c) {
    if(a) {
      return showError(a)
    }
    showError("authenticated");
    doLoad();
    replaceDropboxButtons()
  })
}, callDropbox = function() {
  !0 == (localStorage.holidayTrackerDates ? confirm("You have added some dates locally. By loading from dropbox you will lose the local changes that you have added.") : !0) && client.authenticate(function(a, c) {
    if(a) {
      return showError(a)
    }
    showError("authenticated");
    doLoad();
    replaceDropboxButtons()
  })
}, currentDate = new Date, currentYear = currentDate.getFullYear(), _TIMEALLOWED = 225, timeAllowed = _TIMEALLOWED, weekendDays = ["0", "6"], hoursTaken, hoursPlanned, carriedOver = 0, month = 8, hasStartMonthBeenChanged = !1, defaultDates = {"-yearStart":"8", dateList:{}};
window.dateList = {};
var dateList = window.dateList;
window.dateRange = {};
var dateListObject = {addHoliday:function(a, c, f, g, l, d) {
  window.dateList[a] = new holidayObject(c, f, g, d);
  !window.dateRange[g] && c && (window.dateRange[g] = new dateRangeObject(f, l));
  return window.dateList[a]
}, removeHoliday:function(a) {
  delete window.dateList[a]
}, clearDateList:function() {
  window.dateList = {}
}};
function holidayObject(a, c, f, g) {
  this.isHoliday = a;
  this.isBankHoliday = !a;
  this.holidayNotes = c;
  this.dateRange = f;
  this.halfday = g;
  return this
}
function dateRangeObject(a, c) {
  this.holidayNotes = a;
  this.dateRangeFormattedString = c;
  return this
}
function renderDatesToCalendar() {
  var a = 0;
  YAHOO.calendar.cal1.removeRenderers();
  for(a = weekendDays.length - 1;0 <= a;a--) {
    var c = parseInt(weekendDays[a]) + 1;
    showError("weekend renderer for " + c);
    YAHOO.calendar.cal1.addWeekdayRenderer(c, weekendRenderer)
  }
  YAHOO.calendar.cal1.setYear(currentYear);
  YAHOO.calendar.cal1.setMonth(month);
  for(date in dateList) {
    dateList[date].isHoliday ? "halfday" in dateList[date] && !0 == dateList[date].halfday ? YAHOO.calendar.cal1.addRenderer(date, halfdayRenderer) : YAHOO.calendar.cal1.addRenderer(date, holidayRenderer) : dateList[date].isBankHoliday && YAHOO.calendar.cal1.addRenderer(date, bankHolidayRenderer)
  }
  holidayTakenSoFar();
  hoursTakenSoFarHTML.html(hoursTaken);
  daysTakenSoFarHTML.html(hoursTaken / 7.5);
  hoursPlannedHTML.html(hoursPlanned);
  daysPlannedHTML.html(hoursPlanned / 7.5);
  totalHoursHTML.html(hoursPlanned + hoursTaken);
  totalDaysHTML.html((hoursPlanned + hoursTaken) / 7.5);
  carriedOverHoursHTML.val(carriedOver);
  carriedOverDaysHTML.val(carriedOver / 7.5);
  hoursAllowedHTML.val(timeAllowed);
  daysAllowedHTML.val(timeAllowed / 7.5);
  updateTotalSpareDays();
  YAHOO.calendar.cal1.render()
}
function setStartYear(a) {
  isNaN(month) && (month = a["-yearStart"] ? parseInt(a["-yearStart"]) : 8, showError("set month to be " + month));
  showError("using month " + month);
  currentYear = currentDate.getMonth() < month ? parseInt(currentDate.getFullYear()) - 1 : parseInt(currentDate.getFullYear());
  showError("using currentYear " + currentYear);
  startYear = currentYear;
  endYear = currentYear + 1;
  a = parseInt(month) + 1;
  10 > parseInt(a) ? $("#monthstart").val("0" + a) : $("#monthstart").val("" + a);
  setYearPeriod()
}
function getRangeOfDates(a, c) {
  var f = new Date;
  f.setFullYear(a[0][0][0], parseInt(a[0][0][1] - 1), a[0][0][2]);
  var g = new Date;
  g.setFullYear(c[0][0][0], parseInt(c[0][0][1] - 1), c[0][0][2]);
  var l = f;
  g < f && (l = g, g = f);
  for(f = [];l <= g;) {
    var d = workingDateFromDateObject(l), b = window.dateList[d], e = !1;
    null != b && b.isBankHoliday && (e = !0);
    !e && -1 == weekendDays.indexOf(l.getDay() + "") && f.push(d);
    l.setDate(l.getDate() + 1)
  }
  return f
}
function selectDateRange(a, c) {
  var f = formattedDateFromArray(c), g = workingDateFromArray(c), l = window.dateList[g];
  l ? (dateRangeSelection = 0, l.isBankHoliday ? populateControlBox(l, 2, g, f) : l.isHoliday && populateControlBox(l, 1, l.dateRange, window.dateRange[l.dateRange].dateRangeFormattedString)) : dateRangeSelection ? (f = getRangeOfDates(startDate, c), dateRangeSelection = 0, YAHOO.calendar.cal1.cfg.setProperty("selected", f.join(","), !1), YAHOO.calendar.cal1.render(), populateControlBox("", 3, f.join(","), dateRangeFormattedString(f))) : (startDate = c, dateRangeSelection = 1, populateControlBox("", 
  3, workingDateFromArray(c), formattedDateFromArray(startDate)))
}
function dateRangeFormattedString(a) {
  return 1 < a.length ? formattedDateFromStringDate(a[0]) + " - " + formattedDateFromStringDate(a[a.length - 1]) + " (" + a.length + " days)" : formattedDateFromStringDate(a[0])
}
function formattedDateFromStringDate(a) {
  a = a.split("/");
  return"uk" == dateFormat ? a[1] + "/" + a[0] + "/" + a[2] : a[0] + "/" + a[1] + "/" + a[2]
}
function workingDateFromArray(a) {
  return a[0][0][1] + "/" + a[0][0][2] + "/" + a[0][0][0]
}
function formattedDateFromArray(a) {
  return"uk" == dateFormat ? a[0][0][2] + "/" + a[0][0][1] + "/" + a[0][0][0] : a[0][0][1] + "/" + a[0][0][2] + "/" + a[0][0][0]
}
function formattedDateFromDateObject(a) {
  return"uk" == dateFormat ? a.getDate() + "/" + parseInt(parseInt(a.getMonth()) + 1) + "/" + a.getFullYear() : parseInt(parseInt(a.getMonth()) + 1) + "/" + a.getDate() + "/" + a.getFullYear()
}
function workingDateFromDateObject(a) {
  return parseInt(parseInt(a.getMonth()) + 1) + "/" + a.getDate() + "/" + a.getFullYear()
}
function holidayTakenSoFar() {
  var a = 0, c = 0;
  for(date in dateList) {
    if(null == date || "" == date) {
      delete dateList[date]
    }else {
      if(!0 == dateList[date].isHoliday) {
        var f = date.split("/");
        (new Date(f[2], f[0] - 1, f[1])).getTime() < currentDate.getTime() ? (a++, "halfday" in dateList[date] && !0 != dateList[date].halfday && a++) : (c++, "halfday" in dateList[date] && !0 != dateList[date].halfday && c++)
      }
    }
  }
  hoursTaken = 7.5 * a / 2;
  hoursPlanned = 7.5 * c / 2
}
function setYearPeriod() {
  var a = parseFloat(currentYear) + 1;
  $("#yearPeriod").html(currentYear + " - " + a)
}
function updateCarriedOverDays() {
  carriedOver = 7.5 * carriedOverDaysHTML.val();
  carriedOverHoursHTML.val(carriedOver);
  currentYearNode["-carriedOver"] = carriedOver;
  updateTotalSpareDays()
}
function updateCarriedOverTime() {
  carriedOver = carriedOverHoursHTML.val();
  carriedOverDaysHTML.html(carriedOver / 7.5);
  currentYearNode["-carriedOver"] = carriedOver;
  updateTotalSpareDays()
}
function updateDaysAllowed() {
  timeAllowed = 7.5 * daysAllowedHTML.val();
  hoursAllowedHTML.html(timeAllowed);
  currentYearNode["-timeAllowed"] = timeAllowed;
  updateTotalSpareDays()
}
function updateTimeAllowed() {
  timeAllowed = hoursAllowedHTML.val();
  daysAllowedHTML.val(timeAllowed / 7.5);
  currentYearNode["-timeAllowed"] = timeAllowed;
  updateTotalSpareDays()
}
function updateTotalSpareDays() {
  var a = parseFloat(parseFloat(timeAllowed) + parseFloat(carriedOver) - parseFloat(hoursPlanned) - parseFloat(hoursTaken));
  totalSpareHoursHTML.html(a);
  totalSpareDaysHTML.html(parseInt(10 * a / 7.5) / 10)
}
function prevYear() {
  changeYear(-1)
}
function nextYear() {
  changeYear(1)
}
function changeYear(a) {
  currentYear = parseFloat(currentYear) + parseFloat(a);
  holidayTakenSoFar();
  YAHOO.calendar.cal1.setYear(currentYear);
  gotNewDates(dates);
  YAHOO.calendar.cal1.render();
  setYearPeriod();
  resetSelectOptions();
  updateCarriedOverTime();
  updateTimeAllowed()
}
function countHolidays() {
}
function resetFormattedDates() {
  for(date in dateRange) {
    if("" != date) {
      var a = date.split(",");
      dateRange[date].dateRangeFormattedString = dateRangeFormattedString(a)
    }
  }
}
YAHOO.namespace("calendar");
var weekendRenderer = function(a, c) {
  c.innerHTML = "X";
  return YAHOO.widget.Calendar.STOP_RENDER
};
function weekdayRenderer(a, c) {
  a.getDate();
  a.getMonth();
  a.getFullYear();
  c.title = "";
  return YAHOO.widget.Calendar.STOP_RENDER
}
function bankHolidayRenderer(a, c) {
  YAHOO.calendar.cal1.styleCellDefault(a, c);
  var f = a.getDate();
  addContentsToCell(c, f, "highlight4");
  return YAHOO.widget.Calendar.STOP_RENDER
}
function normalRenderer(a, c) {
  YAHOO.calendar.cal1.styleCellDefault(a, c)
}
function holidayRenderer(a, c) {
  YAHOO.calendar.cal1.styleCellDefault(a, c);
  var f = a.getDate();
  addContentsToCell(c, f, "highlight3");
  return YAHOO.widget.Calendar.STOP_RENDER
}
function halfdayRenderer(a, c) {
  YAHOO.calendar.cal1.styleCellDefault(a, c);
  var f = a.getDate();
  addContentsToCell(c, f, "highlight2");
  return YAHOO.widget.Calendar.STOP_RENDER
}
function addContentsToCell(a, c, f) {
  YAHOO.util.Dom.addClass(a, f);
  a.innerHTML = c
}
var loadLibrary = function(a, c, f, g) {
  var l = a.getElementsByTagName(c)[0];
  a.getElementById(f) || (a = a.createElement(c), a.id = f, a.src = g, l.parentNode.insertBefore(a, l))
}, _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-28963119-5"]);
_gaq.push(["_trackPageview"]);
try {
  (function() {
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.async = !0;
    a.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
    var c = document.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(a, c)
  })()
}catch(e$$12) {
}
var icalTemplate = "BEGIN:VCALENDAR VERSION:2.0 PRODID:trackMyHolidays X-WR-CALNAME:trackMyHolidays X-WR-CALDESC:trackMyHolidays CALSCALE:GREGORIAN CONTENT END:VCALENDAR".split(" "), eventTemplate = function() {
  var a = new Date;
  this.BEGIN = "VEVENT";
  this.UID = a.getTime();
  this.DTSTAMP = DTSTAMP = getICALDate(a.getFullYear(), parseInt(a.getMonth()) + 1, a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
  this.SUMMARY = this.DESCRIPTION = this.DTEND = this.DTSTART = this.TITLE = "";
  this.CLASS = "PUBLIC";
  this.CATEGORIES = "HOLIDAY";
  this.LOCATION = "Annual Leave";
  this.ALARM = $("#ical-reminder").val();
  this.END = "VEVENT"
}, alarmTemplate = function() {
  this.BEGIN = "VALARM";
  this.TRIGGER = "-PT" + $("#ical-reminder").val() + "M";
  this.ACTION = "DISPLAY";
  this.DESCRIPTION = "Reminder";
  this.END = "VALARM"
}, generateIcal = function(a) {
  for(var c = "", f = 0;f < icalTemplate.length;f++) {
    "CONTENT" == icalTemplate[f] ? c = generateEvents(c) : (c += "" + icalTemplate[f], f < icalTemplate.length - 1 && (c += "\n"))
  }
  showError(c);
  showError(escape(c));
  c = "data:text/calendar;charset=utf8," + escape(c);
  $(a).attr("href", c);
  $(a).attr("type", "text/calendar")
}, generateEvents = function(a) {
  for(dateRangeItem in dateRange) {
    if(dateRangeItem) {
      showError(dateRangeItem);
      var c = new eventTemplate, f = dateRangeItem.split(","), g = f[0].split("/");
      c.DTSTART = getICALDate(g[2], g[0], g[1], 0, 0, 0);
      f = f[f.length - 1].split("/");
      c.DTEND = getICALDate(f[2], f[0], f[1], 23, 59, 59);
      c.TITLE = $.trim(dateRange[dateRangeItem].dateRangeFormattedString);
      c.DESCRIPTION = $.trim(dateRange[dateRangeItem].dateRangeFormattedString + " " + dateRange[dateRangeItem].holidayNotes);
      c.SUMMARY = $.trim(dateRange[dateRangeItem].dateRangeFormattedString + " " + dateRange[dateRangeItem].holidayNotes);
      for(item in c) {
        showError("" + item + ":" + c[item]), "ALARM" == item ? "none" != c[item] && (a = generateAlarm(a)) : (a += "" + item + ":" + c[item], a += "\n")
      }
    }
  }
  return a
}, generateAlarm = function(a) {
  var c = new alarmTemplate;
  for(item in c) {
    a += "" + item + ":" + c[item], a += "\n"
  }
  return a
}, getICALDate = function(a, c, f, g, l, d) {
  a = "" + a;
  a = 10 > c ? a + ("0" + c) : a + c;
  a = (10 > f ? a + ("0" + f) : a + f) + "T";
  a = 10 > g ? a + ("0" + g) : a + g;
  a = 10 > l ? a + ("0" + l) : a + l;
  return 10 > d ? a + ("0" + d) : a + d
}, hoursTakenSoFarHTML, daysTakenSoFarHTML, hoursPlannedHTML, daysPlannedHTML, totalHoursHTML, totalDaysHTML, totalSpareHoursHTML, totalSpareDaysHTML, carriedOverHoursHTML, carriedOverDaysHTML, hoursAllowedHTML, daysAllowedHTML;
function setHTMLVariables() {
  hoursTakenSoFarHTML = $("#hoursTakenSoFar");
  daysTakenSoFarHTML = $("#daysTakenSoFar");
  hoursPlannedHTML = $("#hoursPlanned");
  daysPlannedHTML = $("#daysPlanned");
  totalHoursHTML = $("#totalHours");
  totalDaysHTML = $("#totalDays");
  totalSpareHoursHTML = $("#totalSpareHours");
  totalSpareDaysHTML = $("#totalSpareDays");
  carriedOverHoursHTML = $("#carriedOver");
  carriedOverDaysHTML = $("#carriedOverDays");
  hoursAllowedHTML = $("#timeAllowed");
  daysAllowedHTML = $("#daysAllowed");
  hoursAllowedHTML.val(timeAllowed)
}
var replaceDropboxButtons = function() {
  $("#useDropbox,#logout").toggle()
}, resetSelectOptions = function() {
  $("#selectedDate").text("Select the first and last date of each holiday");
  $(".selectedDateControls>button").addClass("hidden");
  $(".selectedDateControls>label").addClass("hidden");
  $(".selectedDateDescription").addClass("hidden")
};
function setButtons() {
  $("#prevYear").click(function() {
    prevYear()
  });
  $("#nextYear").click(function() {
    nextYear()
  });
  carriedOverHoursHTML.change(function() {
    updateCarriedOverTime();
    saveXML()
  });
  carriedOverDaysHTML.change(function() {
    updateCarriedOverDays();
    saveXML()
  });
  hoursAllowedHTML.change(function() {
    updateTimeAllowed();
    saveXML()
  });
  daysAllowedHTML.change(function() {
    updateDaysAllowed();
    saveXML()
  });
  $("#updateYearStart").click(function() {
    setMonth(!0)
  });
  $("#startup-monthstart").click(function() {
    setMonth(!1)
  });
  $('input[name="weekend"]').on("change", function() {
    showError("updating the weekendDays");
    weekendDays = [];
    $('input[name="weekend"]:checked').each(function() {
      weekendDays.push($(this).val())
    });
    showError(weekendDays);
    renderDatesToCalendar()
  });
  $("#config").click(function() {
    $("#controls").show();
    $("#wrapper,header").hide();
    $("body").addClass("config");
    $("#controls").tabs({active:0})
  });
  $("#control-close").click(function() {
    $("#controls").hide();
    $("#wrapper,header").show();
    $("body").removeClass("config")
  });
  $(".dayshoursswitcher").click(function() {
    $(".timeTableDays,.timeTableHours").toggleClass("hidden")
  });
  $("body").on("click", function(a) {
    !0 == clicktodeselect && !isCalendarLink && !$(a.target).parent().hasClass("selector") && !$(a.target).parent().hasClass("btn") && !("dateDescription" == $(a.target).parent().attr("id") || $(a.target).hasClass("selector") || $(a.target).hasClass("btn") || "dateDescription" == $(a.target).attr("id")) ? (dateRangeSelection = 0, YAHOO.calendar.cal1.deselect(YAHOO.calendar.cal1.getSelectedDates()), YAHOO.calendar.cal1.render(), resetSelectOptions(), clicktodeselect = !1) : isCalendarLink && (clicktodeselect = 
    !0, isCalendarLink = !1)
  });
  $("#closefocus").on("click", function() {
  });
  $("#nextMonth").click(function() {
    $(".selectedgroup").removeClass("selectedgroup").next().addClass("selectedgroup");
    0 < $(".selectedgroup.last-of-type").length ? $("#nextMonth").hide() : $("#nextMonth").show();
    $("#prevMonth").show()
  });
  $("#prevMonth").click(function() {
    $(".selectedgroup").removeClass("selectedgroup").prev().addClass("selectedgroup");
    0 < $(".selectedgroup.first-of-type").length ? $("#prevMonth").hide() : $("#prevMonth").show();
    $("#nextMonth").show()
  });
  $("#monthstart").on("change", function() {
    $("#updateYearStart").show()
  });
  $("#comfortableview,#compactview").on("click", function() {
    $("#comfortableview,#compactview").toggle();
    $("body").toggleClass("big")
  });
  $("#dateFormat").on("change", function() {
    dateFormat = $(this).val();
    void 0 === dateFormat && (dateFormat = "uk", setDateFormat());
    resetFormattedDates();
    saveXML()
  });
  $("#bankHolidays,#startup-bankHolidays").on("change", function() {
    country = $(this).val();
    loadServerDates();
    saveXML()
  });
  $("#exporttolist").on("click", function() {
    exportToList()
  });
  $("#exporttoics").on("mousedown", function() {
    generateIcal($(this))
  });
  $("#logout,#compactview").hide();
  $("#controls").tabs();
  for(var a = weekendDays.length - 1;0 <= a;a--) {
    $('input[name="weekend"][value="' + weekendDays[a] + '"]').prop("checked", !0)
  }
}
var setCountry = function() {
  $("#bankHolidays").val(country)
}, setDateFormat = function() {
  $("#dateFormat").val(dateFormat)
}, populateControlBox = function(a, c, f, g) {
  var l = "";
  1 == f.split(",").length && 2 != c && "" != c ? ($("#halfday").removeClass("hidden"), dateList[f] && !0 == dateList[f].halfday ? $("#halfday>input").prop("checked", !0) : $("#halfday>input").prop("checked", !1)) : $("#halfday").addClass("hidden");
  if(1 == c) {
    l = window.dateRange[a.dateRange].holidayNotes, $("#selectButton").addClass("hidden"), $("#deselectButton,#updateButton").removeClass("hidden"), $("#deselectButton").unbind("click"), $("#deselectButton").on("click", function() {
      myDeselectCell(a.dateRange)
    }), $("#updateButton").unbind("click"), $("#updateButton").on("click", function() {
      myUpdateCell(a.dateRange)
    })
  }else {
    if(2 == c) {
      l = a.holidayNotes, $("#deselectButton,#updateButton,#selectButton").addClass("hidden")
    }else {
      if(3 == c) {
        $("#deselectButton,#updateButton").addClass("hidden"), $("#selectButton").removeClass("hidden"), $("#selectButton").unbind("click"), $("#selectButton").on("click", function() {
          mySelectCell(f, g)
        })
      }else {
        return
      }
    }
  }
  $("#selectedDate").html(g);
  isCalendarLink = !0;
  $(".selectedDateDescription").removeClass("hidden");
  $("#dateDescription").val(l)
};
function mySelectCell(a, c, f) {
  f = 1 == $("#halfday>input:checked").length ? !0 : !1;
  dateRangeSelection = 0;
  for(var g = a.split(","), l = $("#dateDescription").val(), d, b = 0;b < g.length;b++) {
    d = dateListObject.addHoliday(g[b], !0, l, a, c, f)
  }
  renderDatesToCalendar();
  populateControlBox(d, 1, a, c);
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
function myUpdateCell(a) {
  1 == $("#halfday>input:checked").length ? dateList[a].halfday = !0 : dateList[a].halfday = !1;
  window.dateRange[a].holidayNotes = $("#dateDescription").val();
  renderDatesToCalendar();
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
function myDeselectCell(a) {
  dateArray = a.split(",");
  for(a = 0;a < dateArray.length;a++) {
    dateListObject.removeHoliday(dateArray[a])
  }
  renderDatesToCalendar();
  populateControlBox("", 3, "", "");
  saveXML();
  $(".groupcal").removeClass("selectedgroup");
  resetSelectOptions()
}
var dateRangeSelection = 0, startDate, client = null, clicktodeselect = !1, isCalendarLink = !1, bankHolidays, dateFormat = "uk", country, firstTimeUser = !1, usingDropbox = !1;
$("#startup").hide();
var isFirstTime = function() {
  !0 == firstTimeUser ? ($("#startup").show(), $("#wrapper").hide(), $("#controls,h1>.btn,#yearControlBlock").hide(), $("#startup-carriedOverDays").bind("change", function() {
    $("#carriedOverDays").val($(this).val());
    updateCarriedOverDays()
  }), $("#startup-carriedOver").bind("change", function() {
    $("#carriedOver").val($(this).val());
    updateCarriedOverTime()
  }), $("#startup-timeAllowed").bind("change", function() {
    $("#timeAllowed").val($(this).val());
    updateTimeAllowed()
  }), $("#startup-daysAllowed").bind("change", function() {
    $("#daysAllowed").val($(this).val());
    updateDaysAllowed()
  }), $("#startup-bankHolidays").on("change", function() {
    $("#bankHolidays").val($(this).val())
  }), $("#startup-monthstart").on("change", function() {
    $("#monthstart").val($(this).val());
    setMonth(!1)
  }), $("#startup-dateFormat").on("change", function() {
    dateFormat = $(this).val();
    resetFormattedDates();
    $("#dateFormat").val($(this).val())
  }), $("body").removeClass("config")) : $("#startup").remove();
  $("#startup-go").on("click", function() {
    closeStartup(!0)
  })
}, closeStartup = function(a) {
  !0 == a && holalert("To select your holiday simply click the start and end date for each holiday and save the dates. The amount of remaining leave will then be shown in the top right corner.");
  $("#startup").hide();
  $("#wrapper,h1>.btn,#yearControlBlock").show()
};
init = function() {
  showError("starting up");
  setHTMLVariables();
  setStartYear();
  YAHOO.calendar.cal1 = new YAHOO.widget.CalendarGroup("calendarContainer", {PAGES:12});
  YAHOO.calendar.cal1.selectEvent.subscribe(selectDateRange, YAHOO.calendar.cal1, !0);
  showError("starting up - prepared the calendar");
  resetSelectOptions();
  setButtons();
  setYearPeriod();
  showError("Done the UI");
  YAHOO.calendar.cal1.setYear(currentYear);
  YAHOO.calendar.cal1.setMonth(month);
  showError("Refreshed the calendar");
  renderDatesToCalendar();
  doLoad();
  loadServerDates();
  getBankHolidayOptions();
  showError("Loaded the data");
  isFirstTime()
};
var baseUrl = location.href.split("#")[0];
$(document).ready(function() {
  init();
  startDropbox();
  $("#useDropbox,#startup-Dropbox").on("click", function() {
    callDropbox();
    closeStartup(!1)
  });
  try {
    loadLibrary(document, "script", "facebook-jssdk", "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=497594116968521"), loadLibrary(document, "script", "twitter-wjs", "//platform.twitter.com/widgets.js"), loadLibrary(document, "script", "google-sdk", "https://apis.google.com/js/plusone.js")
  }catch(a) {
  }
});
$("#logout").hide();
function isLocalStorage() {
  return localStorage.holidayTrackerDates ? !0 : !1
}
function getLocalStorage() {
  return localStorage.holidayTrackerDates
}
function setLocalStorage(a) {
  localStorage.holidayTrackerDates = a
}
function loadServerDates() {
  loadUrl = country ? baseUrl + "bankHolidays/" + country + ".json" : baseUrl + "bankHolidays/England.json";
  $.ajax({type:"GET", url:loadUrl, dataType:"html", success:function(a, c) {
    gotServerDates(a)
  }, data:{}, async:!1})
}
function tryDropboxLoad() {
  showError("TRYING TO LOAD FROM DROPBOX");
  showError(client);
  null != client && client.isAuthenticated() ? (usingDropbox = !0, loadFromDropbox()) : (usingDropbox = !1, loadFromLocal())
}
function exportToList() {
  resetFormattedDates();
  var a = "";
  for(dateRangeItem in dateRange) {
    "" != dateRangeItem && (a += "\n" + dateRange[dateRangeItem].dateRangeFormattedString)
  }
  holalert(a)
}
function getBankHolidayOptions() {
  $.ajax({type:"GET", url:baseUrl + "bankHolidays/list.json", dataType:"html", success:function(a, c) {
    gotBankHolidayOptions(a)
  }, data:{}, async:!1})
}
function holalert(a) {
  alert(a)
}
;

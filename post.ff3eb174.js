// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/lib-font/src/opentype/tables/simple/post.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = void 0;

var _simpleTable = require("../simple-table.js");

/**
 * The OpenType `post` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/post
 */
class post extends _simpleTable.SimpleTable {
  constructor(dict, dataview) {
    const {
      p
    } = super(dict, dataview);
    this.version = p.legacyFixed;
    this.italicAngle = p.fixed;
    this.underlinePosition = p.fword;
    this.underlineThickness = p.fword;
    this.isFixedPitch = p.uint32;
    this.minMemType42 = p.uint32;
    this.maxMemType42 = p.uint32;
    this.minMemType1 = p.uint32;
    this.maxMemType1 = p.uint32;
    if (this.version === 1 || this.version === 3) return p.verifyLength();
    this.numGlyphs = p.uint16;

    if (this.version === 2) {
      this.glyphNameIndex = [...new Array(this.numGlyphs)].map(_ => p.uint16); // Note: we don't actually build `this.names` because it's a frankly bizarre
      // byte blob that encodes strings as "length-and-then-bytes" such that it
      // needs to be loaded entirely in memory before it's useful. That's fine for
      // printers, but is nuts for anything else.
      // Instead, we parse the data only enough to build a NEW type of lookup that
      // tells us which offset a glyph's name bytes are inside the names blob, with
      // the length of a name determined by offsets[next] - offsets[this].

      this.namesOffset = p.currentPosition;
      this.glyphNameOffsets = [1];

      for (let i = 0; i < this.numGlyphs; i++) {
        let index = this.glyphNameIndex[i];

        if (index < macStrings.length) {
          this.glyphNameOffsets.push(this.glyphNameOffsets[i]);
          continue;
        }

        let bytelength = p.int8;
        p.skip(bytelength);
        this.glyphNameOffsets.push(this.glyphNameOffsets[i] + bytelength + 1);
      }
    }

    if (this.version === 2.5) {
      this.offset = [...new Array(this.numGlyphs)].map(_ => p.int8);
    }
  }

  getGlyphName(glyphid) {
    if (this.version !== 2) {
      console.warn(`post table version ${this.version} does not support glyph name lookups`);
      return ``;
    }

    let index = this.glyphNameIndex[glyphid];
    if (index < 258) return macStrings[index];
    let offset = this.glyphNameOffsets[glyphid];
    let next = this.glyphNameOffsets[glyphid + 1];
    let len = next - offset - 1;
    if (len === 0) return `.notdef.`;
    this.parser.currentPosition = this.namesOffset + offset;
    const data = this.parser.readBytes(len, this.namesOffset + offset, 8, true);
    return data.map(b => String.fromCharCode(b)).join(``);
  }

}

exports.post = post;
const macStrings = [`.notdef`, `.null`, `nonmarkingreturn`, `space`, `exclam`, `quotedbl`, `numbersign`, `dollar`, `percent`, `ampersand`, `quotesingle`, `parenleft`, `parenright`, `asterisk`, `plus`, `comma`, `hyphen`, `period`, `slash`, `zero`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `colon`, `semicolon`, `less`, `equal`, `greater`, `question`, `at`, `A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `bracketleft`, `backslash`, `bracketright`, `asciicircum`, `underscore`, `grave`, `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`, `braceleft`, `bar`, `braceright`, `asciitilde`, `Adieresis`, `Aring`, `Ccedilla`, `Eacute`, `Ntilde`, `Odieresis`, `Udieresis`, `aacute`, `agrave`, `acircumflex`, `adieresis`, `atilde`, `aring`, `ccedilla`, `eacute`, `egrave`, `ecircumflex`, `edieresis`, `iacute`, `igrave`, `icircumflex`, `idieresis`, `ntilde`, `oacute`, `ograve`, `ocircumflex`, `odieresis`, `otilde`, `uacute`, `ugrave`, `ucircumflex`, `udieresis`, `dagger`, `degree`, `cent`, `sterling`, `section`, `bullet`, `paragraph`, `germandbls`, `registered`, `copyright`, `trademark`, `acute`, `dieresis`, `notequal`, `AE`, `Oslash`, `infinity`, `plusminus`, `lessequal`, `greaterequal`, `yen`, `mu`, `partialdiff`, `summation`, `product`, `pi`, `integral`, `ordfeminine`, `ordmasculine`, `Omega`, `ae`, `oslash`, `questiondown`, `exclamdown`, `logicalnot`, `radical`, `florin`, `approxequal`, `Delta`, `guillemotleft`, `guillemotright`, `ellipsis`, `nonbreakingspace`, `Agrave`, `Atilde`, `Otilde`, `OE`, `oe`, `endash`, `emdash`, `quotedblleft`, `quotedblright`, `quoteleft`, `quoteright`, `divide`, `lozenge`, `ydieresis`, `Ydieresis`, `fraction`, `currency`, `guilsinglleft`, `guilsinglright`, `fi`, `fl`, `daggerdbl`, `periodcentered`, `quotesinglbase`, `quotedblbase`, `perthousand`, `Acircumflex`, `Ecircumflex`, `Aacute`, `Edieresis`, `Egrave`, `Iacute`, `Icircumflex`, `Idieresis`, `Igrave`, `Oacute`, `Ocircumflex`, `apple`, `Ograve`, `Uacute`, `Ucircumflex`, `Ugrave`, `dotlessi`, `circumflex`, `tilde`, `macron`, `breve`, `dotaccent`, `ring`, `cedilla`, `hungarumlaut`, `ogonek`, `caron`, `Lslash`, `lslash`, `Scaron`, `scaron`, `Zcaron`, `zcaron`, `brokenbar`, `Eth`, `eth`, `Yacute`, `yacute`, `Thorn`, `thorn`, `minus`, `multiply`, `onesuperior`, `twosuperior`, `threesuperior`, `onehalf`, `onequarter`, `threequarters`, `franc`, `Gbreve`, `gbreve`, `Idotaccent`, `Scedilla`, `scedilla`, `Cacute`, `cacute`, `Ccaron`, `ccaron`, `dcroat`];
},{"../simple-table.js":"node_modules/lib-font/src/opentype/tables/simple-table.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54444" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js"], null)
//# sourceMappingURL=/post.ff3eb174.js.map
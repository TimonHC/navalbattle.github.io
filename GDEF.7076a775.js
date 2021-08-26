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
})({"node_modules/lib-font/src/opentype/tables/advanced/shared/class.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassDefinition = void 0;

class ClassDefinition {
  constructor(p) {
    this.classFormat = p.uint16;

    if (this.classFormat === 1) {
      this.startGlyphID = p.uint16;
      this.glyphCount = p.uint16;
      this.classValueArray = [...new Array(this.glyphCount)].map(_ => p.uint16);
    }

    if (this.classFormat === 2) {
      this.classRangeCount = p.uint16;
      this.classRangeRecords = [...new Array(this.classRangeCount)].map(_ => new ClassRangeRecord(p));
    }
  }

}

exports.ClassDefinition = ClassDefinition;

class ClassRangeRecord {
  constructor(p) {
    this.startGlyphID = p.uint16;
    this.endGlyphID = p.uint16;
    this.class = p.uint16;
  }

}
},{}],"node_modules/lib-font/src/opentype/tables/advanced/shared/itemvariation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemVariationStoreTable = void 0;

class ItemVariationStoreTable {
  constructor(table, p) {
    this.table = table;
    this.parser = p;
    this.start = p.currentPosition;
    this.format = p.uint16;
    this.variationRegionListOffset = p.Offset32;
    this.itemVariationDataCount = p.uint16;
    this.itemVariationDataOffsets = [...new Array(this.itemVariationDataCount)].map(_ => p.Offset32);
  }

}

exports.ItemVariationStoreTable = ItemVariationStoreTable;

class ItemVariationData {
  constructor(p) {
    this.itemCount = p.uint16;
    this.shortDeltaCount = p.uint16;
    this.regionIndexCount = p.uint16;
    this.regionIndexes = p.uint16;
    this.deltaSets = [...new Array(this.itemCount)].map(_ => new DeltaSet(p, this.shortDeltaCount, this.regionIndexCount));
  }

}

class DeltaSet {
  constructor(p, shortDeltaCount, regionIndexCount) {
    // the documentation here seems problematic:
    //
    // "Logically, each DeltaSet record has regionIndexCount number of elements.
    //  The first shortDeltaCount elements are represented as signed 16-bit values
    //  (int16), and the remaining regionIndexCount - shortDeltaCount elements are
    //  represented as signed 8-bit values (int8). The length of the data for each
    //  row is shortDeltaCount + regionIndexCount."
    //
    // I'm assuming that should be "the remaining regionIndexCount elements are".
    this.DeltaData = [];

    while (shortDeltaCount-- > 0) {
      this.DeltaData.push(p.in16);
    }

    while (regionIndexCount-- > 0) {
      this.DeltaData.push(p.int8);
    }
  }

}
},{}],"node_modules/lib-font/src/opentype/tables/advanced/GDEF.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GDEF = void 0;

var _parser = require("../../../parser.js");

var _simpleTable = require("../simple-table.js");

var _class = require("./shared/class.js");

var _coverage = require("./shared/coverage.js");

var _itemvariation = require("./shared/itemvariation.js");

var _lazy = _interopRequireDefault(require("../../../lazy.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The OpenType `GDEF` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/GDEF
 */
class GDEF extends _simpleTable.SimpleTable {
  constructor(dict, dataview) {
    const {
      p
    } = super(dict, dataview); // there are three possible versions

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.glyphClassDefOffset = p.Offset16;
    (0, _lazy.default)(this, `glyphClassDefs`, () => {
      if (this.glyphClassDefOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.glyphClassDefOffset;
      return new _class.ClassDefinition(p);
    });
    this.attachListOffset = p.Offset16;
    (0, _lazy.default)(this, `attachList`, () => {
      if (this.attachListOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.attachListOffset;
      return new AttachList(p);
    });
    this.ligCaretListOffset = p.Offset16;
    (0, _lazy.default)(this, `ligCaretList`, () => {
      if (this.ligCaretListOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.ligCaretListOffset;
      return new LigCaretList(p);
    });
    this.markAttachClassDefOffset = p.Offset16;
    (0, _lazy.default)(this, `markAttachClassDef`, () => {
      if (this.markAttachClassDefOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.markAttachClassDefOffset;
      return new _class.ClassDefinition(p);
    });

    if (this.minorVersion >= 2) {
      this.markGlyphSetsDefOffset = p.Offset16;
      (0, _lazy.default)(this, `markGlyphSetsDef`, () => {
        if (this.markGlyphSetsDefOffset === 0) return undefined;
        p.currentPosition = this.tableStart + this.markGlyphSetsDefOffset;
        return new MarkGlyphSetsTable(p);
      });
    }

    if (this.minorVersion === 3) {
      this.itemVarStoreOffset = p.Offset32;
      (0, _lazy.default)(this, `itemVarStore`, () => {
        if (this.itemVarStoreOffset === 0) return undefined;
        p.currentPosition = this.tableStart + this.itemVarStoreOffset;
        return new _itemvariation.ItemVariationStoreTable(p);
      });
    }
  }

}

exports.GDEF = GDEF;

class AttachList extends _parser.ParsedData {
  constructor(p) {
    super(p);
    this.coverageOffset = p.Offset16; // Offset to Coverage table - from beginning of AttachList table

    this.glyphCount = p.uint16;
    this.attachPointOffsets = [...new Array(this.glyphCount)].map(_ => p.Offset16); // From beginning of AttachList table (in Coverage Index order)
  }

  getPoint(pointID) {
    this.parser.currentPosition = this.start + this.attachPointOffsets[pointID];
    return new AttachPoint(this.parser);
  }

}

class AttachPoint {
  constructor(p) {
    this.pointCount = p.uint16;
    this.pointIndices = [...new Array(this.pointCount)].map(_ => p.uint16);
  }

}

class LigCaretList extends _parser.ParsedData {
  constructor(p) {
    super(p);
    this.coverageOffset = p.Offset16;
    (0, _lazy.default)(this, `coverage`, () => {
      p.currentPosition = this.start + this.coverageOffset;
      return new _coverage.CoverageTable(p);
    });
    this.ligGlyphCount = p.uint16;
    this.ligGlyphOffsets = [...new Array(this.ligGlyphCount)].map(_ => p.Offset16); // From beginning of LigCaretList table
  }

  getLigGlyph(ligGlyphID) {
    this.parser.currentPosition = this.start + this.ligGlyphOffsets[ligGlyphID];
    return new LigGlyph(this.parser);
  }

}

class LigGlyph extends _parser.ParsedData {
  constructor(p) {
    super(p);
    this.caretCount = p.uint16;
    this.caretValueOffsets = [...new Array(this.caretCount)].map(_ => p.Offset16); // From beginning of LigGlyph table
  }

  getCaretValue(caretID) {
    this.parser.currentPosition = this.start + this.caretValueOffsets[caretID];
    return new CaretValue(this.parser);
  }

}

class CaretValue {
  constructor(p) {
    this.caretValueFormat = p.uint16;

    if (this.caretValueFormat === 1) {
      this.coordinate = p.int16;
    }

    if (this.caretValueFormat === 2) {
      this.caretValuePointIndex = p.uint16;
    }

    if (this.caretValueFormat === 3) {
      this.coordinate = p.int16;
      this.deviceOffset = p.Offset16; // Offset to Device table (non-variable font) / Variation Index table (variable font) for X or Y value-from beginning of CaretValue table
    }
  }

}

class MarkGlyphSetsTable extends _parser.ParsedData {
  constructor(p) {
    super(p);
    this.markGlyphSetTableFormat = p.uint16;
    this.markGlyphSetCount = p.uint16;
    this.coverageOffsets = [...new Array(this.markGlyphSetCount)].map(_ => p.Offset32);
  }

  getMarkGlyphSet(markGlyphSetID) {
    this.parser.currentPosition = this.start + this.coverageOffsets[markGlyphSetID];
    return new _coverage.CoverageTable(this.parser);
  }

}
},{"../../../parser.js":"node_modules/lib-font/src/parser.js","../simple-table.js":"node_modules/lib-font/src/opentype/tables/simple-table.js","./shared/class.js":"node_modules/lib-font/src/opentype/tables/advanced/shared/class.js","./shared/coverage.js":"node_modules/lib-font/src/opentype/tables/advanced/shared/coverage.js","./shared/itemvariation.js":"node_modules/lib-font/src/opentype/tables/advanced/shared/itemvariation.js","../../../lazy.js":"node_modules/lib-font/src/lazy.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
//# sourceMappingURL=/GDEF.7076a775.js.map
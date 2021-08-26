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
})({"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subtable = void 0;

var _parser = require("../../../../parser.js");

class Subtable extends _parser.ParsedData {
  constructor(p, plaformID, encodingID) {
    super(p);
    this.plaformID = plaformID;
    this.encodingID = encodingID;
  }

}

exports.Subtable = Subtable;
},{"../../../../parser.js":"node_modules/lib-font/src/parser.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format0.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format0 = void 0;

var _subtable = require("./subtable.js");

class Format0 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 0;
    this.length = p.uint16;
    this.language = p.uint16; // this isn't worth lazy-loading

    this.glyphIdArray = [...new Array(256)].map(_ => p.uint8);
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: map this character to a number based on the Apple standard character to glyph mapping
      charCode = -1;
      console.warn(`supports(character) not implemented for cmap subtable format 0. only supports(id) is implemented.`);
    }

    return 0 <= charCode && charCode <= 255;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 0`);
    return {};
  }

  getSupportedCharCodes() {
    return [{
      start: 1,
      end: 256
    }];
  }

}

exports.Format0 = Format0;
},{"./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format2 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format2 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 2;
    this.length = p.uint16;
    this.language = p.uint16;
    this.subHeaderKeys = [...new Array(256)].map(_ => p.uint16);
    const subHeaderCount = Math.max(...this.subHeaderKeys);
    const subHeaderOffset = p.currentPosition;
    (0, _lazy.default)(this, `subHeaders`, () => {
      p.currentPosition = subHeaderOffset;
      return [...new Array(subHeaderCount)].map(_ => new SubHeader(p));
    });
    const glyphIndexOffset = subHeaderOffset + subHeaderCount * 8;
    (0, _lazy.default)(this, `glyphIndexArray`, () => {
      p.currentPosition = glyphIndexOffset;
      return [...new Array(subHeaderCount)].map(_ => p.uint16);
    });
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: consider implementing the correct mapping, https://docs.microsoft.com/en-us/typography/opentype/spec/cmap#format-2-high-byte-mapping-through-table
      charCode = -1;
      console.warn(`supports(character) not implemented for cmap subtable format 2. only supports(id) is implemented.`);
    }

    const low = charCode && 0xff;
    const high = charCode && 0xff00;
    const subHeaderKey = this.subHeaders[high];
    const subheader = this.subHeaders[subHeaderKey];
    const first = subheader.firstCode;
    const last = first + subheader.entryCount;
    return first <= low && low <= last;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 2`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return this.subHeaders.map(h => ({
        firstCode: h.firstCode,
        lastCode: h.lastCode
      }));
    }

    return this.subHeaders.map(h => ({
      start: h.firstCode,
      end: h.lastCode
    }));
  }

}

exports.Format2 = Format2;

class SubHeader {
  constructor(p) {
    this.firstCode = p.uint16;
    this.entryCount = p.uint16;
    this.lastCode = this.first + this.entryCount;
    this.idDelta = p.int16;
    this.idRangeOffset = p.uint16;
  }

}
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format4 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format4 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 4;
    this.length = p.uint16;
    this.language = p.uint16;
    this.segCountX2 = p.uint16;
    this.segCount = this.segCountX2 / 2;
    this.searchRange = p.uint16;
    this.entrySelector = p.uint16;
    this.rangeShift = p.uint16; // This cmap subformat basically lazy-loads everything. It would be better to
    // not even lazy load but the code is not ready for selective extraction.

    const endCodePosition = p.currentPosition;
    (0, _lazy.default)(this, `endCode`, () => p.readBytes(this.segCount, endCodePosition, 16));
    const startCodePosition = endCodePosition + 2 + this.segCountX2;
    (0, _lazy.default)(this, `startCode`, () => p.readBytes(this.segCount, startCodePosition, 16));
    const idDeltaPosition = startCodePosition + this.segCountX2;
    (0, _lazy.default)(this, `idDelta`, () => p.readBytes(this.segCount, idDeltaPosition, 16, true) // Note that idDelta values are signed
    );
    const idRangePosition = idDeltaPosition + this.segCountX2;
    (0, _lazy.default)(this, `idRangeOffset`, () => p.readBytes(this.segCount, idRangePosition, 16));
    const glyphIdArrayPosition = idRangePosition + this.segCountX2;
    const glyphIdArrayLength = this.length - (glyphIdArrayPosition - this.tableStart);
    (0, _lazy.default)(this, `glyphIdArray`, () => p.readBytes(glyphIdArrayLength, glyphIdArrayPosition, 16)); // also, while not in the spec, we really want to organise all that data into convenient segments

    (0, _lazy.default)(this, `segments`, () => this.buildSegments(idRangePosition, glyphIdArrayPosition, p));
  }

  buildSegments(idRangePosition, glyphIdArrayPosition, p) {
    const build = (_, i) => {
      let startCode = this.startCode[i],
          endCode = this.endCode[i],
          idDelta = this.idDelta[i],
          idRangeOffset = this.idRangeOffset[i],
          idRangeOffsetPointer = idRangePosition + 2 * i,
          glyphIDs = []; // simple case

      if (idRangeOffset === 0) {
        for (let i = startCode + idDelta, e = endCode + idDelta; i <= e; i++) {
          glyphIDs.push(i);
        }
      } // not so simple case
      else {
        for (let i = 0, e = endCode - startCode; i <= e; i++) {
          p.currentPosition = idRangeOffsetPointer + idRangeOffset + i * 2;
          glyphIDs.push(p.uint16);
        }
      }

      return {
        startCode,
        endCode,
        idDelta,
        idRangeOffset,
        glyphIDs
      };
    };

    return [...new Array(this.segCount)].map(build);
  }

  reverse(glyphID) {
    let s = this.segments.find(v => v.glyphIDs.includes(glyphID));
    if (!s) return {};
    const code = s.startCode + s.glyphIDs.indexOf(glyphID);
    return {
      code,
      unicode: String.fromCodePoint(code)
    };
  }

  getGlyphId(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0); // surrogate pair value?

    if (0xd800 <= charCode && charCode <= 0xdfff) return 0; // one of the exactly 66 noncharacters?

    if ((charCode & 0xfffe) === 0xfffe || (charCode & 0xffff) === 0xffff) return 0;
    let segment = this.segments.find(s => s.startCode <= charCode && charCode <= s.endCode);
    if (!segment) return 0;
    return segment.glyphIDs[charCode - segment.startCode];
  }

  supports(charCode) {
    return this.getGlyphId(charCode) !== 0;
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.segments;
    return this.segments.map(v => ({
      start: v.startCode,
      end: v.endCode
    }));
  }

}

exports.Format4 = Format4;
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format6 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format6 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 6;
    this.length = p.uint16;
    this.language = p.uint16;
    this.firstCode = p.uint16;
    this.entryCount = p.uint16;
    this.lastCode = this.firstCode + this.entryCount - 1;

    const getter = () => [...new Array(this.entryCount)].map(_ => p.uint16);

    (0, _lazy.default)(this, `glyphIdArray`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: This can be anything, and depends on the Macintosh language indicated by this.language...
      charCode = -1;
      console.warn(`supports(character) not implemented for cmap subtable format 6. only supports(id) is implemented.`);
    }

    if (charCode < this.firstCode) return {};
    if (charCode > this.firstCode + this.entryCount) return {};
    const code = charCode - this.firstCode;
    return {
      code,
      unicode: String.fromCodePoint(code)
    };
  }

  reverse(glyphID) {
    let pos = this.glyphIdArray.indexOf(glyphID);
    if (pos > -1) return this.firstCode + pos;
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return [{
        firstCode: this.firstCode,
        lastCode: this.lastCode
      }];
    }

    return [{
      start: this.firstCode,
      end: this.lastCode
    }];
  }

}

exports.Format6 = Format6;
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format8.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format8 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format8 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 8;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.is32 = [...new Array(8192)].map(_ => p.uint8);
    this.numGroups = p.uint32;

    const getter = () => [...new Array(this.numGroups)].map(_ => new SequentialMapGroup(p));

    (0, _lazy.default)(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: https://docs.microsoft.com/en-us/typography/opentype/spec/cmap#format-8-mixed-16-bit-and-32-bit-coverage is kind of incredible
      charCode = -1;
      console.warn(`supports(character) not implemented for cmap subtable format 8. only supports(id) is implemented.`);
    }

    return this.groups.findIndex(s => s.startcharCode <= charCode && charCode <= s.endcharCode) !== -1;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 8`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map(v => ({
      start: v.startcharCode,
      end: v.endcharCode
    }));
  }

}

exports.Format8 = Format8;

class SequentialMapGroup {
  constructor(p) {
    this.startcharCode = p.uint32;
    this.endcharCode = p.uint32;
    this.startGlyphID = p.uint32;
  }

}
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format10.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format10 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// basically Format 6, but for 32 bit characters
class Format10 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 10;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.startCharCode = p.uint32;
    this.numChars = p.uint32;
    this.endCharCode = this.startCharCode + this.numChars;

    const getter = () => [...new Array(this.numChars)].map(_ => p.uint16);

    (0, _lazy.default)(this, `glyphs`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) {
      // TODO: FIXME: This can be anything, and depends on the Macintosh language indicated by this.language...
      charCode = -1;
      console.warn(`supports(character) not implemented for cmap subtable format 10. only supports(id) is implemented.`);
    }

    if (charCode < this.startCharCode) return false;
    if (charCode > this.startCharCode + this.numChars) return false;
    return charCode - this.startCharCode;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 10`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) {
      return [{
        startCharCode: this.startCharCode,
        endCharCode: this.endCharCode
      }];
    }

    return [{
      start: this.startCharCode,
      end: this.endCharCode
    }];
  }

}

exports.Format10 = Format10;
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format12.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format12 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// basically Format 8, but for 32 bit characters
class Format12 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 12;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.numGroups = p.uint32;

    const getter = () => [...new Array(this.numGroups)].map(_ => new SequentialMapGroup(p));

    (0, _lazy.default)(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0); // surrogate pair value?

    if (0xd800 <= charCode && charCode <= 0xdfff) return 0; // one of the exactly 66 noncharacters?

    if ((charCode & 0xfffe) === 0xfffe || (charCode & 0xffff) === 0xffff) return 0;
    return this.groups.findIndex(s => s.startCharCode <= charCode && charCode <= s.endCharCode) !== -1;
  }

  reverse(glyphID) {
    for (let group of this.groups) {
      let start = group.startGlyphID;
      if (start > glyphID) continue;
      if (start === glyphID) return group.startCharCode;
      let end = start + (group.endCharCode - group.startCharCode);
      if (end < glyphID) continue;
      const code = group.startCharCode + (glyphID - start);
      return {
        code,
        unicode: String.fromCodePoint(code)
      };
    }

    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map(v => ({
      start: v.startCharCode,
      end: v.endCharCode
    }));
  }

}

exports.Format12 = Format12;

class SequentialMapGroup {
  constructor(p) {
    this.startCharCode = p.uint32;
    this.endCharCode = p.uint32;
    this.startGlyphID = p.uint32;
  }

}
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format13.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format13 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format13 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.format = 13;
    p.uint16;
    this.length = p.uint32;
    this.language = p.uint32;
    this.numGroups = p.uint32;
    const getter = [...new Array(this.numGroups)].map(_ => new ConstantMapGroup(p));
    (0, _lazy.default)(this, `groups`, getter);
  }

  supports(charCode) {
    if (charCode.charCodeAt) charCode = charCode.charCodeAt(0); // assumed safe, might not be?

    return this.groups.findIndex(s => s.startCharCode <= charCode && charCode <= s.endCharCode) !== -1;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 13`);
    return {};
  }

  getSupportedCharCodes(preservePropNames = false) {
    if (preservePropNames) return this.groups;
    return this.groups.map(v => ({
      start: v.startCharCode,
      end: v.endCharCode
    }));
  }

}

exports.Format13 = Format13;

class ConstantMapGroup {
  constructor(p) {
    this.startCharCode = p.uint32;
    this.endCharCode = p.uint32;
    this.glyphID = p.uint32;
  }

}
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/format14.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Format14 = void 0;

var _lazy = _interopRequireDefault(require("../../../../lazy.js"));

var _subtable = require("./subtable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Format14 extends _subtable.Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.subTableStart = p.currentPosition;
    this.format = 14;
    this.length = p.uint32;
    this.numVarSelectorRecords = p.uint32;
    (0, _lazy.default)(this, `varSelectors`, () => [...new Array(this.numVarSelectorRecords)].map(_ => new VariationSelector(p)));
  }

  supports() {
    console.warn(`supports not implemented for cmap subtable format 14`);
    return 0;
  }

  getSupportedCharCodes() {
    console.warn(`getSupportedCharCodes not implemented for cmap subtable format 14`);
    return [];
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 14`);
    return {};
  }

  supportsVariation(variation) {
    let v = this.varSelector.find(uvs => uvs.varSelector === variation);
    return v ? v : false;
  }

  getSupportedVariations() {
    return this.varSelectors.map(v => v.varSelector);
  }

}

exports.Format14 = Format14;

class VariationSelector {
  constructor(p) {
    this.varSelector = p.uint24;
    this.defaultUVSOffset = p.Offset32;
    this.nonDefaultUVSOffset = p.Offset32;
  }

}
},{"../../../../lazy.js":"node_modules/lib-font/src/lazy.js","./subtable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/subtable.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap/createSubTable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSubTable;

var _format = require("./format0.js");

var _format2 = require("./format2.js");

var _format3 = require("./format4.js");

var _format4 = require("./format6.js");

var _format5 = require("./format8.js");

var _format6 = require("./format10.js");

var _format7 = require("./format12.js");

var _format8 = require("./format13.js");

var _format9 = require("./format14.js");

// cmap subtables

/**
 * Cmap Subtable factory
 * @param {int} format the subtable format number (see https://docs.microsoft.com/en-us/typography/opentype/spec/cmap#format-0-byte-encoding-table onward)
 * @param {parser} parser a parser already pointing at the subtable's data location, right after reading the `format` uint16.
 */
function createSubTable(parser, platformID, encodingID) {
  const format = parser.uint16;
  if (format === 0) return new _format.Format0(parser, platformID, encodingID);
  if (format === 2) return new _format2.Format2(parser, platformID, encodingID);
  if (format === 4) return new _format3.Format4(parser, platformID, encodingID);
  if (format === 6) return new _format4.Format6(parser, platformID, encodingID);
  if (format === 8) return new _format5.Format8(parser, platformID, encodingID);
  if (format === 10) return new _format6.Format10(parser, platformID, encodingID);
  if (format === 12) return new _format7.Format12(parser, platformID, encodingID);
  if (format === 13) return new _format8.Format13(parser, platformID, encodingID);
  if (format === 14) return new _format9.Format14(parser, platformID, encodingID);
  return {};
}
},{"./format0.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format0.js","./format2.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format2.js","./format4.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format4.js","./format6.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format6.js","./format8.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format8.js","./format10.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format10.js","./format12.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format12.js","./format13.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format13.js","./format14.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/format14.js"}],"node_modules/lib-font/src/opentype/tables/simple/cmap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cmap = void 0;

var _simpleTable = require("../simple-table.js");

var _createSubTable = _interopRequireDefault(require("./cmap/createSubTable.js"));

var _lazy = _interopRequireDefault(require("../../../lazy.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The OpenType `cmap` main table.
 *
 * Subtables are found in the ./cmap directory
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/cmap for more information
 */
class cmap extends _simpleTable.SimpleTable {
  constructor(dict, dataview) {
    const {
      p
    } = super(dict, dataview);
    this.version = p.uint16;
    this.numTables = p.uint16;
    this.encodingRecords = [...new Array(this.numTables)].map(_ => new EncodingRecord(p, this.tableStart));
  }

  getSubTable(tableID) {
    return this.encodingRecords[tableID].table;
  }

  getSupportedEncodings() {
    return this.encodingRecords.map(r => ({
      platformID: r.platformID,
      encodingId: r.encodingID
    }));
  }

  getSupportedCharCodes(platformID, encodingID) {
    const recordID = this.encodingRecords.findIndex(r => r.platformID === platformID && r.encodingID === encodingID);
    if (recordID === -1) return false;
    const subtable = this.getSubTable(recordID);
    return subtable.getSupportedCharCodes();
  }

  reverse(glyphid) {
    for (let i = 0; i < this.numTables; i++) {
      let code = this.getSubTable(i).reverse(glyphid);
      if (code) return code;
    }
  }

  getGlyphId(char) {
    let last = 0;
    this.encodingRecords.some((_, tableID) => {
      let t = this.getSubTable(tableID);
      if (!t.getGlyphId) return false;
      last = t.getGlyphId(char);
      return last !== 0;
    });
    return last;
  }

  supports(char) {
    return this.encodingRecords.some((_, tableID) => {
      const t = this.getSubTable(tableID);
      return t.supports && t.supports(char) !== false;
    });
  }

  supportsVariation(variation) {
    return this.encodingRecords.some((_, tableID) => {
      const t = this.getSubTable(tableID);
      return t.supportsVariation && t.supportsVariation(variation) !== false;
    });
  }

}
/**
 * ...docs go here...
 */


exports.cmap = cmap;

class EncodingRecord {
  constructor(p, tableStart) {
    const platformID = this.platformID = p.uint16;
    const encodingID = this.encodingID = p.uint16;
    const offset = this.offset = p.Offset32; // from cmap table start

    (0, _lazy.default)(this, `table`, () => {
      p.currentPosition = tableStart + offset;
      return (0, _createSubTable.default)(p, platformID, encodingID);
    });
  }

}
},{"../simple-table.js":"node_modules/lib-font/src/opentype/tables/simple-table.js","./cmap/createSubTable.js":"node_modules/lib-font/src/opentype/tables/simple/cmap/createSubTable.js","../../../lazy.js":"node_modules/lib-font/src/lazy.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
//# sourceMappingURL=/cmap.8bb5d6b7.js.map
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
})({"NewNavalBattle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.humanGuessField = exports.aiField = exports.humanField = exports.gameIsOver = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _RESOLUTION = 10;
var _FLEET = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var gameIsOver = false;
exports.gameIsOver = gameIsOver;

var Field = /*#__PURE__*/function () {
  function Field() {
    _classCallCheck(this, Field);

    this.battleField = Array.from({
      length: _RESOLUTION
    }, function () {
      return Array.from({
        length: _RESOLUTION
      }, function () {
        return '@';
      });
    });
  }

  _createClass(Field, [{
    key: "getRandomIntInclusive",
    value: function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }
  }, {
    key: "generateRandomCoordinateXY",
    value: function generateRandomCoordinateXY(result) {
      result = [this.getRandomIntInclusive(0, 9), this.getRandomIntInclusive(0, 9)];
      return result;
    }
  }, {
    key: "convertNumberToCoordArr",
    value: function convertNumberToCoordArr(number) {
      var coordinates = [];
      coordinates.push(Math.floor(number / _RESOLUTION), number % _RESOLUTION);
      return coordinates;
    }
  }]);

  return Field;
}();

var PlayerField = /*#__PURE__*/function (_Field) {
  _inherits(PlayerField, _Field);

  var _super = _createSuper(PlayerField);

  function PlayerField() {
    var _this;

    _classCallCheck(this, PlayerField);

    _this = _super.call(this);
    _this._FLEET = _FLEET;

    _this.placeShipsOnField();

    return _this;
  }

  _createClass(PlayerField, [{
    key: "isSurroundingCellsFree",
    value: function isSurroundingCellsFree(coordinate) {
      var row = coordinate[0];
      var col = coordinate[1];

      if (row === 0) {
        return this.battleField[row][col - 1] === '@' && this.battleField[row][col + 1] === '@' && this.battleField[row + 1][col + 1] === '@' && this.battleField[row + 1][col] === '@' && this.battleField[row + 1][col - 1] === '@';
      }

      if (row === 9) {
        return this.battleField[row][col - 1] === '@' && this.battleField[row - 1][col - 1] === '@' && this.battleField[row - 1][col] === '@' && this.battleField[row - 1][col + 1] === '@' && this.battleField[row][col + 1] === '@';
      }

      if (col === 0) {
        return this.battleField[row - 1][col] === '@' && this.battleField[row - 1][col + 1] === '@' && this.battleField[row][col + 1] === '@' && this.battleField[row + 1][col + 1] === '@' && this.battleField[row + 1][col] === '@';
      }

      if (col === 9) {
        return this.battleField[row][col - 1] === '@' && this.battleField[row - 1][col - 1] === '@' && this.battleField[row - 1][col] === '@' && this.battleField[row + 1][col] === '@' && this.battleField[row + 1][col - 1] === '@';
      }

      return this.battleField[row][col - 1] === '@' && this.battleField[row - 1][col - 1] === '@' && this.battleField[row - 1][col] === '@' && this.battleField[row - 1][col + 1] === '@' && this.battleField[row][col + 1] === '@' && this.battleField[row + 1][col + 1] === '@' && this.battleField[row + 1][col] === '@' && this.battleField[row + 1][col - 1] === '@';
    }
  }, {
    key: "isCanBeAttachedVertical",
    value: function isCanBeAttachedVertical(shipLength, startCoordinate) {
      var row = startCoordinate[0];
      var col = startCoordinate[1];
      var result = true;
      var isWithinTheGameField = row + shipLength < _RESOLUTION;
      var isOneDeckCanBePlaced = this.isSurroundingCellsFree(startCoordinate) && this.battleField[row][col] === '@';
      if (!isWithinTheGameField) return false;
      if (shipLength === 1) return isOneDeckCanBePlaced;

      for (var i = 0; i < shipLength; i++) {
        if (this.battleField[row + i][col] !== '@' || !this.isSurroundingCellsFree([row + i, col])) {
          result = false;
        }
      }

      return result && isWithinTheGameField;
    }
  }, {
    key: "isCanBeAttachedHorizontal",
    value: function isCanBeAttachedHorizontal(shipLength, startCoordinate) {
      var row = startCoordinate[0];
      var col = startCoordinate[1];
      var result = true;
      var isWithinTheGameField = col + shipLength < _RESOLUTION;
      var isOneDeckCanBePlaced = this.isSurroundingCellsFree([row, col]) && this.battleField[row][col] === '@';
      if (!isWithinTheGameField) return false;
      if (shipLength === 1) return isOneDeckCanBePlaced;

      for (var i = 0; i < shipLength; i++) {
        if (this.battleField[row][col + i] !== '@' || !this.isSurroundingCellsFree([row, col + i])) {
          result = false;
        }
      }

      return result && isWithinTheGameField;
    }
  }, {
    key: "attachShip",
    value: function attachShip(shipLength) {
      var _this2 = this;

      var randomCoordinate = [];
      randomCoordinate = this.generateRandomCoordinateXY(randomCoordinate);
      var canBeAttachedVertical = false;
      var canBeAttachedHorizontal = false;

      var attachVertical = function attachVertical() {
        for (var i = 0; i < shipLength; i++) {
          _this2.battleField[randomCoordinate[0] + i][randomCoordinate[1]] = '#';
        }
      };

      var attachHorizontal = function attachHorizontal() {
        for (var i = 0; i < shipLength; i++) {
          _this2.battleField[randomCoordinate[0]][randomCoordinate[1] + i] = '#';
        }
      };

      for (; !(canBeAttachedVertical || canBeAttachedHorizontal);) {
        randomCoordinate = this.generateRandomCoordinateXY(randomCoordinate);
        canBeAttachedVertical = this.isCanBeAttachedVertical(shipLength, randomCoordinate);
        canBeAttachedHorizontal = this.isCanBeAttachedHorizontal(shipLength, randomCoordinate);
      }

      canBeAttachedVertical && canBeAttachedHorizontal ? this.getRandomIntInclusive(0, 1) === 1 ? attachVertical() : attachHorizontal() : canBeAttachedVertical ? attachVertical() : attachHorizontal();
    }
  }, {
    key: "placeShipsOnField",
    value: function placeShipsOnField() {
      for (var i = 0; i < this._FLEET.length; i++) {
        this.attachShip(this._FLEET[i]);
      }
    }
  }, {
    key: "markSunkShip",
    value: function markSunkShip(coordinate, sourceField, guessField) {
      function markSunkDeck(coordinate, sourceField, guessField) {
        if (coordinate[1] - 1 > -1 && sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '@') {
          guessField.battleField[coordinate[0]][coordinate[1] - 1] = '*';
          sourceField.battleField[coordinate[0]][coordinate[1] - 1] = '*';
        }

        if (coordinate[0] - 1 > -1 && coordinate[1] - 1 > -1 && sourceField.battleField[coordinate[0] - 1][coordinate[1] - 1] === '@') {
          guessField.battleField[coordinate[0] - 1][coordinate[1] - 1] = '*';
          sourceField.battleField[coordinate[0] - 1][coordinate[1] - 1] = '*';
        }

        if (coordinate[0] - 1 > -1 && sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '@') {
          sourceField.battleField[coordinate[0] - 1][coordinate[1]] = '*';
          guessField.battleField[coordinate[0] - 1][coordinate[1]] = '*';
        }

        if (coordinate[0] - 1 > -1 && coordinate[1] + 1 < 10 && sourceField.battleField[coordinate[0] - 1][coordinate[1] + 1] === '@') {
          sourceField.battleField[coordinate[0] - 1][coordinate[1] + 1] = '*';
          guessField.battleField[coordinate[0] - 1][coordinate[1] + 1] = '*';
        }

        if (coordinate[1] + 1 < 10 && sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '@') {
          guessField.battleField[coordinate[0]][coordinate[1] + 1] = '*';
          sourceField.battleField[coordinate[0]][coordinate[1] + 1] = '*';
        }

        if (coordinate[0] + 1 < 10 && coordinate[1] + 1 < 10 && sourceField.battleField[coordinate[0] + 1][coordinate[1] + 1] === '@') {
          guessField.battleField[coordinate[0] + 1][coordinate[1] + 1] = '*';
          sourceField.battleField[coordinate[0] + 1][coordinate[1] + 1] = '*';
        }

        if (coordinate[0] + 1 < 10 && sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '@') {
          sourceField.battleField[coordinate[0] + 1][coordinate[1]] = '*';
          guessField.battleField[coordinate[0] + 1][coordinate[1]] = '*';
        }

        if (coordinate[0] + 1 < 10 && coordinate[1] - 1 > -1 && sourceField.battleField[coordinate[0] + 1][coordinate[1] - 1] === '@') {
          guessField.battleField[coordinate[0] + 1][coordinate[1] - 1] = '*';
          sourceField.battleField[coordinate[0] + 1][coordinate[1] - 1] = '*';
        }
      }

      var isOneDeckShip = function isOneDeckShip() {
        var result = true;

        if (coordinate[0] + 1 < 10) {
          if (!(sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '@' || sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '*')) result = false;
        }

        if (coordinate[0] - 1 > -1) {
          if (!(sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '@' || sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '*')) result = false;
        }

        if (coordinate[1] + 1 < 10) {
          if (!(sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '@' || sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '*')) result = false;
        }

        if (coordinate[1] - 1 > -1) {
          if (!(sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '@' || sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '*')) result = false;
        }

        return result;
      }; //vert


      var isSunkVertical = function isSunkVertical() {
        if (coordinate[0] + 1 < 10 && guessField.battleField[coordinate[0] + 1][coordinate[1]] === 'X' || coordinate[0] - 1 > -1 && guessField.battleField[coordinate[0] - 1][coordinate[1]] === 'X') {
          var setTopPoint = function setTopPoint() {
            for (var i = 0; i < 4 && coordinate[0] + i < 10 && guessField.battleField[coordinate[0] + i][coordinate[1]] === 'X'; i++) {
              topPoint = [coordinate[0] + i, coordinate[1]];
            }
          };

          var setLowPoint = function setLowPoint() {
            for (var i = 0; i < 4 && coordinate[0] - i > -1 && guessField.battleField[coordinate[0] - i][coordinate[1]] === 'X'; i++) {
              lowPoint = [coordinate[0] - i, coordinate[1]];
            }
          };

          var topPoint, lowPoint;
          setTopPoint();
          setLowPoint();

          var isCompletelySunkBottomSide = function isCompletelySunkBottomSide() {
            if ([lowPoint[0] - 1] > -1) {
              return sourceField.battleField[lowPoint[0] - 1][lowPoint[1]] !== '#';
            } else return sourceField.battleField[lowPoint[0]][lowPoint[1]] === 'X';
          };

          var isCompletelySunkTopSide = function isCompletelySunkTopSide() {
            if ([topPoint[0] + 1] < 10) {
              return sourceField.battleField[topPoint[0] + 1][topPoint[1]] !== '#';
            } else return sourceField.battleField[topPoint[0]][topPoint[1]] === 'X';
          };

          return isCompletelySunkTopSide() && isCompletelySunkBottomSide();
        }
      }; //horizontal


      var isSunkHorizontal = function isSunkHorizontal() {
        if (coordinate[1] + 1 < 10 && guessField.battleField[coordinate[0]][coordinate[1] + 1] === 'X' || coordinate[1] - 1 > -1 && guessField.battleField[coordinate[0]][coordinate[1] - 1] === 'X') {
          var setTopPoint = function setTopPoint() {
            for (var i = 0; i < 4 && coordinate[1] + i < 10 && guessField.battleField[coordinate[0]][coordinate[1] + i] === 'X'; i++) {
              topPoint = [coordinate[0], coordinate[1] + i];
            }
          };

          var setLowPoint = function setLowPoint() {
            for (var i = 0; i < 4 && coordinate[1] - i > -1 && guessField.battleField[coordinate[0]][coordinate[1] - i] === 'X'; i++) {
              lowPoint = [coordinate[0], coordinate[1] - i];
            }
          };

          var topPoint, lowPoint;
          setLowPoint();
          setTopPoint();
          return sourceField.battleField[topPoint[0]][topPoint[1] + 1] !== '#' && sourceField.battleField[lowPoint[0]][lowPoint[1] - 1] !== '#';
        }
      };

      if (isSunkVertical()) {
        for (var i = 0; i < 4 && coordinate[0] + i < 10 && guessField.battleField[coordinate[0] + i][coordinate[1]] === 'X'; i++) {
          markSunkDeck([coordinate[0] + i, coordinate[1]], sourceField, guessField);
        }

        for (var _i = 0; _i < 4 && coordinate[0] - _i > -1 && guessField.battleField[coordinate[0] - _i][coordinate[1]] === 'X'; _i++) {
          markSunkDeck([coordinate[0] - _i, coordinate[1]], sourceField, guessField);
        }
      }

      if (isSunkHorizontal()) {
        for (var _i2 = 0; _i2 < 4 && coordinate[1] + _i2 < 10 && guessField.battleField[coordinate[0]][coordinate[1] + _i2] === 'X'; _i2++) {
          markSunkDeck([coordinate[0], coordinate[1] + _i2], sourceField, guessField);
        }

        for (var _i3 = 0; _i3 < 4 && coordinate[1] - _i3 > -1 && guessField.battleField[coordinate[0]][coordinate[1] - _i3] === 'X'; _i3++) {
          markSunkDeck([coordinate[0], coordinate[1] - _i3], sourceField, guessField);
        }
      }

      if (isOneDeckShip()) {
        markSunkDeck(coordinate, sourceField, guessField);
      }
    }
  }, {
    key: "isGameOver",
    value: function isGameOver(field) {
      var result = true;

      for (var row = 0; row < _RESOLUTION; row++) {
        for (var col = 0; col < _RESOLUTION; col++) {
          if (field.battleField[row][col] === '#') result = false;
        }
      }

      if (result) {
        exports.gameIsOver = gameIsOver = true;
      }
    }
  }]);

  return PlayerField;
}(Field);

var HumanField = /*#__PURE__*/function (_PlayerField) {
  _inherits(HumanField, _PlayerField);

  var _super2 = _createSuper(HumanField);

  function HumanField() {
    _classCallCheck(this, HumanField);

    return _super2.call(this);
  }

  _createClass(HumanField, [{
    key: "humanAttack",
    value: function humanAttack(index) {
      var coordinates = this.convertNumberToCoordArr(index);

      switch (aiField.battleField[coordinates[0]][coordinates[1]]) {
        case '@':
          aiField.battleField[coordinates[0]][coordinates[1]] = '*';
          humanGuessField.battleField[coordinates[0]][coordinates[1]] = '*';
          aiField.aiAttackRandomCoordinate();
          break;

        case '#':
          aiField.battleField[coordinates[0]][coordinates[1]] = 'X';
          humanGuessField.battleField[coordinates[0]][coordinates[1]] = 'X';
          this.markSunkShip(coordinates, aiField, humanGuessField);
          break;

        case 'X':
          break;

        case '*':
          break;

        default:
          alert("DEFAULT in humanAttack");
          break;
      }

      this.isGameOver(aiField);
    }
  }]);

  return HumanField;
}(PlayerField);

var AiField = /*#__PURE__*/function (_PlayerField2) {
  _inherits(AiField, _PlayerField2);

  var _super3 = _createSuper(AiField);

  function AiField() {
    _classCallCheck(this, AiField);

    return _super3.call(this);
  }

  _createClass(AiField, [{
    key: "aiAttackRandomCoordinate",
    value: function aiAttackRandomCoordinate() {
      var coordinate = this.generateRandomCoordinateXY();

      switch (humanField.battleField[coordinate[0]][coordinate[1]]) {
        case '@':
          humanField.battleField[coordinate[0]][coordinate[1]] = '*';
          break;

        case '#':
          humanField.battleField[coordinate[0]][coordinate[1]] = 'X';
          aIguessField.battleField[coordinate[0]][coordinate[1]] = 'X';
          this.markSunkShip(coordinate, humanField, aIguessField);
          aiField.aiAttackRandomCoordinate();
          break;

        case 'X':
          aiField.aiAttackRandomCoordinate();
          break;

        case '*':
          aiField.aiAttackRandomCoordinate();
          break;

        default:
          alert("ERROR in aiAttackRandomCoordinate()");
          break;
      }

      this.isGameOver(humanField);
    } // processAiAttack(lastSuccessAttackCoordinate) {
    //
    //     let directions = []; //possible direction of attack, excluding directions leading to switching to next line and directions with already empty/hitted cells
    //     const lsac = lastSuccessAttackCoordinate; //shorter form for better readability
    //     let coords = []; //array of first cell coords, from a possibly attack directions
    //     let possibleAttackCoords;
    //
    //     //is an extreme cell of line
    //     function isLastCellInTheLine(coordinate) {
    //         return coordinate % 10 === 0 ||           //left line
    //             coordinate < 10 ||                    //top line
    //             (coordinate % 10) === 9 ||            //right line
    //             Math.floor(coordinate / 10) === 9; //bottom line
    //     }
    //
    //     //get array of a possible attack directions
    //     function getAttackDirections (lsac)  {
    //         let directions = [];
    //
    //         //1. last in a line; 1 - true; 0 - false;
    //         if(isLastCellInTheLine(lsac)) {
    //             lsac % 10 === 0 ? directions.push(1) : directions.push(0); //left line
    //             lsac < 10 ? directions.push(1) : directions.push(0); //top line
    //             (lsac % 10) === 9 ? directions.push(1) : directions.push(0); //right line
    //             Math.floor(lsac / 10) === 9 ? directions.push(1) : directions.push(0); //bottom line
    //         }
    //
    //         //2. there's empty cells;
    //         if (directions[0] !== 0) aIguessField.battleField[lsac - 1] === '@' ? directions[0] = 1 : directions[0] = 0; //left line
    //         if (directions[1] !== 0) aIguessField.battleField[lsac - 10] === '@' ? directions[1] = 1 : directions[1] = 0; //top line
    //         if (directions[2] !== 0) aIguessField.battleField[lsac + 1] === '@' ? directions[2] = 1 : directions[2] = 0; //right line
    //         if (directions[3] !== 0) aIguessField.battleField[lsac + 10] === '@' ? directions[3] = 1 : directions[3] = 0; //bottom line
    //
    //         return directions;
    //     }
    //
    //     directions = getAttackDirections(lsac);
    //
    //     //first cell coords, from a possibly attack directions
    //     function getPossibleAttackCoords () {
    //         directions.forEach(function(direction, index) {
    //             if(direction === 1) {
    //                 switch (index) {
    //                     case 0: coords.push(lsac - 1); break;
    //                     case 1: coords.push(lsac - 10); break;
    //                     case 2: coords.push(lsac + 1); break;
    //                     case 3: coords.push(lsac + 10); break;
    //                     default: break;
    //                 }}
    //         });
    //         return coords;
    //     }
    //
    //     this.nextAttackCoords = getPossibleAttackCoords(nextAttackCoords);
    // }
    //
    // attackVars = {
    //     isThereMultideckShips: this.enemyFleet.includes(2 || 3 || 4),
    //     lastSuccessAttackCoordinate: null,
    //     possibleAttackCoords: [],
    // };
    //
    // isShipSunk() {
    //     let coordsToCompare = [];
    //     let result = true;
    //
    //
    //         //left line
    //         for (let i = 1; humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - i] !== '@' && i < 4; i++) {
    //             coordsToCompare.push(this.attackVars.lastSuccessAttackCoordinate - i);
    //         }
    //
    //
    //
    //         //right line
    //         for (let i = 1; humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + i] !== '@' && i < 4; i++) {
    //             coordsToCompare.push(this.attackVars.lastSuccessAttackCoordinate + i);
    //         }
    //
    //
    //
    //         for (let i = 1; humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - i * VERTICAL_INCREMENT] !== '@' && i < 4; i++) {
    //             coordsToCompare.push(this.attackVars.lastSuccessAttackCoordinate - i * VERTICAL_INCREMENT);
    //         }
    //
    //
    //
    //         for (let i = 1; humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + i * VERTICAL_INCREMENT] !== '@' && i < 4; i++) {
    //             coordsToCompare.push(this.attackVars.lastSuccessAttackCoordinate + i * VERTICAL_INCREMENT);
    //         }
    //
    //     coordsToCompare = coordsToCompare.filter(coord => coord >= 0);
    //     coordsToCompare = coordsToCompare.filter(coord => coord <= 99);
    //
    //     console.log(coordsToCompare);
    //     coordsToCompare.forEach((coordinate) => {if (aIguessField.battleField[coordinate] !== 'X') result = false;});
    //
    //     return result;
    // }
    //
    // aiAttacks() {
    //
    // if (this.attackVars.lastSuccessAttackCoordinate) {
    //     console.log(this.attackVars.lastSuccessAttackCoordinate);
    //     if(this.isShipSunk()) {
    //         this.processSunkShip();
    //     } else {
    //         this.getFinishingCoords();
    //         this.attackPossibleCoords();
    //     }
    //
    //
    // } else {
    //     this.aiAttackRandomCoordinate();
    // }
    //
    // }
    //
    // getFinishingCoords() {
    //
    //     //adding left direction coords
    //     for (let i = 1; i < 4
    //         && aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - i*HORIZONTAL_INCREMENT] === '@'
    //         && (aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] !== 'X'
    //         || aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] !== 'X'); i++) {
    //             this.attackVars.possibleAttackCoords.push(this.attackVars.lastSuccessAttackCoordinate - i);
    //         }
    //
    //     //adding top direction coords
    //     for (let i = 1; i < 4
    //     && aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + i*VERTICAL_INCREMENT] === '@'
    //     && (aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] !== 'X'
    //         || aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] !== 'X'); i++) {
    //         this.attackVars.possibleAttackCoords.push(this.attackVars.lastSuccessAttackCoordinate + i*VERTICAL_INCREMENT);
    //     }
    //
    //
    //     //adding right direction coords
    //     for (let i = 1; i < 4
    //         && aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + i*HORIZONTAL_INCREMENT] === '@'
    //         && (aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] !== 'X'
    //         || aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] !== 'X'); i++) {
    //             this.attackVars.possibleAttackCoords.push(this.attackVars.lastSuccessAttackCoordinate + i);
    //         }
    //
    //     //adding bottom direction coords
    //     for (let i = 1; i < 4
    //         && aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - i*VERTICAL_INCREMENT] === '@'
    //         && (aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] !== 'X'
    //         || aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] !== 'X'); i++) {
    //             this.attackVars.possibleAttackCoords.push(this.attackVars.lastSuccessAttackCoordinate - i*VERTICAL_INCREMENT);
    //         }
    //
    //     console.log('finishing coords:' + this.attackVars.possibleAttackCoords)
    // }
    //
    // processSunkShip() {
    //
    //     //detect ship direction
    //     let lsac = this.attackVars.lastSuccessAttackCoordinate;
    //     let length = 1;
    //     let isVertical = null;
    //
    //     const surroundCoordinateWithDots = () => {
    //         if
    //         (
    //             (humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] === '@' ||
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] === '*') &&
    //
    //             (humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] === '@' ||
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] === '*') &&
    //
    //             (humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] === '@' ||
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] === '*') &&
    //
    //             (humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] === '@' ||
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] === '*')
    //         ) {
    //
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate - 9] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 11] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 9] = '*';
    //             humanField.battleField[this.attackVars.lastSuccessAttackCoordinate + 11] = '*';
    //
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 1] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 1] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 10] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 10] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 11] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 11] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate - 9] = '*';
    //             aIguessField.battleField[this.attackVars.lastSuccessAttackCoordinate + 9] = '*';
    //
    //         }
    //     };
    //
    //     isVertical = () => {
    //         if (aIguessField.battleField[lsac + 1] === 'X' || aIguessField.battleField[lsac - 1] === 'X') return 0;
    //         if (aIguessField.battleField[lsac + 10] === 'X' || aIguessField.battleField[lsac - 10] === 'X') return 1;
    //     };
    //
    //     const  processVertical = () => {
    //
    //             let extremeDeckCoordinate = () => {
    //                 let result = lsac;
    //                 for (let i = 0; aIguessField.battleField[lsac + i * VERTICAL_INCREMENT] === 'X'; i++) {
    //                     result += i * VERTICAL_INCREMENT;
    //                 } return result;
    //             };
    //
    //             let finalDeckCoordinate = () => {
    //                 let result = lsac;
    //                 for (let i = 0; i < length - 1; i++) {
    //                     result -= i * VERTICAL_INCREMENT;
    //                 } return result;
    //             };
    //
    //             function getSunkShipLength() {
    //             for (let i = 1; aIguessField.battleField[lsac + i * VERTICAL_INCREMENT] === 'X'; i++) {
    //                 length++;
    //             }
    //
    //             for (let i = 1; aIguessField.battleField[lsac - i * VERTICAL_INCREMENT] === 'X'; i++) {
    //                 length++;
    //             }
    //         }
    //
    //             function surroundShipWithDots () {
    //
    //                 function surroundExtremeDeckWithDots() {
    //                     aIguessField.battleField[extremeDeckCoordinate - 1] = '*';
    //                     aIguessField.battleField[extremeDeckCoordinate - 9] = '*';
    //                     aIguessField.battleField[extremeDeckCoordinate - 10] = '*';
    //                     aIguessField.battleField[extremeDeckCoordinate - 11] = '*';
    //                     aIguessField.battleField[extremeDeckCoordinate + 1] = '*';
    //
    //                     humanField.battleField[extremeDeckCoordinate - 1] = '*';
    //                     humanField.battleField[extremeDeckCoordinate - 9] = '*';
    //                     humanField.battleField[extremeDeckCoordinate - 10] = '*';
    //                     humanField.battleField[extremeDeckCoordinate - 11] = '*';
    //                     humanField.battleField[extremeDeckCoordinate + 1] = '*';
    //
    //
    //                 }
    //
    //                 function surroundFinalDeckWithDots() {
    //                     aIguessField.battleField[finalDeckCoordinate - 1] = '*';
    //                     aIguessField.battleField[finalDeckCoordinate + 9] = '*';
    //                     aIguessField.battleField[finalDeckCoordinate + 10] = '*';
    //                     aIguessField.battleField[finalDeckCoordinate + 11] = '*';
    //                     aIguessField.battleField[finalDeckCoordinate + 1] = '*';
    //
    //                     humanField.battleField[finalDeckCoordinate - 1] = '*';
    //                     humanField.battleField[finalDeckCoordinate + 9] = '*';
    //                     humanField.battleField[finalDeckCoordinate + 10] = '*';
    //                     humanField.battleField[finalDeckCoordinate + 11] = '*';
    //                     humanField.battleField[finalDeckCoordinate + 1] = '*';
    //
    //                 }
    //
    //                 function surroundMiddleDeckWithDots() {
    //                     for (let i = 0; i < length; i++) {
    //                         aIguessField.battleField[extremeDeckCoordinate() - i * VERTICAL_INCREMENT + 1] = '*';
    //                         aIguessField.battleField[extremeDeckCoordinate() - i * VERTICAL_INCREMENT - 1] = '*';
    //
    //                         humanField.battleField[extremeDeckCoordinate() - i * VERTICAL_INCREMENT + 1] = '*';
    //                         humanField.battleField[extremeDeckCoordinate() - i * VERTICAL_INCREMENT - 1] = '*';
    //
    //                     }
    //                 }
    //
    //                 surroundExtremeDeckWithDots();
    //                 surroundFinalDeckWithDots();
    //                 surroundMiddleDeckWithDots();
    //             }
    //
    //         getSunkShipLength();
    //         surroundShipWithDots ();
    //     };
    //
    //     const  processHorizontal = () => {
    //
    //         let extremeDeckCoordinate = () => {
    //             let result = lsac;
    //             for (let i = 0; aIguessField.battleField[lsac - i] === 'X'; i++) {
    //                 result += i;
    //             } return result;
    //         };
    //
    //         let finalDeckCoordinate = () => {
    //             let result = lsac;
    //             for (let i = 0; i < length - 1; i++) {
    //                 result += i;
    //             } return result;
    //         };
    //
    //         function getSunkShipLength() {
    //             for (let i = 1; aIguessField.battleField[lsac + i] === 'X'; i++) {
    //                 length++;
    //             }
    //
    //             for (let i = 1; aIguessField.battleField[lsac - i] === 'X'; i++) {
    //                 length++;
    //             }
    //         }
    //
    //         function surroundShipWithDots () {
    //
    //             function surroundExtremeDeckWithDots() {
    //                 aIguessField.battleField[extremeDeckCoordinate - 10] = '*';
    //                 aIguessField.battleField[extremeDeckCoordinate - 9] = '*';
    //                 aIguessField.battleField[extremeDeckCoordinate - 1] = '*';
    //                 aIguessField.battleField[extremeDeckCoordinate + 9] = '*';
    //                 aIguessField.battleField[extremeDeckCoordinate + 10] = '*';
    //
    //                 humanField.battleField[extremeDeckCoordinate - 10] = '*';
    //                 humanField.battleField[extremeDeckCoordinate - 9] = '*';
    //                 humanField.battleField[extremeDeckCoordinate - 1] = '*';
    //                 humanField.battleField[extremeDeckCoordinate + 9] = '*';
    //                 humanField.battleField[extremeDeckCoordinate + 10] = '*';
    //
    //             }
    //
    //             function surroundFinalDeckWithDots() {
    //                 aIguessField.battleField[finalDeckCoordinate - 10] = '*';
    //                 aIguessField.battleField[finalDeckCoordinate - 9] = '*';
    //                 aIguessField.battleField[finalDeckCoordinate + 1] = '*';
    //                 aIguessField.battleField[finalDeckCoordinate + 11] = '*';
    //                 aIguessField.battleField[finalDeckCoordinate + 10] = '*';
    //
    //                 humanField.battleField[finalDeckCoordinate - 10] = '*';
    //                 humanField.battleField[finalDeckCoordinate - 9] = '*';
    //                 humanField.battleField[finalDeckCoordinate + 1] = '*';
    //                 humanField.battleField[finalDeckCoordinate + 11] = '*';
    //                 humanField.battleField[finalDeckCoordinate + 10] = '*';
    //
    //             }
    //
    //             function surroundMiddleDeckWithDots() {
    //                 for (let i = 0; i < length; i++) {
    //                     aIguessField.battleField[extremeDeckCoordinate() + 10] = '*';
    //                     aIguessField.battleField[extremeDeckCoordinate() - 10] = '*';
    //
    //                     humanField.battleField[extremeDeckCoordinate() + 10] = '*';
    //                     humanField.battleField[extremeDeckCoordinate() - 10] = '*';
    //                 }
    //             }
    //
    //             surroundExtremeDeckWithDots();
    //             surroundFinalDeckWithDots();
    //             surroundMiddleDeckWithDots();
    //
    //         }
    //         getSunkShipLength();
    //         surroundShipWithDots();
    //
    //     };
    //
    //     switch (isVertical) {
    //         case 1: processVertical(); break;
    //         case 0: processHorizontal(); break;
    //         default: surroundCoordinateWithDots();
    //     }
    //
    //     this.attackVars.lastSuccessAttackCoordinate = null;
    //     this.attackVars.possibleAttackCoords = [];
    //
    // };
    //
    // attackPossibleCoords() {
    //
    //     switch (humanField.battleField[this.attackVars.possibleAttackCoords[0]]) {
    //         case '@':
    //             humanField.battleField[this.attackVars.possibleAttackCoords[0]] = '*';
    //             aIguessField.battleField[this.attackVars.possibleAttackCoords[0]] = '*';
    //             this.attackVars.possibleAttackCoords = [];
    //             break;
    //         case '#':
    //             aIguessField.battleField[this.attackVars.possibleAttackCoords[0]] = 'X';
    //             humanField.battleField[this.attackVars.possibleAttackCoords[0]] = 'X';
    //             this.aiAttacks();
    //             break;
    //         case 'X':
    //             this.attackVars.possibleAttackCoords.splice(0,1);
    //             this.attackPossibleCoords();
    //             break;
    //         case '*':
    //             this.attackVars.possibleAttackCoords.splice(0,1);
    //             this.attackPossibleCoords();
    //             break;
    //         default: alert("default case in attackPossibleCoords()");
    //             break;
    //     }
    //     this.isGameOver(humanField);
    // };

  }]);

  return AiField;
}(PlayerField);

var humanField = new HumanField();
exports.humanField = humanField;
var aiField = new AiField();
exports.aiField = aiField;
var humanGuessField = new Field();
exports.humanGuessField = humanGuessField;
var aIguessField = new Field();
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64755" + '/');

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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","NewNavalBattle.js"], null)
//# sourceMappingURL=/navalbattle.github.io/NewNavalBattle.e9310c80.js.map
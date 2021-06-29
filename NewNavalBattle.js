
    const _RESOLUTION = 10;
    const _FLEET = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];


    class Field {

        constructor() {
            this.battleField = Array.from({length: _RESOLUTION},
                () => Array.from({length: _RESOLUTION},
                    () => ('@')));
        }

        getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
        }

        generateRandomCoordinateXY(result) {
            result = [this.getRandomIntInclusive(0, 9), this.getRandomIntInclusive(0, 9)]
            return result;
        }

        convertNumberToCoordArr(number) {
            let coordinates = [];
            coordinates.push(Math.floor(number / _RESOLUTION), number % _RESOLUTION);
            return coordinates;
        }
    }

    class PlayerField extends Field {

        constructor() {
            super();
            this._FLEET = _FLEET;
            this.placeShipsOnField();
        }

        isSurroundingCellsFree(coordinate) {
            let row = coordinate[0];
            let col = coordinate[1];

            if (row === 0) {
                return this.battleField[row][col - 1] === '@'
                    && this.battleField[row][col + 1] === '@'
                    && this.battleField[row + 1][col + 1] === '@'
                    && this.battleField[row + 1][col] === '@'
                    && this.battleField[row + 1][col - 1] === '@'
            }

            if (row === 9) {
                return this.battleField[row][col - 1] === '@'
                    && this.battleField[row - 1][col - 1] === '@'
                    && this.battleField[row - 1][col] === '@'
                    && this.battleField[row - 1][col + 1] === '@'
                    && this.battleField[row][col + 1] === '@'
            }

            if (col === 0) {
                return this.battleField[row - 1][col] === '@'
                    && this.battleField[row - 1][col + 1] === '@'
                    && this.battleField[row][col + 1] === '@'
                    && this.battleField[row + 1][col + 1] === '@'
                    && this.battleField[row + 1][col] === '@'
            }

            if (col === 9) {
                return this.battleField[row][col - 1] === '@'
                    && this.battleField[row - 1][col - 1] === '@'
                    && this.battleField[row - 1][col] === '@'
                    && this.battleField[row + 1][col] === '@'
                    && this.battleField[row + 1][col - 1] === '@'
            }

            return this.battleField[row][col - 1] === '@'
                && this.battleField[row - 1][col - 1] === '@'
                && this.battleField[row - 1][col] === '@'
                && this.battleField[row - 1][col + 1] === '@'
                && this.battleField[row][col + 1] === '@'
                && this.battleField[row + 1][col + 1] === '@'
                && this.battleField[row + 1][col] === '@'
                && this.battleField[row + 1][col - 1] === '@'

        }

        isCanBeAttachedVertical(shipLength, startCoordinate) {

            let row = startCoordinate[0];
            let col = startCoordinate[1];
            let result = true;
            let isWithinTheGameField = (row + shipLength < _RESOLUTION);
            let isOneDeckCanBePlaced = this.isSurroundingCellsFree(startCoordinate) && (this.battleField[row][col] === '@');
            if (!isWithinTheGameField) return false;
            if (shipLength === 1) return isOneDeckCanBePlaced;

            for (let i = 0; i < shipLength; i++) {
                if (this.battleField[row + i][col] !== '@' || !this.isSurroundingCellsFree([row + i, col])) {
                    result = false;
                }
            }

            return result && isWithinTheGameField;
        }

        isCanBeAttachedHorizontal(shipLength, startCoordinate) {

            let row = startCoordinate[0];
            let col = startCoordinate[1];
            let result = true;
            let isWithinTheGameField = (col + shipLength < _RESOLUTION);
            let isOneDeckCanBePlaced = this.isSurroundingCellsFree([row, col]) && (this.battleField[row][col] === '@');
            if (!isWithinTheGameField) return false;
            if (shipLength === 1) return isOneDeckCanBePlaced;


            for (let i = 0; i < shipLength; i++) {
                if (this.battleField[row][col + i] !== '@' || !this.isSurroundingCellsFree([row, col + i])) {
                    result = false;
                }
            }

            return result && isWithinTheGameField;
        }

        attachShip(shipLength) {
            let randomCoordinate = [];
            randomCoordinate = this.generateRandomCoordinateXY(randomCoordinate);
            let canBeAttachedVertical = false;
            let canBeAttachedHorizontal = false;

            let attachVertical = () => {
                for (let i = 0; i < shipLength; i++) {
                    this.battleField[randomCoordinate[0] + i][randomCoordinate[1]] = '#';
                }
            }

            let attachHorizontal = () => {
                for (let i = 0; i < shipLength; i++) {
                    this.battleField[randomCoordinate[0]][randomCoordinate[1] + i] = '#';
                }
            }

            for (; !(canBeAttachedVertical || canBeAttachedHorizontal);) {
                randomCoordinate = this.generateRandomCoordinateXY(randomCoordinate);
                canBeAttachedVertical = this.isCanBeAttachedVertical(shipLength, randomCoordinate);
                canBeAttachedHorizontal = this.isCanBeAttachedHorizontal(shipLength, randomCoordinate);
            }

            canBeAttachedVertical && canBeAttachedHorizontal ? this.getRandomIntInclusive(0, 1) === 1 ? attachVertical() : attachHorizontal() : canBeAttachedVertical ? attachVertical() : attachHorizontal();


        }

        placeShipsOnField() {
            for (let i = 0; i < this._FLEET.length; i++) {
                this.attachShip(this._FLEET[i]);
            }
        }

        markSunkDeck(coordinate, sourceField, guessField) {
            if (coordinate[1] - 1 > -1
                && sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '@') {
                guessField.battleField[coordinate[0]][coordinate[1] - 1] = '*';
                sourceField.battleField[coordinate[0]][coordinate[1] - 1] = '*';
            }
            if (coordinate[0] - 1 > -1 && coordinate[1] - 1 > -1
                && sourceField.battleField[coordinate[0] - 1][coordinate[1] - 1] === '@') {
                guessField.battleField[coordinate[0] - 1][coordinate[1] - 1] = '*';
                sourceField.battleField[coordinate[0] - 1][coordinate[1] - 1] = '*';
            }
            if (coordinate[0] - 1 > -1
                && sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '@') {
                sourceField.battleField[coordinate[0] - 1][coordinate[1]] = '*';
                guessField.battleField[coordinate[0] - 1][coordinate[1]] = '*';
            }
            if (coordinate[0] - 1 > -1 && coordinate[1] + 1 < 10
                && sourceField.battleField[coordinate[0] - 1][coordinate[1] + 1] === '@') {
                sourceField.battleField[coordinate[0] - 1][coordinate[1] + 1] = '*';
                guessField.battleField[coordinate[0] - 1][coordinate[1] + 1] = '*';
            }
            if (coordinate[1] + 1 < 10
                && sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '@') {
                guessField.battleField[coordinate[0]][coordinate[1] + 1] = '*';
                sourceField.battleField[coordinate[0]][coordinate[1] + 1] = '*';
            }
            if (coordinate[0] + 1 < 10 && coordinate[1] + 1 < 10
                && sourceField.battleField[coordinate[0] + 1][coordinate[1] + 1] === '@') {
                guessField.battleField[coordinate[0] + 1][coordinate[1] + 1] = '*';
                sourceField.battleField[coordinate[0] + 1][coordinate[1] + 1] = '*';
            }
            if (coordinate[0] + 1 < 10
                && sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '@') {
                sourceField.battleField[coordinate[0] + 1][coordinate[1]] = '*';
                guessField.battleField[coordinate[0] + 1][coordinate[1]] = '*';
            }
            if (coordinate[0] + 1 < 10 && coordinate[1] - 1 > -1
                && sourceField.battleField[coordinate[0] + 1][coordinate[1] - 1] === '@') {
                guessField.battleField[coordinate[0] + 1][coordinate[1] - 1] = '*';
                sourceField.battleField[coordinate[0] + 1][coordinate[1] - 1] = '*';
            }

        }

        markSunkShip(coordinate, sourceField, guessField) {

            let isOneDeckShip = () => {
                let result = true;
                if (coordinate[0] + 1 < 10) { if (!(sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '@'
                || sourceField.battleField[coordinate[0] + 1][coordinate[1]] === '*')) result = false; }
                if (coordinate[0] - 1 > -1) { if (!(sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '@'
                || sourceField.battleField[coordinate[0] - 1][coordinate[1]] === '*')) result = false; }
                if (coordinate[1] + 1 < 10) { if (!(sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '@'
                || sourceField.battleField[coordinate[0]][coordinate[1] + 1] === '*')) result = false; }
                if (coordinate[1] - 1 > -1) { if (!(sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '@'
                || sourceField.battleField[coordinate[0]][coordinate[1] - 1] === '*')) result = false; }
                return result;
            }

            //vert
            let isSunkVertical = () => {

                if ( (coordinate[0] + 1 < 10 && guessField.battleField[coordinate[0] + 1][coordinate[1]] === 'X')
                    || (coordinate[0] - 1 > -1 && guessField.battleField[coordinate[0] - 1][coordinate[1]] === 'X') ) {

                    let topPoint, lowPoint;


                    for (let i = 0; i < 4
                        && coordinate[0] + i < 10
                        && guessField.battleField[coordinate[0] + i][coordinate[1]] === 'X'; i++) {
                        topPoint = [coordinate[0] + i, coordinate[1]];
                    }


                    for (let i = 0; i < 4
                        && coordinate[0] - i > -1
                        && guessField.battleField[coordinate[0] - i][coordinate[1]] === 'X'; i++) {
                        lowPoint = [coordinate[0] - i, coordinate[1]];
                        }

                    let isCompletelySunkBottomSide = () => {
                        if ([lowPoint[0] - 1] > -1) {
                            return sourceField.battleField[lowPoint[0] - 1][lowPoint[1]] !== '#';
                        } else return sourceField.battleField[lowPoint[0]][lowPoint[1]] === 'X';
                    }

                    let isCompletelySunkTopSide = () => {
                        if ([topPoint[0] + 1] < 10) {
                            return sourceField.battleField[topPoint[0] + 1][topPoint[1]] !== '#';
                        } else return sourceField.battleField[topPoint[0]][topPoint[1]] === 'X';
                    }


                    return isCompletelySunkTopSide() && isCompletelySunkBottomSide();
                }

            }

            //horizontal
            let isSunkHorizontal = () => {

                    if ( (coordinate[1] + 1 < 10
                        && guessField.battleField[coordinate[0]][coordinate[1] + 1] === 'X')
                        || ( coordinate[1] - 1 > -1
                            && guessField.battleField[coordinate[0]][coordinate[1] - 1] === 'X') ) {

                        let topPoint, lowPoint;

                        for (let i = 0; i < 4
                        && coordinate[1] + i < 10
                        && guessField.battleField[coordinate[0]][coordinate[1] + i] === 'X'; i++) {
                            topPoint = [coordinate[0], coordinate[1] + i];
                        }

                        for (let i = 0; i < 4
                        && coordinate[1] - i > -1
                        && guessField.battleField[coordinate[0]][coordinate[1] - i] === 'X'; i++) {
                            lowPoint = [coordinate[0], coordinate[1] - i];
                        }

                        return sourceField.battleField[topPoint[0]][topPoint[1] + 1] !== '#' && sourceField.battleField[lowPoint[0]][lowPoint[1] - 1] !== '#';
                    }

            }

            if (isSunkVertical()) {

                for (let i = 0; i < 4 && coordinate[0] + i < 10
                && guessField.battleField[coordinate[0] + i][coordinate[1]] === 'X'; i++) {
                    this.markSunkDeck([coordinate[0] + i, coordinate[1]], sourceField, guessField)
                }

                for (let i = 0; i < 4 && coordinate[0] - i > -1
                    && guessField.battleField[coordinate[0] - i][coordinate[1]] === 'X'; i++) {
                    this.markSunkDeck([coordinate[0] - i, coordinate[1]], sourceField, guessField)
                }

            }

            if (isSunkHorizontal()) {

                for (let i = 0; i < 4 && coordinate[1] + i < 10
                && guessField.battleField[coordinate[0]][coordinate[1]+ i] === 'X'; i++) {
                    this.markSunkDeck([coordinate[0], coordinate[1] + i], sourceField, guessField)
                }

                for (let i = 0; i < 4 && coordinate[1] - i > -1
                && guessField.battleField[coordinate[0]][coordinate[1] - i] === 'X'; i++) {
                    this.markSunkDeck([coordinate[0], coordinate[1]  - i], sourceField, guessField)
                }

            }

            if (isOneDeckShip()) {
                this.markSunkDeck(coordinate, sourceField, guessField);
            }
        }

        isGameOver(field) {
            let result = true;
            for (let row = 0; row < _RESOLUTION; row++) {
                for (let col = 0; col < _RESOLUTION; col++) {
                    if (field.battleField[row][col] === '#') result = false;
                }
            }
            if (result) {
                alert('GG');
            }
        }
    }

    class HumanField extends PlayerField {

        constructor() {
            super();
        }

        humanAttack(index) {
            let coordinates = this.convertNumberToCoordArr(index);
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

    }

    class AiField extends PlayerField {

        constructor() {
            super();
        }

        aiAttackRandomCoordinate() {
            let coordinate = this.generateRandomCoordinateXY()
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

        }


        // processAiAttack(lastSuccessAttackCoordinate) {
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

    }

    const humanField = new HumanField();
    const aiField = new AiField();
    const humanGuessField = new Field();
    const aIguessField = new Field();


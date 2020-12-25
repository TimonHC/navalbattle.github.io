const VERTICAL_INCREMENT = 10;
const HORIZONTAL_INCREMENT = 1;
class Field {

    constructor() {
        this.battleField = [];
        this.fillField();
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    fillField() {
        for (let i = 0; i < 100; i++) {
            this.battleField.push('@');
        }
    }
}

class PlayerField extends  Field {

    constructor() {
        super();
        this.placeGameEntities();
    }

    _FLEET = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    setShipDirection() {
        return Math.random() >= 0.5 ? 1 : 0;
    }

    isSurroundingCellsFree(cell) {
        let result = false;

        if (
            (this.battleField[cell-11] === '@' || this.battleField[cell-11] === undefined)
            && (this.battleField[cell-10] === '@' || this.battleField[cell-10] === undefined)
            && (this.battleField[cell-9] === '@' || this.battleField[cell-9] === undefined)
            && (this.battleField[cell+1] === '@' || this.battleField[cell+1] === undefined)
            && (this.battleField[cell+11] === '@' || this.battleField[cell+11] === undefined)
            && (this.battleField[cell+10] === '@' || this.battleField[cell+10] === undefined)
            && (this.battleField[cell+9] === '@' || this.battleField[cell+9] === undefined)
            && (this.battleField[cell-1] === '@' || this.battleField[cell-1] === undefined)
        ) { result = true; }
        return result;
    }

    isCanBeAttached(shipLength, startCoordinate, direction) {
        //for an attempt to place ship in another direction
        let switchedDirection = () => direction === 1 ? 0 : 1;
        let cellsToOut;
        let lastCoordinate;
        let canBeAttached = false;

        //check free cell for one-deck ships
        if (shipLength === 1) return this.isSurroundingCellsFree(startCoordinate) && (this.battleField[startCoordinate] === '@');

        //vertical ship placement direction
        if (direction === 1) {

            cellsToOut = (startCoordinate === 99) ? 1
                : 10 - Math.floor(((startCoordinate) + 10) / 10) + 1;
            lastCoordinate = startCoordinate + ((shipLength - 1) * 10);

            if (
                this.isSurroundingCellsFree(startCoordinate) &&
                this.isSurroundingCellsFree(lastCoordinate) &&
                shipLength <= cellsToOut
            ) {
                canBeAttached = true;
                for (let i = 0; i < shipLength; i++) {
                    if (!((this.battleField[startCoordinate - 1] === '@' || this.battleField[startCoordinate - 1] === undefined)
                        && (this.battleField[startCoordinate + 1] === '@' || this.battleField[startCoordinate + 1] === undefined)))
                        canBeAttached = false;
                }
            }
        }

        //horizontal ship placement direction
        if (direction === 0) {
            cellsToOut = (startCoordinate % 10) === 0 ? 10 : 10 - (startCoordinate % 10);
            lastCoordinate = startCoordinate + shipLength;
            if (
                this.isSurroundingCellsFree(startCoordinate) &&
                this.isSurroundingCellsFree(lastCoordinate) &&
                shipLength <= cellsToOut
            ) {
                canBeAttached = true;
                for (let i = 0; i < shipLength; i++) {
                    if(!((this.battleField[startCoordinate - VERTICAL_INCREMENT] === '@' || this.battleField[startCoordinate + VERTICAL_INCREMENT] === undefined)
                        && (this.battleField[startCoordinate - VERTICAL_INCREMENT] === '@' || this.battleField[startCoordinate + VERTICAL_INCREMENT] === undefined)))
                        canBeAttached = false;
                }
            }
        }

        //trying to place ship with the same coordinates but in another direction
        if(!canBeAttached) try {
            this.isCanBeAttached(shipLength, startCoordinate, switchedDirection);
        } catch(rangeError) {
            return canBeAttached;}

        return canBeAttached;
}

    placeShip(ship) {
        let randomCoordinate;
        let direction;
        let canBeAttached = false;

        do {
            randomCoordinate = this.getRandomIntInclusive(0, 99);
            direction = this.setShipDirection();
            canBeAttached = this.isCanBeAttached(ship, randomCoordinate, direction);
        } while (!canBeAttached);

        if (canBeAttached) {
            for (let i = 0; i < ship; i++) {
                this.battleField[randomCoordinate] = '#';
                direction ? randomCoordinate += 10 : randomCoordinate++;
            }
        }

    }

    placeGameEntities () {
        for (let i = 0; i < this._FLEET.length; i++) {
            this.placeShip(this._FLEET[i]);
        }
    }

    isGameOver(field){
        let result = true;
        for (let i = 0; i < 100; i++) {
            if(field.battleField[i] === '#') result = false;
        }
        if(result) {
           alert('GG');
        }
    }
}

class AiField extends PlayerField {


    constructor() {
        super();
    }

    processAiSuccessAttack(lastSuccessAttackCoordinate) {
        let verticalLine = [];
        let horizontalLine = [];

        //arg1 is coordinate, arg2 is desirable direction of the line (1 - vert, 0 horizontal);
        function getLineNumber(coordinate, direction) {
            let line;
            if ( (coordinate < 0 || coordinate > 99) || (direction !== 0 || direction !== 1) ) {
                return;
            } else {
                direction
                    ? line = coordinate % VERTICAL_INCREMENT //vertical
                    : line = Math.floor(coordinate / VERTICAL_INCREMENT); //horizontal
            } return line;
        }

        //get whole vertical line wheres hitted in a row
        function setVerticalLine(coordinate, arr) {
            let verticalLineNumber = getLineNumber(coordinate, 1);
            //vertical ship hitted case
            arr = getLineNumber(coordinate, 1);
                for (let i = 0; i < 10; i++) {
                    arr.push((i * VERTICAL_INCREMENT) + verticalLineNumber);
                }
            }

            //horizontal ship hitted case
            function setHorizontalLine(coordinate, arr) {
                let horizontalLineNumber = getLineNumber(coordinate, 0);
                for (let i = 0; i < 10; i++) {
                    arr.push((horizontalLineNumber*VERTICAL_INCREMENT) + i);
                }
            }

            function isLastCellInTheLine(coordinate) {
                return coordinate % 10 === 0 ||
                    coordinate % 10 === 1 ||
                    Math.floor(coordinate / 10) === 0 ||
                    Math.floor(coordinate / 10) === 9;
            }

            //cut off cells beyond the maximum length of the ship
            function cutGuessAttackLine (line, coordinate) {
            let index = line.indexOf(coordinate);
            index < 4 ? line = line.slice (0, index + 4) :
            line = line.slice (index - 3, (index + 4));
            return line;
            }

            cutGuessAttackLine(verticalLine, lastSuccessAttackCoordinate);
            cutGuessAttackLine(horizontalLine, lastSuccessAttackCoordinate);

            function proceedGuessAttackLines() {

            }


    }

    aiAttack() {
       let coordinate = this.getRandomIntInclusive(0, 99);
        switch (humanField.battleField[coordinate]) {
            case '@':
                humanField.battleField[coordinate] = '*';
                break;
            case '#':
                humanField.battleField[coordinate] = 'X';

                aiField.aiAttack();
                break;
            case 'X':
                aiField.aiAttack();
                break;
            case '*':
                aiField.aiAttack();
                break;
            default: alert("DEFAULT in aiAttack " );
            break;
        }
        this.isGameOver(humanField);
    }



}

class HumanField extends PlayerField {

    constructor() {
        super();
    }

    changeClass(item, index, field) {
        item.classList.remove('incognito','ship','empty', 'hit');
        switch(field.battleField[index]) {
            case "@": item.classList.add("incognito");
                break;
            case "#": item.classList.add("ship");
                break;
            case "X": item.classList.add("hit");
                break;
            case "*": item.classList.add("empty");
                break;
            default:
                break;
        }
    }

    humanAttack(index) {

        switch (aiField.battleField[index]) {
            case '@':
                aiField.battleField[index] = '*';
                humanGuessField.battleField[index] = '*';
                aiField.aiAttack();
                break;
            case '#':
                aiField.battleField[index] = 'X';
                humanGuessField.battleField[index] = 'X';
                break;
            case 'X':
                break;
            case '*':
                break;
            default: alert("DEFAULT in humanAttack");
                break;
        } this.isGameOver(aiField);
    }
}

let humanField = new HumanField();
let aiField = new AiField();
let humanGuessField = new Field();
let aIguessField = new Field();


console.log(humanField.battleField);
console.log(aiField.battleField);
console.log(humanGuessField.battleField);
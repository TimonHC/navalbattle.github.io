
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
        cell--;

        if (
            (this.battleField[cell-11] === undefined || this.battleField[cell-11] === '@')
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

        let cellsToOut;
        let lastCoordinate;
        let canBeAttached = false;

        if (shipLength === 1) return this.isSurroundingCellsFree(startCoordinate);

        if (direction === 1) {

            cellsToOut = (startCoordinate === 100) ? 1
                : 10 - Math.floor(((startCoordinate) + 10) / 10) + 1;
            lastCoordinate = startCoordinate + (shipLength * 10 - 1);

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

        if (direction === 0) {
            cellsToOut = (startCoordinate % 10) === 0 ? 1 : 10 - (startCoordinate % 10) + 1;
            lastCoordinate = startCoordinate + shipLength - 1;
            if (
                this.isSurroundingCellsFree(startCoordinate) &&
                this.isSurroundingCellsFree(lastCoordinate) &&
                shipLength <= cellsToOut
            ) {
                canBeAttached = true;
                for (let i = 0; i < shipLength; i++) {
                    if(!((this.battleField[startCoordinate - 10] === '@' || this.battleField[startCoordinate + 10] === undefined)
                        && (this.battleField[startCoordinate - 10] === '@' || this.battleField[startCoordinate + 10] === undefined)))
                        canBeAttached = false;
                }
            }
        }
        return canBeAttached;
    }

    placeShip(ship) {
        let randomCoordinate;
        let direction;
        let canBeAttached = false;

        do {
            randomCoordinate = this.getRandomIntInclusive(1, 100);
            direction = this.setShipDirection();
            canBeAttached = this.isCanBeAttached(ship, randomCoordinate, direction);
        } while (!canBeAttached);

        if (canBeAttached) {
            for (let i = 0; i < ship; i++) {
                this.battleField[randomCoordinate-1] = '#';
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
        if(result) alert('GG');
    }
}

class AiField extends PlayerField {

    constructor() {
        super();
    }

    aiAttack() {

        let coordinate = this.getRandomIntInclusive(1, 100);
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

    isShipSunk(coordsOfLastSuccessAttack, field) {
        let c = coordsOfLastSuccessAttack;
        return ((field[c - 1] || field[c + 1] || field[c + 10] || field[c - 10]) !== "#");
    }

    circleTheSunkenShipWithDots(coordsOfLastSuccessAttack) {
        let c = coordsOfLastSuccessAttack;
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





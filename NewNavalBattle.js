
class Field {

    constructor(player){
        this.battleField = [];
        this.player = player;
    }

    _FLEET = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

    fillField() {
        for (let i = 0; i < 100; i++) {
            this.battleField.push('@');
        }
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    setShipDirection() {
            return Math.random() >= 0.5 ? 1 : 0;
        }

    isSuroundingCellsFree(cell) {
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

            if (shipLength === 1) return this.isSuroundingCellsFree(startCoordinate);

            if (direction === 1) {

                cellsToOut = (startCoordinate === 100) ? 1
                    : 10 - Math.floor(((startCoordinate) + 10) / 10) + 1;
                lastCoordinate = startCoordinate + (shipLength * 10 - 1);

                if (
                    this.isSuroundingCellsFree(startCoordinate) &&
                    this.isSuroundingCellsFree(lastCoordinate) &&
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
                    this.isSuroundingCellsFree(startCoordinate) &&
                    this.isSuroundingCellsFree(lastCoordinate) &&
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

        isShipSunk(coordsOfLastSuccessAttack, field) {
        let c = coordsOfLastSuccessAttack;
        return ((field[c - 1] || field[c + 1] || field[c + 10] || field[c - 10]) !== "#");
        }

        circleTheSunkenShipWithDots(coordsOfLastSuccessAttack) {
            let c = coordsOfLastSuccessAttack;
            

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

}

class Cannon {
    botGetAttackCoords() {
        botLastSuccessAttackCoords;
        botNextAttackCoord;

        if (this.botLastSuccessAttackCoords === "undefined") {
            return this.botNextAttackCoord = Field.prototype.getRandomIntInclusive(1, 100);
        }
    }
}

function changeClass(item, index, field) {
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

function isGameover(field){
    let result = true;
    for (let i = 0; i < 100; i++) {
       if(field.battleField[i] === '#') result = false;
    }
    if(result) alert('GG');
}
function playerAttack(index) {
    
    switch (botField.battleField[index]) {
        case '@':
            botField.battleField[index] = '*';
            guessField.battleField[index] = '*';
            botAttack();
            break;
        case '#':
            botField.battleField[index] = 'X';
            guessField.battleField[index] = 'X';
            break;
        case 'X':
            break;
        case '*':
            break;
        default: alert("DEFAULT");
        break;
    } isGameover(botField);
}

function botAttack() {
    let index = botField.getRandomIntInclusive(0, 100);
    switch (myField.battleField[index]) {
        case '@':
            myField.battleField[index] = '*';
            break;
        case '#':
            myField.battleField[index] = 'X';
            botAttack();
            break;
        case 'X':
            //alert("bot already known cell with sunked deck");
            botAttack();
            break;
        case '*':
           // alert("bot already known empty cell");
            botAttack();
            break;
        default: alert("DEFAULT");break;
    }
    isGameover(myField);
}

let myField = new Field('Player');
let botField = new Field('Bot');
let guessField = new Field('Bot');


myField.fillField();
myField.placeGameEntities();


botField.fillField();
botField.placeGameEntities();
guessField.fillField();


function initField(field) {
    for(var i=0; i<100; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        field.appendChild(square);
}


/*
        //square.classList.add("square");
        switch (myField.battleField[i]) {
            case "@":
                square.classList.add("incognito");
                break;
            case "#":
                square.classList.add("ship");
                break;
            case "X":
                square.classList.add("hit");
                break;
            case "*":
                square.classList.add("empty");
                break;
            default:
                break;
        }
        playerField.appendChild(square);
    }
}
*/

}



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

    printField() {
        switch (this.player) {
            case 'Player' :
                console.log('ПОЛЕ ИГРОКА:');
                break;
            case 'Bot' :
                console.log('ПОЛЕ БОТА: ');
                break;
            default :
                console.log('ОШИБКА, НЕВЕРНОЕ ПОЛЕ...');
                break;
        }

        const fieldCoords = [
            ['\n   |A_B_C_D_E_F_G_H_I_J|',],
            ['\n01|', '02|', '03|', '04|', '05|', '06|', '07|', '08|', '09|', '10|']
        ];
        let result = '';
        console.log(fieldCoords[0][0]);

        for (let i = 0; i < this.battleField.length; i++) {
            const isRowEnd = i % 10 === 0;

            if (isRowEnd)
                result += (i === 0)
                    ? fieldCoords[1][i / 10]
                    : '\n' + fieldCoords[1][i / 10];
            result += ' ' + this.battleField[i];
        }
        console.log(result);
    }

    placeGameEntities () {
            for (let i = 0; i < this._FLEET.length; i++) {
                this.placeShip(this._FLEET[i]);
            }
        }

}

class Cannon {

    coordsConverter(letter, number) {

        let row = 0, col = 0;

    switch (letter) {
        case 'a' :
            col += 1;
            break;
        case 'b':
            col += 2;
            break;
        case 'c':
            col += 3;
            break;
        case 'd':
            col += 4;
            break;
        case 'e':
            col += 5;
            break;
        case 'f':
            col += 6;
            break;
        case 'g':
            col += 7;
            break;
        case 'h':
            col += 8;
            break;
        case 'i':
            col += 9;
            break;
        case 'j':
            col;
            break;
        default :
            console.log('wrong coords of the column');
            break;
    }

        switch (number) {
            case 1:
                row;
                break;
            case 2:
                row += 10;
                break;
            case 3:
                row += 20;
                break;
            case 4:
                row += 30;
                break;
            case 5:
                row += 40;
                break;
            case 6:
                row += 50;
                break;
            case 7:
                row += 60;
                break;
            case 8:
                row += 70;
                break;
            case 9:
                row += 80;
                break;
            case 10:
                row += 90;
                break;
            default :
                console.log('wrong coords of the row');
                break;
        }

        return (col + row);
    }


    botGetAttackCoords() {
        botLastSuccessAttackCoords;
        botNextAttackCoord;

        if (this.botLastSuccessAttackCoords === "undefined") {
            return this.botNextAttackCoord = Field.prototype.getRandomIntInclusive(1, 100);
        }
    }
}

function playerAttack(index) {
    switch (botField.battleField[index]) {        case '@': alert('pusto'); break;
        case '#': alert('ship'); break;
        case 'X': alert('fire'); break;
        case '*': alert('uje bilo'); break;

    }

}

let myField = new Field('Player');
let botField = new Field('Bot');


myField.fillField();
myField.placeGameEntities();
myField.printField();

botField.fillField();
botField.placeGameEntities();
botField.printField();



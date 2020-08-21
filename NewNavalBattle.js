class Field {

    constructor(player){
        this.battleField = [];
        this.player = player;
    }

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
            if (
                ((this.battleField[cell-11] === undefined) || (this.battleField[cell-11] === '@'))
                && (this.battleField[cell-10] === '@' || this.battleField[cell-10] === undefined)
                && (this.battleField[cell-9] === '@' || this.battleField[cell-9] === undefined)
                && (this.battleField[cell+1] === '@' || this.battleField[cell+1] === undefined)
                && (this.battleField[cell+11] === '@' || this.battleField[cell+11] === undefined)
                && (this.battleField[cell+10] === '@' || this.battleField[cell+10] === undefined)
                && (this.battleField[cell+9] === '@' || this.battleField[cell+9] === undefined)
                && (this.battleField[cell-1] === '@' || this.battleField[cell-1] === undefined)
            ) result = true;
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
            case 'player' :
                console.log('ПОЛЕ ИГРОКА:');
                break;
            case 'bot' :
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

        placeFleet () {

        }



}

myField = new Field('player');
myField.fillField();
myField.printField();
myField.placeShip(4);
myField.placeShip(3);
myField.placeShip(3);
myField.placeShip(2);
myField.placeShip(2);
myField.placeShip(2);
myField.placeShip(1);
myField.placeShip(1);
myField.placeShip(1);
myField.placeShip(1);
myField.printField();
    const renderer = PIXI.autoDetectRenderer(
        {backgroundAlpha: 0});
    renderer.resize(innerWidth, innerHeight);

    const textureCell = PIXI.Texture.from('Content\\sprites\\cell-incognito.png');
    const textureCellShip = PIXI.Texture.from('Content\\sprites\\cell-ship.png');
    const textureCellHit = PIXI.Texture.from('Content\\sprites\\cell-hit.png');
    const textureCellEmpty = PIXI.Texture.from('Content\\sprites\\cell-empty.png');
    const cellSize = 7 * (window.innerHeight / 100);
    const stage = new PIXI.Container();


    const firstField = new PIXI.Container();
    const secondField = new PIXI.Container();

    const firstFieldXY = [cellSize, cellSize]
    const secondFieldXY = [(innerWidth / 2) + cellSize, 2*cellSize]
    firstField.x = firstFieldXY[0];
    firstField.y = firstFieldXY[1];

    document.getElementById('view').appendChild(renderer.view);

    stage.addChild(firstField);
    stage.addChild(secondField);


    createUiField(humanField.battleField, firstFieldXY, firstField)
    createUiField(humanGuessField.battleField, secondFieldXY, secondField)

function createUiField(dataField, startPoint, uiField) {

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {

        let cell;

        function createCell(dataField) {
                    switch (dataField[i][j]) {
                        case "@":
                            cell = new PIXI.Sprite(textureCell);
                            break;
                        case "*":
                            cell = new PIXI.Sprite(textureCellEmpty);
                            break;
                        case "X":
                            cell = new PIXI.Sprite(textureCellHit);
                            break;
                        case "#":
                            cell = new PIXI.Sprite(textureCellShip);
                            break;
                        default:
                            break;
                    }
                }

            createCell(dataField);

            cell.width = cellSize;
            cell.height = cellSize;
            cell.y = startPoint[1] + i * cellSize;
            cell.x = startPoint[0] + j * cellSize;
            cell.interactive = true;
            cell.buttonMode = true;

            if (dataField === humanGuessField.battleField){
                cell
                    .on('pointerdown', onButtonDown)
                    .on('pointerup', onButtonUp)
                    .on('pointerupoutside', onButtonUp)
                    .on('pointerover', onButtonOver)
                    .on('pointerout', onButtonOut);
            } else {
                cell
                    .on('pointerover', onButtonOver)
                    .on('pointerout', onButtonOut);
            }

            uiField.addChild(cell);
        }
    }
}

function switchCellTexture(cell, index, dataField) {
    let coords = humanField.convertNumberToCoordArr(index);
    let x = coords[0];
    let y = coords[1];

    switch (dataField.battleField[x][y]) {
        case "@":
            cell.texture = textureCell;
            break;
        case "*":
            cell.texture = textureCellEmpty;
            break;
        case "X":
            cell.texture = textureCellHit;
            break;
        case "#":
            cell.texture = textureCellShip;
            break;
        default:
            break;

    }
}

// run the render loop
animate();

function animate() {
    renderer.render(stage);
    requestAnimationFrame( animate );
}

function onButtonDown() {
    this.isdown = true;
    this.alpha = 1;

    let index = secondField.getChildIndex(this);
    humanField.humanAttack(index);

    switchCellTexture(this, index, aiField);
    firstField.children.forEach(cell => switchCellTexture(cell, firstField.children.indexOf(cell), humanField))
}

function onButtonUp() {
    this.alpha = 1;
    this.isdown = false;
    if (this.isOver) {
        this.alpha = 0.5;
    } else {
       return;
    }
}

function onButtonOver() {
    this.alpha = 0.5;
    this.isOver = true;
    if (this.isdown) {
        return;
    }

}

function onButtonOut() {
    this.alpha = 1;
    this.isOver = false;
    if (this.isdown) {
        return;
    }
   
}

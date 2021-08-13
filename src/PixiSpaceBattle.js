import {humanField, humanGuessField, aiField} from "./NewNavalBattle.js";
// import * as PIXI from './Content/libs/pixi.js';

let renderer, textureCell, textureCellShip, slogo,
    textureCellHit, textureCellEmpty, stage, firstField, secondField, header, logo,
    message;
let innerWidth = 1390;
let innerHeight = 640;
const cellSize = 6 * (window.innerHeight / 100);
const firstFieldXY = [cellSize, cellSize];
const secondFieldXY = [((innerWidth / 2) + cellSize), 2 * cellSize];
const headerXY = [cellSize, cellSize];


function setup() {

    //initializing renderer
    renderer = PIXI.autoDetectRenderer(
        {backgroundAlpha: 0});
    renderer.resize(1390, 900);//1390х640

    //initializing textures
    textureCell = PIXI.Texture.from('./Content\\images\\sprites\\cell-incognito.png');
    textureCellShip = PIXI.Texture.from('Content\\images\\sprites\\cell-ship.png');
    textureCellHit = PIXI.Texture.from('Content\\images\\sprites\\cell-hit.png');
    textureCellEmpty = PIXI.Texture.from('Content\\images\\sprites\\cell-empty.png');
    logo = PIXI.Texture.from('Content\\images\\slogosb.png');



    //initializing containers
    //header section
    header = new PIXI.Container();
    header.x = headerXY[0];
    header.y = headerXY[1];
        //header text
        message = new PIXI.Text(
            "SPACE BATTLE", {
                fontFamily: 'Star Jedi',
                fontSize: 50,
                fill: 'orange',
                align: 'right',
            }
        );
        message.position.set(innerWidth/2, 0);
    slogo = new PIXI.Sprite(logo);
        slogo.scale.set(1.2,1.2);
        slogo.position.set(cellSize, 0);
    header.addChild(message);
    header.addChild(slogo);

    //body section
    firstField = new PIXI.Container();
         firstField.position.set(cellSize, 2*cellSize);
    secondField = new PIXI.Container();
        secondField.position.set(cellSize, cellSize);
    //root container
    stage = new PIXI.Container();
    //injecting containers to root container
    stage.addChild(header);
    stage.addChild(firstField);
    stage.addChild(secondField);


    //appending root container to the html
    document.body.appendChild(renderer.view);

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

    function onButtonDown() {
        this.isdown = true;
        this.alpha = 1;

        let index = secondField.getChildIndex(this);
        humanField.humanAttack(index);


       // switchCellTexture(this, index, aiField);
        firstField.children.forEach(cell => switchCellTexture(cell, firstField.children.indexOf(cell), humanField))
        secondField.children.forEach(cell => switchCellTexture(cell, secondField.children.indexOf(cell), aiField))
    }

    function onButtonUp() {
        this.alpha = 1;
        this.isdown = false;
        if (this.isOver) {
            this.alpha = 0.5;
        }
    }

    function onButtonOver() {
        this.alpha = 0.5;
        this.isOver = true;
    }

    function onButtonOut() {
        this.alpha = 1;
        this.isOver = false;
    }

    // run the render loop
    animate();
}

function animate() {
    renderer.render(stage);
    requestAnimationFrame( animate );
}

setup();
import {sound} from "@pixi/sound";


export function playSound(cellValue) {

    switch (cellValue) {
        case '#': audioContext.resume().then(r => sound.play('my-sound')); break;
        case 'X': audioContext.resume().then(r => sound.play('my-sound')); break;
        case '*': audioContext.resume().then(r => sound.play('my-sound')); break;
        case '@': audioContext.resume().then(r => sound.play('my-sound')); break;
        default: break;
    }
}

playSound('#');
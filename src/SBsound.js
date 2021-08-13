import { sound } from '@pixi/sound';
sound.add('my-sound', 'Content/sounds/MortarCannon.mp3');




export function playSound(cellValue) {

    switch (cellValue) {
        case '#': audioContext.resume().then(r => sound.play('my-sound')); break;
        case 'X': audioContext.resume().then(r => sound.play('my-sound')); break;
        case '*': audioContext.resume().then(r => sound.play('my-sound')); break;
        case '@': audioContext.resume().then(r => sound.play('my-sound')); break;
        default: break;
    }
}


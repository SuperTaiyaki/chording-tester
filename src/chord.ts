
// TODO: Shift this outside to somewhere less stupid
class Chord
{
    pressed: boolean[] = []
    keys: number[] = []
    releasing = false

    constructor() {
        for (let i = 0;i < 10; i++) { // TODO: sync this to the max number of keys defined in the keymap!
            this.keys[i] = 0;
            this.pressed[i] = false;
        }
    }

    isClear(): boolean {
        return this.keys.every((it) => it == 0)
    }

    down(keycode: number) {
        this.keys[keycode] += 1;
        this.pressed[keycode] = true
        this.releasing = false
    }
    up(keycode: number) {
        this.keys[keycode] -= 1;
        this.pressed[keycode] = false

        if (!this.isClear()) {
            this.releasing = true
        }
    }

    pressedKeys(): Array<number> {
        let x = this.pressed.map((pressed, idx) => pressed ? idx : undefined)
            .filter((idx) => idx != undefined);
        return x;
    }

    reset() {
        for (let i = 0;i < 10; i++) {
            this.pressed[i] = false;
        }
    }
}

export default Chord;

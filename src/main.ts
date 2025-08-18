
import m from "mithril";

const doubleKeys: Map<String, String> = new Map([
// 1 char
['0', 'r'],
['1', 's'],
['2', 'n'],
['3', 'i'],
['4', 'a'],
['5', 'o'],
['6', 't'],
['7', 'e'],

// two chars
['0-1', 'b'], // this is probably sub-optimal, can this be expressed in a saner way?
['4-5', 'l'],
['1-2', 'p'],
['0-3', 'g'],
['0-2', 'z'],
['4-6', 'q'],
['0-6', 'x'],
['1-7', 'v'],
['0-7', 'm'],

['1-6', '/'],
['0-5', ';'],
['2-7', ','],

['2-3', 'y'],
['6-7', 'h'],
['5-6', 'u'],
['4-7', 'd'],
['1-3', 'f'],
['5-7', 'c'],
['3-5', 'k'],
['2-4', 'j'],
['3-4', 'w'],

['2-5', '-'],
['3-6', '?'],
['1-4', '\''],
]);


function parseChord(keys: Array<number>) {
    return doubleKeys.get(keys.toSorted().join("-"));
}

// TODO: Shift this outside to somewhere less stupid
class Chord
{
    pressed: boolean[] = []
    keys: number[] = []
    constructor() {
        for (let i = 0;i < 8; i++) {
            this.keys[i] = 0;
            this.pressed[i] = false;
        }
    }

    down(keycode: number) {
        this.keys[keycode] += 1;
        this.pressed[keycode] = true
    }
    up(keycode: number) {
        this.keys[keycode] -= 1;
    }

    isClear(): boolean {
        return this.keys.every((it) => it == 0)
    }

    pressedKeys(): Array<number> {
        let x = this.pressed.map((pressed, idx) => pressed ? idx : undefined)
            .filter((idx) => idx != undefined);
        return x;
    }

    reset() {
        for (let i = 0;i < 8; i++) {
            this.pressed[i] = false;
        }
    }
}

const mapping = new Map([
    ['KeyQ', 0],
    ['KeyW', 1],
    ['KeyE', 2],
    ['KeyR', 3],

    ['KeyA', 4],
    ['KeyS', 5],
    ['KeyD', 6],
    ['KeyF', 7],

    ['KeyP', 0],
    ['KeyO', 1],
    ['KeyI', 2],
    ['KeyU', 3],

    ['Semicolon', 4],
    ['KeyL', 5],
    ['KeyK', 6],
    ['KeyJ', 7],
]);



let text = "";
let chord = new Chord()

function keydown(event) {
    const code = mapping.get(event.code);
    if (code != undefined && event.repeat == false) {
        chord.down(code);
    }
    if (event.code == "Space"  && event.repeat == false) {
        text += (" ");
    }
    if (event.code == "Backspace") {
        text = text.slice(0, -1);
    }
}

function keyup(event) {
    const code = mapping.get(event.code);
    if (code != undefined) {
        console.log("EEEEE");

        chord.up(code);
        if (chord.isClear()) {
            const keys = chord.pressedKeys();
            text += parseChord(keys);
            chord.reset();
        }
    }
}

const Box = {
    view: (() => {
        return [
            m("h1","Test input"),
            m("div", {style: {minHeight: "6ex"}}, text),
            m("div", [
                m('h4', "NOTES:"),
                m('ul', [
                    m('li', 'Keys are mapped to the home row (real A for a, real F for e, real U-P and J-semicolon)'),
                    m('li', 'Only the 1 and 2 character codes in the main table are implemented (no numbers, modifiers, etc).'),
                    m('li', 'Enter and tab are not implemented'),
                    m('li', 'Thumb modifiers are not implemented'),
                    m('li', 'Space is space bar, backspace is backspace'),
                ])
            ]),
            m("div", ["Source: ", m('a', {href: 'https://github.com/SuperTaiyaki/chording-tester' }, 'https://github.com/SuperTaiyaki/chording-tester')]),
        ];
    })
}

const App = {
    view: (() => {
        return [
            m("img", {src: "/taipo.png", style: {width: "55%"}}),
            m(Box)
        ];
    })
}

addEventListener("keydown", ((event) => {
    keydown(event);
}));
addEventListener("keyup", ((event) => {
    keyup(event);
    m.redraw();
}));

m.mount(document.getElementById("app"), App);



import m from "mithril";

import './style.css';

const taipoMap = [
// 1 char
['0', 'r'],
['1', 's'],
['2', 'n'],
['3', 'i'],
['4', 'a'],
['5', 'o'],
['6', 't'],
['7', 'e'],

['8', ' '],

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


['2-3', 'y'],
['6-7', 'h'],
['5-6', 'u'],
['4-7', 'd'],
['1-3', 'f'],
['5-7', 'c'],
['3-5', 'k'],
['2-4', 'j'],
['3-4', 'w'],

['1-6', '/'],
['0-5', ';'],
['2-7', ','],

['2-5', '-'],
['3-6', '?'],
['1-4', '\''],
] as const;

const poshMap = [
    ['7', 'e'],
    ['6', 't'],
    ['5', 'o'],
    ['3', 'i'],
    ['2', 'n'],
    ['1', 'a'],

    ['2-3', 's'],
    ['6-7', 'h'],
    ['2-7', 'r'],
    ['1-2', 'd'],
    ['3-6', 'l'],
    ['5-7', 'c'],
    ['5-6', 'u'],
    ['1-7', 'm'],
    ['3-5', 'w'],
    ['1-3', 'f'],
    ['2-5', 'g'],
    ['2-3-5', 'y'],
    ['1-2-3', 'p'],
    ['5-6-7', 'b'],
    ['2-5-7', 'v'],
    ['1-2-7', 'k'],
    ['3-5-6', 'j'],
    ['1-6-7', 'x'],
    ['1-5-7', 'q'],
    ['2-6-7', 'z'],
] as const;

const arduxMap = [
// 1 char
['0', 's'],
['1', 't'],
['2', 'r'],
['3', 'a'],
['4', 'o'],
['5', 'i'],
['6', 'y'],
['7', 'e'],

// two chars
['4-7', 'b'],
['6-7', 'c'],
['1-2-3', 'd'],
['2-3', 'f'],
['1-2', 'g'],
['5-7', 'h'],
['0-1', 'j'],
['4-6', 'k'],
['5-6-7', 'l'],

['4-5-6', 'm'],
['4-5', 'n'],
['4-5-7', 'p'],

['0-1-3', 'q'],
['5-6', 'u'],
['0-2', 'v'],
['0-3', 'w'],
['0-1-2', 'x'],
['0-1-2-3', 'z'],

['4-5-6-7', ' '],
['1-2-3-4', "BACKSPACE"]
] as const;

const artseyMap = [
// 1 char
['0', 's'],
['1', 't'],
['2', 'r'],
['3', 'a'],
['4', 'o'],
['5', 'i'],
['6', 'y'],
['7', 'e'],

// two chars
['4-7', 'b'],
['6-7', 'c'],
['1-2-3', 'd'],
['2-3', 'f'],
['1-2', 'g'],
['5-7', 'h'],
['0-1', 'j'],
['4-6', 'k'],
['5-6-7', 'l'],

['4-5-6', 'm'],
['4-5', 'n'],
['4-5-7', 'p'],

['0-1-3', 'q'],
['5-6', 'u'],
['0-2', 'v'],
['0-3', 'w'],
['0-1-2', 'x'],
['0-1-2-3', 'z'],

['4-5-6-7', ' '],
['2-7', "BACKSPACE"]
] as const;


function parseChord(keys: Array<number>, chordMap) {
    return chordMap.get(keys.toSorted().join("-"));
}

// TODO: Shift this outside to somewhere less stupid
class Chord
{
    pressed: boolean[] = []
    keys: number[] = []
    constructor() {
        for (let i = 0;i < 10; i++) { // TODO: sync this to the max number of keys defined in the keymap!
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
        for (let i = 0;i < 10; i++) {
            this.pressed[i] = false;
        }
    }
}

// TODO: split this left/right, cross hand chords aren't so useful
const mappings = [new Map([
    ['KeyQ', 0],
    ['KeyW', 1],
    ['KeyE', 2],
    ['KeyR', 3],

    ['KeyA', 4],
    ['KeyS', 5],
    ['KeyD', 6],
    ['KeyF', 7],

    ['KeyV', 8],
    ['KeyB', 9],
]),
new Map([
    ['KeyP', 0],
    ['KeyO', 1],
    ['KeyI', 2],
    ['KeyU', 3],

    ['Semicolon', 4],
    ['KeyL', 5],
    ['KeyK', 6],
    ['KeyJ', 7],

    ['KeyM', 8], //mod
    ['KeyN', 9],
])];

let text = "";
let chords = [new Chord(), new Chord()]

function keydown(event) {
    mappings.forEach((m, i) => {
        const code = m.get(event.code);
        if (code != undefined && event.repeat == false) {
            chords[i].down(code);
        }
        if (event.code == "Space" && event.repeat == false) {
            text += (" ");
        }
        if (event.code == "Backspace") {
            text = text.slice(0, -1);
        }
    });
}

function keyup(event, chordMap) {
    mappings.forEach((m, i) => {
        const code = m.get(event.code);
        if (code != undefined) {
            chords[i].up(code);
            if (chords[i].isClear()) {
                const keys = chords[i].pressedKeys();
                const generated = parseChord(keys, chordMap);
                if (generated != undefined) {
                    if (generated == "BACKSPACE") {
                        text = text.slice(0, -1);
                    } else {
                        text += generated;
                    }
                }
                chords[i].reset();
            }
        }
    });
}

const ChordBox = {
    view: ((vnode) => {
        return m("div", {style: {minHeight: "6ex"}}, m("input", {placeholder: "Type here using chorded inputs", size: 50, 
                onkeydown: ((event) => {keydown(event); event.stopPropagation(); return false;}),
                onkeyup: ((event) => {keyup(event, vnode.attrs.chordMap); event.stopPropagation(); m.redraw(); return false;}),
                value: text,
            }))
    })
};

const Box = {
    view: ((vnode) => {
        return [
            m("h1","Test input"),
            m(ChordBox, {chordMap: vnode.attrs.chordMap}),
            m("h1","Sample input"),
            m('div',
              [m("input", {placeholder: "This is an empty text box. Use it to drop in sample text for copy typing.", size: 50})]),
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
             m("div", m("span", ["Change layout: ",
                        m("p", [ m(m.route.Link, {href: "/taipo"}, "Taipo"), " (4 keys + 2 modifiers)"]),
                        m("p", [ m(m.route.Link, {href: "/posh"}, "Posh"), " (3 keys + 2 modifiers - no pinkies)"]),
                        m("p", [ m(m.route.Link, {href: "/ardux"}, "Ardux"), " (8 keys, no modifiers)"]),
                        //m("p", [ m(m.route.Link, {href: "/artsey"}, "Artsey"), " (8 keys, no modifiers)"]),
                        // disabling Artsey because the main map is the same as Ardux
                        m("p", ["Keymaps are taken from ", m("a", {href: "https://inkeys.wiki/en/keymaps"}, "inclusive keyboards")]),
             ])),
        ];
    })
}

const KeyDiagram = {
    view: ((vnode) => {
        const keysUsed = vnode.attrs.chord;

        const buttonStates = Array(8);
        buttonStates.fill(0, 0, 8); // Array(8) doesn't iterate in forEach!
        buttonStates.forEach((_, i) => {
           buttonStates[i]  = m('td', {class: (keysUsed.includes(String(i)) ? "O" : "X")}, "_");
        }); // TODO: this probably requires a cleanup...

        return [
            m("table.minor", [
                m("tr", [m("td.lead", {rowspan: 2}, m("h4", vnode.attrs.keysym, ))]
                  .concat(vnode.attrs.flip ? buttonStates.slice(0,4).toReversed() : buttonStates.slice(0,4))),
                m("tr", vnode.attrs.flip ? buttonStates.slice(4,8).toReversed() : buttonStates.slice(4,8)),
            ]),
        ];
    })
}

const SingleKeyBlock = {
    view: ((vnode) => {
        let chars = vnode.attrs.chars.map((c) => m("td", m("h4", c)));
        return m("table.major", [
            // TODO: this is an ugly way to handle the flip
                m("tr", vnode.attrs.flip ? chars.slice(0,4).toReversed(): chars.slice(0,4)),
                m("tr", vnode.attrs.flip ? chars.slice(4,8).toReversed(): chars.slice(4,8)),
            ]);
    })
};


const KeyChart = {
    view: ((vnode) => {
        const allKeys = vnode.attrs.chordMap.entries().filter((code) => {
            return code[0].split("-").length > 1; // can this be single-lined?
        }).map((code) => 
        m(KeyDiagram, {keysym: code[1], chord: code[0], flip: vnode.attrs.flip})
              ).toArray();

          const singles = vnode.attrs.chordMap.entries().filter((code) => {
              return code[0].split("-").length == 1; // can this be single-lined?
          }).toArray(); // istoArray() necessary? I can't forEach an iterator?

          let singleBlock = Array(8);
          singles.forEach((x) => {
              singleBlock[Number(x[0])] = x[1];
          });

          return [m(SingleKeyBlock, {chars: singleBlock, flip: vnode.attrs.flip})].concat(allKeys);
    })
}

const App = {
    view: ((vnode) => {
        return m("div.app", [
            m("div.keyDiagram", m(KeyChart, {chordMap: vnode.attrs.chordMap, flip: false})),
            m("div.main", [
                //m("img", {src: "/taipo.png", style: {width: "55%"}}),
                m(Box, {chordMap: vnode.attrs.chordMap}),
            ]),
            m("div.keyDiagram", m(KeyChart, {chordMap: vnode.attrs.chordMap, flip: true})),
        ]);
    })
}

//m.mount(document.getElementById("app"), App);
m.route(document.getElementById("app"), "/taipo", {
    "/taipo": {
        render: (() => {
            return m(App, {chordMap: new Map(taipoMap)});
        })
    },
    "/ardux": {
        render: (() => {
            return m(App, {chordMap: new Map(arduxMap)});
        })
    },
    "/posh": {
        render: (() => {
            return m(App, {chordMap: new Map(poshMap)});
        })
    },
    "/artsey": {
        render: (() => {
            return m(App, {chordMap: new Map(artseyMap)});
        })
    },

    /*
    "/": {
        render: (() => {
            // it came to this one? why?
            return m(App, {chordMap: new Map(poshMap)});
        })
    },
    */

    /*
    "/:layout": {
        render: ((vnode) => m(App, {layout: vnode.attrs.layout}))
    }
    */
})



// taipo: https://inkeys.wiki/en/keymaps/taipo
// posh: https://inkeys.wiki/en/keymaps/posh
// ardux: https://inkeys.wiki/en/keymaps/ardux

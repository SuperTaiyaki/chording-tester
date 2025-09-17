
import m from "mithril";
import wordlist from "./wordlist";

import './style.css';

// not a very typescript way to do this (maybe)
// not very different to a regular class, in the end... ugh.
const MString = (() => ({text: ""}));
const MStringActions = ((state) =>  {
    return {
        append: ((c) => { state.text += c ;}),
        backspace: (() => {state.text = state.text.slice(0, -1);}),
        clear: (() => {state.text = "";}),
        set: ((t) => {state.text = t;})
}});

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

const modifiedTaipoMap = [
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

// two fingers
['0-1', 'b'],
['4-5', 'l'],
['1-2', 'p'],
['0-3', 'g'],
['0-2', 'w'],
['4-6', 'm'],

['2-3', 'y'],
['6-7', 'h'],
['5-6', 'u'],
['4-7', 'd'],
['1-3', 'f'],
['5-7', 'c'],
['3-5', 'k'],

['1-6', '/'],
['0-5', ';'],
['2-7', ','],

['2-5', '-'],
['3-6', '?'],
['1-4', '\''],

// 3-finger regular chars
['0-1-2', 'j'],
['4-5-6', 'k'],
['0-1-3', 'x'],
['4-5-7', 'v'],
['0-1-3', 'z'],
['4-6-7', 'q'],

['0-1-2-3', 'BACKSPACE'],
] as const;

const taipo2Memo = `
After practing with Taipo I decided I didn't like diagonal keys
and the result is this layout. It introduces 3-character chords
to make sure every character is entirely on a single row. Overall
effect on efficiency doesn't seem to be huge.
`;


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

const cykeyMap = [
['7-9', 'i'],
['4-7-9', 'l'],
['4-5', 'g'],
['4-5-9', 'j'],
['5-7', 't'],
['4-9', 'h'],
['7', 'e'],
['6', 'o'],
['5', 's'],
['4', 'u'],
['6-7', 'a'],
['5-6', 'n'],
['5-7-9', 'r'],
['5-9', 'k'],
['5-6-7-9', 'f'],
['4-5-6-7', 'm'],
['6-7-9', 'd'],
['4-5-6', 'b'],
['6-9', 'c'],
['4-6', 'q'],
['4-5-6-7-9', 'p'],
['4-7', 'v'],
['5-6-9', 'y'],
['4-5-6-9', 'x'],
['4-5-7-9', 'w'],
['4-6-9', 'z'],
['9', ' '],
['8', 'BACKSPACE'],
] as const;

const cykeyMemo = `
Space can be used as the primary thumb key for the left hand only.

This is easier to remember using the MicroWriter documentation. 
Mnemonics are provided for all letters.

Several keys
seem to be selected for memorability rather than efficiency. Still, as there's
no finger movement for regular typing it doesn't have a huge effect.

`;

const cykeyMap2 = [
['7-9', 'i'],
['4-7-9', 'l'],
['4-5', 'g'],
['4-5-9', 'j'],
['5-7', 't'],
['4-9', 'h'],
['7', 'e'],
['6', 'o'],
['5', 's'],
['4', 'a'],
['6-7', 'u'],
['5-6', 'n'],
['5-7-9', 'm'],
['5-9', 'k'],
['5-6-7-9', 'f'],
['4-5-6-7', 'z'],
['6-7-9', 'd'],
['4-5-6', 'b'],
['6-9', 'c'],
['4-6', 'r'],
['4-5-6-7-9', 'q'],
['4-7', 'p'],
['5-6-9', 'y'],
['4-5-6-9', 'x'],
['4-5-7-9', 'w'],
['4-6-9', 'm'],
['9', ' '],
['5-8', 'BACKSPACE'],
] as const;

const cykey2Memo = `
Space can be used as the primary thumb key for the left hand only.
After practing with stardard CyKey I changed a few things around, mostly to reduce
the number of fingers required for common letters.
A and U are swapped (single-letter A), R and P are reduced to 2 fingers, 
    other keys are shuffled to make them fit.
`;

function parseChord(keys: Array<number>, chordMap) {
    return chordMap.get(keys.toSorted().join("-"));
}

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
    ['Space', 9],
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
    //['Space', 9],
])];

let chords = [new Chord(), new Chord()]

function keydown(event, actions) {
    mappings.forEach((m, i) => {
        const code = m.get(event.code);
        if (code != undefined && event.repeat == false) {
            chords[i].down(code);
        }
    });
    if (event.code == "Backspace" && event.repeat == false) {
        actions.backspace();
    }
}

function keyup(event, chordMap, actions) {
    let activated = false;
    mappings.forEach((m, i) => {
        const code = m.get(event.code);
        if (activated) {
            // This is a terrible unreliable mess to get around the doubled-up spacebar.
            // A single space triggers things on both sides, so if the left side triggers a combo
            // the ride side just gets outright killed.
            // If you try to bridge too fast across hands this will break horribly...
            if (i == 1) {
                chords[i ^ 1].reset();
            }
            return;
        }
        if (code != undefined && !activated) {
            // ARGH need to move more of this logic into the Chord class...
            if (!chords[i].releasing) {
                const keys = chords[i].pressedKeys();
                const generated = parseChord(keys, chordMap);
                if (generated != undefined) {
                    if (generated == "BACKSPACE") {
                        // this is different to the direct key backspace above
                        actions.backspace();
                    } else {
                        actions.append(generated);
                    }
                    activated = true;
                }
                //chords[i].reset();
            }
            chords[i].up(code);
        }
    });
}

// maybe this can be returned to a const
const ChordBox =  {
    view: ((vnode) => {
        return m("div", {style: {minHeight: "6ex"}}, m("input", {placeholder: "Type here using chorded inputs", size: 50, 
                   // GRRRR pressing keys in here seems to kick the focus away and the keyup never comes. Why???
                                                       // because the component is being recreated...?
                onkeydown: ((event) => {
                    keydown(event, vnode.attrs.actions);
                    event.stopPropagation();
                    return false;
                }),
                
                onkeyup: ((event) => {
                    keyup(event, vnode.attrs.chordMap, vnode.attrs.actions);
                    event.stopPropagation();
                    m.redraw();
                    return false;
                }),
                value: vnode.attrs.state.text,
            }))
    })
};

function Box() { 

    let currentText = MString();
    let actions = MStringActions(currentText);

    return {
        view: ((vnode) => {
            return [
                m("h1","Test input"),
                m(ChordBox, {chordMap: vnode.attrs.chordMap, state: currentText, actions: actions}),
                m("h1","Sample input"),
                m('div',
                  [m("input", {placeholder: "This is an empty text box. Use it to drop in sample text for copy typing.", size: 50})]),
                m("div", [
                    m('h4', "NOTES:"),
                    m('ul', [
                        m('li', 'Keys are mapped to the home row (real A for a, real F for e, real U-P and J-semicolon, VB/NM for thumbs)'),
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
                            m("p", [ m(m.route.Link, {href: "/taipo2"}, "Modified Taipo"), " (Taipo with the layout I use in hardware)"]),
                            m("p", [ m(m.route.Link, {href: "/cykey"}, "Cykey"), " CyKey layout (Microwriter)"]),
                            m("p", [ m(m.route.Link, {href: "/cykey2"}, "Modified Cykey"), " CyKey with modifications for better flow"]),
                            //m("p", [ m(m.route.Link, {href: "/artsey"}, "Artsey"), " (8 keys, no modifiers)"]),
                            // disabling Artsey because the main map is the same as Ardux
                            m("p", ["Keymaps are taken from ", m("a", {href: "https://inkeys.wiki/en/keymaps"}, "inclusive keyboards")]),
                 ])),
            ];
        })
    }
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

const FlatKeyDiagram = {
    view: ((vnode) => {
        // this is basically only for the CyKey layout, so 4-5-6-7-9
        const keysUsed = vnode.attrs.chord;

        const buttonStates = Array(10);
        buttonStates.fill(0, 0, 10); // Array(8) doesn't iterate in forEach!
        buttonStates.forEach((_, i) => {
           buttonStates[i]  = m('td', {class: (keysUsed.includes(String(i)) ? "O" : "X")}, "_");
        }); // TODO: this probably requires a cleanup...

        const strip = buttonStates.slice(4,8);
        strip.push(buttonStates[9]);
        strip.push(buttonStates[8]);

        return [
            m("table.minor", [
                m("tr", [m("td.lead", m("h4", vnode.attrs.keysym, ))]
                  .concat(vnode.attrs.flip ? strip.toReversed() : strip)),
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
        m(vnode.attrs.diagram, {keysym: code[1], chord: code[0], flip: vnode.attrs.flip})
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



function shuffleArray(inArray) {
    let array = [...inArray];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function TypingTest(_initialVnode) {
    let words = shuffleArray(wordlist);
    let wordIndex;
    let lineIndex;

    let currentTarget;
    let currentWord;

    let currentText = MString();
    let actions = MStringActions(currentText);

    function nextLine() {
        wordIndex += 10;
        return words.slice(wordIndex - 10, wordIndex);
    }

    return {
        oninit: (() => {
            words = [...words];
            wordIndex = 10;

            currentTarget = nextLine(); 

            lineIndex = 0;
            currentWord = currentTarget[lineIndex];


        }),
        view: ((vnode) => {
            // activating this under view() is wrong but anyway
            let entered = currentText.text;

            if (currentWord == entered) {
                actions.clear();
                lineIndex += 1;
                if (lineIndex == 10) {
                    currentTarget = nextLine();
                    lineIndex = 0;
                }
                currentWord = currentTarget[lineIndex];
            }
            let color = currentWord.startsWith(entered) ?  "green" : "red";
            // need to get the text value out of the chordbox, can I pass a variable in like in react?
            // and then... get updates to work on it? no idea if updates will trigger correctly on this
            return [
                m("h1", "Typing prompt"),
                m(ChordBox, {chordMap: vnode.attrs.chordMap, state: currentText, actions: actions}),
                m("p", {style: {backgroundColor: color}}, currentWord),
                m("p", currentTarget.map((word) => m("span", word + " "))),
            ];
        })
    }
}

const App = {
    view: ((vnode) => {
        return m("div.app", [
            m("div.keyDiagram", m(KeyChart, {chordMap: vnode.attrs.chordMap, flip: false, diagram: vnode.attrs.diagram})),
            m("div.main", [
                //m("img", {src: "/taipo.png", style: {width: "55%"}}),
                m(Box, {chordMap: vnode.attrs.chordMap}),
                vnode.attrs.memo ? m("h2", "Layout Notes") : "",
                m("p", vnode.attrs.memo),
                m(TypingTest, {chordMap: vnode.attrs.chordMap}),
            ]),
            m("div.keyDiagram", m(KeyChart, {chordMap: vnode.attrs.chordMap, flip: true, diagram: vnode.attrs.diagram})),
        ]);
    })
}

//m.mount(document.getElementById("app"), App);
m.route(document.getElementById("app"), "/taipo", {
    "/taipo": {
        render: (() => {
            return m(App, {chordMap: new Map(taipoMap), diagram: KeyDiagram});
        })
    },
    "/ardux": {
        render: (() => {
            return m(App, {chordMap: new Map(arduxMap), diagram: KeyDiagram});
        })
    },
    "/posh": {
        render: (() => {
            return m(App, {chordMap: new Map(poshMap), diagram: KeyDiagram});
        })
    },
    "/artsey": {
        render: (() => {
            return m(App, {chordMap: new Map(artseyMap), diagram: KeyDiagram});
        })
    },
    "/taipo2": {
        render: (() => {
            return m(App, {chordMap: new Map(modifiedTaipoMap), diagram: KeyDiagram, memo: taipo2Memo});
        })
    },
    "/cykey": {
        render: (() => {
            return m(App, {chordMap: new Map(cykeyMap), diagram: FlatKeyDiagram, memo: cykeyMemo});
        })
    },
    "/cykey2": {
        render: (() => {
            return m(App, {chordMap: new Map(cykeyMap2), diagram: FlatKeyDiagram, memo: cykey2Memo});
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

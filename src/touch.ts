import m from "mithril";

import Chord from './chord.ts';

// This is going to become the overall controller class
// not just text, maybe modeswitches and the like too
const MString = (() => ({text: ""}));
const MStringActions = ((state) =>  {
    return {
        append: ((c) => { state.text += c ;}),
        backspace: (() => {state.text = state.text.slice(0, -1);}),
        clear: (() => {state.text = "";}),
        set: ((t) => {state.text = t;})
}});

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
['5-7-9', 'v'],
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

function parseChord(keys: Array<number>, chordMap) {
    return chordMap.get(keys.toSorted().join("-"));
}

const KeyArray = {
    view: (vnode) => {

        // bad scoping etc etc.
        function keys(key) {
            return {onmousedown: ((event) => {
                        vnode.attrs.touchon(key);
                    }),
                    onmouseup: ((event) => {
                        vnode.attrs.touchoff(key);
                    })
            };
        }

        return m("svg", {width: 800, height: 800, viewbox: "0 0 1000 1000"}, [
            m("rect", {width: 80, height: 80, x: 100, y: 200, ...keys(4)}),
            m("rect", {width: 80, height: 80, x: 200, y: 170, ...keys(5)}),
            m("rect", {width: 80, height: 80, x: 300, y: 170, ...keys(6)}),
            m("rect", {width: 80, height: 80, x: 400, y: 200, ...keys(7)}),
            m("rect", {width: 80, height: 80, x: 500, y: 280, ...keys(8)}),
            m("rect", {width: 80, height: 80, x: 600, y: 280, ...keys(9)}),
        ]);

    }
};
// will need to do this with touchstart/touchend

function TouchScreen(initialVnode) {
    return {
        view: ((vnode) => {
            return m(KeyArray, {actions: vnode.attrs.actions, touchon: vnode.attrs.touchon, touchoff: vnode.attrs.touchoff});
        })
    };
}

function TouchApp() {
    let currentText = MString();
    let actions = MStringActions(currentText);

    let chord = new Chord();
    let chordmap = new Map(cykeyMap2);

    function touchon(key) {
        chord.down(key);
    }

    function touchoff(key) {
        if (!chord.releasing) {
            const keys = chord.pressedKeys();
            const generated = parseChord(keys, chordmap);
            if (generated != undefined) {
                if (generated == "BACKSPACE") {
                    // this is different to the direct key backspace above
                    actions.backspace();
                } else {
                    actions.append(generated);
                }
            }
        }
        chord.up(key);
    }

    return {
        view: ((vnode) => {
            return [
                m("h1","Test input"),
                m("p", "Typed: " + currentText.text),
                m(TouchScreen, {actions: actions, touchon: touchon, touchoff: touchoff}),
            ];
        })
    };
}

export default TouchApp;

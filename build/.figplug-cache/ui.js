/* mp-asset-generator/build/.figplug-cache/ui.js 0 */
(function(exports){

'use strict';

var VERSION = "0", DEBUG = false;
var global=void 0!==global?global:"undefined"!=typeof window?window:this;function _stackTrace(cons){const x={stack:""};if(Error.captureStackTrace){Error.captureStackTrace(x,cons);const p=x.stack.indexOf("\n");if(-1!=p)return x.stack.substr(p+1)}return x.stack}function _parseStackFrame(sf){let m=/^\s*at\s+([^\s]+)\s+\((?:.+\/(src\/[^\:]+)|([^\:]+))\:(\d+)\:(\d+)\)$/.exec(sf);return m?{func:m[1],file:m[2]||m[3],line:parseInt(m[4]),col:parseInt(m[5])}:null}function panic(msg){if(console.error.apply(console,["panic:",msg].concat(Array.prototype.slice.call(arguments,1))),"undefined"==typeof process){let e=new Error(msg);throw e.name="Panic",e}console.error(_stackTrace(panic)),process.exit(2)}function print(){console.log.apply(console,Array.prototype.slice.call(arguments))}const dlog=()=>{};function assert(){}function repr(obj){try{return JSON.stringify(obj,null,2)}catch(_){return String(obj)}}


let currentColors = { Primary: undefined, Secondary: undefined };
const COLOR_NAMES = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "black",
    "teal",
];
function setPrimary(colorName) {
    parent.postMessage({
        pluginMessage: {
            type: "style",
            color: colorName,
            variant: "Primary",
        },
    }, "*");
}
function setSecondary(colorName) {
    parent.postMessage({
        pluginMessage: {
            type: "style",
            color: colorName,
            variant: "Secondary",
        },
    }, "*");
}
for (const color of COLOR_NAMES) {
    let primaryDiv = document.createElement("div");
    document.getElementById("primary").appendChild(primaryDiv);
    primaryDiv.id = `Primary ${color}`;
    primaryDiv.className = `${color} selection`;
    primaryDiv.onclick = () => {
        setPrimary(color);
    };
    let secondaryDiv = document.createElement("div");
    document.getElementById("secondary").appendChild(secondaryDiv);
    secondaryDiv.id = `Secondary ${color}`;
    secondaryDiv.className = `${color} selection`;
    secondaryDiv.onclick = () => {
        setSecondary(color);
    };
}
document.getElementById("logo").onclick = () => {
    parent.postMessage({ pluginMessage: { type: "logo" } }, "*");
};
onmessage = async (event) => {
    var _a;
    const message = event.data.pluginMessage;
    console.log("Got this from the plugin", message);
    if (message.type === "colorChange") {
        (_a = document
            .getElementById(`${message.variant} ${currentColors[message.variant]}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        currentColors[message.variant] = message.color;
        document
            .getElementById(`${message.variant} ${message.color}`)
            .classList.add("selected");
        console.log(document.getElementById(`${message.variant} ${message.color}`));
    }
    else if (message.type === "error") {
        document.getElementById("error").innerHTML = message.message;
    }
};
})(typeof exports != "undefined" ? exports : (typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)["ui"] = {});


//#sourceMappingURL=data:application/json;base64,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

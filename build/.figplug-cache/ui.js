/* mp-asset-generator/build/.figplug-cache/ui.js 0 */
(function(exports){

'use strict';

var VERSION = "0", DEBUG = false;
var global=void 0!==global?global:"undefined"!=typeof window?window:this;function _stackTrace(cons){const x={stack:""};if(Error.captureStackTrace){Error.captureStackTrace(x,cons);const p=x.stack.indexOf("\n");if(-1!=p)return x.stack.substr(p+1)}return x.stack}function _parseStackFrame(sf){let m=/^\s*at\s+([^\s]+)\s+\((?:.+\/(src\/[^\:]+)|([^\:]+))\:(\d+)\:(\d+)\)$/.exec(sf);return m?{func:m[1],file:m[2]||m[3],line:parseInt(m[4]),col:parseInt(m[5])}:null}function panic(msg){if(console.error.apply(console,["panic:",msg].concat(Array.prototype.slice.call(arguments,1))),"undefined"==typeof process){let e=new Error(msg);throw e.name="Panic",e}console.error(_stackTrace(panic)),process.exit(2)}function print(){console.log.apply(console,Array.prototype.slice.call(arguments))}const dlog=()=>{};function assert(){}function repr(obj){try{return JSON.stringify(obj,null,2)}catch(_){return String(obj)}}


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
    primaryDiv.id = color;
    primaryDiv.className = `${color} selection`;
    primaryDiv.onclick = () => {
        setPrimary(color);
    };
    let secondaryDiv = document.createElement("div");
    document.getElementById("secondary").appendChild(secondaryDiv);
    secondaryDiv.id = color;
    secondaryDiv.className = `${color} selection`;
    secondaryDiv.onclick = () => {
        setSecondary(color);
    };
}
document.getElementById("logo").onclick = () => {
    parent.postMessage({ pluginMessage: { type: "logo" } }, "*");
};
onmessage = async (event) => {
    const message = event.data.pluginMessage;
    console.log("Got this from the plugin", message);
    if (message.type === "colorChange") {
        document.getElementById(`${message.variant}text`).innerHTML = `Current color: ${message.color}`;
    }
    else if (message.type === "error") {
        document.getElementById("error").innerHTML = message.message;
    }
};
})(typeof exports != "undefined" ? exports : (typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)["ui"] = {});


//#sourceMappingURL=data:application/json;base64,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

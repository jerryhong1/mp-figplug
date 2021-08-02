/* mp-asset-generator/build/plugin.js 0 */
(function(exports){

'use strict';

var VERSION = "0", DEBUG = false;
var global=void 0!==global?global:"undefined"!=typeof window?window:this;function _stackTrace(cons){const x={stack:""};if(Error.captureStackTrace){Error.captureStackTrace(x,cons);const p=x.stack.indexOf("\n");if(-1!=p)return x.stack.substr(p+1)}return x.stack}function _parseStackFrame(sf){let m=/^\s*at\s+([^\s]+)\s+\((?:.+\/(src\/[^\:]+)|([^\:]+))\:(\d+)\:(\d+)\)$/.exec(sf);return m?{func:m[1],file:m[2]||m[3],line:parseInt(m[4]),col:parseInt(m[5])}:null}function panic(msg){if(console.error.apply(console,["panic:",msg].concat(Array.prototype.slice.call(arguments,1))),"undefined"==typeof process){let e=new Error(msg);throw e.name="Panic",e}console.error(_stackTrace(panic)),process.exit(2)}function print(){console.log.apply(console,Array.prototype.slice.call(arguments))}const dlog=()=>{};function assert(){}function repr(obj){try{return JSON.stringify(obj,null,2)}catch(_){return String(obj)}}


const hexToRGB = (hexcolor) => {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hexcolor = hexcolor.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexcolor);
    return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        }
        : {
            r: 0,
            g: 0,
            b: 0,
        };
};
const getContrastYIQ = (color) => {
    const { r, g, b } = color;
    var yiq = ((r * 299 + g * 587 + b * 114) * 255) / 1000;
    return yiq >= 136 ? "black" : "white";
};
const getNameParts = (name) => {
    const nameParts = name.split("/").filter((part) => !!part);
    return nameParts.map((part) => part.trim());
};
const getStyleByName = (styleName) => {
    const styles = figma.getLocalPaintStyles();
    return styles.find((style) => {
        return (JSON.stringify(getNameParts(style.name)) ===
            JSON.stringify(getNameParts(styleName)));
    });
};
const COLORS = {
    white: hexToRGB("#FFF"),
    black: hexToRGB("#000"),
    Digital: {
        solid: {
            red: hexToRGB("#FF004D"),
            orange: hexToRGB("#FF5C00"),
            yellow: hexToRGB("#FFE500"),
            green: hexToRGB("#64FB73"),
            blue: hexToRGB("#0038FF"),
            teal: { r: 0, g: 0.88, b: 1 },
            purple: hexToRGB("#AD00FF"),
            black: hexToRGB("#000"),
        },
        fade: {
            red: hexToRGB("#FFD9E4"),
            orange: hexToRGB("#FFE2D1"),
            yellow: hexToRGB("#FFF8BA"),
            green: hexToRGB("#D5FDD9"),
            blue: hexToRGB("#D9E1FF"),
            purple: hexToRGB("#F3D9FF"),
            teal: { r: 0.73, g: 0.97, b: 1 },
            black: { r: 0.88, g: 0.88, b: 0.88 },
        },
    },
    Print: {
        solid: {
            red: hexToRGB("#FF004D"),
            orange: hexToRGB("#FF5C00"),
            yellow: hexToRGB("#FFE500"),
            green: hexToRGB("#B2FDB9"),
            blue: hexToRGB("#0038FF"),
            teal: hexToRGB("#99F3FF"),
            purple: hexToRGB("#AD00FF"),
            black: hexToRGB("#000"),
        },
        fade: {
            red: hexToRGB("#FFD9E4"),
            orange: hexToRGB("#FFE2D1"),
            yellow: hexToRGB("#FFF8BA"),
            green: hexToRGB("#E8FEEA"),
            blue: hexToRGB("#D9E1FF"),
            teal: hexToRGB("#BAF7FF"),
            purple: hexToRGB("#F3D9FF"),
            black: { r: 0.88, g: 0.88, b: 0.88 },
        },
    },
};
const colorsMatch = (c1, c2) => {
    const EPSILON = 5e-3;
    return (Math.abs(c1.r - c2.r) < EPSILON &&
        Math.abs(c1.g - c2.g) < EPSILON &&
        Math.abs(c1.b - c2.b) < EPSILON);
};
const getCurrentStyles = () => {
    var _a, _b;
    let primaryStyle = getStyleByName("Digital / Primary");
    if (primaryStyle &&
        ((_a = primaryStyle.paints) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
        primaryStyle.paints[0].type === "SOLID") {
        const primaryStyleColor = primaryStyle.paints[0].color;
        const matchingColorEntry = Object.entries(COLORS.Digital.solid).find(([_, color]) => colorsMatch(color, primaryStyleColor));
        if (matchingColorEntry) {
            sendColorUpdate("Primary", matchingColorEntry[0]);
        }
    }
    let secondaryStyle = getStyleByName("Digital / Secondary");
    if (secondaryStyle &&
        ((_b = secondaryStyle.paints) === null || _b === void 0 ? void 0 : _b.length) > 0 &&
        secondaryStyle.paints[0].type === "SOLID") {
        const secondaryStyleColor = secondaryStyle.paints[0].color;
        const matchingColorEntry = Object.entries(COLORS.Digital.solid).find(([_, color]) => colorsMatch(color, secondaryStyleColor));
        if (matchingColorEntry) {
            sendColorUpdate("Secondary", matchingColorEntry[0]);
        }
    }
};
const initPlugin = () => {
    figma.showUI(__html__);
    figma.ui.resize(444, 400);
    getCurrentStyles();
};
const setStyle = (styleName, color) => {
    let style = getStyleByName(styleName);
    if (style) {
        style.paints = [{ type: "SOLID", color: color }];
    }
    else {
        style = figma.createPaintStyle();
        style.name = styleName;
        style.paints = [{ type: "SOLID", color: color }];
    }
};
const setTextStyles = ({ color_name, variant, }) => {
    const styleName = `Text / Neutral on ${variant}`;
    const textColorName = getContrastYIQ(COLORS.Digital.solid[color_name]);
    setStyle(styleName, COLORS[textColorName]);
    if (variant === "Primary") {
        if (textColorName === "white") {
            setStyle("Text / Branded on Light", COLORS.Digital.solid[color_name]);
        }
        else {
            setStyle("Text / Branded on Light", COLORS.black);
        }
    }
};
function sendColorUpdate(variant, newColorName) {
    figma.ui.postMessage({
        type: "colorChange",
        variant: variant,
        color: newColorName,
    });
}
const flattenAllText = (node) => {
    if (node.type === "TEXT" && node.parent) {
        const flattenedText = figma.flatten([node], node.parent);
        flattenedText.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    }
    if ("children" in node) {
        if (node.type !== "INSTANCE") {
            for (const child of node.children) {
                flattenAllText(child);
            }
        }
    }
};
const updateSVGLogo = () => {
    var _a;
    let logo;
    const firstPage = figma.root.children[0];
    const logos = firstPage.findAll((node) => {
        var _a;
        return node.name === "Editable Digital Logo" &&
            ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.name) === "Logos";
    });
    if (logos.length !== 1) {
        figma.ui.postMessage({
            type: "error",
            message: "Hmm. Looks like we can't seem to find a unique frame with the name 'Editable Digital Logo'.",
        });
        return;
    }
    logo = logos[0];
    const logoParent = logo.parent;
    for (const medium of ["Digital", "Print"]) {
        const newLogo = logo.clone();
        newLogo.locked = true;
        newLogo.name = "SVG Logo (Don't edit)";
        newLogo.x = 0;
        newLogo.y = 0;
        let flattenedLogoComponent = logoParent.children.find((node) => {
            return node.name === `${medium} Logo`;
        });
        if (flattenedLogoComponent) {
            for (const node of flattenedLogoComponent.children) {
                node.remove();
            }
        }
        else {
            flattenedLogoComponent = figma.createComponent();
            logoParent.appendChild(flattenedLogoComponent);
            flattenedLogoComponent.name = `${medium} Logo`;
            flattenedLogoComponent.x = 0;
            flattenedLogoComponent.y = 0;
        }
        flattenedLogoComponent.appendChild(newLogo);
        const componentSize = Math.max(newLogo.width, newLogo.height);
        flattenedLogoComponent.resizeWithoutConstraints(componentSize, componentSize);
        if (newLogo.width > newLogo.height) {
            newLogo.y = (componentSize - newLogo.height) / 2;
        }
        else {
            newLogo.x = (componentSize - newLogo.width) / 2;
        }
        for (let child of newLogo.children) {
            if (child.type === "INSTANCE") {
                child = child.detachInstance();
            }
            child.layoutMode = "NONE";
            child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
            if (medium === "Print" && child.fillStyleId) {
                const fillStyleName = (_a = figma.getStyleById(child.fillStyleId)) === null || _a === void 0 ? void 0 : _a.name;
                if (!fillStyleName)
                    continue;
                const colorNameParts = getNameParts(fillStyleName);
                if ((colorNameParts === null || colorNameParts === void 0 ? void 0 : colorNameParts.length) < 2)
                    continue;
                const colorName = colorNameParts[1];
                const newFillStyle = getStyleByName(`Print / ${colorName}`);
                if (newFillStyle) {
                    child.fillStyleId = newFillStyle.id;
                }
            }
        }
        flattenAllText(flattenedLogoComponent);
    }
};
figma.ui.onmessage = (message) => {
    console.log("got this from the UI", message);
    if (message.type === "style") {
        for (const fade of [false, true]) {
            for (const medium of ["Print", "Digital"]) {
                const styleName = `${medium} / ${message.variant}${fade ? " Accent" : ""}`;
                const color = COLORS[medium][fade ? "fade" : "solid"][message.color];
                setStyle(styleName, color);
            }
        }
        setTextStyles({
            color_name: message.color,
            variant: message.variant,
        });
        sendColorUpdate(message.variant, message.color);
    }
    else if (message.type === "logo") {
        updateSVGLogo();
    }
    else if (message.type === "test") {
        const nodes = figma.currentPage.findAll((node) => node.type === "FRAME" && node.children.length === 0);
    }
};
initPlugin();
})(typeof exports != "undefined" ? exports : (typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)["plugin"] = {});


//#sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLlVzZXJzLmplcnJ5aG9uZy5yZXBvcy5maWdtYS1wbHVnaW5zLm1wLWFzc2V0LWdlbmVyYXRvci5idWlsZC5wbHVnaW4uanMubWFwIiwic291cmNlcyI6WyIuLi9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBa0JBLE1BQU0sUUFBUSxHQUFHLENBQUMsUUFBZ0I7SUFDOUIsSUFBSSxjQUFjLEdBQUcsa0NBQWtDLENBQUM7SUFDeEQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztJQUVILElBQUksTUFBTSxHQUFHLDJDQUEyQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RSxPQUFPLE1BQU07VUFDUDtZQUNJLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUc7WUFDaEMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRztZQUNoQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHO1NBQ25DO1VBQ0Q7WUFFSSxDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDUCxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBSUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFVO0lBQzlCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLENB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

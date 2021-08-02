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
figma.showUI(__html__);
figma.ui.resize(444, 350);
getCurrentStyles();
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
    const logos = figma.root.findAll((node) => {
        var _a;
        return node.name === "Editable Digital Logo" &&
            ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.name) === "Logos";
    });
    if (logos.length !== 1) {
        figma.ui.postMessage({
            type: "error",
            message: "Hmm. Looks like we can't seem to find a unique frame with the name 'Editable Digial Logo'.",
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

})(typeof exports != "undefined" ? exports : (typeof global != "undefined" ? global : typeof self != "undefined" ? self : this)["plugin"] = {});


//#sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLlVzZXJzLmplcnJ5aG9uZy5yZXBvcy5maWdtYS1wbHVnaW5zLm1wLWFzc2V0LWdlbmVyYXRvci5idWlsZC5wbHVnaW4uanMubWFwIiwic291cmNlcyI6WyIuLi9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBbUJBLE1BQU0sUUFBUSxHQUFHLENBQUMsUUFBZ0I7SUFDOUIsSUFBSSxjQUFjLEdBQUcsa0NBQWtDLENBQUM7SUFDeEQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM1RCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hDLENBQUMsQ0FBQztJQUVILElBQUksTUFBTSxHQUFHLDJDQUEyQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4RSxPQUFPLE1BQU07VUFDUDtZQUNJLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUc7WUFDaEMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRztZQUNoQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHO1NBQ25DO1VBQ0Q7WUFFSSxDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDUCxDQUFDO0FBQ1osQ0FBQyxDQUFDO0FBSUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFVO0lBQzlCLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUMxQixJQUFJLEdBQUcsR0FBRyxDQUFDLENB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

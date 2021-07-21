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


//#sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLlVzZXJzLmplcnJ5aG9uZy5yZXBvcy5maWdtYS1wbHVnaW5zLm1wLWFzc2V0LWdlbmVyYXRvci5idWlsZC5wbHVnaW4uanMubWFwIiwic291cmNlcyI6WyIuLi9wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBT0EsTUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFnQjtJQUM5QixJQUFJLGNBQWMsR0FBRyxrQ0FBa0MsQ0FBQztJQUN4RCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxNQUFNLEdBQUcsMkNBQTJDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sTUFBTTtVQUNQO1lBQ0ksQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsR0FBRztZQUNoQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHO1lBQ2hDLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUc7U0FDbkM7VUFDRDtZQUVJLENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7WUFDSixDQUFDLEVBQUUsQ0FBQztTQUNQLENBQUM7QUFDWixDQUFDLENBQUM7QUFJRixNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQVU7SUFDOUIsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzFCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDO0lBQ3ZELE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUVGLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBWTtJQUM5QixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQVksS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkUsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUVGLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBaUI7SUFDckMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBaUI7UUFDakMsUUFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsRUFDekM7S0FDTCxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRztJQUNYLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLE9BQU8sRUFBRTtRQUNMLEtBQUssRUFBRTtZQUNILEdBQUcsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3hCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNCLEtBQUssRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzFCLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3pCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNCLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsR0FBRyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDeEIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDM0IsTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDM0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDMUIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDekIsTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDM0IsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDaEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUU7U0FDdkM7S0FDSjtJQUNELEtBQUssRUFBRTtRQUNILEtBQUssRUFBRTtZQUNILEdBQUcsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3hCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNCLEtBQUssRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzFCLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3pCLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ3pCLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQzNC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

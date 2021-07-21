// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).
// import _ from "underscore";

/********************* CONSTS, UTIL FUNCTIONS **********************/
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/5624139#5624139
const hexToRGB = (hexcolor: string): RGB => {
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
              // return black by default
              r: 0,
              g: 0,
              b: 0,
          };
};

// takes an RGB object and outputs the color of text so that
// the contrast is appropriate.
const getContrastYIQ = (color: RGB): "black" | "white" => {
    const { r, g, b } = color;
    var yiq = ((r * 299 + g * 587 + b * 114) * 255) / 1000;
    return yiq >= 136 ? "black" : "white"; // avoids orange being colored black; usually the threshold is 128
};

const getNameParts = (name: string) => {
    const nameParts = name.split("/").filter((part: string) => !!part);
    return nameParts.map((part: string) => part.trim());
};

const getStyleByName = (styleName: string) => {
    const styles = figma.getLocalPaintStyles();
    return styles.find((style: PaintStyle) => {
        return (
            JSON.stringify(getNameParts(style.name)) ===
            JSON.stringify(getNameParts(styleName))
        );
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

const colorsMatch = (c1: RGB, c2: RGB) => {
    const EPSILON = 5e-3;
    return (
        Math.abs(c1.r - c2.r) < EPSILON &&
        Math.abs(c1.g - c2.g) < EPSILON &&
        Math.abs(c1.b - c2.b) < EPSILON
    );
};

const getCurrentStyles = () => {
    // strategies for matching color?
    // 1. saving it in plugin state (disadvantage: depends on local machine, doesn't work on first run)
    // 2. matching colors to the 100th (disadvantage: color matching depends on a loose epsilon)
    // 3. saving the color name in a text box (disadvantage: breaks as soon as user messes with canvas)

    // let's go with 2

    // primary
    let primaryStyle = getStyleByName("Digital / Primary");
    if (
        primaryStyle &&
        primaryStyle.paints?.length > 0 &&
        primaryStyle!.paints[0].type === "SOLID"
    ) {
        const primaryStyleColor = primaryStyle!.paints[0].color;
        const matchingColorEntry = Object.entries(COLORS.Digital.solid).find(
            ([_, color]) => colorsMatch(color, primaryStyleColor)
        );
        if (matchingColorEntry) {
            sendColorUpdate("Primary", matchingColorEntry[0]);
        }
    }

    // secondary
    let secondaryStyle = getStyleByName("Digital / Secondary");
    if (
        secondaryStyle &&
        secondaryStyle.paints?.length > 0 &&
        secondaryStyle!.paints[0].type === "SOLID"
    ) {
        const secondaryStyleColor = secondaryStyle!.paints[0].color;
        const matchingColorEntry = Object.entries(COLORS.Digital.solid).find(
            ([_, color]) => colorsMatch(color, secondaryStyleColor)
        );
        if (matchingColorEntry) {
            sendColorUpdate("Secondary", matchingColorEntry[0]);
        }
    }
};

/********************* MAIN CODE **********************/
figma.showUI(__html__);
figma.ui.resize(444, 350);
getCurrentStyles();

// given a style name (e.g. "Digital / Primary") and an RGB color
// sets that style to that color.
// if the style doesn't exist, create it
const setStyle = (styleName: string, color: RGB) => {
    let style = getStyleByName(styleName);
    if (style) {
        style.paints = [{ type: "SOLID", color: color }];
    } else {
        // if it doesn't exist, create it
        style = figma.createPaintStyle();
        style.name = styleName;
        style.paints = [{ type: "SOLID", color: color }];
    }
};

const setTextStyles = ({
    color_name,
    variant,
}: {
    color_name: string;
    variant: "Primary" | "Secondary";
}) => {
    const styleName = `Text / Neutral on ${variant}`;
    const textColorName: "black" | "white" = getContrastYIQ(
        COLORS.Digital.solid[color_name]
    );
    setStyle(styleName, COLORS[textColorName]);
    if (variant === "Primary") {
        // we assume that if white text works on the primary color,
        // primary color text works on a white background
        if (textColorName === "white") {
            setStyle(
                "Text / Branded on Light",
                COLORS.Digital.solid[color_name]
            );
        } else {
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

// flattens all text within the frame
const flattenAllText = (node: BaseNode) => {
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

// creating an SVG logo component is not advised.
// it's easy to break the proportions of an SVG, whereas a background image
// can be "fit" in the right proportion regardless of the frame size.
const updateSVGLogo = () => {
    // TODO: get the relevant node by querying the name "Editable Digital Logo"
    // for now, let's require that the editable is selected
    let logo;
    const logos = figma.root.findAll(
        (node) =>
            node.name === "Editable Digital Logo" &&
            node.parent?.name === "Logos"
    );
    if (logos.length !== 1) {
        figma.ui.postMessage({
            type: "error",
            message:
                "Hmm. Looks like we can't seem to find a unique frame with the name 'Editable Digial Logo'.",
        });
        return;
    }
    logo = logos[0];
    const logoParent = logo.parent;

    // update both the print and digital logos
    for (const medium of ["Digital", "Print"]) {
        // duplicate into a new component with square proportions
        const newLogo = logo.clone();
        newLogo.locked = true;
        newLogo.name = "SVG Logo (Don't edit)";
        newLogo.x = 0;
        newLogo.y = 0;

        let flattenedLogoComponent = logoParent.children.find(
            (node: BaseNode) => {
                return node.name === `${medium} Logo`;
            }
        );

        // if the logo component doesn't exist, create it!
        if (flattenedLogoComponent) {
            for (const node of flattenedLogoComponent.children) {
                node.remove();
            }
        } else {
            // create new component
            flattenedLogoComponent = figma.createComponent();
            logoParent.appendChild(flattenedLogoComponent);
            flattenedLogoComponent.name = `${medium} Logo`;
            flattenedLogoComponent.x = 0;
            flattenedLogoComponent.y = 0;
        }

        // adjust the component so that it's a square
        flattenedLogoComponent.appendChild(newLogo);
        const componentSize = Math.max(newLogo.width, newLogo.height);
        flattenedLogoComponent.resizeWithoutConstraints(
            componentSize,
            componentSize
        );
        if (newLogo.width > newLogo.height) {
            newLogo.y = (componentSize - newLogo.height) / 2;
        } else {
            // since the width of the logo is at least 140px and the height is always
            // 136px, this should never happen, but it never hurts to edge case.
            newLogo.x = (componentSize - newLogo.width) / 2;
        }

        // flatten all inner layers and change constraints to "scale"
        for (let child of newLogo.children) {
            if (child.type === "INSTANCE") {
                child = child.detachInstance();
            }
            child.layoutMode = "NONE";
            child.constraints = { horizontal: "SCALE", vertical: "SCALE" };

            // for the print version: change all digitally-colored layers to print
            if (medium === "Print" && child.fillStyleId) {
                const fillStyleName = figma.getStyleById(
                    child.fillStyleId
                )?.name;
                if (!fillStyleName) continue;
                const colorNameParts = getNameParts(fillStyleName);
                if (colorNameParts?.length < 2) continue;
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

// Listens for clicks of the colored rectangles.
figma.ui.onmessage = (message) => {
    console.log("got this from the UI", message);
    if (message.type === "style") {
        // changes all relevant color styles
        for (const fade of [false, true]) {
            for (const medium of ["Print", "Digital"]) {
                const styleName = `${medium} / ${message.variant}${
                    fade ? " Accent" : ""
                }`;
                const color =
                    COLORS[medium][fade ? "fade" : "solid"][message.color];
                setStyle(styleName, color);
            }
        }
        setTextStyles({
            color_name: message.color,
            variant: message.variant,
        });
        sendColorUpdate(message.variant, message.color);
    } else if (message.type === "logo") {
        // 1) could export logo from button and then prompt user to reupload
        // exportUpdatedLogo()
        // 2) could create the logo as an SVG, duplicate, flatten, and then delete
        updateSVGLogo();
    } else if (message.type === "test") {
        // just a playground
        const nodes = figma.currentPage.findAll(
            (node) => node.type === "FRAME" && node.children.length === 0
        );
    }
};

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
// figma.closePlugin();

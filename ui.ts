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

function setPrimary(colorName: string) {
    parent.postMessage(
        {
            pluginMessage: {
                type: "style",
                color: colorName,
                variant: "Primary",
            },
        },
        "*"
    );
}
function setSecondary(colorName: string) {
    parent.postMessage(
        {
            pluginMessage: {
                type: "style",
                color: colorName,
                variant: "Secondary",
            },
        },
        "*"
    );
}
for (const color of COLOR_NAMES) {
    let primaryDiv = document.createElement("div");
    document.getElementById("primary")!.appendChild(primaryDiv);
    primaryDiv.id = `Primary ${color}`;
    primaryDiv.className = `${color} selection`;
    primaryDiv.onclick = () => {
        setPrimary(color);
    };

    let secondaryDiv = document.createElement("div");
    document.getElementById("secondary")!.appendChild(secondaryDiv);
    secondaryDiv.id = `Secondary ${color}`;
    secondaryDiv.className = `${color} selection`;
    secondaryDiv.onclick = () => {
        setSecondary(color);
    };
}

document.getElementById("logo")!.onclick = () => {
    parent.postMessage({ pluginMessage: { type: "logo" } }, "*");
};

// document.getElementById("test")!.onclick = () => {
//     parent.postMessage({ pluginMessage: { type: "test" } }, "*");
// };

// listen for color changes
onmessage = async (event) => {
    const message = event.data.pluginMessage;
    console.log("Got this from the plugin", message);
    if (message.type === "colorChange") {
        document
            .getElementById(
                `${message.variant} ${currentColors[message.variant]}`
            )
            ?.classList.remove("selected");
        currentColors[message.variant] = message.color;
        document
            .getElementById(`${message.variant} ${message.color}`)!
            .classList.add("selected");
        console.log(
            document.getElementById(`${message.variant} ${message.color}`)
        );
    } else if (message.type === "error") {
        document.getElementById("error")!.innerHTML = message.message;
    }
};

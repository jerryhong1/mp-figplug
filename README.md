# MP Asset Generator Plugin

This plugin is designed exclusively for the MP Asset Generator Figma file. It automatically sets fill styles and components based on a college's name and brand colors.

https://user-images.githubusercontent.com/7551953/128664990-c96b8c33-63bd-4374-9a88-c84ae78541b2.mov


<!-- This plugin is publically available [at this link](https://apple.com). -->

## Setup

After cloning the repo on your plugin, open Figma and use the quick actions bar (`Cmd-/`) to call "Create Plugin" (or go to `Plugins > Development > Create Plugin` in the menu bar). Link an existing plugin by choosing the `manifest.json` file within `mp-asset-generator`. Afterward, to call the plugin, simply type `mp-asset-generator` into the quick actions bar.

This plugin was built using Rasmus Andersson's [figplug](https://github.com/rsms/figplug). You'll need to install it for your changes to build properly. In the **parent** directory of your local copy of `mp-asset-generator`, run

`npm install -g figplug`

_If figplug doesn't work for you, report it as an issue, and we can move the code to a different framework (e.g. Webpack)._

## Editing the Plugin

The relevant code is in the following files:

-   `ui.html` and `ui.css` define HTML skeleton and styles for the plugin's UI.
-   `ui.ts` populates the HTML canvas and interfaces with `plugin.ts`.
-   `plugin.ts` interfaces with the Figma file, modifying its styles and components and messaging updates to the UI.

Call the following command in the parent directory:

`figplug build -w mp-asset-generator`

As you edit these files, `figplug` will automatically build the relevant plugin files.

## Tips

-   To see your edits take effect in Figma, close the plugin and use `Cmd-Alt-P` to quickly reopen it.
-   You can view console logs in Figma via "Open Console" in the quick actions. Or `Plugins > Developer > Open Console`.
-   [Figma Plugin Docs](https://www.figma.com/plugin-docs/intro/): API + Guide
-   [Figma Plugin Forum](https://forum.figma.com/c/plugin-api/): Ask questions here.

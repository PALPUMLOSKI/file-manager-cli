import { CommandStrategy } from "./CommandStrategy.js";
import { DirectoryState } from "../core/DirectoryState.js";
import { EditState } from "../core/EditState.js";
import { FileAssetRenderer } from "./FileAssetRenderer.js";
import { FileAsset } from "../core/FileAsset.js";

/**
 * Command strategy for viewing and inspecting an active file.
 * @extends CommandStrategy
 */
export class ViewStrategy extends CommandStrategy {
    constructor() {
        super();

        this.registerCommand(
            "print",
            (context, args) => {
                const fileName = context.activeFileName;
                const asset = context.fileSystem[fileName];
                const renderer = new FileAssetRenderer(Boolean(args.options.detailed));
                context.cli.display("View", asset, renderer, `/${fileName}`);
            },
            "Render file paragraphs (supports --detailed flag)"
        );

        this.registerCommand(
            "edit",
            (context) => {
                const fileName = context.activeFileName;
                context.changeState(new EditState());
                context.canvas.renderLayout(
                    "Edit",
                    "Edit Mode Active. Commands: add <text>, clearm save, back",
                    `/${fileName}/edit`
                );
            },
            "Switch to Edit mode for the active file"
        );

        this.registerCommand(
            "close",
            (context) => {
                context.activeFileName = null;
                context.changeState(new DirectoryState());
                context.canvas.renderLayout("Directory", "File context closed successfuly.");
            },
            "Close active file and return to Directory mode"
        );
    }
}
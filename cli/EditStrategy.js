import { CommandStrategy } from "./CommandStrategy.js";
import { ViewState } from "../core/ViewState.js";

/**
 * Command strategy for modifying file content and persisting changes.
 * @extends CommandStrategy
 */
export class EditStrategy extends CommandStrategy {
    constructor() {
        super();

        this.registerCommand(
            "add",
            (context, args) => {
                const fileName = context.activeFileName;
                const textToAppend = args.positional.join(" ");
                if (!textToAppend) {
                    context.canvas.renderLayout("Edit", "Usage: add <text to append>", `/${fileName}/edit`);
                    return;
                }

                const asset = context.fileSystem[fileName];
                asset.paragraphs.push(textToAppend);
                asset.updatedAt = new Date().toISOString();
                context.persist();

                context.canvas.renderLayout(
                    "Edit",
                    `Appended paragraph to [${fileName}] and saved changes.`,
                    `/${fileName}/edit`
                );
            },
            "Append a new paragraph and auto-save: add <text>"
        );

        this.registerCommand(
            "clear",
            (context) => {
                const fileName = context.activeFileName;
                const asset = context.fileSystem[fileName];
                asset.paragraphs = [];
                asset.updatedAt = new Date().toISOString();
                context.persist();

                context.canvas.renderLayout(
                    "Edit",
                    `Cleared all content in [${fileName}] and saved.`,
                    `/${fileName}/edit`
                );
            },
            "Clear all paragraphs in the current file"
        );

        this.registerCommand(
            "save",
            (context) => {
                const fileName = context.activeFileName;
                context.persist();
                context.canvas.renderLayout(
                    "Edit",
                    `All changes in [${fileName}] successfuly persisted to disk.`,
                    `/${fileName}/edit`
                );
            },
            "Force save current state to storage.json"
        );

        this.registerCommand(
            "back",
            (context) => {
                const fileName = context.activeFileName;
                context.changeState(new ViewState());
                context.canvas.renderLayout(
                    "View",
                    `Editing completed. Returned to View Mode for [${fileName}].`,
                    `/${fileName}`
                );
            },
            "Return to View mode"
        );
    }
}
import { CommandStrategy } from "./CommandStrategy.js";
import { ViewState } from "../core/ViewState.js";

/**
 * Command strategy for Directory navigation and file management mode.
 * @extends CommandStrategy
 */
export class DirectoryStrategy extends CommandStrategy {
    constructor() {
        super();

        this.registerCommand(
            "ls",
            (context, args) => {
                const files = Object.values(context.fileSystem);
                if (files.length === 0) {
                    context.canvas.renderLayout("Directory", "Directory is empty. Use 'create <filename>' to add a file.");
                    return;
                }

                const isDetailed = Boolean(args.options.detailed);
                const content = files
                    .map(file =>
                        isDetailed
                            ? `${file.name} | Paragraphs: ${file.paragraphs.length} | Updated: ${file.updatedAt}`
                            : `${file.name} (Structured DocumentAsset)`
                    )
                    .join("\n");

                context.canvas.renderLayout("Directory", content);
            },
            "List all files (supports --detailed flag)"
        );

        this.registerCommand(
            "create",
            (context, args) => {
                const [fileName, ...restArgs] = args.positional;
                if (!fileName) {
                    context.canvas.renderLayout("Directory", "Usage: create <filename> [initial text]");
                    return;
                }
                if (context.fileSystem[fileName]) {
                    context.canvas.renderLayout("Directory", `Failure: File '${fileName}' already exists.`);
                    return;
                }

                const initialText = restArgs.join(" ");
                const paragraphs = initialText ? [initialText] : [];
                context.createFile(fileName, paragraphs);
                context.canvas.renderLayout("Directory", `File '${fileName}' created and saved to disk.`);
            },
            "Create a new file: create <filename> [initial text]"
        );

        this.registerCommand(
            "delete",
            (context, args) => {
                const [fileName] = args.positional;
                if (!fileName || !context.fileSystem[fileName]) {
                    context.canvas.renderLayout("Directory", `Failure: File '${fileName || ""}' does not exist.`);
                    return;
                }

                context.deleteFile(fileName);
                context.canvas.renderLayout("Directory", `File '${fileName}' deleted from storage.`);
            },
            "Delete an existing file: delete <filename>"
        );

        this.registerCommand(
            "open",
            (context, args) => {
                const [fileName] = args.positional;
                if (fileName && context.fileSystem[fileName]) {
                    context.activeFileName = fileName;
                    context.changeState(new ViewState());
                    context.canvas.renderLayout(
                        "View",
                        `File '${fileName}' successfully opened.\nType 'print' to render content or 'help' for commands.`,
                        `/${fileName}`
                    );
                } else {
                    context.canvas.renderLayout("Directory", `Failure: Element '${fileName || ""}' does not exist.`);
                }
            },
            "Open a file in View mode: open <filename>"
        );
    }
}

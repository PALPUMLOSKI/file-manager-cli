import { AppState } from "./AppState.js";
import { DirectoryStrategy } from "../cli/DirectoryStrategy.js";

/**
 * State representing root directory browsing mode.
 * @extends AppState
 */
export class DirectoryState extends AppState {
    onEnter(context) {
        context.cli.useStrategy(new DirectoryStrategy());
    }

    handleCommand(context, commandline) {
        context.cli.exeCommand(commandline, context);
    }
}
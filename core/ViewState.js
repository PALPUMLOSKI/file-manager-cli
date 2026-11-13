import { AppState } from "./AppState.js";
import { ViewStrategy } from "../cli/ViewStrategy.js";

/**
 * State representing read-only file inspection mode.
 * @extends AppState
 */
export class ViewState extends AppState {
    onEnter(context) {
        context.cli.useStrategy(new ViewStrategy());
    }

    handleCommand(context, commandline) {
        context.cli.exeCommand(commandline, context);
    }
}
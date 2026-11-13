import { AppState } from "./AppState.js";
import { EditStrategy } from "../cli/EditStrategy.js";

/**
 * State representing file text modigication mode.
 * @extends AppState
 */
export class EditState extends AppState {
    onEnter(context) {
        context.cli.useStrategy(new EditStrategy());
    }

    handleCommand(context, commandline) {
        context.cli.exeCommand(commandline, context);
    }
}
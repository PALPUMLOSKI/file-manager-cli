/**
 * Abstract base class defining the contract for all application behavior states.
 * @class
 */
export class AppState {
    /**
     * Hook called when transitioning into this state to configure CLI strategies.
     * @param {import('./AppContext.js').AppContext} context
     */
    onEnter(context) {
        // Optional ovveride in subclasses
    }

    /**
     * Evaluates input actions inside the active operational context.
     * @abstact
     * @param {import('./AppContext.js').AppContext} context
     * @param {string} commandline
     */
    handleCommand(context, commandline) {
        throw new Error("Method 'handleCommand()' must be implemented.");
    }
}
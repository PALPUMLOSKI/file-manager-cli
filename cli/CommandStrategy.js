/**
 * Base class / interface contract for command execution strategies (ICommandStrategy).
 * Encapsulates a cohesive group of commands for a specific application mode.
 * @class
 */
export class CommandStrategy {
    #commands;

    constructor() {
        /** @type {Map<string, { handler: Function, description: string }>} */
        this.#commands = new Map();
    }

    /**
     * Registers a new command handler with its help description.
     * @param {string} selector
     * @param {Function} handler
     * @param {string} [description]
     */
    registerCommand(selector, handler, description = "") {
        this.#commands.set(selector.toLowerCase(), { handler, description });
    }

    /**
     * Returns all command names supported by this strategy.
     * @returns {string[]}
     */
    getCommandSelectors() {
        return Array.from(this.#commands.keys());
    }

    /**
     * Returns formatted help string for all registered commands in this strategy.
     * @returns {string}
     */
    getHelpText() {
        const lines = ["Avaible commands in currrent mode:"];
        for (const [cmd, meta] of this.#commands.entries()) {
            lines.push(` - ${cmd.padEnd(16)} : ${meta.description}`);
        }
        return lines.join("\n");
    }

    /**
     * Executees a matched command passing the application context and parsed Args.
     * @param {string} selector
     * @param {import('../core/AppContext.js').AppContext} context
     * @param {import('./Args.js').Args} args
     * @returns {boolean} True if command was found and executed
     */
    execCommand(selector, context, args) {
        const entry = this.#commands.get(selector.toLowerCase());
        if (!entry) {
            return false;
        }
        entry.handler(context, args);
        return true;
    }
}

/**
 * Object representation of parsed terminal command input.
 * @class
 */
export class Args {
    /**
     * @param {string} command - Primary command selector (e.g., 'ls', 'open')
     * @param {string[]} positional - Positional arguments following the command
     * @param {Record<string, string | boolean} options - Parsed flags (e.g., --detailed)
     */
    constructor(command = "", positional = [], options = {}) {
        this.command = command;
        this.positional = positional;
        this.options = options;
    }
}
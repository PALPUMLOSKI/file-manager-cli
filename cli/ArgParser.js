import { Args } from "./Args.js";

/**
 * Parses raw CLI strings into structured Args instances.
 * Supports quoted strings, positional arguments, and '--flag' / '--key=value' options.
 * @class
 */
export class ArgParser {
    /**
     * @param {string} rawInput
     * @returns {Args}
     */
    parseArgs(rawInput) {
        const trimmed = rawInput.trim();
        if (!trimmed) {
            return new Args("", [], {});
        }

        // Match either quoted substrings or non-whitespace tokens
        const tokens = trimmed.match(/"[^"]+"|'[^']+'|\S+/g) || [];
        const [firstToken, ...remainingTokens] = tokens.map(token => token.replace(/^["']|["']$/g, ""));

        const command = firstToken.toLowerCase();
        const positional = [];
        const options = {};

        for (const token of remainingTokens) {
            if (token.startsWith("--")) {
                const flagBody = token.slice(2);
                if (flagBody.includes("=")) {
                    const [key, value] = flagBody.split("=");
                    options[key] = value;
                } else {
                    options[flagBody] = true;
                }
            } else {
                positional.push(token);
            }
        }

        return new Args(command, positional, options);
    }
}

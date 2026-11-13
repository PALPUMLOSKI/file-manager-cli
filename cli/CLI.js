import { ArgParser } from "./ArgParser.js";

/**
 * Facade for the Command Line Interface presentation Layer.
 * Coordinater argument parsing, active command strategies, and object rendering.
 * @class
 */
export class CLI {
    #parser;
    #strategies;
    #canvas;

    /**
     * @param {import('../infra/Canvas.js').Canvas} canvas
     */
    constructor(canvas) {
        this.#parser = new ArgParser();
        /** @type {import('./CommandStrategy.js').CommandStrategy[]}  */
        this.#strategies = [];
        this.#canvas = canvas;
    }

    /**
     * Replaces active strategies with a new strategy for the current state.
     * @param {import('./CommandStrategy.js').CommandStrategy} strategy
     */
    useStrategy(strategy) {
        this.#strategies = [strategy];
    }

    /**
     * Appends an additional strategy (e.g., global infrastructure commands).
     * @param {import('./CommandStrategy.js').CommandStrategy} strategy
     */
    addStrategy(strategy) {
        this.#strategies.push(strategy);
    }

    /**
     * Displays in IRenderable onject onto the active Canvas layout.
     * @param {string} modeName
     * @param {import('../core/FileAsset.js').FileAsset} renderable
     * @param {import('./FileAsset.js').FileAssetRenderer} renderer
     * @param {string} [currentPath]
     */
    display(modeName, renderable, renderer, currentPath = "/") {
        const formattedOutput = renderable.render(renderer);
        this.#canvas.renderLayout(modeName, formattedOutput, currentPath);
    }

    /**
     * Parses raw user input and delegates execution to the matching strategy.
     * @param {string} rawString
     * @param {import('../core/AppContext.js').AppContext} context
     */
    exeCommand(rawString, context) {
        const args = this.#parser.parseArgs(rawString);

        if (!args.command) {
            return;
        }

        for (const strategy of this.#strategies) {
            if (args.command === "help") {
                const currentPath = context.activeFileName ? `/${context.activeFileName}` : "/";
                const modelLabel = context.stateName.replace("State", "");
                this.#canvas.renderLayout(modelLabel, strategy.getHelpText(), currentPath);
                return;
            }

            if (strategy.getCommandSelectors().includes(args.command)) {
                strategy.execCommand(args.command, context, args);
                return;
            }
        }

        const currentPath = context.activeFileName ? `/${context.activeFileName}` : "/";
        const modelLabel = context.stateName.replace("State", "");
        this.#canvas.renderLayout(
            modelLabel,
            `Unknown command: '${args.command}'. Type 'help' to list avaible commands.`,
            currentPath
        );
    }
}
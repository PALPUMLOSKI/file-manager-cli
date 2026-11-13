import { DirectoryState } from "./DirectoryState.js";
import { Canvas } from "../infra/Canvas.js"
import { CLI } from "../cli/CLI.js";
import { FileStorage } from "../data/FileStorage.js";
import { FileAsset } from "./FileAsset.js";

/**
 * App context manages applications states, domain entiries, persistence, and the CLI facade.
 * @class
 */
export class AppContext {
    #state;
    #fileSystem;
    #activeFileName;
    #canvas;
    #cli;
    #storage;

    /**
     * @param {Canvas} [canvasInstance]
     * @param {FileStorage} [storageInstance]
     */
    constructor(canvasInstance = new Canvas(), storageInstance = new FileStorage()) {
        this.#canvas = canvasInstance;
        this.#storage = storageInstance;
        this.#cli = new CLI(this.#canvas);
        this.#activeFileName = null;
        this.#fileSystem = {};

        this.#loadFromStorage();
        this.changeState(new DirectoryState());
    }

    /**
     * Hydrates FileAsset instances from persisted storage records.
     */
    #loadFromStorage() {
        const rawRecords = this.#storage.load();
        for(const [name, record] of Object.entries(rawRecords)) {
            this.#fileSystem[name] = new FileAsset(record.name, record.paragraphs, record.updatedAt);
        }
    }

    /**
     * Serializes and saves all FileAsset entiries to persistent storage.
     */
    persist() {
        const serialized = {};
        for(const [name, asset] of Object.entries(this.#fileSystem)) {
            serialized[name] = asset.toJSON();
        }
        this.#storage.save(serialized);
    }

    /**
     * Creates a new FileAsset and saves it immediately.
     * @param {string} name
     * @param {string[]} [paragraphs]
     */
    createFile(name, paragraphs = []) {
        this.#fileSystem[name] = new FileAsset(name, paragraphs);
        this.persist();
    }

    /**
     * Removes a FileAsset and updates persistent storage.
     * @param {string} name
     */
    deleteFile(name) {
        delete this.#fileSystem[name];
        this.persist();
    }

    get fileSystem() { return this.#fileSystem; }
    get canvas() { return this.#canvas; }
    get cli() { return this.#cli; }

    get activeFileName() { return this.#activeFileName; }
    set activeFileName(value) { this.#activeFileName = value; }


    get stateName() {
        return this.#state.constructor.name;
    }

    /**
     * Transitions to a new state and triggers its initialization hook.
     * @param {import('./AppState.js').AppState} newState
     */
    changeState(newState) {
        this.#state = newState;
        this.#state.onEnter(this);
    }

    /**
     * Forwards raw user command input to the active state.
     * @param {string} commandLine
     */
    processInput(commandLine) {
        this.#state.handleCommand(this, commandLine);
    }
}
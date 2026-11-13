import fs from "node:fs";
import path from "node:path";

/**
 * Persistence layer responsible for saving and loading virtual file system data.
 * @class
 */
export class FileStorage {
    #filePath;

    /**
     * @param {string} [storagePath] - Custom path to JSON storage file
     */
    constructor(storagePath = path.resolve("data", "storage.json")) {
        this.#filePath = storagePath;
    }

    /**
     * Loads files from disk for initializes default seed data if storage does not exist.
     * @returns {Record<string>, { name: string, paragraphs: string[], updateAt: string }>}
     */
    load() {
        try {
            if (!fs.existsSync(this.#filePath)) {
                const defaultData = {
                    "article.md": {
                        name: "article.md",
                        paragraphs: [
                            "## Architecture Guide",
                            "Layered tier decoupling structures guarantee high maintainability."
                        ],
                        updatedAt: new Date().toISOString()
                    },
                        "readme.md": {
                            name: "readme.md",
                            paragraphs: [
                                "##  Readme System",
                                "Console application state router online running smoothly."
                            ],
                            updateAt: new Date().toISOString()
                        }
                    };
                    this.save(defaultData);
                    return defaultData;
                }

                const raw = fs.readFileSync(this.#filePath, "utf-8");
                return JSON.parse(raw);
            } catch (error) {
                throw new Error(`Failed to load storage data: ${error.message}`);
            }
        }

        /**
         * Persists current file system state to JSON file on disk.
         * @param {Record<string, { name: string, paragraphs: string[], updateAt: string }>} data
         */
        save(data) {
            const dir = path.dirname(this.#filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.#filePath, JSON.stringify(data, null, 2), "utf-8");
        }
    }
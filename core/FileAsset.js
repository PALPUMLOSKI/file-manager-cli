/**
 * Domain entity representing a structured document in the file system.
 * Implements the IRenderable pattern allowing external renderers to format output.
 * @class
 */
export class FileAsset {
    #renderer;

    /**
     * @param {string} name
     * @param {string[]} [paragraphs]
     * @param {string} [updatedAt]
     */
    constructor(name, paragraphs = [], updatedAt = new Date().toISOString()) {
        this.name = name;
        this.paragraphs = paragraphs;
        this.updatedAt = updatedAt;
        this.#renderer = null;
    }

    /**
     * Attaches a specific IRenderer implementation to this entity.
     * @param {{ renderer: (asset: FileAsset) => string }} renderer
     */
    useRenderer(renderer) {
        this.#renderer = renderer;
    }

    /**
     * Renders the asset using either a passed renderer or the pre-configured one.
     * @param {{ renderer: (asset: FileAsset) => string }} [renderer]
     * @returns {string}
     */
    render(renderer = this.#renderer) {
        if (!renderer || typeof renderer.render !== "function") {
            throw new Error("Valid renderer implementation is required.");
        }
        return renderer.render(this);
    }

    /**
     * Serializes entity state for persistance storage.
     * @returns {{ name: string, paragraphs: string[], updatedAt: string }}
     */
    toJSON() {
        return {
            name: this.name,
            paragraphs: [...this.paragraphs],
            updatedAt: this.updatedAt
        };
    }
}
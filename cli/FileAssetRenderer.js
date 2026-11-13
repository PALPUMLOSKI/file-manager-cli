/**
 * Specific IRenderer implementation for formatting FileAsset objects in CLI.
 * @class
 */
export class FileAssetRenderer {
    /**
     * @param {boolean} [detailed]
     */
    constructor(detailed = false) {
        this.detailed = detailed;
    }

    /**
     * Transforms a FileAsset instance into a structured console string.
     * @param {import('../core/FileAsset.js').FileAsset} asset
     * @returns {string}
     */
    render(asset) {
        if (this.detailed) {
            return [
                `File Name : ${asset.name}`,
                `Paragraphs : ${asset.paragraphs.length}`,
                `Updated At : ${asset.updatedAt}`,
                `---------------------------------------`,
                ...asset.paragraphs.map((line, idx) => `[Paragraph ${idx + 1}] ${line}`)
            ].join("\n");
        }

        if (asset.paragraphs.length === 0) {
            return "(Empty document - use 'add <text>)' in Edit mode to append content)";
        }

        return asset.paragraphs
            .map((line, idx) => `[Paragraph ${idx + 1}] ${line}`)
            .join("\n");
    }
}
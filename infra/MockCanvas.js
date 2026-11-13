import { Canvas } from "./Canvas.js";

/**
 * Mock Canvas sub-class targeting isolated testing scenarios bypassing real console writes.
 * @extends Canvas
 */
export class MockCanvas extends Canvas {
    constructor() {
        super();
        this.lastRenderedMode = "";
        this.lastRenderedContent = "";
    }

    clear() {
        // Bypasses real terminal clearing sequence inside test loops
    }

    renderLayout(modeName, content, currentPath) {
        this.lastRenderedMode = modeName;
        this.lastRenderedContent = content;
    }
}
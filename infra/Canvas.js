/**
 * Interface/Base class representing the output display canvas boundary.
 * @class
 */
export class Canvas {
    clear() {
        // Standart ANSI escape sequences to clear terminal viewport cleanly
        console.clear();
    }

    /**
     * Renders the dynamic segments interface: Header, Main Field, and Footer.
     * @param {string} modeName
     * @param {string} content
     * @param {string} currentPath
     */
    renderLayout(modeName, content, currentPath = "/") {
        this.clear();
        // 1. Header Segment
        console.log(`============ FILE MANAGER CLI ==================`);
        console.log(`Active Mode: [${modeName.toUpperCase()}] | Current Path Context: ${currentPath}`);
        console.log(`----------------------------------------------------------------------------------`)

        // 2. Main Field Segment
        console.log(content);

        // 3. Footer Segment
        console.log(`--------------------------------------------------------`);
        console.log(`Controls Hint: Type 'help' to rewiev current contextual statements.`);
        console.log(`====================================================================`);
    }
}
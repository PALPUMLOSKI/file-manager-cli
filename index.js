import readline from "readline";
import { AppContext } from "./core/AppContext.js";
import { Canvas } from "./infra/Canvas.js";

// Initialize the application with real Canvas and FileStorage
const appInstance = new AppContext(new Canvas());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function displayPrompt() {
    const modelLabel = appInstance.stateName.replace("State", "").toLowerCase();
    rl.setPrompt(`file-manager [mode: ${modelLabel}] > `);
    rl.prompt();
}

// Perform initial render for the first launch screen layout
appInstance.canvas.renderLayout(
    "Directory",
    "File system explorer online (Storage connected). Type 'help' for actions."
);
displayPrompt();

rl.on("line", (line) => {
    const trimmed = line.trim();

    if (trimmed.toLowerCase() === "exit") {
        console.log("\nExiting application process context. Goodbye!\n");
        process.exit(0);
    }

    // Forward string parsing commands execution pipeline down to context manager
    appInstance.processInput(trimmed);
    displayPrompt();
});
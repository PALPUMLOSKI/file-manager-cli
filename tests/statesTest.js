import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { AppContext } from "../core/AppContext.js";
import { MockCanvas } from "../infra/MockCanvas.js";
import { FileStorage } from "../data/FileStorage.js";
import { ArgParser } from "../cli/ArgParser.js";

const TEST_STORAGE_PATH = path.resolve("data", "test_storage.json");

function cleanupTestStorage() {
    if (fs.existsSync(TEST_STORAGE_PATH)) {
        fs.unlinkSync(TEST_STORAGE_PATH);
    }
}

test("ArgsParser: parses commands, positional args, quotes, and flags", () => {
    const parser = new ArgParser();
    const parsed = parser.parseArgs('create "my note.md" "Hello World" --detailed');

    assert.strictEqual(parsed.command, "create");
    assert.deepStrictEqual(parsed.positional, ["my note.md", "Hello World"]);
    assert.strictEqual(parsed.options.detailed, true);
});

test("State, Strategy * Persistence: full lifecycle (create -> open -> edit -> save -> reload)", () => {
    cleanupTestStorage();

    try {
        // Arrange
        const mockCanvas = new MockCanvas();
        const storage = new FileStorage(TEST_STORAGE_PATH);
        const app = new AppContext(mockCanvas, storage);

        // 1. Diretory mode: list & create file
        app.processInput('create notes.md "Initial line"');
        assert.ok(mockCanvas.lastRenderedContent.includes("created and saved"));


        // 2. Transition to ViewState
        app.processInput("open notes.md");
        assert.strictEqual(app.stateName, "ViewState");
        assert.strictEqual(app.activeFileName, "notes.md");


        app.processInput("print");
        assert.ok(mockCanvas.lastRenderedContent.includes("[Paragraph 1] Initial line"));

        // 3. Transition to EditState and append content
        app.processInput("edit");
        assert.strictEqual(app.stateName, "EditState");

        app.processInput('add Second persisted line');
        assert.ok(mockCanvas.lastRenderedContent.includes("Appended paragraph"));

        // 4. Verify persistance by loading a fresh AppContext from the same storage file
        const reloadedApp = new AppContext(new MockCanvas(), new FileStorage(TEST_STORAGE_PATH));
        assert.ok(reloadedApp.fileSystem["notes.md"]);
        assert.deepStrictEqual(reloadedApp.fileSystem["notes.md"].paragraphs, [
            "Initial line",
            "Second persisted line"
        ]);

    } finally {
        cleanupTestStorage();
    }
});
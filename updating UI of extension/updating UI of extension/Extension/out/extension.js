"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const SidebarProvider_1 = require("./SidebarProvider");
function activate(context) {
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("Chatbot-sidebar", sidebarProvider));
    console.log('Congratulations, your extension "reddit-memes" is now active!');
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
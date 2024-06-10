"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
const vscode = require("vscode");
const getNonce_1 = require("./getNonce");
class SidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                case "goodMorning": {
                    console.log("Good Morning!");
                    this._view.webview.html = this._getGoodMorningHtml(this._view.webview);
                    break;
                }
                case "backToChatbot": {
                    console.log("Back to Chatbot");
                    this._view.webview.html = this._getHtmlForWebview(this._view.webview);
                    break;
                }
                case "goodNight": {
                    console.log("Good Night!");
                    this._view.webview.html = this._getGoodNightHtml(this._view.webview);
                    break;
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "global.css"));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css"));
        const nonce = (0, getNonce_1.default)();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <link href="${styleMainUri}" rel="stylesheet">
                <script>
                    const vscode = acquireVsCodeApi();
                </script>
            </head>
            <body>
                <div id="chat-container">
                    <div id="display"></div>
                    <div id="input-container">
                        <input type="text" id="userInput" placeholder="Type your message here..." />
                        
                    <svg id="Submit" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.0719 8.02397L5.7146 3.66666L6.33332 3.04794L11 7.71461V8.33333L6.33332 13L5.7146 12.3813L10.0719 8.02397Z" fill="#C5C5C5"/>
</svg>
                    </div>
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarProvider.js.map
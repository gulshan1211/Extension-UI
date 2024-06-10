import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
    const sidebarProvider = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "Chatbot-sidebar",
            sidebarProvider
        )
    );
    console.log('Congratulations, your extension "reddit-memes" is now active!');
}
import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const clientName = "zk"
	const clientId = "zk"

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { command: "zk", args: ["lsp"] },
		debug: { command: "zk", args: ["lsp", "--log", "/tmp/zk-lsp.log"] }
	};

	let clientOptions: LanguageClientOptions = {
		// Register the server for Markdown documents.
		documentSelector: [{ scheme: 'file', language: 'markdown' }],
	};

	client = new LanguageClient(clientId, clientName, serverOptions, clientOptions);


	// Start the client. This will also launch the server.
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
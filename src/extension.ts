import * as vscode from 'vscode';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions
} from 'vscode-languageclient/node';

const clientName = "zk"
const clientId = "zk"
let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	let restartCmd = vscode.commands.registerCommand(`${clientId}.restart`, async () => {
		await stopClient();
		startClient(context);
	});

	let showLogsCmd = vscode.commands.registerCommand(`${clientId}.showLogs`, () => {
		if (!client) return
		client.outputChannel.show(true);
	});

	context.subscriptions.push(
		restartCmd,
		showLogsCmd,
	);

	startClient(context)
}

export async function deactivate() {
	await stopClient()
}

function startClient(context: ExtensionContext) {
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
	context.subscriptions.push(client.start());
}

async function stopClient() {
	if (!client) return

	await client.stop();
	client.outputChannel.dispose();
	client.traceOutputChannel.dispose();
}
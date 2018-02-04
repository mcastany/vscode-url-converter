const vscode = require('vscode');
const lib = require('./lib');

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.urltorequest', lib.urltorequire));
    context.subscriptions.push(vscode.commands.registerCommand('extension.requesttourl', lib.requiretourl));
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
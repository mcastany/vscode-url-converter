const vscode = require('vscode');
const url = require('url');
const JSON5 = require('json5');

module.exports.urltorequire = function(){
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const selection = editor.selection;
  const text = editor.document.getText(!selection.isEmpty ? selection : undefined);

  try {
    const parsed = url.parse(text, true);
    const request = {
      url : `${parsed.protocol}//${parsed.host}${parsed.pathname}`,
    };

    if (parsed.method){
      request.method =  parsed.method;
    }

    if (Object.keys(parsed.query).length > 0 ) {
      request.qs = JSON.parse(JSON.stringify(parsed.query)); // Hack to fix issue with JSON5
    }

    const requestObject = JSON5.stringify(request, null, 4);

    editor.edit(function (edit) {
      if (selection.isEmpty){
        return edit.replace(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE), requestObject);
      }

      edit.replace(selection, requestObject);
    });

  } catch(e) {
    vscode.window.showErrorMessage('There was an error converting url to request object');
  }
}


module.exports.requiretourl = function () {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { return; }

  const selection = editor.selection;
  const text = editor.document.getText(!selection.isEmpty ? selection : undefined);

  try {
    const parsed = JSON5.parse(text);
    let resultUrl = `${parsed.url}`;

    if (parsed.qs){
      let qs = '?'
      Object.keys(parsed.qs).forEach((key, index) => {
        qs = qs + `${index > 0 ? '&' : ''}${key}=${encodeURIComponent(parsed.qs[key])}`
      });

      resultUrl += qs;
    }

    editor.edit(function (edit) {
      if (selection.isEmpty){
        return edit.replace(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE), resultUrl);
      }

      edit.replace(selection, resultUrl);
    });

  } catch(e) {
    vscode.window.showErrorMessage('There was an error converting request to url');
  }
}
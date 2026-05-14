const vscode = require('vscode');

class UnsavedFilesProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    const docs = vscode.workspace.textDocuments.filter(
      d => d.isDirty
    );

    if (docs.length === 0) {
      return [
        new vscode.TreeItem(
          'No unsaved files',
          vscode.TreeItemCollapsibleState.None
        )
      ];
    }

    return docs.map(doc => new UnsavedFileItem(doc));
  }
}

class UnsavedFileItem extends vscode.TreeItem {
  constructor(doc) {
    const fileName = doc.isUntitled
      ? 'Untitled'
      : vscode.workspace.asRelativePath(doc.uri);

    super(fileName, vscode.TreeItemCollapsibleState.None);

    this.doc = doc;
    this.uri = doc.uri;

    this.tooltip = doc.uri.fsPath || 'Untitled File';
    this.description = doc.isUntitled ? 'Unsaved New File' : '';

    this.command = {
      command: 'unsavedFiles.open',
      title: 'Open File',
      arguments: [this]
    };

    this.contextValue = 'unsavedFile';

    this.iconPath = new vscode.ThemeIcon('circle-filled');
  }
}

function activate(context) {
  const provider = new UnsavedFilesProvider();

  vscode.window.registerTreeDataProvider(
    'unsavedFilesView',
    provider
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'unsavedFiles.refresh',
      () => provider.refresh()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'unsavedFiles.open',
      async (item) => {
        if (!item?.uri) {
          return;
        }

        const doc = await vscode.workspace.openTextDocument(item.uri);

        await vscode.window.showTextDocument(doc, {
          preview: false
        });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'unsavedFiles.close',
      async (item) => {
        if (!item?.uri) {
          return;
        }

        const doc = await vscode.workspace.openTextDocument(item.uri);

        await vscode.window.showTextDocument(doc);

        await vscode.commands.executeCommand(
          'workbench.action.revertAndCloseActiveEditor'
        );

        provider.refresh();
      }
    )
  );

  const refreshEvents = [
    vscode.workspace.onDidChangeTextDocument(() => provider.refresh()),
    vscode.workspace.onDidOpenTextDocument(() => provider.refresh()),
    vscode.workspace.onDidCloseTextDocument(() => provider.refresh()),
    vscode.window.onDidChangeVisibleTextEditors(() => provider.refresh())
  ];

  context.subscriptions.push(...refreshEvents);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};

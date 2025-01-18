// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "markdown-folding" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('markdown-folding.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from markdown-folding!');
  });

  context.subscriptions.push(disposable);
  // Register the folding range provider
  vscode.languages.registerFoldingRangeProvider({ language: 'markdown' }, new MarkdownFoldingProvider());
}

// This method is called when your extension is deactivated
export function deactivate() {}

class MarkdownFoldingProvider implements vscode.FoldingRangeProvider {
  /**
   * Provides folding ranges for a Markdown document based on header levels.
   *
   * @param document - The text document to provide folding ranges for.
   * @param context - The folding context (not used in this implementation).
   * @param token - A cancellation token (not used in this implementation).
   * @returns An array of `vscode.FoldingRange` objects representing the folding ranges.
   *
   * This method scans through the document line by line, identifying headers based on the
   * Markdown header pattern (lines starting with one or more `#` characters followed by a space).
   * For each header, it determines the range of lines that should be folded under that header.
   * The folding range extends from the header line to the line before the next header of the same
   * or higher level, or to the end of the document.
   */
  provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
    const foldingRanges: vscode.FoldingRange[] = [];
    const headerPattern = /^(#+)\s+/; // Pattern to match Markdown headers

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const match = headerPattern.exec(line.text); // Check if the line matches the header pattern
      if (match) {
      const start = i; // Start of the folding range
      const level = match[1].length; // Header level based on the number of `#` characters

      let end = start;
      for (let j = start + 1; j < document.lineCount; j++) {
        const nextLine = document.lineAt(j);
        const nextMatch = headerPattern.exec(nextLine.text); // Check if the next line matches the header pattern
        if (nextMatch && nextMatch[1].length <= level) {
        break; // Stop if a header of the same or higher level is found
        }
        end = j; // Update the end of the folding range
      }

      foldingRanges.push(new vscode.FoldingRange(start, end)); // Add the folding range
      }
    }

    return foldingRanges;
  }
}
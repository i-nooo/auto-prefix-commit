# AutoPrefix Commit CLI

AutoPrefix Commit CLI is a command-line tool designed to streamline the process of creating Git commits with predefined commit message prefixes. It uses `inquirer` for interactive prompts and `chalk` for colored terminal output.

## Features

- Interactive selection of commit types with emojis.
- Customizable commit types via a `.autoprefix.js` configuration file.
- Automatic checking of Git user configuration.
- Simple Git add and commit process.

## Installation

To use this CLI tool, you need to have Node.js and npm installed on your machine. You can install the package globally using npm:

```bash
npm install -g autoprefix-commit-cli
```

## Usage

Navigate to a Git repository and run the following command:

```bash
autoprefix-commit
```

The CLI will guide you through selecting a commit type and entering a commit message. It will then stage all changes and commit them with the selected prefix.

## Configuration
You can customize the available commit types by creating a .autoprefix.js file in the root directory of your project or any parent directory. This file should export an object with a commitTypes array:
```js
module.exports = {
  commitTypes: [
    "🏗️ Initial",
    "✨ Feat",
    "♻️ Refactor",
    "📦 Chore",
    "🐛 Bug",
    "🚨 HotFix",
    "📚 Docs",
    "🚚 Rename",
    "🗑️ Remove",
    // Add your custom types here
  ],
};
```
## Error Handling
The tool checks if the Git user name and email are configured. If not, it will terminate with an error message.
If the current directory is not a Git repository, the tool will exit with an error.

## Dependencies
- inquirer - For interactive command-line interfaces.
- chalk - For terminal string styling.
- util - For promisifying callback-based functions.
- fs.promises - For file system operations.
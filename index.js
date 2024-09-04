#!/usr/bin/env node

const inquirer = require("inquirer");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs").promises;
const path = require("path");
const chalk = require("chalk");

let commitTypes = [
  "🏗️ Initial",
  "✨ Feat",
  "♻️ Refactor",
  "📦 Chore",
  "🐛 Bug",
  "🚨 HotFix",
  "📚 Docs",
  "🚚 Rename",
  "🗑️ Remove",
];

const findConfig = async (directory) => {
  const configPath = path.join(directory, ".autoprefix.js");
  try {
    await fs.access(configPath);
    return require(configPath);
  } catch (error) {
    const parentDir = path.dirname(directory);
    if (parentDir === directory) {
      return null;
    }
    return findConfig(parentDir);
  }
};

const checkGitConfig = async (configType) => {
  try {
    const result = await exec(`git config --get user.${configType}`);
    if (!result.stdout.trim()) {
      throw new Error(`Git user.${configType} is not set.`);
    }
  } catch (error) {
    console.error(`Error: Git ${configType} is not configured correctly.`);
    process.exit(1);
  }
};

const promptCommitDetails = async () => {
  return inquirer.prompt([
    {
      type: "list",
      name: "commitType",
      message: "Select the type of commit:",
      choices: commitTypes,
    },
    {
      type: "input",
      name: "commitMessage",
      message: "Enter the commit message:",
    },
  ]);
};

const gitAddAndCommit = async (fullCommitMessage) => {
  try {
    await exec("git add .");
    await exec(`git commit -m "${fullCommitMessage}"`);
    console.log(chalk.green(`>> Commit successful: ${fullCommitMessage}`));
  } catch (error) {
    console.error(chalk.red(`Error during git operations: ${error.message}`));
  }
};

const main = async () => {
  try {
    const config = await findConfig(process.cwd());
    if (config && config.commitTypes) {
      commitTypes = config.commitTypes;
    }

    await fs.access(path.join(process.cwd(), ".git"));

    await checkGitConfig("name");
    await checkGitConfig("email");

    const answers = await promptCommitDetails();
    const fullCommitMessage = `${answers.commitType}: ${answers.commitMessage}`;

    await gitAddAndCommit(fullCommitMessage);
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

main();

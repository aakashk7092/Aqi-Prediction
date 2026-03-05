# GitHub Setup with Visual Studio Code

A complete guide to setting up **GitHub with Visual Studio Code (VS Code)** for managing and uploading projects using Git version control. This guide covers installation, configuration, repository creation, and the complete workflow for pushing and updating code.

---

# Table of Contents

1. Introduction
2. Prerequisites
3. Installing Git
4. Creating a GitHub Account
5. Installing Visual Studio Code
6. Configuring Git
7. Connecting VS Code with GitHub
8. Creating a GitHub Repository
9. Initializing Git in a Project
10. Adding Files to Git
11. Committing Changes
12. Connecting Local Repository to GitHub
13. Pushing Code to GitHub
14. Updating Code in the Future
15. Using VS Code Git Interface
16. Creating a .gitignore File
17. Important Git Commands
18. Best Practices
19. Conclusion

---

# 1. Introduction

GitHub is a cloud-based platform that allows developers to **store, manage, and track changes in code using Git**. It enables collaboration, version control, and project management.

Visual Studio Code integrates directly with Git and GitHub, allowing developers to perform version control operations without leaving the editor.

Using GitHub with VS Code helps developers:

* Track changes in code
* Maintain project history
* Collaborate with other developers
* Backup projects online
* Deploy applications efficiently

---

# 2. Prerequisites

Before starting, ensure the following tools are available:

* Git installed on the system
* Visual Studio Code installed
* A GitHub account
* Internet connection

---

# 3. Installing Git

Git is a distributed version control system used to track changes in files.

### Installation Steps

1. Visit the official Git website:

https://git-scm.com/downloads

2. Download the installer for your operating system.
3. Run the installer.
4. Follow the default installation settings.
5. Complete the installation.

### Verify Installation

Open a terminal or command prompt and run:

git --version

If Git is installed correctly, the installed version will be displayed.

---

# 4. Creating a GitHub Account

1. Visit:

https://github.com

2. Click **Sign Up**.
3. Enter the following details:

   * Email address
   * Username
   * Password
4. Verify the email address.
5. Complete the account setup process.

After registration, the GitHub dashboard will be available for creating repositories.

---

# 5. Installing Visual Studio Code

Download Visual Studio Code from the official website:

https://code.visualstudio.com

Install it using default settings.

### Recommended Extensions

Open **Extensions (Ctrl + Shift + X)** and install:

* GitHub Pull Requests and Issues
* GitLens (optional)

These extensions improve Git functionality within VS Code.

---

# 6. Configuring Git

Git must be configured with a username and email so commits are properly identified.

Open a terminal and run:

git config --global user.name "Your Name"
git config --global user.email "[your-email@example.com](mailto:your-email@example.com)"

Verify configuration:

git config --list

This displays the Git configuration settings.

---

# 7. Connecting VS Code with GitHub

1. Open Visual Studio Code.
2. Click the **Accounts icon** in the bottom-left corner.
3. Select **Sign in with GitHub**.
4. A browser window will open.
5. Log in and authorize access.

VS Code will now be connected to the GitHub account.

---

# 8. Creating a GitHub Repository

1. Open GitHub dashboard.
2. Click **New Repository**.
3. Enter repository details.

Example:

Repository Name: project-name

Choose visibility:

* Public
* Private

Click **Create Repository**.

GitHub will generate a repository URL such as:

https://github.com/username/project-name.git

---

# 9. Initializing Git in a Project

Open your project folder in VS Code.

Open the terminal and run:

git init

This converts the folder into a Git repository.

---

# 10. Adding Files to Git

Check file status:

git status

Files not yet tracked will appear as **untracked files**.

Add all files to staging area:

git add .

The dot (`.`) indicates all files in the directory.

---

# 11. Committing Changes

A commit records a snapshot of the project.

git commit -m "Initial commit"

The message should describe the changes made.

---

# 12. Connecting Local Repository to GitHub

Link the local project with the GitHub repository.

git remote add origin https://github.com/username/repository-name.git

Verify connection:

git remote -v

---

# 13. Pushing Code to GitHub

Upload the project to GitHub.

git branch -M main
git push -u origin main

After executing these commands, the project will appear in the GitHub repository.

---

# 14. Updating Code in the Future

Whenever new changes are made, follow this workflow:

Step 1 — Add changes

git add .

Step 2 — Commit changes

git commit -m "Describe the update"

Step 3 — Push changes

git push

This updates the repository on GitHub.

---

# 15. Using VS Code Git Interface

VS Code provides a graphical interface for Git.

Steps:

1. Open **Source Control** from the left sidebar.
2. Stage files using the **+ icon**.
3. Write a commit message.
4. Click **Commit**.
5. Click **Push** to upload changes.

This method allows Git operations without using terminal commands.

---

# 16. Creating a .gitignore File

A `.gitignore` file prevents unnecessary files from being uploaded to the repository.

Example:

**pycache**/
node_modules/
.env
*.log
*.pkl
*.csv
.ipynb_checkpoints

This keeps the repository clean and avoids uploading large or sensitive files.

---

# 17. Important Git Commands

| Command    | Description               |
| ---------- | ------------------------- |
| git init   | Initialize Git repository |
| git status | Check file changes        |
| git add .  | Add files to staging      |
| git commit | Save snapshot             |
| git push   | Upload code to GitHub     |
| git pull   | Download latest changes   |
| git log    | View commit history       |

---

# 18. Best Practices

* Commit changes frequently with clear messages.
* Always run `git pull` before starting new work.
* Use `.gitignore` to prevent uploading unnecessary files.
* Keep repository structure organized.
* Write a detailed README for each project.

---

# 19. Conclusion

GitHub and Visual Studio Code together provide a powerful environment for managing software development projects. By using Git for version control and GitHub for repository hosting, developers can efficiently track changes, collaborate with others, and maintain a reliable development workflow.

Following the steps in this guide ensures that projects can be easily managed, versioned, and shared using modern development practices.

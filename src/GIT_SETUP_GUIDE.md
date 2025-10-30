# 🔧 Git Setup & GitHub Repository Guide

Complete guide for initializing your Git repository and pushing the Estal platform to GitHub.

---

## 📋 Prerequisites

- [x] Git installed locally (`git --version` to verify)
- [x] GitHub account created
- [x] Repository created on GitHub: `https://github.com/EstalProptech/Estal.git`

---

## 🚀 Quick Start (First Time Setup)

If you're setting up Git for the first time, run these commands:

```bash
# Configure your identity (one-time setup)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name to 'main'
git config --global init.defaultBranch main
```

---

## 📦 Initialize Repository & Push to GitHub

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory
cd /path/to/estal-platform

# Initialize Git (creates .git directory)
git init
```

**Expected output:**
```
Initialized empty Git repository in /path/to/estal-platform/.git/
```

---

### Step 2: Add All Files

```bash
# Add all files to staging area
git add .

# Verify what will be committed
git status
```

**What gets added:**
- All source code files (`.tsx`, `.ts`, `.css`)
- Configuration files (`package.json`, `vite.config.ts`, etc.)
- Documentation (`.md` files)
- **NOT added**: Files listed in `.gitignore` (node_modules, .env, etc.)

---

### Step 3: Create First Commit

```bash
# Commit with a meaningful message
git commit -m "Initial commit: Estal PropTech Platform v1.0"
```

**Expected output:**
```
[main (root-commit) abc1234] Initial commit: Estal PropTech Platform v1.0
 XXX files changed, XXXX insertions(+)
 create mode 100644 App.tsx
 create mode 100644 README.md
 ...
```

---

### Step 4: Rename Branch to Main (if needed)

```bash
# Ensure you're on the 'main' branch
git branch -M main
```

---

### Step 5: Connect to GitHub Remote

```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/EstalProptech/Estal.git

# Verify remote is added
git remote -v
```

**Expected output:**
```
origin  https://github.com/EstalProptech/Estal.git (fetch)
origin  https://github.com/EstalProptech/Estal.git (push)
```

---

### Step 6: Push to GitHub

```bash
# Push to GitHub (first push uses -u to set upstream)
git push -u origin main
```

**Authentication options:**
1. **Personal Access Token (Recommended)**:
   - Generate at: https://github.com/settings/tokens
   - Use token as password when prompted
   
2. **SSH Key**:
   - Set up SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
   - Change remote: `git remote set-url origin git@github.com:EstalProptech/Estal.git`

---

## ✅ Verification Checklist

After pushing, verify everything worked:

- [ ] Visit `https://github.com/EstalProptech/Estal`
- [ ] Check that all files are visible
- [ ] Verify README.md displays correctly
- [ ] Confirm `.env` files are **NOT** visible (protected by `.gitignore`)
- [ ] Check commit count shows "1 commit"

---

## 📝 Daily Git Workflow

Once set up, use these commands for daily development:

### Making Changes

```bash
# 1. Check current status
git status

# 2. Add specific files
git add components/NewComponent.tsx

# Or add all changes
git add .

# 3. Commit with descriptive message
git commit -m "feat: add new maintenance dashboard component"

# 4. Push to GitHub
git push
```

---

## 🎯 Conventional Commit Messages

Use these prefixes for clarity:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feat:` | New features | `feat: add AI-powered insights panel` |
| `fix:` | Bug fixes | `fix: resolve dashboard loading issue` |
| `docs:` | Documentation | `docs: update API integration guide` |
| `style:` | Formatting | `style: improve card spacing` |
| `refactor:` | Code restructuring | `refactor: optimize KV cache logic` |
| `test:` | Testing | `test: add auth validation tests` |
| `chore:` | Maintenance | `chore: update dependencies` |

**Example:**
```bash
git commit -m "feat: add export functionality to financial reports"
```

---

## 🌿 Branching Strategy

### Creating Feature Branches

```bash
# Create and switch to new branch
git checkout -b feature/ai-insights

# Make your changes, then commit
git add .
git commit -m "feat: implement AI insights engine"

# Push to GitHub
git push -u origin feature/ai-insights
```

### Recommended Branch Names

```
feature/description    - New features
fix/bug-name          - Bug fixes
docs/update-topic     - Documentation updates
refactor/component    - Code refactoring
```

### Merging Back to Main

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge feature/ai-insights

# Push merged changes
git push origin main

# Delete feature branch (optional)
git branch -d feature/ai-insights
```

---

## 🔄 Syncing with Team

### Pulling Latest Changes

```bash
# Fetch and merge latest changes from GitHub
git pull origin main
```

### Resolving Conflicts

If you get a merge conflict:

```bash
# 1. Git will mark conflicted files
# 2. Open files and resolve conflicts manually
# 3. After resolving, add the files
git add .

# 4. Complete the merge
git commit -m "merge: resolve conflicts in dashboard view"

# 5. Push changes
git push
```

---

## 🛠️ Useful Git Commands

### Checking History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View last 5 commits
git log -5

# View changes in a commit
git show <commit-hash>
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- filename.tsx

# Unstage a file (undo git add)
git reset HEAD filename.tsx

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - USE CAREFULLY
git reset --hard HEAD~1
```

### Viewing Differences

```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged

# Compare with specific commit
git diff <commit-hash>
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep `.gitignore` updated
- Review changes before committing (`git status`, `git diff`)
- Use meaningful commit messages
- Commit frequently with small, logical changes

### ❌ DON'T:
- Commit `.env` files or API keys
- Commit `node_modules/` directory
- Use `git add .` blindly without reviewing
- Commit large binary files (>100MB)

---

## 🐛 Troubleshooting

### Problem: "Repository already exists"

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/EstalProptech/Estal.git
```

### Problem: "Permission denied"

**Solution 1** (HTTPS): Use Personal Access Token instead of password

**Solution 2** (SSH): Set up SSH key authentication

### Problem: "Large files detected"

```bash
# Find large files
find . -type f -size +10M

# Add to .gitignore if needed
echo "path/to/large/file" >> .gitignore
```

### Problem: Accidentally committed secrets

```bash
# Remove file from Git history (use with caution)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if already pushed)
git push origin --force --all

# Then rotate all exposed secrets immediately!
```

---

## 📚 Additional Resources

- **GitHub Documentation**: https://docs.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Pro Git Book**: https://git-scm.com/book/en/v2
- **Interactive Git Tutorial**: https://learngitbranching.js.org/

---

## 🎯 Quick Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# Create branch
git checkout -b branch-name

# Switch branch
git checkout branch-name

# View history
git log --oneline
```

---

## ✨ Next Steps

After successfully pushing to GitHub:

1. **Set up GitHub Actions** - See `/docs/CI_CD_SETUP_INSTRUCTIONS.md`
2. **Configure branch protection** - Protect `main` branch from force pushes
3. **Add collaborators** - Go to Settings → Collaborators
4. **Create first issue** - Document feature requests or bugs
5. **Set up project board** - Organize work in GitHub Projects

---

<div align="center">

**🚀 Your Estal platform is now on GitHub!**

[View Repository](https://github.com/EstalProptech/Estal) • [Issues](https://github.com/EstalProptech/Estal/issues) • [Pull Requests](https://github.com/EstalProptech/Estal/pulls)

</div>

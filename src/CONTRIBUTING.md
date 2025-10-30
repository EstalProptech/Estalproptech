# 🤝 Contributing to Estal PropTech Platform

Thank you for your interest in contributing to Estal! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 🌟 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and considerate
- Use welcoming and inclusive language
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or inflammatory comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git installed and configured
- Basic knowledge of React, TypeScript, and Tailwind CSS
- Familiarity with the [project structure](/README.md#-project-structure)

### Setup Development Environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Estal.git
cd Estal

# Add upstream remote
git remote add upstream https://github.com/EstalProptech/Estal.git

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔄 Development Workflow

### 1. Sync Your Fork

Before starting work, sync with upstream:

```bash
# Fetch latest changes
git fetch upstream

# Switch to main branch
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

### 2. Create a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Branch naming conventions:
# feature/description  - New features
# fix/bug-name        - Bug fixes
# docs/topic          - Documentation
# refactor/component  - Code refactoring
```

### 3. Make Your Changes

- Write clean, maintainable code
- Follow the [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (when available)
npm test
```

### 5. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines):

```bash
# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new maintenance dashboard widget"
```

### 6. Push to Your Fork

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

1. Go to the [Estal repository](https://github.com/EstalProptech/Estal)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template
5. Submit for review

---

## 💻 Coding Standards

### TypeScript

```typescript
// ✅ DO: Use TypeScript types
interface Property {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// ❌ DON'T: Use 'any' type
const data: any = fetchData();
```

### React Components

```typescript
// ✅ DO: Use functional components with TypeScript
interface UserCardProps {
  name: string;
  role: 'admin' | 'accountant' | 'owner';
}

export function UserCard({ name, role }: UserCardProps) {
  return <div>{name} - {role}</div>;
}

// ❌ DON'T: Use class components
class UserCard extends React.Component { ... }
```

### Tailwind CSS

```tsx
// ✅ DO: Use Tailwind utility classes
<div className="rounded-[20px] bg-white p-6 shadow-sm">

// ❌ DON'T: Use inline styles
<div style={{ borderRadius: '20px', background: 'white' }}>
```

### File Organization

```
components/
├── ui/                  # Shadcn UI components only
├── figma/              # Figma utilities (protected)
├── ComponentName.tsx   # One component per file
└── README.md           # Component documentation

hooks/
├── useCustomHook.ts    # Custom React hooks
└── README.md

utils/
├── helpers.ts          # Utility functions
└── types.ts            # Shared TypeScript types
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `PropertyCard.tsx` |
| **Hooks** | camelCase with 'use' | `useProperties.ts` |
| **Utils** | camelCase | `formatCurrency.ts` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL` |
| **Interfaces** | PascalCase | `PropertyData` |

---

## 📝 Commit Guidelines

### Conventional Commits

Use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add property export functionality` |
| `fix` | Bug fix | `fix: resolve dashboard loading spinner` |
| `docs` | Documentation | `docs: update API integration guide` |
| `style` | Code style/formatting | `style: apply consistent spacing` |
| `refactor` | Code refactoring | `refactor: simplify KV cache logic` |
| `perf` | Performance improvement | `perf: optimize chart rendering` |
| `test` | Add/update tests | `test: add auth validation tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |

### Examples

```bash
# Simple feature
git commit -m "feat: add maintenance request filtering"

# Bug fix with scope
git commit -m "fix(auth): resolve token expiration handling"

# Breaking change
git commit -m "feat!: redesign property card layout

BREAKING CHANGE: PropertyCard now requires 'variant' prop"
```

---

## 🔀 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with `main`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. **Automated checks** run (linting, tests)
2. **Code review** by maintainers
3. **Requested changes** addressed
4. **Approval** and merge by maintainer

### After Merge

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull upstream main

# Delete feature branch
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🧪 Testing

### Manual Testing

```bash
# Test as different user roles
# 1. Admin dashboard
# 2. Accountant view
# 3. Owner view

# Test responsive design
# 1. Desktop (1920px)
# 2. Tablet (768px)
# 3. Mobile (375px)

# Test core workflows
# 1. Login/logout
# 2. Property creation
# 3. Maintenance request
# 4. Financial report export
```

### Writing Tests (Future)

```typescript
// Example test structure
import { render, screen } from '@testing-library/react';
import { PropertyCard } from './PropertyCard';

describe('PropertyCard', () => {
  it('renders property name', () => {
    render(<PropertyCard name="Building A" status="active" />);
    expect(screen.getByText('Building A')).toBeInTheDocument();
  });
});
```

---

## 📚 Documentation

### Code Comments

```typescript
// ✅ DO: Comment complex logic
/**
 * Calculates ROI based on revenue and expenses
 * @param revenue - Monthly revenue in SAR
 * @param expenses - Monthly expenses in SAR
 * @returns ROI percentage
 */
function calculateROI(revenue: number, expenses: number): number {
  return ((revenue - expenses) / expenses) * 100;
}

// ❌ DON'T: Comment obvious code
// Set name to "John"
const name = "John";
```

### Component Documentation

Create `ComponentName.md` for complex components:

```markdown
# PropertyCard Component

## Usage

\`\`\`tsx
import { PropertyCard } from './components/PropertyCard';

<PropertyCard 
  name="Building A"
  status="active"
  units={24}
/>
\`\`\`

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | Property name |
| status | string | Yes | active/inactive |
| units | number | No | Number of units |
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check [existing issues](https://github.com/EstalProptech/Estal/issues)
2. Verify it's reproducible
3. Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- Browser: [e.g. Chrome 120]
- OS: [e.g. macOS 14]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives you've considered**
Other solutions considered

**Additional context**
Mockups, examples, etc.
```

---

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Documentation improvements |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `priority: high` | High priority |
| `priority: low` | Low priority |

---

## 🎯 Contribution Ideas

### Good First Issues

- Fix typos in documentation
- Add missing TypeScript types
- Improve error messages
- Add comments to complex code
- Update outdated screenshots

### Medium Complexity

- Add new dashboard widgets
- Improve responsive design
- Add data export features
- Enhance form validation
- Optimize performance

### Advanced

- Implement 2FA authentication
- Add real-time collaboration
- Build mobile app version
- Integrate payment gateways
- Add multi-language support

---

## 📞 Getting Help

### Resources

- **Documentation**: [/docs](/docs)
- **Troubleshooting**: [/docs/TROUBLESHOOTING.md](/docs/TROUBLESHOOTING.md)
- **GitHub Issues**: [Report bugs or request features](https://github.com/EstalProptech/Estal/issues)

### Questions?

- Check [FAQ](/docs/FAQ.md)
- Search [closed issues](https://github.com/EstalProptech/Estal/issues?q=is%3Aissue+is%3Aclosed)
- Open a [discussion](https://github.com/EstalProptech/Estal/discussions)

---

## 🙏 Recognition

Contributors will be:
- Listed in [CONTRIBUTORS.md](/CONTRIBUTORS.md)
- Mentioned in release notes
- Acknowledged in documentation

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to Estal! 🚀**

[Back to README](/README.md) • [View Issues](https://github.com/EstalProptech/Estal/issues) • [Documentation](/docs)

</div>

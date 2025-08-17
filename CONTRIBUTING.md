# Contributing to TidySnips

Thank you for your interest in contributing to TidySnips! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Make** your changes
5. **Test** thoroughly
6. **Submit** a pull request

## 📋 Development Setup

### Prerequisites
- Go 1.21+
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/TidySnips.git
cd TidySnips

# Backend setup
cd backend
cp .env.example .env.development
go mod tidy
go run .

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

## 🎯 Types of Contributions

### 🐛 Bug Reports
- Use the GitHub issue template
- Include steps to reproduce
- Provide system information
- Add screenshots if applicable

### ✨ Feature Requests
- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Consider backward compatibility

### 🔧 Code Contributions
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all checks pass

### 📚 Documentation
- Fix typos and grammar
- Improve clarity
- Add examples
- Update API documentation

## 🛠️ Development Guidelines

### Code Style

#### Backend (Go)
```bash
# Format code
go fmt ./...

# Lint code
golangci-lint run

# Run tests
go test ./...
```

#### Frontend (TypeScript/React)
```bash
# Lint and format
npm run lint
npm run format

# Type check
npx tsc --noEmit

# Build check
npm run build
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(api): add minify endpoint for PHP
fix(ui): resolve mobile responsiveness issue
docs(readme): update installation instructions
test(handlers): add unit tests for validation
```

### Branch Naming
```
feature/add-python-support
bugfix/fix-json-parsing
docs/update-api-docs
hotfix/security-patch
```

## 🧪 Testing Requirements

### Backend Testing
```bash
# Unit tests
go test ./...

# Integration tests
go test -tags=integration ./...

# Coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Frontend Testing
```bash
# Lint
npm run lint

# Type checking
npx tsc --noEmit

# Build verification
npm run build
```

### API Testing
```bash
# Health check
curl -X GET http://localhost:8080/api/v1/health

# Functionality test
curl -X POST http://localhost:8080/api/v1/format \
  -H "Content-Type: application/json" \
  -d '{"code": "function test(){}", "language": "JavaScript"}'
```

## 📝 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

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
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: Maintainer review
3. **Feedback**: Address review comments
4. **Approval**: Get maintainer approval
5. **Merge**: Maintainer merges PR

## 🏗️ Architecture Guidelines

### Backend Structure
```
backend/
├── main.go          # Entry point
├── config.go        # Configuration management
├── handlers.go      # HTTP handlers
├── middleware.go    # Middleware functions
├── formatters.go    # Code formatting logic
└── models.go        # Data structures
```

### Frontend Structure
```
frontend/
├── app/
│   ├── page.tsx     # Main page component
│   └── layout.tsx   # Root layout
├── components/      # Reusable components
├── types/          # TypeScript types
└── public/         # Static assets
```

## 🚀 Release Process

### Version Numbering
Follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Checklist
- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Tag release
- [ ] Build and test
- [ ] Deploy to staging
- [ ] Production deployment

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Be constructive in feedback
- Help newcomers
- Respect different opinions

### Communication Channels
- **Issues**: Bug reports and feature requests
- **Discussions**: Questions and general discussion
- **PR Comments**: Code-specific discussions

## 🏆 Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## ❓ Getting Help

### Documentation
- Read the README.md
- Check existing issues
- Review API documentation

### Support Channels
- GitHub Issues (bugs/features)
- GitHub Discussions (questions)
- Email: support@yourdomain.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TidySnips! 🎉

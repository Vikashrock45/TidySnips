# Security Policy

## Supported Versions

We actively support the following versions of TidySnips:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in TidySnips, please report it responsibly:

### 🔒 Private Disclosure

1. **Email**: Send details to security@yourdomain.com (replace with your email)
2. **Subject**: [SECURITY] TidySnips Vulnerability Report
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### 📝 What to Include

- **Vulnerability Type**: (e.g., XSS, CSRF, SQL Injection)
- **Affected Components**: Backend API, Frontend, Docker config
- **Attack Vector**: How the vulnerability can be exploited
- **Impact Assessment**: Potential damage or data exposure
- **Proof of Concept**: Code or screenshots demonstrating the issue

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix Development**: Within 30 days (depending on severity)
- **Public Disclosure**: After fix is deployed and users have time to update

### 🏆 Recognition

Security researchers who responsibly disclose vulnerabilities will be:
- Credited in our security acknowledgments
- Mentioned in release notes (if desired)
- Added to our Hall of Fame

### ❌ Out of Scope

The following are considered out of scope:
- Rate limiting bypass (this is by design for development)
- Denial of Service attacks
- Physical attacks
- Social engineering

### 🛡️ Security Best Practices

When deploying TidySnips in production:

1. **Environment Variables**: Use production-grade secrets management
2. **Rate Limiting**: Enable and configure appropriate limits
3. **CORS**: Configure allowed origins properly
4. **HTTPS**: Always use HTTPS in production
5. **Container Security**: Use non-root containers (already implemented)
6. **Input Validation**: Ensure all inputs are validated (already implemented)

Thank you for helping keep TidySnips secure! 🙏

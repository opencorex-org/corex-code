# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Safety Architecture

Corex Code is designed as a local-first agent with a strict trust boundary:
- Path boundaries isolate operations to the active repository root.
- All file modifications require explicit interactive user approval.
- Secrets and environment configuration files (`.env*`, credentials) are denied by default.
- For complete security design details, refer to [docs/safety.md](../docs/safety.md).

## Reporting a Vulnerability

If you discover a security vulnerability or trust-boundary bypass in Corex Code:

1. **Do not disclose exploit details or proof-of-concept steps in public issues or pull requests.**
2. Request a private communication channel via GitHub Security Advisories or maintainer contact.
3. Include details of the affected component, environmental prerequisites, and steps to reproduce.

We will acknowledge receipt, evaluate the issue, and provide patches in coordination with the reporter.

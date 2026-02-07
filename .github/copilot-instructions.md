# Copilot Instructions

These guidelines ensure Copilot-generated code aligns with our project's standards and conventions.

## Project Overview

- This is a Web3 wallet application built with vanilla JavaScript
- Integrates with MetaMask using the `window.ethereum` API
- Handles cryptocurrency transactions and Wei/ETH conversions
- Standalone application without build tools or frameworks

## Coding Standards

- Use **vanilla JavaScript** (ES6+) - no frameworks like React or Vue
- Use **camelCase** for variables and function names
- Use **const** and **let**; avoid `var`
- Use **single quotes** for strings
- Always use **async/await** for asynchronous operations
- Handle promises with proper error handling

## Critical Practices

### BigInt Usage for Precision
- **ALWAYS use BigInt** for Wei/ETH conversions to maintain precision
- Split conversions into whole and fractional parts when needed
- Never use regular numbers for cryptocurrency amounts that could lose precision
- Example pattern from app.js:110-120, app.js:177-181

### Web3 Integration
- Use `window.ethereum` API for MetaMask integration
- Always check for MetaMask availability before operations
- Handle connection errors gracefully
- Respect user rejection of connection requests

## Architectural Guidelines

- Keep JavaScript logic in dedicated `.js` files (e.g., `app.js`)
- HTML structure in `.html` files
- Maintain separation of concerns between UI and business logic
- Use DOM manipulation methods for UI updates

## Security Considerations

- Never expose private keys or sensitive data
- Validate all user inputs before processing
- Sanitize data before displaying in the UI to prevent XSS
- Use proper error handling to avoid exposing internal details

## Error Handling

- Always use try-catch blocks for async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle MetaMask connection failures gracefully

## Documentation

- Add clear comments for complex logic, especially around Web3 operations
- Document function parameters and return values for public APIs
- Keep README.md updated with setup and usage instructions

## Prohibited Patterns

- Do NOT use regular Number types for cryptocurrency amounts
- Do NOT ignore MetaMask connection errors
- Do NOT mutate global state without proper encapsulation
- Do NOT use callbacks for new asynchronous logic (prefer async/await)

## Testing

- Test Web3 functionality with MetaMask installed
- Verify BigInt conversions maintain precision
- Test error handling for missing MetaMask
- Validate UI updates after state changes

## References

- Project repository: aosima858588-boop/viphuiyuan
- README.md for setup and usage details

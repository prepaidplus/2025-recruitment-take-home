# Prepaid Plus Recruitment Take-Home Project

Complete authentication implementation with unit and E2E tests.

## Features Implemented

- ✅ Login Page with encrypted password transmission
- ✅ Registration Page for new merchants
- ✅ Password Reset Flow (request + reset)
- ✅ Session Management with IndexedDB
- ✅ Route protection and authentication guards
- ✅ Comprehensive unit tests (Jest)
- ✅ End-to-end tests (Cypress)
- ✅ CI/CD GitHub Actions workflow


## Authentication Flow

1. **Login**: Email/password with AES-256 encryption
2. **Registration**: Merchant account creation (admin-activated)
3. **Password Reset**: Email-based reset flow
4. **Session Persistence**: IndexedDB + sessionStorage

## Testing

### Unit Tests

npm test                  # Run all unit tests
npm run test:watch        # Watch mode
npm run test:coverage  
#With coverage report

### E2E tests

npm run cypress:open      # Interactive Cypress
npm run cypress:run       # Headless Cypress
npm run test:e2e          # Full E2E test suite
npm run test:all          # All tests

### Development

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
# Course MFE

A micro-frontend application for managing and displaying programming topics and resources, built with Angular 19.2.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.18.

## Features

- **Header Component**: Top navigation and branding
- **Sidebar Component**: Navigation and filtering options
- **Topics List Component**: Display and manage programming topics
- **Pagination Component**: Navigate through paginated content
- **Topics Service**: Data management and API integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

Install dependencies:

```bash
npm install
# or
yarn install
```

### Development Server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Then open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running Tests

This project uses [Karma](https://karma-runner.github.io) and Jasmine for unit testing.

### Run tests once (for CI/CD)

```bash
npm test
```

This runs tests in headless Chrome without watch mode.

### Run tests in watch mode

```bash
npm run test:watch
```

This is useful during development - tests will re-run automatically when files change.

### Run tests with coverage

```bash
npm run test:ci
```

This generates code coverage reports in the `coverage/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/          # UI components
│   │   ├── header/          # Top navigation
│   │   ├── sidebar/         # Side navigation
│   │   ├── topics-list/     # Topics display
│   │   └── pagination/      # Pagination controls
│   ├── models/              # TypeScript interfaces and models
│   ├── services/            # Business logic and API services
│   └── app.module.ts        # Main application module
├── styles/                  # Component-specific styles
└── assets/                  # Static assets
```

## CI/CD

This project uses GitHub Actions for continuous integration. The pipeline:
- Runs on push and pull requests
- Executes unit tests with coverage
- Builds the application
- Validates code quality


## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

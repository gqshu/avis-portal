# AVIS Management System

## Project Overview

The AVIS Management System is a modern web application for managing and monitoring intelligent agents. The system provides features for task editing, agent deployment, monitoring, and analysis.

## Building and Testing Locally

### System Requirements

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Modern browser (Chrome, Firefox, Safari, Edge, etc.)

### Installation Steps

1. Clone the repository locally

\`\`\`bash
git clone https://github.com/your-organization/avis-management.git
cd avis-management
\`\`\`

2. Install dependencies

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

3. Start the development server

\`\`\`bash
npm run dev
\`\`\`

4. Access the application in your browser

Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Building for Production

To build the application for production environment, run:

\`\`\`bash
npm run build
\`\`\`

After the build is complete, you can start the production server with:

\`\`\`bash
npm start
\`\`\`

### Running Tests

Execute unit tests:

\`\`\`bash
npm test
\`\`\`

Execute end-to-end tests:

\`\`\`bash
npm run test:e2e
\`\`\`

### Project Structure

- `/app` - Next.js application routes
- `/components` - React components
- `/lib` - Utility functions and type definitions
- `/public` - Static assets

## Frequently Asked Questions

### Q: The application won't start, showing port is occupied
A: You can change the default port by setting the PORT environment variable:
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Q: How to switch languages?
A: There is a language switcher button in the top right corner of the application, supporting Chinese and English.

## Technical Support

For any questions, please contact our technical support team: support@daiming.com

© 2025 Shanghai Daiming Technology Co., Ltd.

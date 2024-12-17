# Farm Flow

## General Documentation

### Project Overview
This project involves designing and developing an application to manage a collection of farms and their associated crop productions.

### Application Demo [**https://farm-flow-pi.vercel.app**](https://farm-flow-pi.vercel.app)
![Farm Flow Demo](./public/farm-flow.gif)



### Project Overview
This project involves designing and developing an application to manage a collection of farms and their associated crop productions.

### Deployment Instructions
To deploy this project, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/paulpessoa/farm-flow
   ```
2. Navigate to the project directory:
   ```bash
   cd project-name
   ```
3. Install the necessary dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Local Development Instructions
To set up a local development environment, follow these steps:
1. Clone the repository as mentioned above.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run server
   ```
   ```bash
   npm run dev
   ```
4. The local VITE_API_URL is running at `http://localhost:3001` (Make sure to configure the appropriate environment variable, if necessary.)
5. Open your browser and navigate to `http://localhost:5173` (or the port specified in your development server logs).

### Testing Instructions
For testing, this project uses Cypress for end-to-end testing and Vitest with React Testing Library (RTL) for unit and integration tests. To run the tests, follow these steps:
1. For end-to-end testing with Cypress, open the Cypress test runner:
   ```bash
   npm cypress:open
   ```
2. Follow the prompts in the Cypress interface to select and run your tests. You can also run tests in headless mode using:
   ```bash
   npm cypress:run
   ```
3. Review the test results in the terminal or the Cypress dashboard for detailed insights on test performance and coverage.

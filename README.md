# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Automatic Deployment to Cloudflare Pages

This project is configured for automatic deployment to Cloudflare Pages using GitHub Actions. When you push changes to the `main` branch, your site will be automatically built and deployed.

### Setup Instructions

1. Create a Cloudflare Pages project:
   - Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Pages
   - Click "Create a project"
   - Choose "Connect to Git"
   - Select your repository
   - Configure your build settings:
     - Build command: `npm run build`
     - Build output directory: `build`
     - Root directory: `/` (leave as default)

2. Set up GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. To create a Cloudflare API token:
   - Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to User Profile > API Tokens
   - Click "Create Token"
   - Use the "Edit Cloudflare Workers" template or create a custom token with the following permissions:
     - Account > Cloudflare Pages > Edit
     - Zone > Zone > Read
   - Copy the token and add it as a GitHub secret

4. To find your Cloudflare Account ID:
   - Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Your Account ID is in the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`
   - Copy this ID and add it as a GitHub secret

Once these steps are completed, your site will automatically deploy whenever you push changes to the main branch.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Conference Management System Frontend

This repo organizes the frontend of a Conference Management System for Model UN conferences. It aims to allow smooth registration and administration of participants, allocation of delegations and general management of a conference.

The management system is mainly split up into three sections:

- registration: dealing with all participants and schools related data
- administration: dealing with all conference related data
- secretariat: printing and data visualization

The frontend is written with JavaScript in the Vue 3 (vue 3.5.0, vue/cli 5.0.8) and uses Vuetify (3.9.0) as the design library. It was developed with node 20.7.0 and npm 10.1.0.

## Development

Run `npm run dev` after `npm install` to serve the frontend locally in development mode. Follow the printed instructions to open it in the browser. Sometimes you my have to remove cached `node_modules` and/or `package-lock.vue` if there is a conflict.

Run Unit Tests with [Vitest](https://vitest.dev/) `npm run test:unit`. For formatting run `npm run format` and for linting `npm run lint`.

To enable pre-commit hooks, download and install them with

```bash
pip install pre-commit
pre-commit install
```

To run the hooks on all files run: `pre-commit run --all-files`

## Deployment

**Preparation**:

Make sure to include all required assets (such as images, audio, fonts) in the assets folder. They might not be under version control due to large size, privacy or ip reasons and therefore need to be copied manually.

Copy the example .env file `.env.development.local.example`, rename it to `env.production` and set the `VITE_BACKEND_URL` in `.env` file to the correct backend address for all API requests. Also adapt the backend API token.

**Building**:
Specify the `base` attribute in `vite.config.js` config (e.g. `/my/subfolder`), which can then be accessed by `import.meta.env.BASE_URL`. Specifying the base path ensures that the web app looks for files under this path and not at the root of your domain.Run `npm install` followed by `npm run build --production` in the project's root folder. This will install all required packages and build the app and place it in a `dist/` folder.

**Serving**

Lastly, copy the content of the `dist` folder into your desired serving folder under `/subfolder/of/my/domain/`, which you have specified during the preparations.

Depending on your server, you need to specify that routings from this app should be served by the index file. For apache servers for example, add something like this to your `.htaccess`:

```bash
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /subfolder/of/my/domain/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /subfolder/of/my/domain/index.html [L]
</IfModule>
```

**Connection to backend and authentication**:
As an empty frontend is boring, you might connect it to a [backend](https://github.com/model-united-nations-of-luebeck/CMS-backend). In the backend's `cms/settings.py' file you need to add the frontend URL to the`CORS_ORIGIN_WHITELIST = [...]` list, so that API requests are possible.

For the Azure authentication for organizers, you need to set the redirect urls in the App Registrations and if necessary grant access for new users.

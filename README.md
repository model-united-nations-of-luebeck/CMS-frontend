# Conference Management System Frontend

This repo organizes the frontend of a Conference Management System for Model UN conferences. It aims to allow smooth registration and administration of participants, allocation of delegations and general management of a conference.

The management system is mainly split up into three sections:

- registration: dealing with all participants and schools related data
- administration: dealing with all conference related data
- secretariat: printing and data visualization

The frontend is written with TypeScript in the Vue framework and uses Vuetify as the design library.

## Development

Run `npm run serve` after `npm install` to serve the frontend locally. Follow the printed instructions to open it in the browser. Sometimes you my have to remove cached `node_modules` and/or `package-lock.vue` if there is a conflict.

## Deployment

**Preparation**: Make sure to adapt the `publicPath` variable in the `vue.config.js` file, depending on the `NODE_END` like this:

```python
publicPath: process.env.NODE_ENV === 'production'
    ? '/subfolder/of/my/domain/'
    : '/'
```

so that in production the webapp looks for the files in the first path, whereas in development is looks at `/` which is usually fine for localhost setups.

Also make sure to include all required assets in the assets folder. They might not be under version control due to large size, privacy or ip reasons.

Set the `VUE_APP_BACKEND_URL` in `.env` file to the correct backend address for all API requests. This might be changed between development and production.

**Building**:
Run `npm install` followed by `npm run build --production` in the project's root folder. This will install all required packages and build the app and place it in a `dist/` folder. Lastly, copy the content of this folder into your desired serving folder, which you have specified during the preparations.

**Connection to backend**:
As an empty frontend is boring, you might connect it to a [backend](https://github.com/model-united-nations-of-luebeck/CMS-backend). In the backend's `cms/settings.py' file you need to add the frontend URL to the`CORS_ORIGIN_WHITELIST = [...]` list, so that API requests are possible.

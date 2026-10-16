# React + Vite

## Deployment

The Vercel configuration proxies `/api/v1/*` and `/tickets/*` to the server1
Render service. Production builds call those same-origin paths so admin and
volunteer HttpOnly cookies are not treated as third-party cookies. Keep the
Render `CLIENT_ORIGIN` allowlist set to the deployed Vercel origin, and leave
`AUTH_COOKIE_DOMAIN` unset so cookies are scoped to the Vercel host. Do not set
`VITE_SERVER1_API_URL` to the Render hostname in Vercel production environment
variables; local development may use the URL in `.env.example`.

When deploying the client, deploy the Vercel project rooted at this `client`
directory so its `vercel.json` rewrites are applied. The app also reloads once
when an open tab encounters a stale lazy-loaded chunk after a deployment.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Website Translator Angular SPA Lab

Manual integration harness for SPA routing, dynamic DOM updates, delayed content, attribute mutation, iframes, and open Shadow DOM. Existing static test pages remain separate under `pages/`.

## Run locally

From the repository root, start the widget development server:

```powershell
npm start
```

In another terminal, start the Angular application:

```powershell
npm --prefix test-apps/angular-spa start
```

Open `http://localhost:4200`. Angular proxies `/dist/widget.js` to the widget server at `http://localhost:8030`, so local widget changes can be tested without copying its implementation into this app.

## Widget configuration

Edit `src/app/widget/widget.config.ts` to change the website ID, API URL, or widget script URL. Widget loading and initialization are centralized in `src/app/widget/widget-bootstrap.service.ts`.

The app serves a mock API v3 configuration for website `72aab105-df74-4b1c-b9b4-2f374d6eff29`. It uses English as the source and exposes every other EU official language plus Russian. Translation and token requests are proxied to `https://localhost:44367/translate/website/72aab105-df74-4b1c-b9b4-2f374d6eff29`.

## Validate

```powershell
npm --prefix test-apps/angular-spa run build
```

The fixed panel displays the current Angular route, query string, component instance ID, component age, and dynamic item count. It also provides browser back/forward actions, query and route parameter navigation, and a repeated route lifecycle sequence.

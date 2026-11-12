SETUP (Cloudflare Pages)

1. Workers & Pages > KV > Create a namespace. Name it: prices
2. Workers & Pages > Create > Pages > Upload assets. Upload this whole folder (index.html, admin, _worker.js). Deploy.
3. Open the project > Settings > Bindings (or Functions) > Add > KV namespace.
   Variable name: PRICES   Namespace: prices
4. Settings > Variables and Secrets > Add. Name: ADMIN_PASSWORD  Value: a long password  Type: Secret
5. Deployments > Retry/Create a new deployment (upload the folder again) so the settings apply.

Client page:  https://YOUR-SITE.pages.dev/
Dashboard:    https://YOUR-SITE.pages.dev/admin/

If Cloudflare ignores _worker.js in the dashboard upload, deploy with Wrangler instead:
  npx wrangler pages deploy shipping-site --project-name YOUR-PROJECT

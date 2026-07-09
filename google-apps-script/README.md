# Google Sheet Responses

This script saves every Yes response from the date invitation into a private Google Sheet.

1. Create a new Google Sheet, for example `Merey Date Responses`.
2. In the Sheet, choose `Extensions` > `Apps Script`.
3. Replace the editor contents with [Code.gs](Code.gs).
4. Save, then select the `setup` function and run it once. Approve the requested Google permissions. This creates the `Responses` tab and its columns.
5. Choose `Deploy` > `New deployment` > `Web app`.
6. Set **Execute as** to **Me**. Set **Who has access** to **Anyone** so Merey can submit without signing in. If your Google account does not offer that option, use a Google account where it is available.
7. Deploy and copy the web-app URL ending in `/exec`.
8. In `valentine.js`, paste that URL here:

```js
const notificationWebhook = "PASTE_THE_EXEC_URL_HERE";
```

When Merey presses Yes, a new row appears in the `Responses` sheet. You do not need to share the Sheet with her.

Use the `/exec` URL for the website. The `/dev` test URL only works for people who can edit the script.

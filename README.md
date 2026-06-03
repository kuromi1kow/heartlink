# Date Invitation

A tiny romantic invitation page made with plain HTML, CSS, and JavaScript.

After she says yes, the page opens a clear result popup and can send the answer to you automatically if `ownerNotificationWebhook` is connected.

## Customize it

Open `index.html` and edit:

- The main question in the `h1`
- The plan, mood, and dress code cards
- The button text and confirmation messages

Open `valentine.js` and edit `moodMessages` if you want different answers after she says yes.

The social buttons are set to:

- `yourTelegramUsername = "ghinayatolla"`
- `yourInstagramUsername = "ghinayatolla"`

Instagram and Telegram profile links do not reliably pre-fill DM text from a static website, so the app copies the answer first.

## Automatic Alert

GitHub Pages is static, so it cannot secretly notify you by username alone. To receive the choice automatically, create a webhook using a service such as Make, Pipedream, Formspree, or your own small backend.

Then paste the webhook URL near the top of `valentine.js`:

```js
const ownerNotificationWebhook = "https://your-webhook-url";
```

The app sends this JSON:

```json
{
  "answer": "yes",
  "mood": "Coffee first",
  "message": "Yes, I want to go on a date. My choice: Coffee first.",
  "sentAt": "2026-06-04T00:00:00.000Z"
}
```

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload these files or push this folder with Git.
3. In the repository, go to `Settings` > `Pages`.
4. Choose the `main` branch and `/root` folder.
5. Open the GitHub Pages link GitHub gives you.

The app is static, so it does not need a build step.

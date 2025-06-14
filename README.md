# pg-threads-bot
A simple write-up to the technical details of this implementation.


## Getting the quotes

The quotes come from OpenAI Deep Research reading from Paul Graham's essays.

> Read Paul Graham's essays on his site. Find/extract 150 insights in their original words. They should be insightful and short. Remember, use the original phrases and words.

## Getting `THREADS_ACCESS_TOKEN`

You need a developer’s account at [developers.facebook.com](https://developers.facebook.com) and some rando's account.

Steps:

1. Create a new app in the Meta Developer Portal and select "Threads API" as the use case.
2. Tick the `threads_basic` and `threads_content_publish` permissions.
3. Add your account as a Threads Tester, then grant permission in the Threads Web App (Settings → Account → Website Permissions → Invites).
4. Configure Redirect Callback URLs to generate an `Access Token`. 


These `Access Token`s are the only important secrets you need to post using the name of someone.

> **Note:** Each long-term access token is valid for 60 days.

## Deploying the app on [fly.io](https://fly.io)

use `fly launch` to create the fly app. this will read the fly.toml file and create a new app.

```
? Would you like to copy its configuration to the new app? Yes
```
Say 'yes' so it can use the configurations in `fly.toml`, which is more desired than fixing these later on.

use `fly secrets set THREADS_ACCESS_TOKEN=<your-token>` to set the token for threads.

threads_access_token is the token from the user, that you use to post. You get this from Meta Developer Portal.

use `fly deploy` to deploy the app.

You can only schedule jobs with fly after the machine is deployed. With fly, you can only schedule jobs to run hourly, daily, weekly, monthly, etc. To have it run every 12 hours, you have to add some checks in your code.

To schedule a job, use `fly machine update <machine_id> --schedule hourly` to schedule it to run hourly.

To see the machine id, use `fly machine list`.

To see the logs streamed to your terminal, use `fly logs -i <machine_id>`.
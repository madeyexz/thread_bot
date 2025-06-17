# PG Threads Bot

A technical implementation guide for automatically posting pre-generated Paul Graham quotes on [Threads](https://www.threads.com).

## Overview
1. Automatically posts quotes using the Threads API.
2. The quotes are pre-generated using ChatGPT's Deep Research.
3. Deployed on [Fly.io](https://fly.io).

## Getting the Quotes

The quotes are generated using ChatGPT Deep Research with the following prompt:

> Read Paul Graham's essays on his site. Find/extract 150 insights in their original words. They should be insightful and short. Remember, use the original phrases and words. Save the quotes to a CSV file, the first column should be the title of the essay, the second column should be the quote.

Upon getting the quotes, run `extract_quotes.py` to extract the quotes into a text file.

Rename it properly, place it in the root directory of the project, then set the corresponding `<quote-file>` as `QUOTES_FILE` in `index.js`.

## Setting Up Threads API Access

To use this bot, you'll need a Threads Access Token from Meta's Developer Portal.

### Prerequisites

- Developer account at [developers.facebook.com](https://developers.facebook.com)
- Personal Threads account for testing

### Steps

1. **Create a Meta App**
   - Create a new app in the Meta Developer Portal
   - Select "Threads API" as the use case

2. **Configure Permissions**
   - Enable `threads_basic` and `threads_content_publish` permissions

3. **Add Test User**
   - Add your account as a Threads Tester
   - Grant permission in the Threads Web App: Settings → Account → Website Permissions → Invites

4. **Generate Access Token**
   - Configure Redirect Callback URLs
   - Generate your Access Token

> **Important:** Each long-term access token is valid for 60 days and must be renewed.

## Deployment on Fly.io

### Initial Setup

0. Install `flyctl`, login, and set the app name
   ```bash
   brew install flyctl
   fly auth login
   fly apps create pg-threads-bot
   ```

1. **Launch the App**
   ```bash
   fly launch
   ```
   When prompted "Would you like to copy its configuration to the new app?", select **Yes** to use the existing `fly.toml` configuration.

2. **Set Environment Variables**
   ```bash
   fly secrets set THREADS_ACCESS_TOKEN=<your-token>
   ```

3. **Deploy**
   ```bash
   fly deploy
   ```

### Scheduling

After deployment, you can schedule the bot to run automatically:

1. **Get Machine ID**
   ```bash
   fly machine list
   ```

2. **Schedule Job**
   ```bash
   fly machine update <machine_id> --schedule hourly
   ```

   > **Note:** Fly.io supports hourly, daily, weekly, and monthly schedules. For custom intervals (like every 12 hours), implement the logic in your application code.

   > **Note:** Fly ties an "hourly" schedule to the exact moment a Machine is first created, not to the top of each clock hour, and that anchor never moves. For example, if you run `fly machine run … --schedule hourly` at 10:13:39Z, the platform will auto-start the Machine around 11:13Z, 12:13Z, and so on. Manual interventions do not reset the original creation timestamp.

3. **Monitor Logs**
   ```bash
   fly logs -i <machine_id>
   ```

### Customizing Post Interval

To change the posting frequency, update the `POST_INTERVAL_HOURS` environment variable on your Fly Machine. For example, to set the interval to every 6 hours:

```bash
# Example for app 'pg-threads-bot'
fly machine update <machine_id> \\
  --app pg-threads-bot \\
  -e POST_INTERVAL_HOURS=6 \\
  --yes
```

Replace `<machine_id>` with your actual machine ID from `fly machine list`.
# PG Threads Bot

A technical implementation guide for automatically posting Paul Graham quotes to Threads.

## Overview

This bot automatically posts insightful quotes from Paul Graham's essays to Threads using the Threads API. The quotes are curated using OpenAI's Deep Research to extract meaningful insights from Paul Graham's published essays.

## Getting the Quotes

The quotes are generated using OpenAI Deep Research with the following prompt:

> Read Paul Graham's essays on his site. Find/extract 150 insights in their original words. They should be insightful and short. Remember, use the original phrases and words.

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

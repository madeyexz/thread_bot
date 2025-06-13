# Thread Bot

This project posts Paul Graham quotes to Threads on a schedule.

## Setup

1. Copy `.env.example` to `.env` and fill in your Threads API credentials.
2. Build and start the services:

```bash
docker-compose up --build
```

The app will connect to PostgreSQL, seed the quotes table, and begin posting every `POST_INTERVAL_HOURS` hours.

## Configuration

- `THREADS_ACCESS_TOKEN` – Threads API access token.
- `INSTAGRAM_USER_ID` – Instagram user ID for the Threads account.
- `POST_INTERVAL_HOURS` – How often to post (default 6).

## Database

The PostgreSQL service initializes with some example quotes. Modify `seed.sql` to add more.


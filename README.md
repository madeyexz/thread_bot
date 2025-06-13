# Thread Bot

This project automatically posts Paul Graham quotes to Threads on a scheduled basis using Docker services.

## Overview

The Thread Bot consists of:
- A Node.js application that schedules and posts quotes
- A PostgreSQL database to store quotes
- Docker containerization for easy deployment

## Prerequisites

Before starting, ensure you have:
- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed
- A Threads API access token
- Your Instagram user ID associated with your Threads account

## Quick Start

### 1. Clone and Navigate to the Project

```bash
git clone <your-repo-url>
cd thread_bot
```

### 2. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```bash
THREADS_ACCESS_TOKEN=your_actual_threads_access_token
INSTAGRAM_USER_ID=your_actual_instagram_user_id
THREADS_APP_ID=your_threads_app_id
THREADS_APP_SECRET=your_threads_app_secret
POST_INTERVAL_HOURS=6
```

### 3. Build and Start the Services

```bash
docker-compose up --build
```

This command will:
- Build the Node.js application container
- Start a PostgreSQL database container
- Seed the database with initial quotes
- Begin the automated posting schedule

### 4. Verify the Service is Running

You should see output similar to:
```
app_1  | Connected to DB. Posting every 6 hours.
app_1  | Posted quote: It's hard to do a really good job on anything you don't think about in the shower.
```

## Configuration

### Environment Variables

| Variable                | Description                                  | Required | Default |
|-------------------------|----------------------------------------------|----------|---------|
| `THREADS_ACCESS_TOKEN`  | Your Threads API access token                | Yes      | -       |
| `INSTAGRAM_USER_ID`     | Your Instagram user ID for Threads           | Yes      | -       |
| `POST_INTERVAL_HOURS`   | How often to post quotes (in hours)          | No       | 6       |
| `THREADS_APP_ID`        | Your Meta App ID (used for token debugging)  | Yes      | -       |
| `THREADS_APP_SECRET`    | Your Meta App Secret                         | Yes      | -       |
| `EXPIRY_WARN_DAYS`      | Days before expiry to emit a warning         | No       | 7       |

### Getting Your Threads API Credentials

1. **Threads Access Token**: You'll need to set up a Meta Developer account and create an app with Threads API access
2. **Instagram User ID**: This is your Instagram account's user ID that's linked to your Threads account

## Database Management

### Initial Quotes

The database is automatically seeded with sample Paul Graham quotes from `seed.sql`:
- "It's hard to do a really good job on anything you don't think about in the shower."
- "The most successful people are often the ones who take the initiative."
- "If you're not failing occasionally, you're probably not trying hard enough."

### Adding More Quotes

To add more quotes, edit the `seed.sql` file:

```sql
INSERT INTO quotes (text) VALUES
('Your new quote here'),
('Another quote here');
```

Then rebuild and restart the services:

```bash
docker-compose down
docker-compose up --build
```

### Database Access

To access the PostgreSQL database directly:

```bash
docker-compose exec db psql -U postgres -d threadbot
```

## Docker Commands

### Start Services (Detached Mode)
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f app
```

### Rebuild After Changes
```bash
docker-compose up --build
```

### Remove All Data (Including Database)
```bash
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. **"THREADS_ACCESS_TOKEN and INSTAGRAM_USER_ID must be set" Error**
   - Ensure your `.env` file exists and contains valid credentials
   - Check that there are no extra spaces or quotes around the values

2. **Database Connection Issues**
   - Wait a few seconds for the database to fully start
   - Check logs: `docker-compose logs db`

3. **Threads API Errors**
   - Verify your access token is valid and hasn't expired
   - Check that your Instagram user ID is correct
   - Review Threads API rate limits

### Checking Service Health

```bash
# Check if containers are running
docker-compose ps

# Check application logs for errors
docker-compose logs app

# Check database connectivity
docker-compose exec app node -e "console.log('DB URL:', process.env.DATABASE_URL)"
```

## Development

### File Structure
```
thread_bot/
├── src/
│   └── index.js          # Main application code
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # Node.js app container definition
├── package.json         # Node.js dependencies
├── seed.sql            # Database initialization
├── .env.example        # Environment variables template
└── README.md          # This file
```

### Making Code Changes

The application directory is mounted as a volume, so you can make changes to the code and restart just the app service:

```bash
docker-compose restart app
```

## License

This project is open source. Please ensure you comply with Threads API terms of service when using this bot.


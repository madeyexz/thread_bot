const { Client } = require('pg');
const fetch = require('node-fetch');
const cron = require('node-cron');
require('dotenv').config();

const db = new Client({ connectionString: process.env.DATABASE_URL });
const accessToken = process.env.THREADS_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;
const intervalHours = parseInt(process.env.POST_INTERVAL_HOURS || '6', 10);

if (!accessToken || !userId) {
  console.error('THREADS_ACCESS_TOKEN and INSTAGRAM_USER_ID must be set');
  process.exit(1);
}

async function postQuote() {
  try {
    const res = await db.query('SELECT text FROM quotes ORDER BY RANDOM() LIMIT 1');
    if (res.rows.length === 0) {
      console.log('No quotes found');
      return;
    }
    const quote = res.rows[0].text;
    const endpoint = `https://graph.facebook.com/v17.0/${userId}/threads`;
    const body = new URLSearchParams({
      access_token: accessToken,
      text: quote
    });
    const response = await fetch(endpoint, { method: 'POST', body });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Threads API error: ${response.status} ${text}`);
    }
    console.log('Posted quote:', quote);
  } catch (err) {
    console.error('Error posting quote', err);
  }
}

(async () => {
  await db.connect();
  console.log(`Connected to DB. Posting every ${intervalHours} hours.`);
  await postQuote();
  cron.schedule(`0 */${intervalHours} * * *`, postQuote);
})();

// Minimal Threads poster – single file, no DB
import fs from 'node:fs';
import fetch from 'node-fetch';

const QUOTES_FILE = './quotes_147.txt';
const INTERVAL_H = Number(process.env.POST_INTERVAL_HOURS || 6);
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
    console.error('❌ Env var THREADS_ACCESS_TOKEN is required.');
    process.exit(1);
}

const QUOTES = fs.readFileSync(QUOTES_FILE, 'utf8')
    .split('\n')
    .map(q => q.trim())
    .filter(Boolean);

function randomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

async function createContainer(text) {
    const r = await fetch('https://graph.threads.net/me/threads', {
        method: 'POST',
        body: new URLSearchParams({ text, media_type: 'TEXT', access_token: ACCESS_TOKEN })
    });
    if (!r.ok) {
        const responseText = await r.text();
        console.error(`❌ Create container failed: ${r.status} ${r.statusText}`);
        console.error(`❌ Response: ${responseText}`);
        throw new Error(`Create container failed: ${r.status} ${r.statusText} - ${responseText}`);
    }
    return (await r.json()).id;
}

async function publishContainer(id) {
    const r = await fetch('https://graph.threads.net/me/threads_publish', {
        method: 'POST',
        body: new URLSearchParams({ creation_id: id, access_token: ACCESS_TOKEN })
    });
    if (!r.ok) {
        const responseText = await r.text();
        console.error(`❌ Publish container failed: ${r.status} ${r.statusText}`);
        console.error(`❌ Response: ${responseText}`);
        throw new Error(`Publish container failed: ${r.status} ${r.statusText} - ${responseText}`);
    }
    return (await r.json()).id;
}

async function postOnce() {
    // Only post every 6 hours (when UTC hour is divisible by 6)
    const currentHour = new Date().getUTCHours();
    if (currentHour % INTERVAL_H !== 0) {
        console.log(`[${new Date().toISOString()}] ⏰ Skipping post - current hour ${currentHour} is not divisible by ${INTERVAL_H}`);
        return;
    }

    const quote = randomQuote();
    const containerId = await createContainer(quote);
    const postId = await publishContainer(containerId);
    console.log(`[${new Date().toISOString()}] ✅ ${postId}: ${quote}`);
}

// ------------------------------------------------------------ entry point
(async () => {
    try {
        await postOnce();
    } catch (e) {
        console.error('❌', e);
        process.exit(1);
    }
    process.exit(0);
})();
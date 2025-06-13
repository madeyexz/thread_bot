// Minimal Threads poster – single file, no DB
import fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import fetch from 'node-fetch';

const QUOTES_FILE = './quotes.txt';
const INTERVAL_H = Number(process.env.POST_INTERVAL_HOURS || 6);
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const APP_ID = process.env.THREADS_APP_ID;
const APP_SECRET = process.env.THREADS_APP_SECRET;
const APP_TOKEN = `${APP_ID}|${APP_SECRET}`;
const EXP_WARN_DAYS = Number(process.env.EXPIRY_WARN_DAYS || 7);

if (!ACCESS_TOKEN || !APP_ID || !APP_SECRET) {
    console.error('Env vars THREADS_ACCESS_TOKEN, THREADS_APP_ID, THREADS_APP_SECRET are required.');
    process.exit(1);
}

const QUOTES = fs.readFileSync(QUOTES_FILE, 'utf8')
    .split('\n')
    .map(q => q.trim())
    .filter(Boolean);

function randomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

async function debugToken() {
    const url = new URL('https://graph.threads.net/debug_token');
    url.searchParams.set('input_token', ACCESS_TOKEN);
    url.searchParams.set('access_token', APP_TOKEN);
    const r = await fetch(url);
    if (!r.ok) throw new Error(await r.text());
    return (await r.json()).data;
}

async function createContainer(text) {
    const r = await fetch('https://graph.threads.net/me/threads', {
        method: 'POST',
        body: new URLSearchParams({ text, media_type: 'TEXT', access_token: ACCESS_TOKEN })
    });
    if (!r.ok) throw new Error(await r.text());
    return (await r.json()).id;
}

async function publishContainer(id) {
    const r = await fetch('https://graph.threads.net/me/threads_publish', {
        method: 'POST',
        body: new URLSearchParams({ creation_id: id, access_token: ACCESS_TOKEN })
    });
    if (!r.ok) throw new Error(await r.text());
    return (await r.json()).id;
}

async function postOnce() {
    const quote = randomQuote();
    const containerId = await createContainer(quote);
    const postId = await publishContainer(containerId);
    console.log(`[${new Date().toISOString()}] ✅ ${postId}: ${quote}`);
}

async function loop() {
    while (true) {
        try {
            // Warn if token near expiry
            const meta = await debugToken();
            const secs = meta.expires_at - Math.floor(Date.now() / 1e3);
            if (secs < EXP_WARN_DAYS * 86400)
                console.warn(`⚠️  Token expires in ${(secs / 86400).toFixed(1)} days`);

            await postOnce();
        } catch (e) {
            console.error('❌', e.message);
        }
        await setTimeout(INTERVAL_H * 3600 * 1000);
    }
}

loop();
// Minimal Threads poster – single file, no DB
import fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import fetch from 'node-fetch';

const QUOTES_FILE = './quotes.txt';
const INTERVAL_H = Number(process.env.POST_INTERVAL_HOURS || 6);
const ACCESS_TOKEN = process.env.THREADS_ACCESS_TOKEN;
const EXP_WARN_DAYS = Number(process.env.EXPIRY_WARN_DAYS || 7);

if (!ACCESS_TOKEN) {
    console.error('Env var THREADS_ACCESS_TOKEN is required.');
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
    console.log(`🔍 Debuging token`);
    console.log(`🔑 Token length: ${ACCESS_TOKEN.length}`);
    console.log(`🔑 Token starts with: ${ACCESS_TOKEN.substring(0, 10)}...`);

    const r = await fetch('https://graph.threads.net/debug_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            input_token: ACCESS_TOKEN,
            access_token: ACCESS_TOKEN
        })
    });

    if (!r.ok) {
        const responseText = await r.text();
        console.error(`❌ Token debug failed: ${r.status} ${r.statusText}`);
        console.error(`Response: ${responseText}`);
        console.error(`Headers:`, Object.fromEntries(r.headers.entries()));
        throw new Error(`Token debug failed: ${r.status} ${r.statusText} - ${responseText}`);
    }
    console.log(`✅ Token debug successful`);
    return (await r.json()).data;
}

async function createContainer(text) {
    const r = await fetch('https://graph.threads.net/me/threads', {
        method: 'POST',
        body: new URLSearchParams({ text, media_type: 'TEXT', access_token: ACCESS_TOKEN })
    });
    if (!r.ok) {
        const responseText = await r.text();
        console.error(`❌ Create container failed: ${r.status} ${r.statusText}`);
        console.error(`Response: ${responseText}`);
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
        console.error(`Response: ${responseText}`);
        throw new Error(`Publish container failed: ${r.status} ${r.statusText} - ${responseText}`);
    }
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
            console.error('❌', e);
        }
        await setTimeout(INTERVAL_H * 3600 * 1000);
    }
}

// ------------------------------------------------------------ entry point
const ONCE = process.argv.includes('--once');

(async () => {
    if (ONCE) {
        await postOnce();
        process.exit(0);        // required for Fly scheduled jobs
    } else {
        await loop();           // original 24×7 mode
    }
})();
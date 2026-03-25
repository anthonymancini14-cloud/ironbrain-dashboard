/**
 * sync-calendar.js
 *
 * Fetches today's events from Google Calendar and updates
 * src/data/dashboard.json, then commits and pushes to GitHub
 * so Vercel auto-deploys the updated data.
 *
 * Required env vars (set on Jarvis — NOT in repo):
 *   GCAL_CLIENT_ID
 *   GCAL_CLIENT_SECRET
 *   GCAL_REFRESH_TOKEN
 *
 * Run: node scripts/sync-calendar.js
 * Schedule: Every 2 hours, 6 AM – 8 PM PT (via Windows Task Scheduler)
 * Task Registry name: ironbrain-hq-calendar-sync
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD_JSON_PATH = path.join(__dirname, '..', 'src', 'data', 'dashboard.json');

async function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GCAL_CLIENT_ID,
    process.env.GCAL_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GCAL_REFRESH_TOKEN,
  });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

async function fetchTodayEvents(calendar) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  // List all calendars
  const calListRes = await calendar.calendarList.list({ minAccessRole: 'reader' });
  const calList = calListRes.data.items || [];

  const events = [];

  for (const cal of calList) {
    try {
      const eventsRes = await calendar.events.list({
        calendarId: cal.id,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const items = eventsRes.data.items || [];
      for (const item of items) {
        if (item.status === 'cancelled') continue;
        const isAllDay = !item.start.dateTime;
        events.push({
          title: item.summary || '(No title)',
          start: item.start.dateTime || item.start.date,
          end: item.end?.dateTime || item.end?.date,
          allDay: isAllDay,
          calendar: cal.summary,
          location: item.location || null,
        });
      }
    } catch (err) {
      console.warn(`Could not fetch events for calendar "${cal.summary}": ${err.message}`);
    }
  }

  // Sort: all-day first, then by start time
  events.sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay)  return 1;
    return new Date(a.start) - new Date(b.start);
  });

  return events;
}

async function main() {
  console.log(`[ironbrain-hq-calendar-sync] Starting — ${new Date().toISOString()}`);

  // Validate env
  const required = ['GCAL_CLIENT_ID', 'GCAL_CLIENT_SECRET', 'GCAL_REFRESH_TOKEN'];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`Missing required env var: ${key}`);
      process.exit(1);
    }
  }

  // Read current dashboard.json
  const dashboard = JSON.parse(fs.readFileSync(DASHBOARD_JSON_PATH, 'utf8'));

  // Fetch events
  const calendar = await getCalendarClient();
  const events = await fetchTodayEvents(calendar);
  const todayStr = new Date().toISOString().split('T')[0];

  // Update calendar section
  dashboard.calendar = {
    date: todayStr,
    events,
  };

  // Update meta
  dashboard.meta.lastUpdated = todayStr;
  dashboard.meta.updatedBy = 'jarvis-sync';

  // Write back
  fs.writeFileSync(DASHBOARD_JSON_PATH, JSON.stringify(dashboard, null, 2) + '\n', 'utf8');
  console.log(`[sync] Updated dashboard.json — ${events.length} events for ${todayStr}`);

  // Commit and push
  try {
    const repoRoot = path.join(__dirname, '..');
    execSync('git add src/data/dashboard.json', { cwd: repoRoot, stdio: 'inherit' });
    execSync(`git commit -m "chore: sync calendar ${todayStr} [skip ci]"`, {
      cwd: repoRoot,
      stdio: 'inherit',
      env: { ...process.env, GIT_AUTHOR_NAME: 'Jarvis', GIT_AUTHOR_EMAIL: 'jarvis@ironbrain.local',
             GIT_COMMITTER_NAME: 'Jarvis', GIT_COMMITTER_EMAIL: 'jarvis@ironbrain.local' },
    });
    execSync('git push origin main', { cwd: repoRoot, stdio: 'inherit' });
    console.log('[sync] Committed and pushed — Vercel auto-deploy triggered');
  } catch (err) {
    if (err.message.includes('nothing to commit')) {
      console.log('[sync] No changes to commit — calendar unchanged');
    } else {
      console.error('[sync] Git error:', err.message);
      process.exit(1);
    }
  }

  console.log(`[ironbrain-hq-calendar-sync] Done — ${new Date().toISOString()}`);
}

main().catch(err => {
  console.error('[sync] Fatal error:', err);
  process.exit(1);
});

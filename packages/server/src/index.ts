import { existsSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { config } from 'dotenv';

config();

const settingsFile = join(process.cwd(), 'settings.json');

type Settings = Record<string, any>;
let settings: Settings = {};

if (existsSync(settingsFile)) {
  const b = readFileSync(settingsFile, 'utf8');
  settings = JSON.parse(b.toString());
}

const app = new Hono();

app.use('/api/*', cors());
app.use('/*', serveStatic({ root: '/public' }));

app.get('/hello', (c) => {
  return c.text('Hello Hono!');
});
app.get('/api/settings', (c) => c.json(settings));
app.post('/api/settings', async (c) => {
  const s = await c.req.json<Settings>();
  settings = s;
  writeFile(settingsFile, JSON.stringify(settings), 'utf8' as BufferEncoding, (err) => err && console.error(err));
  return c.text('OK');
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};

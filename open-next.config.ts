
{
  "name": "collaboration-hub",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.0.0",
    "jose": "^6.0.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "resend": "^6.0.0",
    "@opennextjs/cloudflare": "latest"
  },
  "devDependencies": {
    "wrangler": "latest"
  }
}

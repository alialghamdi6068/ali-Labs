# Ali Labs — Run and deployment setup

Ali Labs includes a same-origin Node.js server. It serves the frontend and API together, persists application data on a persistent writable disk, and keeps uploaded files under the configured data directory.

## Requirements

- Node.js 20 or newer.
- A host with persistent writable disk; do not use an ephemeral filesystem for production data.
- HTTPS in production.
- OAuth applications for GitHub, Google, and Discord.

## Run locally

1. Install Node.js 20+.
2. In the repository directory, run `npm test`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

The server creates `data-local/store.json` and `data-local/uploads/` automatically. `data-local` is ignored by Git. Set `DATA_DIR` when you want to use a mounted disk path.

## Environment variables

Keep all secrets on the host or in a secret manager. Never commit them to GitHub:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `SESSION_SECRET` — a long random secret used to hash session tokens.
- `APP_ENCRYPTION_KEY` — a long random secret used by AES-256-GCM to encrypt stored account email and biography fields.
- `PLATFORM_OWNER_EMAIL=alialghamdi6068@gmail.com` — the verified OAuth account matching this email receives the platform owner/admin role.
- `PUBLIC_BASE_URL=https://YOUR_DOMAIN` — required in production for exact OAuth callback URLs.

Register these exact callback URLs with the providers:

- GitHub: `https://YOUR_DOMAIN/api/auth/callback`
- Google: `https://YOUR_DOMAIN/api/auth/google/callback`
- Discord: `https://YOUR_DOMAIN/api/auth/discord/callback`

`PORT`, `HOST`, and `DATA_DIR` are optional runtime settings. If a provider's credentials are absent, only that provider returns a clear 503; the other configured providers continue to work.

## Persistent storage model

- `data-local/store.json`: users, sessions, projects, versions, comments, reviews, notifications, reports, audit records, and analytics.
- `data-local/uploads/quarantine/`: new uploads awaiting trusted scanning/review.
- `data-local/uploads/`: released files after they have passed the release workflow.
- Files are written using a temporary file and atomic rename.
- Ten local snapshots of `store.json` and uploaded files are rotated under `DATA_DIR/backups/snapshot-*/`.
- Account email and biography are stored as authenticated AES-256-GCM ciphertext for newly created or updated accounts.

Keep an off-host backup and test restoration before production launch. Back up the encryption key separately from the encrypted store; losing the key makes encrypted fields unrecoverable.

### Restore a local snapshot

1. Stop the Node.js process before restoring files.
2. Choose a valid `DATA_DIR/backups/snapshot-*` directory.
3. Restore its `store.json` to `DATA_DIR/store.json` and its `uploads/` directory to `DATA_DIR/uploads/`.
4. Restart the server and verify `/api/health`, project listings, authentication, and a known download.

## Account and download security

- Users sign in only through GitHub, Google, or Discord OAuth; Ali Labs never receives provider passwords.
- OAuth state is checked with timing-safe comparison, sessions are opaque random tokens, and only session-token hashes are stored.
- Approved release downloads require an authenticated session.
- New uploads remain quarantined until the trusted review/scanning workflow approves them.
- The JSON store is for a small single-instance deployment. Run exactly one server process per data directory; migrate to a transactional database for larger workloads.
- Always use HTTPS in production so cookies are Secure.
- A successful local test is not proof of production OAuth, scanner, backup, or host persistence.

## Checks

```sh
npm test
npm start
```

Verify `GET /api/health` returns a healthy response before exposing the host publicly.

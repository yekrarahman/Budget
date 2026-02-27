# Budget Pocket App

A lightweight, mobile-first budget tracker that turns your Excel budgeting workflow into an app-like experience in the browser.

## Features
- Add, edit, and delete income/expense entries.
- Automatic totals for income, expenses, and remaining balance.
- Saves data in browser `localStorage` so entries persist.
- Export entries to CSV for Excel.
- Import CSV updates back into the app when your sheet changes.
- Installable on phone (Add to Home Screen / Install App) for an app-like full-screen experience.

## Run locally
Because this is a static app, you can open `index.html` directly or run a tiny local server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## URL quick answer
- On the same computer: `http://localhost:8000`
- On your phone (same Wi-Fi): `http://<your-computer-ip>:8000` (example: `http://192.168.1.10:8000`)
- After online hosting (recommended): your HTTPS URL, for example:
  - GitHub Pages: `https://<username>.github.io/<repo>/`
  - Netlify: `https://<site-name>.netlify.app`
  - Vercel: `https://<project-name>.vercel.app`

## How to use on your phone

### Option A (quick test on same Wi-Fi)
1. Start the app on your computer:
   ```bash
   python3 -m http.server 8000 --bind 0.0.0.0
   ```
2. Find your computer's local IP (example `192.168.1.10`).
3. On your phone browser, open: `http://<your-ip>:8000`.
4. Add to home screen:
   - **Android Chrome**: menu (⋮) → **Install app** or **Add to Home screen**.
   - **iPhone Safari**: Share button → **Add to Home Screen**.

### Option B (host online, recommended)
Use one of these static hosting options so you can access your app from anywhere:

#### GitHub Pages (free)
1. Push this project to a GitHub repository.
2. On GitHub: **Settings** → **Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` (or your default branch), folder `/ (root)`
4. Click **Save** and wait ~1–2 minutes.
5. Open your published URL (for example `https://<username>.github.io/<repo>/`) on your phone.
6. Add it to Home Screen / Install App from your mobile browser menu.

#### Netlify (drag-and-drop)
1. Go to Netlify Drop: <https://app.netlify.com/drop>.
2. Drag your project folder (containing `index.html`) into the page.
3. Netlify gives you a live HTTPS URL instantly.
4. Open that URL on your phone and install/add to home screen.

#### Vercel
1. Import the GitHub repo in Vercel.
2. Framework preset: **Other** (static site).
3. Deploy with default settings.
4. Open the generated HTTPS URL on your phone and install/add to home screen.

> Note: Data is saved in your phone browser storage. If you clear browser data, reinstall the browser, or switch phones, export CSV first as a backup.

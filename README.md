# Stocker - Paper Trading Platform

Practice buying and selling stocks with **$100,000 of virtual money**. No real money involved.

| Part      | Tech                                                         |
|-----------|--------------------------------------------------------------|
| Frontend  | React 19, Vite, Material UI, Tailwind CSS, Recharts          |
| Backend   | Java 21, Spring Boot 3.5, Spring Data JPA (Hibernate)        |
| Database  | MySQL                                                        |
| Auth      | JWT (30-day tokens) + BCrypt password hashing                |
| Prices    | Yahoo Finance public chart endpoint (no API key needed)      |

**Features:** register/login, market search (unknown tickers are looked up and added automatically),
buy/sell with wallet validation, portfolio with profit/loss, watchlist, 30-day price charts,
simulated live price ticks, rule-based "AI advisor" chatbot, admin dashboard (users, all trades, stats).

```
stocker/
├── backend/    Spring Boot API   (port 5000)
└── frontend/   React app         (port 5173)
```

---

## 1. Run it on your computer

### What you need
- **JDK 21** (https://adoptium.net) - check with `java -version`
- **Node.js 18+** - check with `node -v`
- **A MySQL database** - pick ONE:
  - *Easiest:* create a free cloud MySQL on Aiven (see section 3, step 1) and use it locally too - nothing to install.
  - Or install MySQL Community Server (https://dev.mysql.com/downloads/mysql/) and keep it running on port 3306.

### Backend
```bash
cd backend
```
Set the database details as environment variables, then start the server.

**Mac / Linux**
```bash
export DB_URL="jdbc:mysql://localhost:3306/stocker?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false"
export DB_USER=root
export DB_PASSWORD=your_mysql_password
export ADMIN_EMAIL=admin@stocker.com        # optional: auto-creates an admin account
export ADMIN_PASSWORD=choose-a-password     # (min 6 characters)
./mvnw spring-boot:run
```

**Windows (PowerShell)**
```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/stocker?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false"
$env:DB_USER="root"
$env:DB_PASSWORD="your_mysql_password"
$env:ADMIN_EMAIL="admin@stocker.com"
$env:ADMIN_PASSWORD="choose-a-password"
.\mvnw.cmd spring-boot:run
```
(Using IntelliJ IDEA or VS Code? Just open the `backend` folder, set the same environment variables in the run configuration, and run `StockerApplication`.)

The first start downloads dependencies (a few minutes), creates all tables automatically, and adds starter stocks
(AAPL, GOOGL, MSFT, TSLA, AMZN, NVDA, META, NFLX). Check http://localhost:5000/api/health - it should say `{"status":"ok"}`.

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the link Vite prints (http://localhost:5173). `frontend/.env.development` already points the app at `http://localhost:5000/api`.

---

## 2. Environment variables (backend)

| Variable         | Meaning                                                              | Default (local)            |
|------------------|----------------------------------------------------------------------|----------------------------|
| `DB_URL`         | JDBC connection string                                               | local MySQL, db `stocker`  |
| `DB_USER`        | Database user                                                        | `root`                     |
| `DB_PASSWORD`    | Database password                                                    | *(empty)*                  |
| `JWT_SECRET`     | Secret used to sign login tokens. **Set a long random value when deploying.** | insecure placeholder |
| `FRONTEND_URL`   | Allowed website origin(s) for CORS, comma separated (`https://*.vercel.app` works) | localhost:5173 |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | If both set, that admin account is created/promoted on startup | *(unset)*     |
| `PORT`           | Set automatically by hosts like Render                               | `5000`                     |

Frontend: `VITE_API_URL` = the backend URL **ending in `/api`**.

No third-party API keys are needed anywhere.

---

## 3. Deploy for free (get a public link)

Free stack: **Aiven** (MySQL) + **Render** (Spring Boot API) + **Vercel** (React site).
Put the code on GitHub first (section 4).

### Step 1 - Free MySQL on Aiven
1. Sign up at https://aiven.io (no credit card) -> **Create service** -> **MySQL** -> choose the **Free** plan -> create.
2. Wait until the status is *Running*, then open the service **Overview** page and note: Host, Port, User, Password, Database name (usually `defaultdb`).
3. Your values are:
   - `DB_URL` = `jdbc:mysql://HOST:PORT/defaultdb?sslMode=REQUIRED`
   - `DB_USER` = the user shown (usually `avnadmin`)
   - `DB_PASSWORD` = the password shown
4. If the backend can't connect, check the service's *Allowed IP addresses* setting allows `0.0.0.0/0`.

### Step 2 - Backend on Render
1. https://render.com -> sign up with GitHub -> **New +** -> **Web Service** -> pick your repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime / Language:** Docker (Render finds `backend/Dockerfile`)
   - **Instance Type:** Free
   - **Health Check Path:** `/api/health`
3. Add environment variables: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (any long random string),
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `FRONTEND_URL` (put `*` for now, fix it in step 4).
4. **Create Web Service.** The first build takes several minutes. You get a URL like `https://stocker-api.onrender.com`.
   Test `https://stocker-api.onrender.com/api/health`.

> Free Render services sleep after 15 minutes without traffic; the next visit takes about a minute to wake up.

### Step 3 - Frontend on Vercel
1. https://vercel.com -> sign up with GitHub -> **Add New... -> Project** -> import the repo.
2. **Root Directory:** `frontend` (Framework preset: Vite - auto-detected).
3. **Environment Variables:** `VITE_API_URL` = `https://stocker-api.onrender.com/api` (your Render URL + `/api`).
4. **Deploy.** Your public link will look like `https://stocker-xxxx.vercel.app`.

(Netlify works too: base directory `frontend`, build command `npm run build`, publish directory `dist`.)

### Step 4 - Connect them
In Render -> your service -> **Environment**, change `FRONTEND_URL` to your Vercel link (e.g. `https://stocker-xxxx.vercel.app`) and save (it redeploys).
Open your Vercel link, register, and trade.

---

## 4. Upload to GitHub

1. Create an empty repository on https://github.com/new (name it `stocker`, don't add a README).
2. In a terminal inside the project's top folder (the one containing `backend/` and `frontend/`):
```bash
git init
git add .
git commit -m "Initial commit: Stocker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stocker.git
git push -u origin main
```
When asked to log in, use your GitHub username and a **personal access token** as the password
(GitHub -> Settings -> Developer settings -> Personal access tokens), or use GitHub Desktop.

Never commit passwords or secrets - put them in environment variables only (the `.gitignore` already excludes `.env` files).

---

## 5. Making someone an admin
- Easiest: set `ADMIN_EMAIL` + `ADMIN_PASSWORD` before the backend starts. If that email already exists it is promoted to admin.
- Or in MySQL: `UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';`

## 6. Good to know
- **Live prices:** the Market page polls `/api/stocks/live` every 3 seconds. Those ticks are simulated (stored price +/-0.1%).
  Opening a stock refreshes its price from Yahoo Finance when Yahoo is reachable.
- **Yahoo Finance** is an unofficial public endpoint. If it's slow or blocks the host, the app keeps working with stored prices and a simulated 30-day chart.
- **Free tiers:** Aiven free MySQL (1 GB) may be powered off if unused for a long time (you can switch it back on); Render free sleeps when idle.
- This is a learning project with virtual money - not financial advice.

## 7. Ideas to extend it
Limit/stop orders, leaderboard, real LLM chatbot, price alerts, news feed, portfolio-value-over-time chart, password reset.

# Frontend Dokumentasjon

Denne frontend-løsningen er en Express + EJS-app for:

- registrering/innlogging av admin
- opprettelse og håndtering av bedrifter
- registrering av elever i bedrifter brukeren eier
- sending av vurderinger til elever
- student-dashboard for visning av vurderinger

## Teknologistack

- Node.js
- Express
- EJS
- cookie-parser
- jsonwebtoken

## Prosjektstruktur

- `server.js` - oppsett av app, middleware og ruter
- `router/` - definisjon av ruter
- `controller/` - visningslogikk + API-kall
- `middleware/` - auth- og rolle-guards
- `views/` - EJS-sider + partials
- `public/css/main.css` - grunnleggende styling
- `utils/postApi.js` - hjelpefunksjon for POST mot backend
- `utils/getApi.js` - hjelpefunksjon for GET mot backend

## Miljøvariabler

Opprett `frontend/.env`:

```env
PORT=3000
BACKEND_API=http://localhost:5000/api
JWT_SECRET=your_secret_here
```

## Installer og kjør

```bash
cd frontend
npm install
npm start
```

Kjører på `http://localhost:3000`.

## Hovedruter (Frontend)

### Auth-ruter

- `GET /login-user`
- `POST /login/user`
- `GET /register`
- `POST /register/user`
- `GET /login-student`
- `POST /login/student`
- `GET /logout`

### Dashboard-ruter

- `GET /` (kun admin)
- `GET /student/dashboard` (kun elev)

### Bedrift/Admin-ruter

- `GET /bedrift/create` (kun admin)
- `POST /bedrift/create` (kun admin)
- `GET /bedrift/register-elev` (kun admin)
- `POST /bedrift/register-elev` (kun admin)
- `GET /bedrift/send-vurdering` (kun admin)
- `POST /bedrift/send-vurdering` (kun admin)

## Roller og tilgangskontroll

- `middleware/auth.js` verifiserer JWT fra cookie `token`
- `middleware/roleAuth.js` håndhever:
  - `adminOnly`
  - `studentOnly`
- Navbar i `views/partials/header.ejs` er rollebasert:
  - admin-lenker for admin
  - student-lenker for elev

## Nåværende brukerflyt

1. Admin logger inn.
2. Admin oppretter en eller flere bedrifter.
3. Admin registrerer elev i valgt bedrift han/hun eier.
4. Admin sender vurdering til en elev i valgt bedrift.
5. Elev logger inn og ser vurderinger i student-dashboard.

## Notater

- Frontend snakker med backend kun via `BACKEND_API`.
- Videresending av cookie brukes i `getApi` og `postApi` slik at backend-auth fungerer.
- Hvis rollebaserte endringer ikke slår inn med en gang, logg ut og inn igjen (ny token payload).

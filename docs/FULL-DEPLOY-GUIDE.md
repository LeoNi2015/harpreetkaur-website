# Full Deployment Guide: GitHub → GCS → GXALB → CDN

For the Harpreet Kaur personal website.

**Deployment is split into two phases:**

| Phase | When | Access |
|-------|------|--------|
| **Phase 1** (now) | Domain consent pending | `http://<new-load-balancer-ip>` |
| **Phase 2** (later) | After `harpreetkuar.net` DNS control | `https://harpreetkuar.net` |

> Google-managed SSL certificates require a domain name — HTTPS cannot be issued for a bare IP. Phase 1 uses **HTTP on port 80** only. CDN still works behind the load balancer.

Set the variables below once per terminal session, then run each section in order.

```bash
# ── Required ──────────────────────────────────────────────
export GITHUB_USER="LeoNi2015"
export REPO_NAME="harpreetkaur-website"
export PROJECT_ID="healthy-booth-186502"
export BUCKET="harpreetkaur-website-prd"          # globally unique; change if taken

# Planned domain (Phase 2 only — do not configure DNS until you have consent)
export DOMAIN="harpreetkuar.net"
export DOMAIN_WWW="www.harpreetkuar.net"

# ── Resource names ───────────────────────────────────────────
export LB_PREFIX="harpreetkaur"
export IP_NAME="${LB_PREFIX}-ip"
export BACKEND_BUCKET="${LB_PREFIX}-backend"
export URL_MAP="${LB_PREFIX}-url-map"
export SSL_CERT="${LB_PREFIX}-cert"
export HTTPS_PROXY="${LB_PREFIX}-https-proxy"
export FWD_RULE="${LB_PREFIX}-https-rule"
export HTTP_PROXY="${LB_PREFIX}-http-proxy"
export HTTP_FWD_RULE="${LB_PREFIX}-http-rule"
export HTTP_REDIRECT_MAP="${LB_PREFIX}-http-redirect"
```

---

## Part 1: Create a public GitHub repo and push code

### 1.1 Create the repository on GitHub

1. Open [https://github.com/new](https://github.com/new)
2. **Repository name**: `harpreetkaur-website`
3. **Description**: `Harpreet Kaur personal website — React + GSAP`
4. Select **Public**
5. **Do not** check "Add a README" (code already exists locally)
6. Click **Create repository**

Remote URL: `https://github.com/LeoNi2015/harpreetkaur-website.git`

### 1.2 Initialize locally and push

```bash
cd /Users/fengweini/Harpreetkaur-website

git init
git branch -M main
git add .
git commit -m "Initial commit: Harpreet Kaur personal website with GSAP"
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
git push -u origin main
```

**Authentication (choose one):**

| Method | Notes |
|--------|-------|
| **HTTPS + PAT** | GitHub → Settings → Developer settings → Personal access tokens |
| **SSH** | `git remote set-url origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git` |

### 1.3 Verify

Refresh [github.com/LeoNi2015/harpreetkaur-website](https://github.com/LeoNi2015/harpreetkaur-website). You should see `src/`, `package.json`, `docs/`, etc.

---

## Part 2: GCP prerequisites

```bash
gcloud auth login
gcloud config set project "$PROJECT_ID"
gcloud config get-value project
gcloud services enable compute.googleapis.com storage.googleapis.com
```

---

## Part 3: GCS bucket + upload static site

### 3.1 Create bucket

```bash
gcloud storage buckets create "gs://${BUCKET}" \
  --location=US \
  --uniform-bucket-level-access
```

> Bucket names are globally unique. If taken, try `harpreetkaur-site-prd-2026`.

### 3.2 Build and upload

```bash
cd /Users/fengweini/Harpreetkaur-website
export GCS_BUCKET="$BUCKET"
chmod +x scripts/deploy-gcs.sh
./scripts/deploy-gcs.sh
```

### 3.3 Verify upload

```bash
gcloud storage ls "gs://${BUCKET}/"
```

### 3.4 (Optional) Make bucket public for direct testing

Skip this when using only the load balancer. Useful before DNS/SSL is ready:

```bash
export GCS_BUCKET="$BUCKET"
chmod +x scripts/make-bucket-public.sh
./scripts/make-bucket-public.sh
```

Or via [Cloud Console](https://console.cloud.google.com/storage/browser) → bucket → **Permissions** → **Grant access** → Principal: `allUsers`, Role: **Storage Object Viewer**.

Open in browser:

- `https://storage.googleapis.com/harpreetkaur-website-prd/index.html`
- `https://storage.googleapis.com/harpreetkaur-website-prd/`

> No Cloud CDN on this URL. Revert public access before production if the bucket should stay private behind the load balancer only.

---

## Part 4: GXALB + backend bucket + CDN

### 4.1 Create backend bucket (CDN enabled)

```bash
gcloud compute backend-buckets create "$BACKEND_BUCKET" \
  --gcs-bucket-name="$BUCKET" \
  --enable-cdn
```

### 4.2 Create URL map

```bash
gcloud compute url-maps create "$URL_MAP" \
  --default-backend-bucket="$BACKEND_BUCKET"
```

### 4.3 Reserve a new global static IP

```bash
gcloud compute addresses create "$IP_NAME" --global

export LB_IP=$(gcloud compute addresses describe "$IP_NAME" --global --format='get(address)')
echo "Load balancer IP: ${LB_IP}"
```

Save `LB_IP` — this is your temporary site URL until the domain is ready.

**IP attached to a forwarding rule: $0 extra charge.**

---

## Part 5 (Phase 1): HTTP load balancer — use now

Serve the site over HTTP on the new IP. **Skip Part 6 until the domain is available.**

```bash
gcloud compute target-http-proxies create "$HTTP_PROXY" \
  --url-map="$URL_MAP"

gcloud compute forwarding-rules create "$HTTP_FWD_RULE" \
  --address="$IP_NAME" \
  --global \
  --target-http-proxy="$HTTP_PROXY" \
  --ports=80
```

---

## Part 6: Grant load balancer access to GCS (if 403)

```bash
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" \
  --member="serviceAccount:service-${PROJECT_NUMBER}@compute-system.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

---

## Part 7 (Phase 1): Verify — IP access

```bash
gcloud compute forwarding-rules list --global

export LB_IP=$(gcloud compute addresses describe "$IP_NAME" --global --format='get(address)')
curl -I "http://${LB_IP}"
```

Open `http://<LB_IP>` in a browser — you should see the GSAP portfolio site.

> Browsers may show "Not secure" — expected without HTTPS. Phase 2 adds SSL.

---

## Part 8 (Phase 2): Custom domain + HTTPS — when `harpreetkuar.net` consent is received

**Do not run until you control DNS for `harpreetkuar.net`.**

### 8.1 Configure DNS

| Type | Name | Value |
|------|------|-------|
| A | `@` | `LB_IP` from Part 4.3 |
| A | `www` | Same IP |

> If using Cloudflare, set **DNS only (grey cloud)** until the certificate is ACTIVE.

### 8.2 Create Google-managed SSL certificate

```bash
gcloud compute ssl-certificates create "$SSL_CERT" \
  --domains="${DOMAIN},${DOMAIN_WWW}" \
  --global

# Wait until ACTIVE (15–60 min)
gcloud compute ssl-certificates describe "$SSL_CERT" --global \
  --format='get(managed.status,managed.domainStatus)'
```

### 8.3 Create HTTPS proxy + forwarding rule (443)

```bash
gcloud compute target-https-proxies create "$HTTPS_PROXY" \
  --url-map="$URL_MAP" \
  --ssl-certificates="$SSL_CERT"

gcloud compute forwarding-rules create "$FWD_RULE" \
  --address="$IP_NAME" \
  --global \
  --target-https-proxy="$HTTPS_PROXY" \
  --ports=443
```

### 8.4 Switch HTTP to HTTPS redirect

Delete the Phase 1 HTTP proxy rule that served content directly, then add redirect:

```bash
# Remove Phase 1 HTTP serving rule (if it exists)
gcloud compute forwarding-rules delete "$HTTP_FWD_RULE" --global --quiet
gcloud compute target-http-proxies delete "$HTTP_PROXY" --quiet

# Create redirect URL map
gcloud compute url-maps import "$HTTP_REDIRECT_MAP" --global --source /dev/stdin <<EOF
name: ${HTTP_REDIRECT_MAP}
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
  stripQuery: false
EOF

gcloud compute target-http-proxies create "$HTTP_PROXY" \
  --url-map="$HTTP_REDIRECT_MAP"

gcloud compute forwarding-rules create "$HTTP_FWD_RULE" \
  --address="$IP_NAME" \
  --global \
  --target-http-proxy="$HTTP_PROXY" \
  --ports=80
```

### 8.5 Verify domain

```bash
curl -I "https://${DOMAIN}"
```

---

## Part 9: Routine update workflow

```bash
cd /Users/fengweini/Harpreetkaur-website

git add .
git commit -m "Update content"
git push

export GCS_BUCKET="$BUCKET"
./scripts/deploy-gcs.sh

gcloud compute url-maps invalidate-cdn-cache "$URL_MAP" --path "/*"
```

---

## Cost summary

| Item | Cost |
|------|------|
| New global IP (attached to rule) | **$0** |
| Additional forwarding rules (within 5) | **$0** extra |
| GLB base fee | ~**$18/month** (shared across rules in project) |
| GCS storage | Usually **< $1/month** |
| CDN + traffic | Usage-based |

---

## FAQ

**Q: Why no HTTPS on the IP?**  
Google-managed certificates require a domain. Use HTTP for Phase 1; add HTTPS in Phase 2.

**Q: Certificate stuck in PROVISIONING?**  
DNS A records must point to `LB_IP` with no proxy blocking validation.

**Q: Site returns 403?**  
Run Part 6 IAM binding; confirm `index.html` is at the bucket root.

**Q: Changes not visible after deploy?**  
Run `gcloud compute url-maps invalidate-cdn-cache "$URL_MAP" --path "/*"`.

---

## Resource checklist

### Phase 1 (now)

```
GitHub
  └── LeoNi2015/harpreetkaur-website (public)

GCP (healthy-booth-186502)
  ├── gs://harpreetkaur-website-prd/     ← static files
  ├── harpreetkaur-backend               ← backend bucket + CDN
  ├── harpreetkaur-url-map
  ├── harpreetkaur-ip                    ← new IP (temporary access)
  ├── harpreetkaur-http-proxy            ← serves site on :80
  └── harpreetkaur-http-rule             ← http://<IP>
```

### Phase 2 (after domain consent)

```
  ├── harpreetkaur-cert                  ← SSL for harpreetkuar.net
  ├── harpreetkaur-https-proxy
  ├── harpreetkaur-https-rule            ← :443
  ├── harpreetkaur-http-redirect         ← :80 → HTTPS
  └── DNS: harpreetkuar.net → LB IP
```

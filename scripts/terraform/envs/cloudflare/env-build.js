// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '../../../../.env.development' })
const preview = `
NEXT_PUBLIC_API_KEY_PREVIEW = "${process.env.NEXT_PUBLIC_API_KEY}"
NEXT_PUBLIC_AUTH_DOMAIN_PREVIEW = "${process.env.NEXT_PUBLIC_AUTH_DOMAIN}"
NEXT_PUBLIC_PROJECT_ID_PREVIEW = "${process.env.NEXT_PUBLIC_PROJECT_ID}"
NEXT_PUBLIC_STORAGE_BUCKET_PREVIEW = "${process.env.NEXT_PUBLIC_STORAGE_BUCKET}"
NEXT_PUBLIC_MESSAGING_SENDER_ID_PREVIEW = "${process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID}"
NEXT_PUBLIC_APP_ID_PREVIEW = "${process.env.NEXT_PUBLIC_APP_ID}"
NEXT_PUBLIC_VAPID_KEY_PREVIEW = "${process.env.NEXT_PUBLIC_VAPID_KEY}"
AUTH_SECRET_PREVIEW = "${process.env.AUTH_SECRET}"
AUTH_GOOGLE_ID_PREVIEW = "${process.env.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET_PREVIEW = "${process.env.AUTH_GOOGLE_SECRET}"
`

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '../../../../.env.production' })
const production = `
NEXT_PUBLIC_API_KEY = "${process.env.NEXT_PUBLIC_API_KEY}"
NEXT_PUBLIC_AUTH_DOMAIN = "${process.env.NEXT_PUBLIC_AUTH_DOMAIN}"
NEXT_PUBLIC_PROJECT_ID = "${process.env.NEXT_PUBLIC_PROJECT_ID}"
NEXT_PUBLIC_STORAGE_BUCKET = "${process.env.NEXT_PUBLIC_STORAGE_BUCKET}"
NEXT_PUBLIC_MESSAGING_SENDER_ID = "${process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID}"
NEXT_PUBLIC_APP_ID = "${process.env.NEXT_PUBLIC_APP_ID}"
NEXT_PUBLIC_VAPID_KEY = "${process.env.NEXT_PUBLIC_VAPID_KEY}"
AUTH_SECRET = "${process.env.AUTH_SECRET}"
AUTH_GOOGLE_ID = "${process.env.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET = "${process.env.AUTH_GOOGLE_SECRET}"
`

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')

fs.writeFileSync(
  './scripts/terraform/cloudflare/env.tfvars',
  preview + production
)

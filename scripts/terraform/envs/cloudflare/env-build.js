// eslint-disable-next-line @typescript-eslint/no-require-imports
const dev = require('dotenv').config({
  path: '../../../../.env.development'
}).parsed
const preview = `
NEXT_PUBLIC_API_KEY_PREVIEW = "${dev.NEXT_PUBLIC_API_KEY}"
NEXT_PUBLIC_AUTH_DOMAIN_PREVIEW = "${dev.NEXT_PUBLIC_AUTH_DOMAIN}"
NEXT_PUBLIC_PROJECT_ID_PREVIEW = "${dev.NEXT_PUBLIC_PROJECT_ID}"
NEXT_PUBLIC_STORAGE_BUCKET_PREVIEW = "${dev.NEXT_PUBLIC_STORAGE_BUCKET}"
NEXT_PUBLIC_MESSAGING_SENDER_ID_PREVIEW = "${dev.NEXT_PUBLIC_MESSAGING_SENDER_ID}"
NEXT_PUBLIC_APP_ID_PREVIEW = "${dev.NEXT_PUBLIC_APP_ID}"
NEXT_PUBLIC_VAPID_KEY_PREVIEW = "${dev.NEXT_PUBLIC_VAPID_KEY}"
AUTH_SECRET_PREVIEW = "${dev.AUTH_SECRET}"
AUTH_GOOGLE_ID_PREVIEW = "${dev.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET_PREVIEW = "${dev.AUTH_GOOGLE_SECRET}"
`

// eslint-disable-next-line @typescript-eslint/no-require-imports
const prod = require('dotenv').config({
  path: '../../../../.env.production'
}).parsed
const production = `
NEXT_PUBLIC_API_KEY = "${prod.NEXT_PUBLIC_API_KEY}"
NEXT_PUBLIC_AUTH_DOMAIN = "${prod.NEXT_PUBLIC_AUTH_DOMAIN}"
NEXT_PUBLIC_PROJECT_ID = "${prod.NEXT_PUBLIC_PROJECT_ID}"
NEXT_PUBLIC_STORAGE_BUCKET = "${prod.NEXT_PUBLIC_STORAGE_BUCKET}"
NEXT_PUBLIC_MESSAGING_SENDER_ID = "${prod.NEXT_PUBLIC_MESSAGING_SENDER_ID}"
NEXT_PUBLIC_APP_ID = "${prod.NEXT_PUBLIC_APP_ID}"
NEXT_PUBLIC_VAPID_KEY = "${prod.NEXT_PUBLIC_VAPID_KEY}"
AUTH_SECRET = "${prod.AUTH_SECRET}"
AUTH_GOOGLE_ID = "${prod.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET = "${prod.AUTH_GOOGLE_SECRET}"
`

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')

fs.writeFileSync('./env.tfvars', preview + production)

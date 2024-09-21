// eslint-disable-next-line @typescript-eslint/no-require-imports
const values = require('dotenv').config({
  path: `../../../../../${process.argv[2]}`
}).parsed
const env = `
NEXT_PUBLIC_API_KEY = "${values.NEXT_PUBLIC_API_KEY}"
NEXT_PUBLIC_AUTH_DOMAIN = "${values.NEXT_PUBLIC_AUTH_DOMAIN}"
NEXT_PUBLIC_PROJECT_ID = "${values.NEXT_PUBLIC_PROJECT_ID}"
NEXT_PUBLIC_STORAGE_BUCKET = "${values.NEXT_PUBLIC_STORAGE_BUCKET}"
NEXT_PUBLIC_MESSAGING_SENDER_ID = "${values.NEXT_PUBLIC_MESSAGING_SENDER_ID}"
NEXT_PUBLIC_APP_ID = "${values.NEXT_PUBLIC_APP_ID}"
NEXT_PUBLIC_VAPID_KEY = "${values.NEXT_PUBLIC_VAPID_KEY}"
AUTH_SECRET = "${values.AUTH_SECRET}"
AUTH_GOOGLE_ID = "${values.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET = "${values.AUTH_GOOGLE_SECRET}"
`

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs')
fs.writeFileSync('./env.tfvars', env)

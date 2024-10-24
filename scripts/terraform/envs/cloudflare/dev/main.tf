module "cloudflare_root" {
  source                          = "../../../modules/cloudflare"
  email                           = var.email
  api_token                       = var.api_token
  account_id                      = var.account_id
  project_name                    = var.project_name
  github_owner                    = var.github_owner
  github_repo                     = var.github_repo
  NEXT_PUBLIC_API_KEY             = var.NEXT_PUBLIC_API_KEY
  NEXT_PUBLIC_AUTH_DOMAIN         = var.NEXT_PUBLIC_AUTH_DOMAIN
  NEXT_PUBLIC_PROJECT_ID          = var.NEXT_PUBLIC_PROJECT_ID
  NEXT_PUBLIC_STORAGE_BUCKET      = var.NEXT_PUBLIC_STORAGE_BUCKET
  NEXT_PUBLIC_MESSAGING_SENDER_ID = var.NEXT_PUBLIC_MESSAGING_SENDER_ID
  NEXT_PUBLIC_APP_ID              = var.NEXT_PUBLIC_APP_ID
  NEXT_PUBLIC_VAPID_KEY           = var.NEXT_PUBLIC_VAPID_KEY
  AUTH_SECRET                     = var.AUTH_SECRET
  AUTH_GOOGLE_ID                  = var.AUTH_GOOGLE_ID
  AUTH_GOOGLE_SECRET              = var.AUTH_GOOGLE_SECRET
  production_branch               = local.production_branch
  preview_branch_includes         = local.preview_branch_includes
  NODE_VERSION                    = local.NODE_VERSION
}


resource "cloudflare_pages_project" "deployment_configs" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch
  source {
    type = "github"
    config {
      owner                         = var.github_owner
      repo_name                     = var.github_repo
      production_branch             = var.production_branch
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = var.preview_branch_includes
      preview_branch_excludes       = [var.production_branch]
    }
  }
  build_config {
    build_command   = "npm run build:cloudflare"
    destination_dir = ".vercel/output/static"
    root_dir        = ""
  }

  deployment_configs {
    preview {
      compatibility_flags = ["nodejs_compat"]
      environment_variables = {
        NEXT_PUBLIC_API_KEY             = var.NEXT_PUBLIC_API_KEY
        NEXT_PUBLIC_AUTH_DOMAIN         = var.NEXT_PUBLIC_AUTH_DOMAIN
        NEXT_PUBLIC_PROJECT_ID          = var.NEXT_PUBLIC_PROJECT_ID
        NEXT_PUBLIC_STORAGE_BUCKET      = var.NEXT_PUBLIC_STORAGE_BUCKET
        NEXT_PUBLIC_MESSAGING_SENDER_ID = var.NEXT_PUBLIC_MESSAGING_SENDER_ID
        NEXT_PUBLIC_APP_ID              = var.NEXT_PUBLIC_APP_ID
        NEXT_PUBLIC_VAPID_KEY           = var.NEXT_PUBLIC_VAPID_KEY
        NODE_VERSION                    = var.NODE_VERSION
      }
      secrets = {
        AUTH_SECRET        = var.AUTH_SECRET
        AUTH_GOOGLE_ID     = var.AUTH_GOOGLE_ID
        AUTH_GOOGLE_SECRET = var.AUTH_GOOGLE_SECRET
      }
    }

    production {
      compatibility_flags = ["nodejs_compat"]
      environment_variables = {
        NEXT_PUBLIC_API_KEY             = var.NEXT_PUBLIC_API_KEY
        NEXT_PUBLIC_AUTH_DOMAIN         = var.NEXT_PUBLIC_AUTH_DOMAIN
        NEXT_PUBLIC_PROJECT_ID          = var.NEXT_PUBLIC_PROJECT_ID
        NEXT_PUBLIC_STORAGE_BUCKET      = var.NEXT_PUBLIC_STORAGE_BUCKET
        NEXT_PUBLIC_MESSAGING_SENDER_ID = var.NEXT_PUBLIC_MESSAGING_SENDER_ID
        NEXT_PUBLIC_APP_ID              = var.NEXT_PUBLIC_APP_ID
        NEXT_PUBLIC_VAPID_KEY           = var.NEXT_PUBLIC_VAPID_KEY
        NODE_VERSION                    = var.NODE_VERSION
      }
      secrets = {
        AUTH_SECRET        = var.AUTH_SECRET
        AUTH_GOOGLE_ID     = var.AUTH_GOOGLE_ID
        AUTH_GOOGLE_SECRET = var.AUTH_GOOGLE_SECRET
      }
    }
  }
}

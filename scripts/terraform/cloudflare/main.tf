import {
  id = format("%s/%s", var.account_id, var.project_name)
  to = cloudflare_pages_project.deployment_configs
}

resource "cloudflare_pages_project" "deployment_configs" {
  account_id        = var.account_id
  name              = var.project_name
  production_branch = var.production_branch
  source {
    type = "github"
    config {
      owner                         = var.github_owner
      repo_name                     = var.github_repo
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["develop"]
      preview_branch_excludes       = [var.production_branch]
    }
  }
  build_config {
    build_command   = "npm run cloudflare:build"
    destination_dir = ".vercel/output/static"
    root_dir        = ""
  }

  deployment_configs {
    preview {
      compatibility_flags = ["nodejs_compat"]
      environment_variables = {
        NEXT_PUBLIC_API_KEY             = var.NEXT_PUBLIC_API_KEY_PREVIEW
        NEXT_PUBLIC_AUTH_DOMAIN         = var.NEXT_PUBLIC_AUTH_DOMAIN_PREVIEW
        NEXT_PUBLIC_PROJECT_ID          = var.NEXT_PUBLIC_PROJECT_ID_PREVIEW
        NEXT_PUBLIC_STORAGE_BUCKET      = var.NEXT_PUBLIC_STORAGE_BUCKET_PREVIEW
        NEXT_PUBLIC_MESSAGING_SENDER_ID = var.NEXT_PUBLIC_MESSAGING_SENDER_ID_PREVIEW
        NEXT_PUBLIC_APP_ID              = var.NEXT_PUBLIC_APP_ID_PREVIEW
        NEXT_PUBLIC_VAPID_KEY           = var.NEXT_PUBLIC_VAPID_KEY_PREVIEW
      }
      secrets = {
        AUTH_SECRET        = var.AUTH_SECRET_PREVIEW
        AUTH_GOOGLE_ID     = var.AUTH_GOOGLE_ID_PREVIEW
        AUTH_GOOGLE_SECRET = var.AUTH_GOOGLE_SECRET_PREVIEW
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
      }
      secrets = {
        AUTH_SECRET        = var.AUTH_SECRET
        AUTH_GOOGLE_ID     = var.AUTH_GOOGLE_ID
        AUTH_GOOGLE_SECRET = var.AUTH_GOOGLE_SECRET
      }
    }
  }
}

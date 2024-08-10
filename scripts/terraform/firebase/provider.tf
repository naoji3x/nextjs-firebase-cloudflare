terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

provider "google-beta" {
  # プロジェクトに関連するコストを追跡する
  user_project_override = true
  billing_project       = var.firebase_project_id
}

provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

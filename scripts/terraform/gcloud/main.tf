provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_service_account" "github_actions_admin" {
  account_id   = "github-actions-admin"
  display_name = "GitHub Actions Admin Service Account"
}

resource "google_project_iam_member" "artifact_registry_admin" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

resource "google_project_iam_member" "cloud_build_service_account" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

resource "google_project_iam_member" "cloud_runtimeconfig_admin" {
  project = var.project_id
  role    = "roles/cloudtasks.enqueuer"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

resource "google_project_iam_member" "cloud_tasks_task_executor" {
  project = var.project_id
  role    = "roles/runtimeconfig.admin"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

resource "google_project_iam_member" "firebase_admin" {
  project = var.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions_admin.email}"
}

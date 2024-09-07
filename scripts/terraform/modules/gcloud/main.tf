provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_service_account" "github_actions_sa" {
  account_id   = var.account_id
  display_name = "GitHub Actions Service Account"
  description  = "Service account for GitHub Actions"
}

# resource "google_project_iam_member" "artifact_registry_admin" {
#   project = var.project_id
#   role    = "roles/artifactregistry.repoAdmin"
#   member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
# }

resource "google_project_iam_member" "artifact_registry_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_project_iam_member" "cloud_build_service_account" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

# resource "google_project_iam_member" "cloud_tasks_task_executor" {
#   project = var.project_id
#   role    = "roles/cloudtasks.taskRunner"
#   member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
# }

resource "google_project_iam_member" "cloud_runtimeconfig_admin" {
  project = var.project_id
  role    = "roles/runtimeconfig.admin"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_project_iam_member" "firebase_admin" {
  project = var.project_id
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}

resource "google_project_iam_member" "cloud_tasks_viewer" {
  project = var.project_id
  role    = "roles/cloudtasks.viewer"
  member  = "serviceAccount:${google_service_account.github_actions_sa.email}"
}


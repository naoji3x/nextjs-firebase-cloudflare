# Creates a new Google Cloud project.
resource "google_project" "prod" {
  provider = google-beta.no_user_project_override
  org_id   = var.org_id

  # project_id should be globally unique
  project_id      = var.project_id
  name            = var.project_name
  billing_account = var.billing_account

  # Required for the project to display in any list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "prod" {
  provider = google-beta.no_user_project_override
  project  = google_project.prod.project_id
  for_each = toset([
    # example form https://zenn.dev/cloud_ace/articles/b791cce386d523
    "cloudbuild.googleapis.com",
    "firestore.googleapis.com",
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebase.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
    "cloudfunctions.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "fcmregistrations.googleapis.com",
    "fcm.googleapis.com",
    "cloudtasks.googleapis.com",
    "securetoken.googleapis.com",
    "iap.googleapis.com",
    "artifactregistry.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "prod" {
  provider = google-beta
  project  = google_project.prod.project_id

  # Waits for the required APIs to be enabled.
  depends_on = [
    google_project_service.prod,
  ]
}

# Firebase Web App
resource "google_firebase_web_app" "prod" {
  provider     = google-beta
  project      = var.project_id
  display_name = "Todo Web App"

  depends_on = [
    google_firebase_project.prod,
  ]
}

#
# Firebase Authentication
# terraformでの設定は色々難しそうだったので、Consloeから手動で設定。
#

# Firebase Firestore
resource "google_firestore_database" "prod" {
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = var.region
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"

  depends_on = [
    google_firebase_project.prod
  ]
}

# Firebase Cloud Storage

# Enable App Engine
resource "google_app_engine_application" "prod" {
  project     = var.project_id
  location_id = var.region

  depends_on = [
    google_firebase_project.prod
  ]
}

# Storage Bucket
resource "google_firebase_storage_bucket" "prod" {
  provider  = google-beta
  project   = var.project_id
  bucket_id = google_app_engine_application.prod.default_bucket
}

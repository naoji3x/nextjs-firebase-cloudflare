# Firebase
module "firebase_root" {
  source          = "../../../modules/firebase"
  billing_account = var.billing_account
  project_name    = var.project_name
  project_id      = var.project_id
  region          = var.region
}

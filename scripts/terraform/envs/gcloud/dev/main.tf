# Firebase
module "gcloud_root" {
  source     = "../../../modules/gcloud"
  project_id = var.project_id
  account_id = var.account_id
  region     = local.region
}

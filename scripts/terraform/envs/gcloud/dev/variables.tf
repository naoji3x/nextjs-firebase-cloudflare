variable "project_id" {
  description = "The ID of the project in which to create the service account."
  type        = string
}
variable "account_id" {
  description = "The service account ID to be created."
  type        = string
  default     = "github-actions-sa"
}

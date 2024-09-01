variable "billing_account" {
  description = "Google Cloud Billing Account ID for this Firebase project"
  type        = string
}

variable "org_id" {
  description = "Google Cloud Organization ID for this Firebase project"
  default     = null
  type        = string
}

variable "project_name" {
  description = "Firebase Project Name"
  type        = string
}

variable "project_id" {
  description = "Firebase Project ID (a globally unique code)"
  type        = string
}


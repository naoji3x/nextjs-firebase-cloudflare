variable "email" {
  description = "Email address for Cloudflare account"
}

variable "api_token" {
  description = "API token for Cloudflare account"
}

variable "account_id" {
  description = "Account ID for Cloudflare"
}

variable "project_name" {
  description = "Name of the Cloudflare Pages project"
}

variable "production_branch" {
  description = "Production branch to deploy from"
  default     = "main"
}

variable "github_owner" {
  description = "GitHub owner (user or organization)"
}

variable "github_repo" {
  description = "GitHub repository name"
}

variable "NEXT_PUBLIC_API_KEY" {
  description = "API key for the firebase app"
}
variable "NEXT_PUBLIC_AUTH_DOMAIN" {
  description = "Auth domain for the firebase app"
}
variable "NEXT_PUBLIC_PROJECT_ID" {
  description = "Project ID for the firebase app"
}
variable "NEXT_PUBLIC_STORAGE_BUCKET" {
  description = "Storage bucket for the firebase app"
}
variable "NEXT_PUBLIC_MESSAGING_SENDER_ID" {
  description = "Messaging sender ID for the firebase app"
}
variable "NEXT_PUBLIC_APP_ID" {
  description = "App ID for the firebase app"
}
variable "NEXT_PUBLIC_VAPID_KEY" {
  description = "VAPID key for the firebase app"
}
variable "AUTH_SECRET" {
  description = "Auth secret (next-auth) for the firebase app"
}
variable "AUTH_GOOGLE_ID" {
  description = "Google OAuth ID for the firebase app"
}
variable "AUTH_GOOGLE_SECRET" {
  description = "Google OAuth secret for the firebase app"
}

variable "NEXT_PUBLIC_API_KEY_PREVIEW" {
  description = "API key for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_AUTH_DOMAIN_PREVIEW" {
  description = "Auth domain for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_PROJECT_ID_PREVIEW" {
  description = "Project ID for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_STORAGE_BUCKET_PREVIEW" {
  description = "Storage bucket for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_MESSAGING_SENDER_ID_PREVIEW" {
  description = "Messaging sender ID for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_APP_ID_PREVIEW" {
  description = "App ID for the firebase app (Preview)"
}
variable "NEXT_PUBLIC_VAPID_KEY_PREVIEW" {
  description = "VAPID key for the firebase app (Preview)"
}
variable "AUTH_SECRET_PREVIEW" {
  description = "Auth secret (next-auth) for the firebase app (Preview)"
}
variable "AUTH_GOOGLE_ID_PREVIEW" {
  description = "Google OAuth ID for the firebase app (Preview)"
}
variable "AUTH_GOOGLE_SECRET_PREVIEW" {
  description = "Google OAuth secret for the firebase app (Preview)"
}


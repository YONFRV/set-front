provider "aws" {
  region = "us-east-1"
}

# ==========================================
# S3 — Frontend React (hosting estático temporal)
# ==========================================
resource "aws_s3_bucket" "frontend" {
  bucket        = "btg-funds-frontend-978430483844"
  force_destroy = true

  tags = { Name = "btg-funds-frontend", Environment = "dev" }
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document { suffix = "index.html" }
  error_document { key    = "index.html" }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket     = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend.arn}/*"
    }]
  })
}

# ==========================================
# OUTPUTS
# ==========================================
output "FRONTEND_URL"       { value = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}" }
output "S3_FRONTEND_BUCKET" { value = aws_s3_bucket.frontend.id }
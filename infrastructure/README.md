# ReelsCrafter Infrastructure

Docker, Kubernetes, and Terraform configurations for deploying ReelsCrafter.

## Structure
```
infrastructure/
├── docker/          # Docker Compose overrides and per-env configs
├── kubernetes/      # K8s manifests (Deployments, Services, Ingress, HPA)
└── terraform/       # Cloud infrastructure as code (GCP / AWS)
```

## Quick Start (Docker Compose — local)
```bash
# From project root
docker compose up -d
docker compose ps
```

## Kubernetes (Production)
```bash
kubectl apply -f infrastructure/kubernetes/
```

## Terraform (Cloud provisioning)
```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

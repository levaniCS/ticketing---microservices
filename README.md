# Microservices Ticketing App

## Tech stack:

#### Nodejs, Express, Typescript, mongodb, docker, kubernetes, skaffold, nginx, React/Next.js

```javascript
// Start minikube intance
minikube start

// Enable ingress-nginx on minikube
minikube addons enable ingress

// Build and listening to changes
skaffold dev


// Start Nats
// 1) get pods
k get pods

// 2) port forward
k port-forward [pods id] 4222:4222

```

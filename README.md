# Graphql-JsProj
A base project for understanding GraphQL in a JavaScript environment

You need dockerHub installed because the database runs on docker

---
Comand bash for dependencies and then testing
```
---
docker-compose up -d
npm install pg
npm install @apollo/server graphql
npm install graphql-ws ws @graphql-tools/merge
npm install graphql-subscriptions
---
npm i --install all dependencies in the package.json
npm run build
npm run dev
---

when changes on Dockerfile
docker-compose up -d --build //cambios de programacion
docker-compose down -v //inicio de base de datos desde 0
```
---

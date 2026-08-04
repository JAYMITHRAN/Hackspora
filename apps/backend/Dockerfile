FROM node:20-alpine

RUN corepack enable

WORKDIR /repo

COPY . .

RUN pnpm install --filter ai-careerpath-backend --prod

WORKDIR /repo/apps/backend

CMD ["pnpm", "start"]

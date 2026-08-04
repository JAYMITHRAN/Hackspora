FROM node:20-alpine

WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json

# Copy frontend source code
COPY apps/frontend ./apps/frontend

# Install dependencies
RUN pnpm install --no-frozen-lockfile --filter ai-careerpath-frontend...

WORKDIR /repo/apps/frontend

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV BACKEND_API_URL=http://backend:5000

RUN pnpm build

EXPOSE 3002

CMD ["pnpm", "exec", "next", "start", "-H", "0.0.0.0", "-p", "3002"]

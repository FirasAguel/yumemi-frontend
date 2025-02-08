# Build stage
FROM node:22.13.1-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm@latest

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the project to the container
COPY . .

# Build the Next.js app
RUN pnpm build

# Production image
FROM node:22.13.1-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

# Expose the app's port
EXPOSE 3000
ENV PORT=3000

# Start the Next.js production server
CMD ["node", "node_modules/next/dist/bin/next", "start"]

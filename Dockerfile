ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json .

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

ENV PORT=4000
ENV DB_PORT=5432
ENV DB_PASS=0
ENV DB_NAME=fin-track
ENV DB_USER=postgres
ENV DB_HOST=0.0.0.0
ENV JWT_ACCESS_TOKEN_SECRET=123456
ENV JWT_REFRESH_TOKEN_SECRET=654321

# Expose the port that the application listens on.
EXPOSE 4000

# Run the application.
CMD npx ts-node src/index.ts

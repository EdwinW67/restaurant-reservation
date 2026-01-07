# Base image with Chromium, Firefox, WebKit + all required libs
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Install common tools expected by VS Code Dev Containers
USER root
RUN apt-get update && apt-get install -y \
    git \
    curl \
    sudo \
    bash \
    ca-certificates \
    postgresql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Allow pwuser to use sudo (optional but convenient)
RUN echo "pwuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to the built‑in Playwright user
USER pwuser

# Set working directory
WORKDIR /workspaces

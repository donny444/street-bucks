#!/usr/bin/env bash
# =============================================================================
# Docker & Docker Compose Installation Script (Linux)
# Supports: Ubuntu/Debian, CentOS/RHEL 7, CentOS/RHEL 8+, Fedora, Arch Linux
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
info()    { echo "[INFO]  $*"; }
success() { echo "[OK]    $*"; }
warn()    { echo "[WARN]  $*"; }
error()   { echo "[ERROR] $*" >&2; exit 1; }

# -----------------------------------------------------------------------------
# 1. Root check
# -----------------------------------------------------------------------------
if [[ "${EUID}" -ne 0 ]]; then
  error "This script must be run as root. Please re-run with: sudo bash $0"
fi

info "Starting Docker installation script..."

# -----------------------------------------------------------------------------
# 2. Detect Linux distribution
# -----------------------------------------------------------------------------
if [[ ! -f /etc/os-release ]]; then
  error "Cannot detect Linux distribution: /etc/os-release not found."
fi

source /etc/os-release
DISTRO_ID="${ID:-unknown}"
DISTRO_VERSION_ID="${VERSION_ID:-0}"

info "Detected distribution: ${NAME:-$DISTRO_ID} (ID=${DISTRO_ID}, VERSION_ID=${DISTRO_VERSION_ID})"

# Normalise to a package-manager family
case "${DISTRO_ID}" in
  ubuntu | debian | raspbian | linuxmint | pop)
    PKG_FAMILY="apt"
    ;;
  centos | rhel | rocky | almalinux | ol)
    # RHEL/CentOS 7 → yum; 8+ → dnf
    MAJOR_VER="${DISTRO_VERSION_ID%%.*}"
    if [[ "${MAJOR_VER}" -ge 8 ]]; then
      PKG_FAMILY="dnf"
    else
      PKG_FAMILY="yum"
    fi
    ;;
  fedora)
    PKG_FAMILY="dnf"
    ;;
  arch | manjaro | endeavouros | garuda)
    PKG_FAMILY="pacman"
    ;;
  *)
    error "Unsupported Linux distribution: '${DISTRO_ID}'. Supported: Ubuntu/Debian, CentOS/RHEL, Fedora, Arch."
    ;;
esac

info "Package manager family: ${PKG_FAMILY}"

# -----------------------------------------------------------------------------
# 3. Detect CPU architecture
# -----------------------------------------------------------------------------
ARCH="$(uname -m)"
info "Detected CPU architecture: ${ARCH}"

case "${ARCH}" in
  x86_64)
    DOCKER_ARCH="x86_64"
    DEB_ARCH="amd64"
    RPM_ARCH="x86_64"
    ;;
  aarch64 | arm64)
    DOCKER_ARCH="aarch64"
    DEB_ARCH="arm64"
    RPM_ARCH="aarch64"
    ;;
  armv7l)
    DOCKER_ARCH="armv7"
    DEB_ARCH="armhf"
    RPM_ARCH="armhfp"
    ;;
  *)
    error "Unsupported CPU architecture: '${ARCH}'. Supported: x86_64, aarch64/arm64, armv7l."
    ;;
esac

# -----------------------------------------------------------------------------
# 4. Check if Docker is already installed
# -----------------------------------------------------------------------------
DOCKER_INSTALLED=false
if command -v docker &>/dev/null && docker --version &>/dev/null; then
  DOCKER_VER="$(docker --version)"
  success "Docker is already installed: ${DOCKER_VER}"
  DOCKER_INSTALLED=true
else
  info "Docker is not installed. Proceeding with installation..."
fi

# -----------------------------------------------------------------------------
# 5. Check if Docker Compose is already installed
# -----------------------------------------------------------------------------
COMPOSE_INSTALLED=false
if docker compose version &>/dev/null 2>&1; then
  COMPOSE_VER="$(docker compose version)"
  success "Docker Compose plugin is already installed: ${COMPOSE_VER}"
  COMPOSE_INSTALLED=true
elif command -v docker-compose &>/dev/null && docker-compose --version &>/dev/null 2>&1; then
  COMPOSE_VER="$(docker-compose --version)"
  success "Docker Compose (standalone) is already installed: ${COMPOSE_VER}"
  COMPOSE_INSTALLED=true
else
  info "Docker Compose is not installed. It will be installed alongside Docker."
fi

# -----------------------------------------------------------------------------
# 6. Install Docker Engine + Compose plugin (if needed)
# -----------------------------------------------------------------------------
if [[ "${DOCKER_INSTALLED}" == true && "${COMPOSE_INSTALLED}" == true ]]; then
  info "Both Docker and Docker Compose are already installed. Skipping installation."
else
  case "${PKG_FAMILY}" in

    # -------------------------------------------------------------------------
    apt)
      info "Installing prerequisites..."
      apt-get update -y
      apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

      info "Adding Docker's official GPG key..."
      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL "https://download.docker.com/linux/${DISTRO_ID}/gpg" \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      chmod a+r /etc/apt/keyrings/docker.gpg

      info "Adding Docker's apt repository..."
      echo \
        "deb [arch=${DEB_ARCH} signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/${DISTRO_ID} \
$(lsb_release -cs) stable" \
        | tee /etc/apt/sources.list.d/docker.list > /dev/null

      info "Installing Docker Engine and Docker Compose plugin..."
      apt-get update -y
      apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
      ;;

    # -------------------------------------------------------------------------
    yum)
      info "Installing prerequisites (yum)..."
      yum install -y yum-utils

      info "Adding Docker's yum repository..."
      yum-config-manager --add-repo \
        "https://download.docker.com/linux/centos/docker-ce.repo"

      info "Installing Docker Engine and Docker Compose plugin..."
      yum install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
      ;;

    # -------------------------------------------------------------------------
    dnf)
      info "Installing prerequisites (dnf)..."
      dnf install -y dnf-plugins-core

      info "Adding Docker's dnf repository..."
      dnf config-manager --add-repo \
        "https://download.docker.com/linux/${DISTRO_ID}/docker-ce.repo"

      info "Installing Docker Engine and Docker Compose plugin..."
      dnf install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin
      ;;

    # -------------------------------------------------------------------------
    pacman)
      info "Updating package database (pacman)..."
      pacman -Sy --noconfirm

      info "Installing Docker and Docker Compose (Arch Linux)..."
      # docker package on Arch includes the engine; docker-compose is separate
      pacman -S --noconfirm docker docker-compose
      ;;

  esac

  success "Docker Engine and Docker Compose installed successfully."
fi

# -----------------------------------------------------------------------------
# 7. Start and enable the Docker service
# -----------------------------------------------------------------------------
info "Enabling and starting the Docker service..."
if command -v systemctl &>/dev/null; then
  systemctl enable docker
  systemctl start docker
  success "Docker service is enabled and running."
else
  warn "systemctl not found. Please start the Docker service manually."
fi

# -----------------------------------------------------------------------------
# 8. Add the current (non-root) user to the docker group
# -----------------------------------------------------------------------------
REAL_USER="${SUDO_USER:-}"
if [[ -z "${REAL_USER}" || "${REAL_USER}" == "root" ]]; then
  warn "Could not determine the invoking non-root user. Skipping docker group assignment."
  warn "To run Docker without sudo, manually run: sudo usermod -aG docker <your-username>"
else
  if id -nG "${REAL_USER}" | grep -qw docker; then
    success "User '${REAL_USER}' is already in the 'docker' group."
  else
    info "Adding user '${REAL_USER}' to the 'docker' group..."
    usermod -aG docker "${REAL_USER}"
    success "User '${REAL_USER}' added to the 'docker' group."
    warn "You will need to log out and log back in (or run 'newgrp docker') for group changes to take effect."
  fi
fi

# -----------------------------------------------------------------------------
# 9. Final verification
# -----------------------------------------------------------------------------
info "Verifying installation..."
docker --version   && success "Docker:         $(docker --version)"
docker compose version && success "Docker Compose: $(docker compose version)"

echo ""
echo "============================================================"
echo "  Docker installation complete!"
echo "  If you were added to the 'docker' group, please log out"
echo "  and log back in before using Docker without sudo."
echo "============================================================"

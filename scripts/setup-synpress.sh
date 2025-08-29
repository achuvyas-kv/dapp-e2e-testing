#!/bin/bash

echo "Setting up Synpress for MetaMask testing..."

# Check if Synpress is installed
if ! command -v synpress &> /dev/null; then
    echo "Installing Synpress globally..."
    npm install -g @synthetixio/synpress
fi

# Create .env file for Synpress configuration
if [ ! -f .env ]; then
    echo "Creating .env file for Synpress configuration..."
    cat > .env << EOF
# Synpress Configuration
SYNPRESS_BASE_URL=http://localhost:3000
SYNPRESS_METAMASK_VERSION=latest
SYNPRESS_DOWNLOAD_METAMASK=true
EOF
fi

echo "Building Synpress wallet cache..."
npx synpress test/wallet-setup

echo ""
echo "Synpress setup complete!"
echo ""
echo "To run tests with MetaMask:"
echo "1. Start Hardhat network: npm run hardhat:node"
echo "2. Run MetaMask tests: npm run test:metamask:extended:headed"
echo ""
echo "Alternative commands:"
echo "- One-command setup: npm run local:test"
echo "- Basic tests: npm run test:basic"
echo "- Headless tests: npm run test:metamask:extended"
echo ""
echo "Note: First run may take longer as Synpress downloads MetaMask extension"
echo "Extended timeout tests give MetaMask more time to initialize (3 minutes)" 
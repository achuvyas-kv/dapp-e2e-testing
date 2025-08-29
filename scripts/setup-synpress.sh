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

echo "Synpress setup complete!"
echo ""
echo "To run tests with MetaMask:"
echo "1. Make sure the development server is running: npm run dev"
echo "2. Run basic tests: npm run test:basic"
echo "3. Run MetaMask tests with standard timeouts: npm run test:metamask"
echo "4. Run MetaMask tests with extended timeouts: npm run test:metamask:extended"
echo "5. For headed mode, add ':headed' to any test command"
echo ""
echo "Note: First run may take longer as Synpress downloads MetaMask extension"
echo "Extended timeout tests give MetaMask more time to initialize (3 minutes)" 
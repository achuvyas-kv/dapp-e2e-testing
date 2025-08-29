#!/bin/bash

echo "🚀 Starting Local Ethereum Network and Tests"
echo "=============================================="

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    pkill -f "hardhat node" || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start Hardhat node in background
echo "⛓️  Starting Hardhat local network..."
npx hardhat node > hardhat.log 2>&1 &
HARDHAT_PID=$!

# Wait for Hardhat to start
echo "⏳ Waiting for Hardhat network to start..."
sleep 5

# Check if Hardhat is running
if ! ps -p $HARDHAT_PID > /dev/null; then
    echo "❌ Failed to start Hardhat network"
    cat hardhat.log
    exit 1
fi

echo "✅ Hardhat network started successfully!"
echo "🌐 Network URL: http://127.0.0.1:8545"
echo "🔗 Chain ID: 1337"
echo ""

# Display account information
echo "💰 Available Accounts:"
echo "======================"
npx hardhat node --help > /dev/null 2>&1 || echo "Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)"
echo ""

# Wait a bit more for network to be fully ready
sleep 3

# Run the tests
echo "🧪 Running MetaMask tests..."
npm run test:metamask:extended:headed

# The cleanup function will handle stopping Hardhat 
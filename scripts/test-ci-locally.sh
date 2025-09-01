#!/bin/bash

echo "🧪 Testing CI Workflow Locally"
echo "==============================="

# Set environment variables like CI
export CI=true
export SEED_PHRASE="test test test test test test test test test test test junk"
export PASSWORD="Tester@1234"

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    pkill -f "hardhat node" || true
    pkill -f "vite" || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT

echo "📦 Installing dependencies..."
npm ci

echo "🏗️ Building project..."
npm run build

echo "🔧 Installing linux dependencies (if needed)..."
# sudo apt-get update
# sudo apt-get install --no-install-recommends -y xvfb

echo "⛓️ Starting Hardhat node in background..."
npm run hardhat:node > hardhat.log 2>&1 &
HARDHAT_PID=$!

# Wait for Hardhat to start
echo "⏳ Waiting 15 seconds for Hardhat network..."
sleep 15

# Check if Hardhat is running
if ! ps -p $HARDHAT_PID > /dev/null; then
    echo "❌ Failed to start Hardhat network"
    cat hardhat.log
    exit 1
fi

echo "🌐 Starting development server in background..."
npm run dev > dev.log 2>&1 &
DEV_PID=$!

# Wait for dev server
echo "⏳ Waiting 10 seconds for dev server..."
sleep 10

# Check if dev server is running
if ! ps -p $DEV_PID > /dev/null; then
    echo "❌ Failed to start dev server"
    cat dev.log
    exit 1
fi

echo "✅ Both services started successfully!"

# Test service connectivity
echo "🔍 Testing service connectivity..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server responding at http://localhost:3000"
else
    echo "❌ Dev server not responding at http://localhost:3000"
    exit 1
fi

if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null; then
    echo "✅ Hardhat node responding at http://127.0.0.1:8545"
else
    echo "❌ Hardhat node not responding at http://127.0.0.1:8545"
    exit 1
fi

echo "🏗️ Building Synpress cache..."
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run cache:build

if [ $? -eq 0 ]; then
    echo "✅ Synpress cache built successfully!"
else
    echo "❌ Failed to build Synpress cache"
    exit 1
fi

echo "🧪 Running E2E tests (simulating CI)..."
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run test:metamask:extended

if [ $? -eq 0 ]; then
    echo "✅ Tests passed! CI should work."
else
    echo "❌ Tests failed. This is why CI is failing."
    exit 1
fi

echo "🎉 Local CI simulation completed successfully!"

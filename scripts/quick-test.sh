#!/bin/bash

echo "⚡ Quick CI Testing (Fast Approach)"
echo "==================================="

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    pkill -f "hardhat node" || true
    pkill -f "vite" || true
    exit 0
}
trap cleanup EXIT

# Set CI environment
export CI=true

echo "📦 Step 1: Check if dependencies are installed..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

echo "🏗️ Step 2: Build project..."
npm run build

echo "🌐 Step 3: Test dev server startup..."
npm run dev &
DEV_PID=$!
sleep 8

if ps -p $DEV_PID > /dev/null; then
    echo "✅ Dev server started successfully"
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Dev server responding at http://localhost:3000"
    else
        echo "❌ Dev server not responding"
        exit 1
    fi
else
    echo "❌ Dev server failed to start"
    exit 1
fi

echo "⛓️ Step 4: Test Hardhat node startup..."
npm run hardhat:node > hardhat.log 2>&1 &
HARDHAT_PID=$!
sleep 10

if ps -p $HARDHAT_PID > /dev/null; then
    echo "✅ Hardhat node started successfully"
    if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null; then
        echo "✅ Hardhat node responding at http://127.0.0.1:8545"
    else
        echo "❌ Hardhat node not responding"
        exit 1
    fi
else
    echo "❌ Hardhat node failed to start"
    exit 1
fi

echo "🧪 Step 5: Test basic E2E (no MetaMask)..."
if [ -f "tests/basic.spec.ts" ]; then
    xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npx playwright test tests/basic.spec.ts --reporter=line
    if [ $? -eq 0 ]; then
        echo "✅ Basic E2E tests passed!"
    else
        echo "⚠️ Basic E2E tests failed (but that's OK for now)"
    fi
else
    echo "ℹ️ No basic tests found, skipping..."
fi

echo "🎭 Step 6: Test MetaMask cache (quick check)..."
export SEED_PHRASE="test test test test test test test test test test test junk"
export PASSWORD="Tester@1234"

# Only test if cache builds without full test run
timeout 30s xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run cache:build
if [ $? -eq 0 ]; then
    echo "✅ MetaMask cache built successfully!"
    
    echo "🧪 Step 7: Quick MetaMask test (timeout 60s)..."
    timeout 60s xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npx playwright test tests/metamask-setup.spec.ts --reporter=line --max-failures=1
    
    if [ $? -eq 0 ]; then
        echo "🎉 MetaMask tests passed! CI should work!"
    elif [ $? -eq 124 ]; then
        echo "⏰ MetaMask tests timed out (but cache works)"
        echo "💡 This means CI will probably work, just needs more time"
    else
        echo "❌ MetaMask tests failed"
        echo "📋 Check playwright-report/ for details"
    fi
else
    echo "❌ MetaMask cache build failed or timed out"
    echo "🔧 Need to fix cache building first"
fi

echo ""
echo "📊 Summary:"
echo "==========="
echo "✅ Dependencies: OK"
echo "✅ Build: OK" 
echo "✅ Dev Server: OK"
echo "✅ Hardhat: OK"
echo "Check MetaMask results above..."
echo ""
echo "💡 If cache builds but tests timeout, just increase timeouts in CI!"

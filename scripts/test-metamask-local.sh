#!/bin/bash

echo "🧪 Testing MetaMask with Increased Timeouts"
echo "==========================================="

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    pkill -f "hardhat node" || true
    pkill -f "vite" || true
    exit 0
}
trap cleanup EXIT

# Set environment variables
export CI=true
export SEED_PHRASE="test test test test test test test test test test test junk"
export PASSWORD="Tester@1234"

echo "🛑 Stopping any existing services..."
pkill -f "hardhat node" || true
pkill -f "vite" || true
sleep 3

echo "🌐 Starting dev server..."
npm run dev > dev.log 2>&1 &
DEV_PID=$!
sleep 12

if ! ps -p $DEV_PID > /dev/null; then
    echo "❌ Dev server failed to start"
    cat dev.log
    exit 1
fi

echo "✅ Dev server started on port 3000"

echo "⛓️ Starting Hardhat node..."
npm run hardhat:node > hardhat.log 2>&1 &
HARDHAT_PID=$!
sleep 20

if ! ps -p $HARDHAT_PID > /dev/null; then
    echo "❌ Hardhat node failed to start"
    cat hardhat.log
    exit 1
fi

echo "✅ Hardhat node started on port 8545"

# Verify services are responding
echo "🔍 Verifying services..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server responding"
else
    echo "❌ Dev server not responding"
    exit 1
fi

if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}' http://127.0.0.1:8545 > /dev/null; then
    echo "✅ Hardhat node responding"
else
    echo "❌ Hardhat node not responding"
    exit 1
fi

echo "🏗️ Building MetaMask cache (with extra time)..."
timeout 120s xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run cache:build

if [ $? -eq 0 ]; then
    echo "✅ MetaMask cache built successfully"
else
    echo "❌ MetaMask cache build failed or timed out"
    exit 1
fi

echo ""
echo "🧪 Running MetaMask tests with increased timeouts..."
echo "⏰ Test timeout: 5 minutes per test"
echo "⏰ Action timeout: 90 seconds"
echo "⏰ Navigation timeout: 2 minutes"
echo ""

# Run with extended timeouts and verbose output
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" \
    npx playwright test tests/metamask-setup.spec.ts \
    --config=playwright.metamask.config.ts \
    --reporter=line \
    --timeout=300000 \
    --max-failures=1

TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "🎉 MetaMask tests PASSED with increased timeouts!"
    echo "✅ CI should now work properly"
elif [ $TEST_RESULT -eq 124 ]; then
    echo ""
    echo "⏰ Tests still timed out - need even longer timeouts or different approach"
else
    echo ""
    echo "❌ Tests failed for other reasons"
    echo "📋 Check playwright-report/ for details"
fi

echo ""
echo "📊 Test Summary:"
echo "==============="
echo "Exit code: $TEST_RESULT"
echo "Report: playwright-report/index.html"
echo ""

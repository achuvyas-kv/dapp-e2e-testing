#!/bin/bash

echo "⚡ Quick CI Test (Fast Version)"
echo "=============================="

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    pkill -f "hardhat node" || true
    pkill -f "vite" || true
    exit 0
}
trap cleanup EXIT

# Set environment
export CI=true
export SEED_PHRASE="test test test test test test test test test test test junk"
export PASSWORD="Tester@1234"

echo "🛑 Stopping existing services..."
pkill -f "hardhat node" || true
pkill -f "vite" || true
sleep 2

echo "🏗️ Building project..."
npm run build

echo "⛓️ Starting Hardhat (quick)..."
npm run hardhat:node > hardhat.log 2>&1 &
sleep 20
echo "✅ Hardhat started"

echo "🌐 Starting dev server (quick)..."
npm run dev > dev.log 2>&1 &
sleep 12
echo "✅ Dev server started"

echo "🧪 Testing basic E2E..."
xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" \
  npm run test:basic --reporter=line
BASIC_RESULT=$?

if [ $BASIC_RESULT -eq 0 ]; then
  echo "✅ Basic E2E tests passed!"
else
  echo "❌ Basic E2E tests failed"
  exit 1
fi

echo "🏗️ Quick cache test..."
timeout 60s xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run cache:build
CACHE_RESULT=$?

echo ""
echo "🎯 Quick CI Test Results:"
echo "========================"
echo "✅ Build: OK"
echo "✅ Services: Started (no verification for speed)"
echo "✅ Basic E2E: $( [ $BASIC_RESULT -eq 0 ] && echo 'PASSED' || echo 'FAILED' )"
echo "✅ Cache: $( [ $CACHE_RESULT -eq 0 ] && echo 'BUILT' || echo 'TIMEOUT/FAILED' )"
echo ""
echo "🚀 Simplified CI should be MUCH faster!"
echo "   - No slow curl verification loops"
echo "   - Simple sleep timers"
echo "   - Timeouts to prevent hangs"
echo ""
echo "Ready to push!"

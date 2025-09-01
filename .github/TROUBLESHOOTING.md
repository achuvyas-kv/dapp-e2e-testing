# 🛠️ Troubleshooting Simplified CI/CD

This guide helps resolve common issues with the simplified CI/CD setup.

## 🔍 Common Issues & Solutions

### 1. "MetaMask unlock timeout" ❌
**Problem**: MetaMask takes too long to unlock in CI

**Solutions**:
- ✅ **Proper timing**: New workflow waits 15s for Hardhat, 10s for dev server
- ✅ **Simple cache build**: Uses `npm run cache:build` instead of complex commands
- ✅ **Single browser**: Only installs Chromium (faster)
- ✅ **Reliable xvfb**: Uses standard xvfb settings that work consistently

### 2. "Tests work locally but fail in CI" ❌
**Problem**: Different behavior between local and CI environments

**Solutions**:
- Check that secrets are set: `SEED_PHRASE` and `PASSWORD`
- Verify the dev server starts properly (workflow waits 10s)
- Ensure Hardhat node is running (workflow waits 15s)
- Check artifacts for detailed error logs

### 3. "Cache build fails" ❌
**Problem**: Synpress cache doesn't build properly

**Solutions**:
```yaml
# New approach (reliable):
- name: Build Synpress cache (MetaMask)
  run: |
    xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" npm run cache:build
```

**What changed**:
- Uses npm script instead of direct npx command
- Simplified xvfb arguments
- Clear environment variables

### 4. "Basic tests fail" ❌
**Problem**: Non-wallet tests don't work

**Solutions**:
- Basic tests run separately (no wallet setup needed)
- Dev server must be running (workflow handles this)
- Check if `tests/basic.spec.ts` exists and is valid

### 5. "Artifacts not uploading" ❌
**Problem**: Test reports missing

**Solutions**:
```yaml
- name: Archive Playwright report
  uses: actions/upload-artifact@v4
  if: success() || failure()  # Always upload, even on failure
  with:
    name: playwright-report-headful-metamask
    path: |
      playwright-report/
      test-results/
    if-no-files-found: warn  # Don't fail if no files
```

## 🎯 Key Improvements in New Setup

### ⚡ Faster & More Reliable
- **Single browser**: Only Chromium (not 3 browsers)
- **Proper timing**: Services start before tests run
- **Simple commands**: Uses npm scripts consistently
- **No parallel sharding**: Avoids race conditions

### 🧪 Three Test Types
```yaml
jobs:
  test-unit:          # Fast feedback
  test-e2e-basic:     # UI without wallet
  test-e2e-metamask:  # Full wallet integration
```

### 🔧 Better Error Handling
- Always uploads artifacts (even on failure)
- Clear job names for debugging
- Proper service startup timing
- Environment variables set correctly

## 📊 Debugging Workflow

### Step 1: Check Job Logs
1. Go to Actions tab in GitHub
2. Click on failed workflow run
3. Expand the failing job
4. Look for specific error messages

### Step 2: Download Artifacts
1. Scroll to bottom of workflow run page
2. Download `playwright-report-*` artifacts
3. Open `index.html` to see detailed test results
4. Check screenshots/videos of failures

### Step 3: Common Log Patterns

**✅ Good logs:**
```
✓ Hardhat node started
✓ Dev server ready
✓ Synpress cache built
✓ Tests running...
```

**❌ Problem logs:**
```
✗ Connection refused (service not ready)
✗ MetaMask extension not found
✗ Timeout waiting for selector
```

## 🚀 Local Testing Before CI

Always test locally first:

```bash
# 1. Start Hardhat
npm run hardhat:node

# 2. In another terminal, build cache
npm run cache:build

# 3. Run the tests
npm run test:metamask:extended:headed
```

If this works locally, CI should work too.

## 📞 Getting Help

If issues persist:

1. **Check the workflow logs** in detail
2. **Download and examine artifacts**
3. **Compare with local test results**
4. **Verify environment setup** (Node version, dependencies)
5. **Create GitHub issue** with:
   - Workflow run link
   - Error logs
   - Local test results

The new simplified setup should be much more reliable than the previous complex matrix approach! 🎉

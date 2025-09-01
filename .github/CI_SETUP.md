# 🚀 CI/CD Setup Guide for Synpress E2E Testing

This guide will help you set up continuous integration and deployment for your Synpress-based E2E testing project.

## 📋 Prerequisites

Before setting up CI/CD, ensure you have:

1. **GitHub Repository**: Your code is hosted on GitHub
2. **Node.js Project**: With Synpress and Playwright configured
3. **Repository Permissions**: Admin access to configure secrets and workflows

## 🔐 Required GitHub Secrets

Navigate to your repository → Settings → Secrets and variables → Actions, then add these secrets:

### Required Secrets

| Secret Name | Description | Example Value | Required |
|-------------|-------------|---------------|----------|
| `SEED_PHRASE` | Wallet seed phrase for testing | `test test test test test test test test test test test junk` | ✅ |
| `PASSWORD` | Wallet password for testing | `Tester@1234` | ✅ |

### Optional Secrets (for advanced setups)

| Secret Name | Description | Example Value | Required |
|-------------|-------------|---------------|----------|
| `INFURA_API_KEY` | Infura API key for external networks | `abc123...` | ❌ |
| `ALCHEMY_API_KEY` | Alchemy API key for external networks | `xyz789...` | ❌ |
| `PREVIEW_BASE_URL` | URL for testing staging environments | `https://staging.example.com` | ❌ |

## 📁 Workflow Files Created

The following GitHub Actions workflows have been created in `.github/workflows/`:

### 1. `ci.yml` - Main CI Pipeline
- **Triggers**: Push to main/develop, Pull requests
- **Purpose**: Automated testing on every code change
- **Features**:
  - Builds Synpress cache efficiently
  - Runs tests in parallel shards (2x faster)
  - Uploads test reports as artifacts
  - Comments on PRs with test results

### 2. `manual-testing.yml` - Manual Test Execution
- **Triggers**: Manual dispatch via GitHub UI
- **Purpose**: On-demand testing with custom parameters
- **Features**:
  - Choose specific test patterns to run
  - Select headed/headless mode
  - Pick environment (local/staging/production)
  - Detailed test summaries

### 3. `scheduled-tests.yml` - Scheduled Testing
- **Triggers**: Daily at 2 AM UTC
- **Purpose**: Regular health checks and regression testing
- **Features**:
  - Comprehensive test suite execution
  - Automatic issue creation on failures
  - Long-term artifact retention (90 days)

## 🛠️ Setting Up Secrets

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets
Click **New repository secret** and add:

```bash
# Wallet seed phrase (use a test wallet, never production!)
SEED_PHRASE="test test test test test test test test test test test junk"

# Wallet password
PASSWORD="Tester@1234"
```

### Step 3: Verify Secret Setup
Your secrets should look like this in the GitHub UI:
- ✅ `SEED_PHRASE` - Hidden value
- ✅ `PASSWORD` - Hidden value

## 🚦 Triggering Workflows

### Automatic Triggers
- **Push to main/develop**: Runs `ci.yml`
- **Pull Request**: Runs `ci.yml` with PR comments
- **Daily at 2 AM UTC**: Runs `scheduled-tests.yml`

### Manual Triggers
1. Go to **Actions** tab in your repository
2. Select **Manual E2E Testing** workflow
3. Click **Run workflow**
4. Configure parameters:
   - **Test pattern**: `tests/` (all tests) or `tests/basic.spec.ts` (specific test)
   - **Headed mode**: `false` (headless) or `true` (visible browser)
   - **Environment**: `local`, `staging`, or `production`

## 📊 Viewing Test Results

### Test Reports
After each workflow run:
1. Go to **Actions** tab
2. Click on the specific workflow run
3. Scroll down to **Artifacts** section
4. Download test reports (HTML format with screenshots/videos)

### PR Comments
For pull requests, the bot will automatically comment with:
- ✅ Test status (passed/failed)
- 📊 Summary of test results
- 🔗 Links to detailed reports

## 🔧 Workflow Features

### Performance Optimizations
- **Caching**: Node modules and Synpress cache are cached between runs
- **Parallel Execution**: Tests run in 2 shards simultaneously
- **Conditional Cache Building**: Cache only rebuilds when dependencies change

### Error Handling
- **Artifact Upload**: Always uploads results, even on failure
- **Detailed Logging**: Comprehensive logs for debugging
- **Automatic Issue Creation**: Creates GitHub issues for scheduled test failures

### Security
- **Secret Management**: Sensitive data stored in GitHub secrets
- **Default Values**: Fallback to safe defaults if secrets aren't set
- **Isolated Environments**: Each job runs in a fresh environment

## 🚨 Troubleshooting

### Common Issues

#### 1. "Synpress cache build failed"
**Solution**: Check that `SEED_PHRASE` and `PASSWORD` secrets are set correctly.

#### 2. "Tests fail intermittently"
**Solution**: 
- Check Hardhat node startup timing
- Increase wait times in tests
- Verify network connectivity

#### 3. "Browser crashes in CI"
**Solution**: The workflows use `xvfb-run` for virtual display, which is required for Synpress.

#### 4. "Artifacts not uploading"
**Solution**: Ensure the `playwright-report/` and `test-results/` directories exist after test execution.

### Debug Mode
To enable verbose logging, add this environment variable to any workflow:
```yaml
env:
  DEBUG: 'synpress:*'
```

## 📈 Best Practices

### 1. Test Organization
- Keep tests focused and atomic
- Use descriptive test names
- Group related tests in the same file

### 2. Performance
- Run critical tests first
- Use test sharding for large test suites
- Cache dependencies aggressively

### 3. Maintenance
- Review scheduled test failures promptly
- Update dependencies regularly
- Monitor test execution times

### 4. Security
- Never commit real private keys or seed phrases
- Use test networks only
- Rotate test wallet credentials regularly

## 🔄 Workflow Customization

### Adding New Environments
To add a new environment (e.g., `development`):

1. Update `manual-testing.yml`:
```yaml
environment:
  type: choice
  options:
    - local
    - staging
    - production
    - development  # Add this
```

2. Add environment-specific logic:
```yaml
- name: 🌐 Configure environment
  run: |
    if [ "${{ inputs.environment }}" = "development" ]; then
      echo "BASE_URL=https://dev.example.com" >> $GITHUB_ENV
    fi
```

### Custom Test Patterns
Modify the `test_pattern` input in `manual-testing.yml`:
```yaml
test_pattern:
  description: 'Test pattern to run'
  type: choice
  options:
    - 'tests/'
    - 'tests/basic.spec.ts'
    - 'tests/metamask-setup.spec.ts'
    - 'tests/critical/'  # Add custom patterns
```

## 📚 Additional Resources

- [Synpress Documentation](https://docs.synpress.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)

## 🆘 Support

If you encounter issues:
1. Check the workflow logs in GitHub Actions
2. Review the troubleshooting section above
3. Check test artifacts for detailed error information
4. Ensure all secrets are configured correctly

---

**Note**: This setup uses the default test wallet provided in your README. For production use, ensure you're using appropriate test credentials and never expose real private keys.

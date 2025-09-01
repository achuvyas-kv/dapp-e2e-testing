# MetaMask Dapp with Automated Testing

A React dapp with MetaMask integration and automated testing using Synpress and Playwright.

## Prerequisites

- Node.js (v16+)
- MetaMask browser extension installed

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build Synpress wallet cache (IMPORTANT - First time only)**
   ```bash
   npx synpress test/wallet-setup
   ```
   
3. **Start local Ethereum network**
   ```bash
   npm run hardhat:node
   ```

4. **In a new terminal, run the automation**
   ```bash
   npm run test:metamask:extended:headed
   ```

## Alternative Commands

- **One-command setup**: `npm run local:test`
- **Basic tests (no MetaMask)**: `npm run test:basic`
- **Headless tests**: `npm run test:metamask:extended`

## Wallet Information

The tests use a pre-configured test wallet:
- **Seed Phrase**: `test test test test test test test test test test test junk`
- **Password**: `Tester@1234`
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## What it does

- Connects MetaMask to local Hardhat network
- Signs dummy messages
- Sends 1 ETH transactions
- Runs automated tests with MetaMask integration

## 🚀 CI/CD Setup

This project includes a simplified GitHub Actions workflow for reliable automated testing:

### Quick CI/CD Setup
1. **No setup required!** The dummy test credentials are already embedded in the workflow.

2. **Automated Testing**:
   - **Unit Tests**: Fast validation
   - **Basic E2E Tests**: UI functionality without wallet
   - **MetaMask E2E Tests**: Full wallet integration
   - Runs on every push/PR to main, dev, or develop branches

3. **View Results**: Check the Actions tab for test reports and artifacts

📖 **Detailed Setup**: See [`.github/CI_SETUP.md`](.github/CI_SETUP.md) for complete configuration guide.

## Troubleshooting

- **Stuck at MetaMask setup screen**: Run `npx synpress test/wallet-setup` first
- **Tests fail**: Ensure Hardhat node is running (`npm run hardhat:node`)
- **Cache issues**: Delete `.cache-synpress` folder and rebuild with `npx synpress test/wallet-setup`
- **CI/CD issues**: Check [CI Setup Guide](.github/CI_SETUP.md#-troubleshooting)

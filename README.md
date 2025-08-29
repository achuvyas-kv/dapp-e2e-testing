# MetaMask Dapp with Automated Testing

A React dapp with MetaMask integration and automated testing using Synpress and Playwright.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start local Ethereum network**
   ```bash
   npm run hardhat:node
   ```

3. **In a new terminal, run the automation**
   ```bash
   npm run test:metamask:extended:headed
   ```

## What it does

- Connects MetaMask to local Hardhat network
- Signs dummy messages
- Sends 1 ETH transactions
- Runs automated tests with MetaMask integration # dapp-e2e-testing

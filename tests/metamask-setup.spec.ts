// Import necessary Synpress modules and setup
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../test/wallet-setup/basic.setup'

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup))

// Extract expect function from test
const { expect } = test

// Define a test case specifically for MetaMask setup and initialization
test('should setup MetaMask and connect to dapp', async ({
	context,
	page,
	metamaskPage,
	extensionId,
}) => {
	// Create a new MetaMask instance
	const metamask = new MetaMask(
		context,
		metamaskPage,
		basicSetup.walletPassword,
		extensionId
	)

	// Wait for MetaMask to fully initialize
	console.log('Setting up MetaMask...')
	await page.waitForTimeout(15000) // 15 seconds for full MetaMask setup

	// Add local Hardhat network to MetaMask
	console.log('Adding local Hardhat network...')
	await metamask.addNetwork({
		name: 'Hardhat Local',
		rpcUrl: 'http://127.0.0.1:8545',
		chainId: 1337,
		symbol: 'ETH',
		blockExplorerUrl: ''
	})
	await page.waitForTimeout(2000)

	// Switch to local network
	await metamask.switchNetwork('Hardhat Local')
	await page.waitForTimeout(2000)

	// Navigate to the dapp homepage
	console.log('Navigating to dapp...')
	await page.goto('/')

	// Wait for the page to fully load
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(3000) // Additional wait for React to render

	// Verify the page loaded correctly
	await expect(page.locator('h1')).toHaveText('MetaMask Dapp')
	await expect(page.locator('#connectButton')).toBeVisible()

	// Click the connect button
	console.log('Connecting to MetaMask...')
	await page.locator('#connectButton').click()

	// Wait for MetaMask to respond
	await page.waitForTimeout(5000)

	// Connect MetaMask to the dapp
	await metamask.connectToDapp()

	// Wait for connection to complete
	await page.waitForTimeout(3000)

	// Verify the connected account address (case insensitive)
	await expect(page.locator('#accounts')).toHaveText(
		/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/i
	)

	// Wait for wallet info to be displayed
	await expect(page.locator('.wallet-info')).toBeVisible()
	await expect(page.locator('.status.connected')).toBeVisible()

	console.log('MetaMask setup and connection successful!')
})

// Define a test case for MetaMask actions with extended timeouts
test('should perform MetaMask actions with proper timing', async ({
	context,
	page,
	metamaskPage,
	extensionId,
}) => {
	// Create a new MetaMask instance
	const metamask = new MetaMask(
		context,
		metamaskPage,
		basicSetup.walletPassword,
		extensionId
	)

	// Wait for MetaMask to initialize
	console.log('Initializing MetaMask...')
	await page.waitForTimeout(15000)

	// Add local Hardhat network to MetaMask
	console.log('Adding local Hardhat network...')
	await metamask.addNetwork({
		name: 'Hardhat Local',
		rpcUrl: 'http://127.0.0.1:8545',
		chainId: 1337,
		symbol: 'ETH',
		blockExplorerUrl: ''
	})
	await page.waitForTimeout(2000)

	// Switch to local network
	await metamask.switchNetwork('Hardhat Local')
	await page.waitForTimeout(2000)

	// Navigate to the dapp homepage
	await page.goto('/')
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(3000)

	// Connect wallet
	console.log('Clicking connect button...')
	await page.locator('#connectButton').click()
	await page.waitForTimeout(5000)
	
	console.log('Connecting MetaMask to dapp...')
	await metamask.connectToDapp()
	await page.waitForTimeout(3000)
	
	// Wait for wallet info to appear
	console.log('Waiting for wallet info...')
	await page.waitForSelector('.wallet-info', { timeout: 30000 })

	// Debug: Log what's actually displayed
	const actualAddress = await page.locator('#accounts').textContent()
	console.log('Actual address displayed:', actualAddress)
	
	// Verify connection (case insensitive)
	await expect(page.locator('#accounts')).toHaveText(
		/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/i
	)

	// Test signing a dummy message with extended timeout
	console.log('Testing message signing...')
	await page.locator('button:has-text("Sign Dummy Message")').click()
	await page.waitForTimeout(5000) // Wait longer for MetaMask popup
	await metamask.confirmSignature()
	await page.waitForTimeout(3000)

	// Verify signature was created
	await expect(page.locator('h3:has-text("Message Signed")')).toBeVisible()

	// Test sending a 1 ETH transaction with extended timeout
	console.log('Testing 1 ETH transaction sending...')
	await page.locator('button:has-text("Send 1 ETH Transaction")').click()
	await page.waitForTimeout(5000) // Wait longer for MetaMask popup
	await metamask.confirmTransaction()
	await page.waitForTimeout(5000) // Wait longer for transaction processing

	// Verify transaction was sent
	await expect(page.locator('.status:has-text("Transaction sent!")')).toBeVisible()

	console.log('All MetaMask actions completed successfully!')
}) 
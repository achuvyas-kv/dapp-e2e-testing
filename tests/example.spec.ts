// Import necessary Synpress modules and setup
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../test/wallet-setup/basic.setup'

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup))

// Extract expect function from test
const { expect } = test

// Define a test case for connecting wallet and performing dummy actions
test('should connect wallet and perform dummy actions', async ({
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

	// Wait for MetaMask to initialize (give it extra time)
	console.log('Waiting for MetaMask to initialize...')
	await page.waitForTimeout(10000) // 10 seconds for MetaMask setup

	// Navigate to the dapp homepage
	await page.goto('/')

	// Wait for the page to load
	await page.waitForLoadState('networkidle')

	// Click the connect button
	await page.locator('#connectButton').click()

	// Wait a bit for MetaMask to respond
	await page.waitForTimeout(2000)

	// Connect MetaMask to the dapp
	await metamask.connectToDapp()

	// Verify the connected account address (case insensitive)
	await expect(page.locator('#accounts')).toHaveText(
		/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/i
	)

	// Wait for wallet info to be displayed
	await expect(page.locator('.wallet-info')).toBeVisible()

	// Test signing a dummy message
	await page.locator('button:has-text("Sign Dummy Message")').click()

	// Wait for MetaMask signature popup
	await page.waitForTimeout(2000)

	// Handle MetaMask signature request
	await metamask.confirmSignature()

	// Verify signature was created
	await expect(page.locator('h3:has-text("Message Signed")')).toBeVisible()
	await expect(page.locator('.wallet-info p:has-text("Signature:")')).toBeVisible()

	// Test sending a 1 ETH transaction
	await page.locator('button:has-text("Send 1 ETH Transaction")').click()

	// Wait for MetaMask transaction popup
	await page.waitForTimeout(2000)

	// Handle MetaMask transaction request
	await metamask.confirmTransaction()

	// Verify transaction was sent (check for success message)
	await expect(page.locator('.status:has-text("Transaction sent!")')).toBeVisible()
})

// Define a test case for wallet disconnection
test('should disconnect wallet', async ({
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

	// Wait for MetaMask to initialize (give it extra time)
	console.log('Waiting for MetaMask to initialize...')
	await page.waitForTimeout(10000) // 10 seconds for MetaMask setup

	// Navigate to the dapp homepage
	await page.goto('/')

	// Connect wallet first
	await page.locator('#connectButton').click()
	await metamask.connectToDapp()

	// Verify wallet is connected (case insensitive)
	await expect(page.locator('#accounts')).toHaveText(
		/0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/i
	)

	// Disconnect wallet
	await page.locator('button:has-text("Disconnect")').click()

	// Verify wallet is disconnected
	await expect(page.locator('#connectButton')).toBeVisible()
	await expect(page.locator('.wallet-info')).not.toBeVisible()
})

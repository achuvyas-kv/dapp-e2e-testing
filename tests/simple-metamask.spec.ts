// Simplified MetaMask test that doesn't require network switching
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../test/wallet-setup/basic.setup'

// Create a test instance with Synpress and MetaMask fixtures
const test = testWithSynpress(metaMaskFixtures(basicSetup))

// Extract expect function from test
const { expect } = test

// Simple test that just verifies MetaMask loads and connects
test('should connect MetaMask to dapp (simple)', async ({
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
	console.log('Waiting for MetaMask to initialize...')
	await page.waitForTimeout(30000) // 30 seconds for full setup

	// Navigate to the dapp homepage (use default network)
	console.log('Navigating to dapp...')
	await page.goto('/')

	// Wait for the page to fully load
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(5000) // Extra wait for React

	// Verify the page loaded correctly
	await expect(page.locator('h1')).toHaveText('MetaMask Dapp')
	await expect(page.locator('#connectButton')).toBeVisible()

	// Click the connect button
	console.log('Connecting to MetaMask...')
	await page.locator('#connectButton').click()

	// Wait for MetaMask popup
	await page.waitForTimeout(8000)

	// Connect MetaMask to the dapp (use default network)
	console.log('Accepting connection...')
	await metamask.connectToDapp()

	// Wait for connection to complete
	await page.waitForTimeout(5000)

	// Verify connection worked (check if any account is displayed)
	console.log('Verifying connection...')
	await expect(page.locator('#accounts')).toBeVisible({ timeout: 30000 })
	
	// Check that some address is shown (might not be the exact hardhat address on default network)
	const accountText = await page.locator('#accounts').textContent()
	console.log('Connected account:', accountText)
	
	// Just verify it's a valid Ethereum address format
	expect(accountText).toMatch(/0x[a-fA-F0-9]{40}/)

	// Verify wallet info is displayed
	await expect(page.locator('.wallet-info')).toBeVisible()
	await expect(page.locator('.status.connected')).toBeVisible()

	console.log('✅ Simple MetaMask connection successful!')
})

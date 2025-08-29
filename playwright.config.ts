// Import necessary Playwright and Synpress modules
import { defineConfig, devices } from '@playwright/test'

// Define Playwright configuration
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	// Increase timeout for MetaMask initialization
	timeout: 120000, // 2 minutes
	expect: {
		timeout: 30000, // 30 seconds for assertions
	},
	use: {
		// Set base URL for tests
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
		// Increase action timeout
		actionTimeout: 30000,
		navigationTimeout: 60000,
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	// Additional Synpress-specific configuration can be added here
})

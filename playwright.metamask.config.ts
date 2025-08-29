// Import necessary Playwright and Synpress modules
import { defineConfig, devices } from '@playwright/test'

// Define Playwright configuration specifically for MetaMask tests
export default defineConfig({
	testDir: './tests',
	fullyParallel: false, // Disable parallel execution for MetaMask tests
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: 1, // Use only 1 worker for MetaMask tests
	reporter: 'html',
	// Extended timeout for MetaMask initialization
	timeout: 180000, // 3 minutes
	expect: {
		timeout: 60000, // 1 minute for assertions
	},
	use: {
		// Set base URL for tests
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry',
		// Extended action timeouts
		actionTimeout: 60000,
		navigationTimeout: 90000,
	},
	projects: [
		{
			name: 'chromium',
			use: { 
				...devices['Desktop Chrome'],
				// Additional browser options for MetaMask
				viewport: { width: 1280, height: 720 },
			},
		},
	],
	// Additional Synpress-specific configuration
	globalSetup: undefined, // Let Synpress handle setup
	globalTeardown: undefined, // Let Synpress handle teardown
}) 
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
		// Set base URL for tests (can be overridden by environment variables)
		baseURL: process.env.BASE_URL || 'http://localhost:3000',
		trace: 'on-first-retry',
		// Increase action timeout
		actionTimeout: 30000,
		navigationTimeout: 60000,
		// Enable screenshots and videos for CI
		screenshot: process.env.CI ? 'only-on-failure' : 'off',
		video: process.env.CI ? 'retain-on-failure' : 'off',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],
	// Additional Synpress-specific configuration can be added here
})

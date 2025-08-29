import { test, expect } from '@playwright/test'

test('should load the dapp homepage', async ({ page }) => {
  // Navigate to the dapp homepage
  await page.goto('/')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Verify the main elements are present
  await expect(page.locator('h1')).toHaveText('MetaMask Dapp')
  await expect(page.locator('#connectButton')).toBeVisible()
  await expect(page.locator('button:has-text("Connect MetaMask")')).toBeVisible()
})

test('should show MetaMask not installed message when ethereum is not available', async ({ page }) => {
  // Navigate to the dapp homepage
  await page.goto('/')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Verify the connect button is disabled and shows appropriate message
  await expect(page.locator('#connectButton')).toBeDisabled()
  await expect(page.locator('p:has-text("Please install MetaMask")')).toBeVisible()
}) 
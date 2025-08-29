import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'

async function initSynpressCache() {
  console.log('🔧 Initializing Synpress cache...')
  
  try {
    // Create a simple browser context to trigger cache creation
    const browser = await chromium.launch({
      headless: false,
      args: [
        '--disable-extensions-except=./.cache-synpress/metamask-chrome-11.9.1',
        '--load-extension=./.cache-synpress/metamask-chrome-11.9.1'
      ]
    })
    
    const context = await browser.newContext()
    const page = await context.newPage()
    
    // Navigate to a simple page to trigger extension loading
    await page.goto('http://localhost:3000')
    await page.waitForTimeout(5000)
    
    console.log('✅ Synpress cache initialization completed')
    
    await browser.close()
  } catch (error) {
    console.error('❌ Error initializing cache:', error.message)
    console.log('💡 Try running: npm run test:metamask:extended:headed')
  }
}

initSynpressCache() 
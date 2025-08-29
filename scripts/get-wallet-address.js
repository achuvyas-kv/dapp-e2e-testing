import { ethers } from 'ethers'

// The same seed phrase used in the test setup
const SEED_PHRASE = 'test test test test test test test test test test test junk'

function getWalletAddress() {
  try {
    // Create a wallet from the seed phrase
    const wallet = ethers.Wallet.fromPhrase(SEED_PHRASE)
    
    console.log('🔑 Wallet Information:')
    console.log('========================')
    console.log(`📝 Seed Phrase: ${SEED_PHRASE}`)
    console.log(`📍 Address: ${wallet.address}`)
    console.log(`🔐 Private Key: ${wallet.privateKey}`)
    console.log('')
    console.log('💰 To fund this wallet on Sepolia:')
    console.log('1. Go to https://sepoliafaucet.com/')
    console.log('2. Enter the address above')
    console.log('3. Request Sepolia ETH')
    console.log('')
    console.log('🌐 Network: Sepolia Testnet')
    console.log('🔗 RPC URL: https://sepolia.infura.io/v3/YOUR-PROJECT-ID')
    console.log('🔗 Explorer: https://sepolia.etherscan.io/')
    
    return wallet.address
  } catch (error) {
    console.error('Error generating wallet address:', error.message)
    return null
  }
}

// Run the function
getWalletAddress() 
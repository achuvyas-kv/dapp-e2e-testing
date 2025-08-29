import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface WalletState {
  isConnected: boolean
  account: string | null
  chainId: string | null
  balance: string | null
}

function App() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    balance: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed!')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Request account access
      const accounts = await provider.send('eth_requestAccounts', [])
      const account = accounts[0]
      
      // Get network info
      const network = await provider.getNetwork()
      const chainId = network.chainId.toString()
      
      // Get balance
      const balance = await provider.getBalance(account)
      const balanceInEth = ethers.formatEther(balance)

      setWalletState({
        isConnected: true,
        account,
        chainId,
        balance: balanceInEth
      })

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletState({
            isConnected: false,
            account: null,
            chainId: null,
            balance: null
          })
        } else {
          setWalletState(prev => ({ ...prev, account: accounts[0] }))
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setWalletState(prev => ({ ...prev, chainId }))
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  // Sign a dummy message
  const signDummyMessage = async () => {
    if (!walletState.isConnected || !walletState.account) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const message = "Hello from MetaMask Dapp! This is a dummy message for testing purposes."
      const signature = await signer.signMessage(message)
      
      setSignature(signature)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign message')
    } finally {
      setIsLoading(false)
    }
  }

  	// Send a dummy transaction (1 ETH to self)
	const sendDummyTransaction = async () => {
		if (!walletState.isConnected || !walletState.account) {
			setError('Please connect your wallet first')
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const provider = new ethers.BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()
			
			const tx = await signer.sendTransaction({
				to: walletState.account,
				value: ethers.parseEther('1')
			})
			
			setError(`Transaction sent! Hash: ${tx.hash}`)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send transaction')
		} finally {
			setIsLoading(false)
		}
	}

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      account: null,
      chainId: null,
      balance: null
    })
    setSignature(null)
    setError(null)
  }

  return (
    <div className="card">
      <h1>MetaMask Dapp</h1>
      <p>Connect your wallet and perform dummy actions</p>

      {error && (
        <div className="status disconnected">
          Error: {error}
        </div>
      )}

      {!walletState.isConnected ? (
        <div>
          <button 
            id="connectButton"
            onClick={connectWallet} 
            disabled={isLoading || !isMetaMaskInstalled()}
          >
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          {!isMetaMaskInstalled() && (
            <p>Please install MetaMask to use this dapp</p>
          )}
        </div>
      ) : (
        <div>
          <div className="wallet-info">
            <h3>Wallet Connected</h3>
            <p><strong>Account:</strong> <span id="accounts">{walletState.account}</span></p>
            <p><strong>Chain ID:</strong> {walletState.chainId}</p>
            <p><strong>Balance:</strong> {walletState.balance} ETH</p>
            <div className="status connected">Connected</div>
          </div>

          <div>
            <button 
              onClick={signDummyMessage} 
              disabled={isLoading}
            >
              {isLoading ? 'Signing...' : 'Sign Dummy Message'}
            </button>

            			<button 
				onClick={sendDummyTransaction} 
				disabled={isLoading}
			>
				{isLoading ? 'Sending...' : 'Send 1 ETH Transaction'}
			</button>

            <button 
              onClick={disconnectWallet} 
              disabled={isLoading}
            >
              Disconnect
            </button>
          </div>

          {signature && (
            <div className="wallet-info">
              <h3>Message Signed</h3>
              <p><strong>Signature:</strong></p>
              <p style={{ wordBreak: 'break-all', fontSize: '0.8em' }}>{signature}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App 
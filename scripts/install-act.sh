#!/bin/bash

echo "📦 Installing Act (GitHub Actions locally)"
echo "=========================================="

# Check if act is already installed
if command -v act &> /dev/null; then
    echo "✅ Act is already installed"
    act --version
    exit 0
fi

# Install act using curl
echo "⬇️ Downloading act..."
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Verify installation
if command -v act &> /dev/null; then
    echo "✅ Act installed successfully!"
    act --version
    
    echo ""
    echo "🚀 Usage:"
    echo "  act                    # Run all workflows"
    echo "  act -j test-e2e-basic  # Run specific job"
    echo "  act -l                 # List workflows"
    echo ""
    echo "📖 More info: https://github.com/nektos/act"
else
    echo "❌ Failed to install act"
    exit 1
fi

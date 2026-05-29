#!/bin/bash

# Inventory Management System UI - Quick Start Script
# This script helps you get started with the project

echo "=========================================="
echo "Inventory Management System UI"
echo "Quick Start Guide"
echo "=========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📥 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm version: $(pnpm --version)"
echo ""

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "Available Commands:"
echo ""
echo "  pnpm dev       - Start development server"
echo "  pnpm build     - Build for production"
echo "  pnpm preview   - Preview production build"
echo ""
echo "Next Steps:"
echo ""
echo "1. Run 'pnpm dev' to start the development server"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Login with default admin credentials"
echo "4. Use the 'Switch Role' button in the sidebar to demo different roles"
echo ""
echo "Documentation:"
echo ""
echo "  • DESIGN_DOCUMENTATION.md - Complete design system"
echo "  • COMPONENT_USAGE_GUIDE.md - Component API docs"
echo "  • IMPLEMENTATION_SUMMARY.md - Project overview"
echo ""
echo "=========================================="

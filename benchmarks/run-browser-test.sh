#!/bin/bash

echo "🌐 Starting browser test server..."
echo ""
echo "Open http://localhost:8000/benchmarks/test-speed.html in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start a simple HTTP server from the parent directory
cd "$(dirname "$0")/.."
python3 -m http.server 8000


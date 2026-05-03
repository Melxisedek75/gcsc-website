#!/bin/bash
# GCSC BuilderAI — auto-restart wrapper
cd "$(dirname "$0")"
while true; do
  echo "[$(date)] Starting GCSC BuilderAI..."
  node server.js
  echo "[$(date)] Server crashed, restarting in 3s..."
  sleep 3
done

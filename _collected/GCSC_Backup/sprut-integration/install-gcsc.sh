#!/bin/bash
# ═══════════════════════════════════════════════════════
# GCSC Agent Kit — Installation Script
# Installs sprut-agent-kit + GCSC configuration
# ═══════════════════════════════════════════════════════
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    GCSC Agent Kit — Installer v1.0       ║${NC}"
echo -e "${BLUE}║    Global Construction Smart Contract    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 1: Check dependencies ───────────────────────
echo -e "${YELLOW}[1/8] Checking dependencies...${NC}"

if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ git not found. Install: https://git-scm.com${NC}"; exit 1
fi
echo -e "${GREEN}✓ git found${NC}"

if ! command -v bun &> /dev/null; then
  echo -e "${YELLOW}Installing Bun runtime...${NC}"
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
echo -e "${GREEN}✓ bun found: $(bun --version)${NC}"

if ! command -v claude &> /dev/null; then
  echo -e "${RED}✗ Claude CLI not found.${NC}"
  echo "Install from: https://claude.ai/download"
  echo "Or: npm install -g @anthropic-ai/claude-code"
  exit 1
fi
echo -e "${GREEN}✓ claude found${NC}"

# ─── Step 2: Clone sprut-agent-kit ────────────────────
echo ""
echo -e "${YELLOW}[2/8] Cloning sprut-agent-kit...${NC}"
INSTALL_DIR="$HOME/.gcsc-agent"
if [ -d "$INSTALL_DIR" ]; then
  echo "Directory exists, pulling latest..."
  cd "$INSTALL_DIR" && git pull
else
  git clone https://github.com/AlekseiUL/sprut-agent-kit.git "$INSTALL_DIR"
fi
echo -e "${GREEN}✓ sprut-agent-kit cloned to $INSTALL_DIR${NC}"

# ─── Step 3: Install dependencies ─────────────────────
echo ""
echo -e "${YELLOW}[3/8] Installing Node/Bun dependencies...${NC}"
cd "$INSTALL_DIR"
bun install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ─── Step 4: Copy GCSC configuration ──────────────────
echo ""
echo -e "${YELLOW}[4/8] Installing GCSC configuration...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp "$SCRIPT_DIR/SOUL.md" "$INSTALL_DIR/SOUL.md"
cp "$SCRIPT_DIR/AGENTS.md" "$INSTALL_DIR/AGENTS.md"
cp "$SCRIPT_DIR/gcsc-agent-config.json" "$INSTALL_DIR/settings.json"
cp -r "$SCRIPT_DIR/gcsc-skills/" "$INSTALL_DIR/skills/gcsc/"
echo -e "${GREEN}✓ GCSC configuration installed${NC}"

# ─── Step 5: Configure environment ────────────────────
echo ""
echo -e "${YELLOW}[5/8] Configuring environment...${NC}"
ENV_FILE="$INSTALL_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" << 'EOF'
# GCSC Agent Configuration
# Fill in your API keys

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Telegram Bot (get from @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_ID=your_telegram_user_id

# XPR Network
XPR_PRIVATE_KEY=your_xpr_private_key
XPR_ACCOUNT=your_xpr_account_name

# Real Estate APIs
ZILLOW_API_KEY=your_zillow_api_key
ATTOM_API_KEY=your_attom_data_key

# KYC/AML
SUMSUB_API_KEY=your_sumsub_api_key
SUMSUB_SECRET_KEY=your_sumsub_secret

# Optional: Metal Blockchain
METAL_API_KEY=your_metal_api_key
EOF
  echo -e "${YELLOW}⚠ Edit $ENV_FILE with your API keys${NC}"
else
  echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# ─── Step 6: Initialize SQLite database ───────────────
echo ""
echo -e "${YELLOW}[6/8] Initializing GCSC memory database...${NC}"
DB_FILE="$INSTALL_DIR/gcsc-memory.sqlite"

bun run -e "
const { Database } = require('bun:sqlite');
const db = new Database('$DB_FILE');
db.exec(\`
  CREATE TABLE IF NOT EXISTS contractors (
    id TEXT PRIMARY KEY,
    xpr_account TEXT UNIQUE,
    name TEXT,
    license_number TEXT,
    state TEXT,
    skills TEXT,
    risk_score REAL DEFAULT 50,
    verified_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    homeowner_xpr TEXT,
    contractor_xpr TEXT,
    status TEXT DEFAULT 'pending',
    escrow_amount REAL,
    current_milestone INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS valuations (
    id TEXT PRIMARY KEY,
    address TEXT,
    estimated_value REAL,
    equity REAL,
    het_amount REAL,
    source TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    expires_at INTEGER
  );
\`);
db.close();
console.log('Database initialized');
" 2>/dev/null || echo -e "${YELLOW}⚠ DB init skipped (bun sqlite not available)${NC}"

echo -e "${GREEN}✓ Database initialized: $DB_FILE${NC}"

# ─── Step 7: Create management scripts ────────────────
echo ""
echo -e "${YELLOW}[7/8] Creating management scripts...${NC}"

cat > "$HOME/gcsc-start.sh" << EOF
#!/bin/bash
cd $INSTALL_DIR
echo "Starting GCSC Agent..."
bun run src/index.ts start --web --config settings.json
EOF
chmod +x "$HOME/gcsc-start.sh"

cat > "$HOME/gcsc-stop.sh" << EOF
#!/bin/bash
pkill -f "gcsc-agent\|sprut-agent" 2>/dev/null && echo "GCSC Agent stopped" || echo "Not running"
EOF
chmod +x "$HOME/gcsc-stop.sh"

cat > "$HOME/gcsc-logs.sh" << EOF
#!/bin/bash
tail -f $INSTALL_DIR/logs/gcsc-agent.log
EOF
chmod +x "$HOME/gcsc-logs.sh"

echo -e "${GREEN}✓ Scripts created: ~/gcsc-start.sh, ~/gcsc-stop.sh, ~/gcsc-logs.sh${NC}"

# ─── Step 8: Summary ──────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    ✅ GCSC Agent Kit Installed!          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "Installation directory: ${BLUE}$INSTALL_DIR${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit API keys:  nano $ENV_FILE"
echo "2. Start agent:    ~/gcsc-start.sh"
echo "3. Web UI:         http://localhost:4632"
echo "4. Telegram:       Set bot token in .env"
echo ""
echo -e "${YELLOW}GCSC Agents available:${NC}"
echo "  CMA — Contractor Matching"
echo "  RAA — Risk Assessment"
echo "  CA  — Compliance & KYC"
echo "  TA  — Treasury & Escrow"
echo "  REA — Real Estate Valuation"
echo ""
echo -e "${BLUE}GitHub: github.com/Melxisedek75/gcsc-website${NC}"
echo -e "${BLUE}Network: XPR Network (Proton)${NC}"
echo ""

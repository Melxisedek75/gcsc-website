# New GCSC Accounts — Ready to Deploy

All 3 contracts are compiled and ready. The 3 new accounts need to be
created first, then contracts can be deployed in one command.

## Generated Key Pairs (saved in proton wallet)

| Account      | Private Key                                               | Public Key (EOS format)                            |
|--------------|-----------------------------------------------------------|----------------------------------------------------|
| gcscbuild11  | PVT_K1_2LB31m1M5kfXUH67LzYSzdPiG65unUoyXkWtHpkM3ur6SBdoLK | EOS6QJznDbNagpvGhTTaMy1BxtcvRzbrjPHCyqK1uv5giXqwUWieY |
| gcscticket1  | PVT_K1_yn65aVJK84FXuyXwJKc8vw8xMvzzdVzXrWJNBjnZSkgpjyTCt  | EOS697z4FXPbueNfirGJyjQDZrzZo5j5uZM2PFo9hpU484xQ4MZ67  |
| gcscbounty1  | PVT_K1_ruwSa6k9aYAtRgjwsshTbLYdmUy15FkFjtWkPkCy8buHtL31N  | EOS5UjSQBFjcg9BnwWE9sbaTq1UN2hLWxV79PeJAQw9NuNmPjKqwG  |

## Option A — Metal Wallet (Web — Recommended)

1. Open https://www.xprnetwork.org/wallet (toggle to Testnet in settings)
2. Click "Create Account"
3. Enter account name, email (gcscdao@gmail.com), and use the public key above
4. Enter the verification code from your email
5. Repeat for all 3 accounts

## Option B — CLI with verification code (once email arrives)

Run each command below when you receive the 6-digit code in your email:

```bash
# After receiving code for gcscbuild11:
proton account:create gcscbuild11
# → enter private key: PVT_K1_2LB31m1M5kfXUH67LzYSzdPiG65unUoyXkWtHpkM3ur6SBdoLK
# → enter email: gcscdao@gmail.com
# → enter display name: GCSC Builder Token
# → enter code from email

# After receiving code for gcscticket1:
proton account:create gcscticket1
# → enter private key: PVT_K1_yn65aVJK84FXuyXwJKc8vw8xMvzzdVzXrWJNBjnZSkgpjyTCt
# → enter email: gcscdao@gmail.com
# → enter display name: GCSC Lottery Ticket

# After receiving code for gcscbounty1:
proton account:create gcscbounty1
# → enter private key: PVT_K1_ruwSa6k9aYAtRgjwsshTbLYdmUy15FkFjtWkPkCy8buHtL31N
# → enter email: gcscdao@gmail.com
# → enter display name: GCSC Bounty Program
```

## Option C — Deploy contracts immediately once accounts exist

After accounts are created (by any method), run:

```bash
cd C:\gcsc\gcscbuild11

# Deploy all 3 contracts
proton contract:set gcscbuild11 target/gcscbuild11
proton contract:set gcscticket1 target/gcscticket1
proton contract:set gcscbounty1 target/gcscbounty1

# Initialize gcscbuild11 — create GCSCBUILD token
proton action gcscbuild11 create \
  '{"issuer":"gcscbuild11","maximum_supply":"1000000000000.0000 GCSCBUILD"}' \
  gcscbuild11@active

# Initialize gcscticket1 — configure lottery
proton action gcscticket1 setconfig \
  '{"admin":"gcscticket1","build_contract":"gcscbuild11","gcsc_contract":"gcsctoken111","usdt_contract":"xtokens","ticket_price":10000000000,"draw_interval":604800}' \
  gcscticket1@active

# Initialize gcscbounty1 — configure bounty
proton action gcscbounty1 setconfig \
  '{"admin":"gcscbounty1","compliance_agent":"gcscbounty1","build_contract":"gcscbuild11"}' \
  gcscbounty1@active
```

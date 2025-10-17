@echo off
REM Package Manager Helper Script for UDP Project
REM Usage: pm.cmd [pnpm-command] [args...]
REM Example: pm.cmd install
REM Example: pm.cmd add react-native-vector-icons --filter @udp/mobile

npx pnpm %*
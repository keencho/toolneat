# Toolneat Development Plan

## Project Overview
Toolneat is a collection of developer and lifestyle utility tools built as a static website with multi-language support (Korean/English).

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS 4.x
- **Server**: Node.js with `serve` package (static file server)
- **Build**: Tailwind CLI for CSS compilation
- **i18n**: Custom JavaScript-based translation system using localStorage

## Implemented Features

### Developer Tools (Dev Tools)
1. **Encoding/Decoding**
   - Base64 Encoder/Decoder
   - URL Encoder/Decoder
   - HTML Entity Encoder

2. **Generators**
   - UUID Generator
   - Hash Generator
   - Lorem Ipsum Generator
   - JWT Generator
   - Password Generator
   - Cron Expression Generator

3. **Converters**
   - JSON Formatter
   - Color Converter
   - Timestamp Converter
   - YAML ↔ JSON Converter
   - Markdown Preview
   - Case Converter
   - SQL Formatter
   - CSS Minifier
   - Line Ending Converter

4. **Testers**
   - Regex Tester
   - JWT Decoder
   - Diff Checker

### Life Tools
1. **Calculators**
   - Salary Calculator
   - D-day Calculator
   - BMI Calculator
   - Loan Calculator
   - Age Calculator
   - Percentage Calculator
   - Compound Interest Calculator
   - Tip Calculator

2. **Converters/Generators**
   - Unit Converter
   - QR Code Generator
   - Barcode Generator (NEW)
   - Favicon Generator (NEW)
   - Image Compressor (NEW)
   - Number Base Converter (NEW)
   - ASCII/Unicode Converter (NEW)
   - Emoji Picker (NEW)

3. **Text Tools**
   - Character Counter

4. **Monitor Test**
   - Dead Pixel Test
   - Pixel Fixer
   - Screen Burn-In Test
   - Screen Color Test

5. **Fun & Games**
   - Lottery Number Generator
   - Roulette Wheel (Random Picker)
   - Dice Roller
   - Coin Flip
   - Typing Test
   - Reaction Time Test

## Recent Updates (January 2026)

### New Tools Added
1. **Image Compressor** - Compress images with adjustable quality
2. **Barcode Generator** - Generate various barcode formats (CODE128, EAN, UPC, etc.)
3. **Number Base Converter** - Convert between binary, octal, decimal, and hexadecimal
4. **Favicon Generator** - Generate favicons in multiple sizes from images
5. **ASCII/Unicode Converter** - Convert text to/from ASCII/Unicode codes
6. **Emoji Picker** - Search and copy emojis with category filtering

### i18n System Update
- Changed from URL-based language switching (`/en/path`) to localStorage-based
- Language preference persists across sessions
- No page reload required when switching languages
- `document.documentElement.lang` attribute updated for dynamic components

## Future Improvements
- [ ] Complete translation coverage for all tool-specific text
- [ ] Add more barcode formats
- [ ] Mobile-optimized testing
- [ ] PWA support
- [ ] Dark/light mode persistence

## Development Commands
```bash
# Start development server with Tailwind watch
npm run dev

# Build CSS for production
npm run build

# Start static server only
npm run serve
```

![logo](https://raw.githubusercontent.com/wiki/kcapp/frontend/images/logo/kcapp_plus_nfc.png)
# nfc
Integration of [ACR122u](https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/) NFC card reader into kcapp

## Prerequisites
1. Install the
```bash
apt-get install libpcsclite-dev pcscd pcsc-tools
```

## Usage
1. Install `node` dependencies
```bash
npm install
```
2. Run with
```bash
npm start <venue_id>
# or
VENUE_ID=<id> npm start
```
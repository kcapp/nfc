const debug = require('debug')('kcapp-nfc:main');

const VENUE_ID = process.env.VENUE_ID || process.argv[2];
if (!VENUE_ID) {
    console.log(`No 'VENUE_ID' env variable or argument specified`);
    process.exit(-1)
}

const host = process.env.KCAPP_API || "localhost";
const port = process.env.PORT || 3000;
const kcapp = require('kcapp-sio-client/kcapp')(host, port, 'kcapp-nfc', "http");

const smartcard = process.env.NODE_ENV === "mock" ? require(`./nfc-mock`)() : require(`./nfc`)();
kcapp.connect(() => {
    smartcard.initialize((uid) => {
        debug(`We got ${uid}`);
        kcapp.socket.emit("smartcard", { type: 'read', venue_id: VENUE_ID, uid: uid });
    });
});
debug("Waiting for NFC-tags to be scanned  ...");

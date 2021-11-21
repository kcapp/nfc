const debug = require('debug')('kcapp-nfc:reader');

exports.initialize = (readCallback) => {
    const pcsc = require('pcsclite')();
    pcsc.on('reader', function(reader) {
        debug(`Reader "${reader.name}" connected`);

        reader.on('error', function(err) {
            debug(`Error (${this.name}): ${err.message}`);
        });

        reader.on('status', function(status) {
            const changes = this.state ^ status.state;
            if (changes) {
                if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                    reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
                        if (err) {
                            debug(err);
                        }
                        // Card removed
                    });
                } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                    reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
                        if (err) {
                            debug(err);
                        } else {
                            // http://pcscworkgroup.com/Download/Specifications/pcsc3_v2.01.09.pdf
                            // Get UID - 0xFF, 0xCA, 0x00, 0x00, 0x00
                            const buffer = Buffer.from([0xFF, 0xCA, 0x00, 0x00, 0x00]);
                            reader.transmit(buffer, 40, protocol, function(err, data) {
                                if (err) {
                                    debug(err);
                                } else {
                                    const cardUID = Buffer.from(data).toString('hex');
                                    debug(`Read card ${cardUID}`);
                                    readCallback(cardUID);
                                }
                            });
                        }
                    });
                }
            }
        });

        reader.on('end', function() {
            debug(`Reader "${this.name}" disconnected`);
        });
    });

    pcsc.on('error', (err) => {
        debug(`PCSC error ${err.message}`);
    });
}

/** Configure the NFC reader */
module.exports = () => {
    return this;
};

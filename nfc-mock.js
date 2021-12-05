const debug = require('debug')('kcapp:nfc-mock');
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
 });

const waitForUserInput = (readCallback) => {
  rl.question("UID: ", (uid) => {
    rl.pause();
    if (uid === "exit"){
        rl.close();
        process.exit();
    } else {
      readCallback(uid);

      waitForUserInput(readCallback);
    }
  });
}

exports.initialize = (readCallback) => {
  debug(`Enter Smartcard UID to send:`);
  waitForUserInput(readCallback);
}

/** Configure the NFC reader */
module.exports = () => {
    return this;
};

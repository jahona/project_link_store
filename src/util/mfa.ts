const twofactor = require("node-2fa");
const QRCode = require('qrcode');

export function generateSecretKey(userKey: string) {
  const newSecret = twofactor.generateSecret({ name: "My Awesome App", account: "johndoe" });

  return newSecret;
}

export function verifyToken(secretKey: string, token: string) {
  const result = twofactor.verifyToken(secretKey, token);
  if (result) {
    if (result.delta === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function convertQRCode(uri: string, cb: Function) {
  QRCode.toDataURL(uri , (err: any, image: any) => {
    if (err) {
      cb(err);
    } else {
      cb(null, image);
    }
  });
}
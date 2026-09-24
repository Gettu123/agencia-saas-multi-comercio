(function (global) {
  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }
  function tlv(id, value) {
    const v = String(value);
    return id + String(v.length).padStart(2, "0") + v;
  }
  function buildPix(opts) {
    const name = String(opts.merchant || "COMERCIO").slice(0, 25);
    const loc = String(opts.city || "SAO PAULO").slice(0, 15);
    const gui = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", opts.key);
    const add = tlv("05", String(opts.txid || "***").slice(0, 25));
    const body = tlv("00", "01") + tlv("26", gui) + tlv("52", "0000") + tlv("53", "986") + tlv("54", Number(opts.amount).toFixed(2)) + tlv("58", "BR") + tlv("59", name) + tlv("60", loc) + tlv("62", add) + "6304";
    return body + crc16(body);
  }
  global.PixEMV = { build: buildPix };
})(window);

import QRCode from "qrcode";

export async function travelerQrSvg(travelerId: string): Promise<string> {
  return QRCode.toString(travelerId, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0b0c0a", light: "#00000000" },
  });
}

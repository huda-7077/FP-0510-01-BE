import { randomBytes } from "crypto";
import { v4 as uuidv4 } from "uuid";

export const generateUUID = (): string => {
  return uuidv4();
};

const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generatePaymentUUID = (prefix: string, length: number): string => {
  const randomBytesLength = Math.ceil(length - prefix.length); // Tidak perlu dibagi 2 lagi
  const randomBytesValue = randomBytes(randomBytesLength);

  let id = "";
  for (let i = 0; i < randomBytesValue.length; i++) {
    const index = randomBytesValue[i] % alphanumeric.length;
    id += alphanumeric[index];
  }

  const finalLength = prefix.length + id.length;
  if (finalLength > length) {
    id = id.slice(0, length - prefix.length);
  }

  return `${prefix}${id}`;
};

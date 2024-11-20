import { createHash } from "crypto";

export function toSHA256(inputString: string) {
  return createHash('sha256').update(inputString).digest('hex');
}
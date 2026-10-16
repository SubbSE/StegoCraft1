const MESSAGES = {
  'no-payload':
    "No StegoCraft message was found. If it was hidden with a password, enter that password and try again.",
  'needs-password': 'This message is protected. Enter the password that was used to hide it.',
  'wrong-password': "That password didn't unlock the message. Check it and try again.",
  corrupted: 'A hidden message was found, but it is damaged — the file was probably edited, resized or re-compressed.',
  'too-large': "The message doesn't fit. Use a bigger cover, more bits per sample, or a shorter message.",
  'unsupported-file': "This file format can't be used here.",
};

export class StegoError extends Error {
  constructor(code, message) {
    super(message || MESSAGES[code] || code);
    this.name = 'StegoError';
    this.code = code;
  }
}

export function friendlyError(err) {
  if (err instanceof StegoError) return err.message;
  console.error(err);
  return 'Something went wrong while processing this file.';
}

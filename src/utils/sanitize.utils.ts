/**
 * Generic function to sanitize sensitive data from an object.
 * @param {Object} data - The data object to sanitize.
 * @param {Array<string>} keysToRedact - An array of keys to redact.
 * @returns {Object} - A new object with specified keys redacted.
 */
const sanitize = (data, keysToRedact) => {
  const sanitized = { ...data };

  keysToRedact.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
};

export default sanitize;

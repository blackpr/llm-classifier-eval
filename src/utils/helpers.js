export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncateMessage(message, maxLength = 50) {
  if (message.length <= maxLength) {
    return message;
  }
  return `${message.substring(0, maxLength)}...`;
}

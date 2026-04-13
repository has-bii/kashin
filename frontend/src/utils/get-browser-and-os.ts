export function getBrowserAndOS(): string {
  const ua = navigator.userAgent
  let browser = "Unknown Browser"
  let os = "Unknown OS"

  // 1. Detect OS
  if (/Windows/i.test(ua)) {
    os = "Windows"
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS"
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    os = "iOS"
  } else if (/Android/i.test(ua)) {
    os = "Android"
  } else if (/Linux/i.test(ua)) {
    os = "Linux"
  }

  // 2. Detect Browser
  // Order matters here! (Edge and Opera often include "Chrome" in their UA)
  if (/Edg/i.test(ua)) {
    browser = "Edge"
  } else if (/OPR|Opera/i.test(ua)) {
    browser = "Opera"
  } else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
    browser = "Chrome"
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Safari"
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browser = "Firefox"
  } else if (/MSIE|Trident/i.test(ua)) {
    browser = "Internet Explorer"
  }

  return `${browser} on ${os}`
}

// Example usage:
console.log(getBrowserAndOS()) // Output: "Chrome on macOS"

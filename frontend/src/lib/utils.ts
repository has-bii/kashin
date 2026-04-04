import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility to add opacity to a hex color
 * @param hex - The hex color (e.g., #BCD6C0)
 * @param opacity - A number between 0 and 1
 */
export const addOpacityToHex = (hex: string, opacity: number): string => {
  // Remove the hash if it exists
  const cleanHex = hex.replace("#", "")

  // Convert hex to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function increaseSaturation(hex: string, amount: number) {
  // Simple regex to grab R, G, B
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s

  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  // Boost saturation and convert to HSL string
  // amount is 0 to 1 (e.g., 0.2 to add 20%)
  const newS = Math.min(1, s + amount) * 100
  return `hsl(${h * 360}, ${newS}%, ${l * 100}%)`
}

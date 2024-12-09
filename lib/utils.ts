import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number: number, type?: "GB" | "ratio") {
  const thresholds = [1_000_000_000, 1_000_000, 1_000]
  const postFixes = type === "GB" ? [" EB", " PB", " TB"] : ["B", "M", "K"]
  let postFix = type === "GB" ? " GB" : ""
  if (type !== "ratio") {
    for (let i = 0; i < thresholds.length; i++) {
      if (number > thresholds[i]) {
        number /= thresholds[i]
        postFix = postFixes[i]
        break
      }
    }
  }
  return `${Number(number.toPrecision(3))}${postFix}`
}

export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true
  }

  const bothAreObjects =
    a && b && typeof a === "object" && typeof b === "object"

  return Boolean(
    bothAreObjects &&
      Object.keys(a).length === Object.keys(b).length &&
      Object.entries(a).every(([k, v]) => deepEqual(v, b[k as keyof T])),
  )
}

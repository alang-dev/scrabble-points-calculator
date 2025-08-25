import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string) {
  return dateString.slice(0, 19); // Extract YYYY-MM-DDTHH:MM:ss
}

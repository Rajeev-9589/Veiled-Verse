import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function handleShare({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { success: true, method: 'native' };
    } catch (err) {
      return { success: false, error: err };
    }
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'clipboard' };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  return { success: false, error: 'Share not supported' };
}

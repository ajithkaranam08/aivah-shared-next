import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ipAddress = async () => {
  const response = await fetch("https://api64.ipify.org/?format=json");
  if (!response.ok) {
    throw "Ip Fail";
  }
  const body = await response.json();
  const ipAddress = body.ip as string;

  return ipAddress;
};


export const openUrlInNewTab = (url: string) => {
  if (!url || typeof window === 'undefined') return;
  
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
}

export const downloadFile = async (url: string, fileName: string) => {
  if (!url || typeof window === 'undefined') return;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to opening in new tab
    openUrlInNewTab(url);
  }
}
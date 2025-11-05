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

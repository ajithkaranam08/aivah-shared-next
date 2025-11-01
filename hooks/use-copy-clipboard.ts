import { useState } from "react";

export const useCopyToClipboard = (resetAfter = 2000) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);

    setTimeout(() => {
      setCopiedKey(null);
    }, resetAfter);
  };

  return { copiedKey, copy };
};

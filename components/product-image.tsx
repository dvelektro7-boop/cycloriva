"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImage({ src, alt, missingLabel, className, loading = "lazy" }: {
  src?: string;
  alt: string;
  missingLabel: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  // Storefront images must belong to this project; source URLs live only in migration files.
  const url = src?.startsWith("/images/produits/") ? src : undefined;

  if (!url || failedSrc === url) {
    return <div role="img" aria-label={`${alt} — ${missingLabel}`} className={`flex items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500 ${className ?? ""}`}>{missingLabel}</div>;
  }

  return <Image unoptimized src={url} alt={alt} width={640} height={480} loading={loading} onError={() => setFailedSrc(url)} className={className} />;
}

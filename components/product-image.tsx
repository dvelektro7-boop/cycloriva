"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGE_BASE, productImageUrl } from "@/lib/product-images";

export function ProductImage({ src, alt, missingLabel, className, loading = "lazy" }: {
  src?: string;
  alt: string;
  missingLabel: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  // Only accept product assets from this project's local path or LFS media source.
  const url = src?.startsWith("/images/produits/") || src?.startsWith(PRODUCT_IMAGE_BASE)
    ? productImageUrl(src)
    : undefined;

  if (!url || failedSrc === url) {
    return <div role="img" aria-label={`${alt} — ${missingLabel}`} className={`flex items-center justify-center bg-slate-100 p-4 text-center text-sm text-slate-500 ${className ?? ""}`}>{missingLabel}</div>;
  }

  return <Image unoptimized src={url} alt={alt} width={640} height={480} loading={loading} onError={() => setFailedSrc(url)} className={className} />;
}

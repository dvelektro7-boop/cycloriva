// Hostinger clones Git LFS pointers without downloading the image objects.
// GitHub's media endpoint serves the original files from this public repository.
export const PRODUCT_IMAGE_BASE =
  "https://media.githubusercontent.com/media/dvelektro7-boop/cycloriva/main/public/images/produits/";

export function productImageUrl(source: string): string {
  const prefix = "/images/produits/";
  if (!source.startsWith(prefix)) return source;
  const segments = source.slice(prefix.length).split("/");
  if (segments.some(segment => !segment || segment === "." || segment === "..")) return "";
  return PRODUCT_IMAGE_BASE + segments.map(encodeURIComponent).join("/");
}

export function getUpdatedUrl(
  currentParams: URLSearchParams,
  updates: Record<string, string | null>,
  pathname: string = "/products"
): string {
  const params = new URLSearchParams(currentParams.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  return `${pathname}?${params.toString()}`;
}

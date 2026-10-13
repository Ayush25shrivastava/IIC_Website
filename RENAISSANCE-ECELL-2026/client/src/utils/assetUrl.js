/**
 * Resolves static asset paths from the public directory.
 * Ensures assets load correctly both at root ('/') and under subpaths (e.g. '/renaissance/').
 *
 * @param {string} path - Relative asset path (e.g. '/support-qr.jpg' or 'sponsors/oatey.png')
 * @returns {string} - Correctly prefixed asset URL
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Idempotency: avoid double-prefixing if already starts with renaissance path
  if (path.startsWith('/renaissance/') || path.startsWith('renaissance/')) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 1. Vite base URL (e.g. '/renaissance/' in production builds)
  const baseUrl = import.meta.env.BASE_URL;
  if (baseUrl && baseUrl !== '/') {
    const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${prefix}${cleanPath}`;
  }

  // 2. Runtime fallback: If running in browser and current pathname is under /renaissance
  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/renaissance')
  ) {
    return `/renaissance/${cleanPath}`;
  }

  // 3. Default to root-relative
  return `/${cleanPath}`;
}

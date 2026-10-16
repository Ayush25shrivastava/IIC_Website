const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function photoCropRect(width, height, zoom, position) {
  const size = Math.min(width, height) / clamp(zoom, 1, 3);
  return { x: (width - size) * clamp(position.x, 0, 1), y: (height - size) * clamp(position.y, 0, 1), size };
}

export function movePhotoCrop(width, height, zoom, position, dx, dy, viewportSize) {
  const { size } = photoCropRect(width, height, zoom, position);
  return {
    x: width > size ? clamp(position.x - dx * size / viewportSize / (width - size), 0, 1) : 0.5,
    y: height > size ? clamp(position.y - dy * size / viewportSize / (height - size), 0, 1) : 0.5,
  };
}

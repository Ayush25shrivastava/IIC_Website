import assert from "node:assert/strict";
import test from "node:test";
import { movePhotoCrop, photoCropRect } from "../../client/src/lib/photo-crop.js";

test("portrait and landscape photos begin with a centered square crop", () => {
  assert.deepEqual(photoCropRect(1200, 800, 1, { x: 0.5, y: 0.5 }), { x: 200, y: 0, size: 800 });
  assert.deepEqual(photoCropRect(800, 1200, 1, { x: 0.5, y: 0.5 }), { x: 0, y: 200, size: 800 });
});

test("zoom and dragging cannot expose empty space outside the photo", () => {
  for (const [width, height] of [[800, 1200], [1200, 800], [800, 800]]) {
    for (const zoom of [1, 2, 3]) {
      const position = movePhotoCrop(width, height, zoom, { x: 0.5, y: 0.5 }, 10000, -10000, 320);
      const crop = photoCropRect(width, height, zoom, position);
      assert(crop.x >= 0 && crop.y >= 0);
      assert(crop.x + crop.size <= width && crop.y + crop.size <= height);
      assert(Number.isFinite(position.x) && Number.isFinite(position.y));
    }
  }
});

test("dragging the image right moves the crop left at the displayed scale", () => {
  const position = movePhotoCrop(1200, 800, 2, { x: 0.5, y: 0.5 }, 80, 0, 320);
  assert.deepEqual(photoCropRect(1200, 800, 2, position), { x: 300, y: 200, size: 400 });
});

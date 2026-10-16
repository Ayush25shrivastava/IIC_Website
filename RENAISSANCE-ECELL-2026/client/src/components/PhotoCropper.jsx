import { useEffect, useRef, useState } from "react";
import { movePhotoCrop, photoCropRect } from "../lib/photo-crop";

export default function PhotoCropper({ source, onApply, onCancel }) {
  const canvas = useRef(null);
  const drag = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const objectUrl = typeof source === "string" ? null : URL.createObjectURL(source);
    const image = new Image();
    if (typeof source === "string" && source.startsWith("https://")) image.crossOrigin = "anonymous";
    image.onload = () => { if (active) setPhoto(image); };
    image.onerror = () => { if (active) setError("This photo could not be opened. Choose another JPEG, PNG or WebP image."); };
    image.src = objectUrl || source;
    return () => { active = false; image.onload = null; image.onerror = null; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [source]);

  useEffect(() => {
    if (!photo || !canvas.current) return;
    const context = canvas.current.getContext("2d");
    const { x, y, size } = photoCropRect(photo.naturalWidth, photo.naturalHeight, zoom, position);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 640, 640);
    context.drawImage(photo, x, y, size, size, 0, 0, 640, 640);
  }, [photo, zoom, position]);

  function move(dx, dy, viewportSize) {
    if (!photo || saving) return;
    setPosition((previous) => movePhotoCrop(photo.naturalWidth, photo.naturalHeight, zoom, previous, dx, dy, viewportSize));
  }

  function apply() {
    if (!photo) return;
    setSaving(true); setError("");
    try {
      const output = document.createElement("canvas");
      const { x, y, size } = photoCropRect(photo.naturalWidth, photo.naturalHeight, zoom, position);
      output.width = output.height = Math.max(1, Math.min(800, Math.round(size)));
      const context = output.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, output.width, output.height);
      context.drawImage(photo, x, y, size, size, 0, 0, output.width, output.height);
      let result;
      for (const quality of [0.9, 0.8, 0.7, 0.6]) {
        result = output.toDataURL("image/jpeg", quality);
        if (result.length <= 466000) break;
      }
      if (result.length > 466000) throw new Error("This crop is too detailed. Try zooming in or choose a smaller photo.");
      onApply(result);
    } catch (err) { setError(err.message || "Unable to crop the photo. Please try another image."); setSaving(false); }
  }

  return <div className="admin-photo-cropper">
    <p id="photo-crop-help">Drag the photo to position your face, then adjust the zoom. The square preview is exactly what will be saved.</p>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {!photo && !error && <p role="status">Opening photo…</p>}
    {photo && <>
      <div className="admin-crop-stage" tabIndex={0} role="group" aria-label="Photo crop preview" aria-describedby="photo-crop-help photo-crop-keyboard"
        onPointerDown={(event) => {
          if (saving || (event.pointerType === "mouse" && event.button !== 0)) return;
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.id !== event.pointerId) return;
          move(event.clientX - drag.current.x, event.clientY - drag.current.y, event.currentTarget.clientWidth);
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={(event) => {
          const direction = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }[event.key];
          if (direction) { event.preventDefault(); move(...direction, event.currentTarget.clientWidth); }
        }}>
        <canvas ref={canvas} width={640} height={640} aria-label="Selected square photo crop" />
        <div className="admin-crop-grid" aria-hidden="true" />
      </div>
      <small id="photo-crop-keyboard">You can also use the arrow keys or position sliders.</small>
      <label>Zoom <span>{zoom.toFixed(1)}×</span><input autoFocus type="range" min="1" max="3" step="0.01" value={zoom} disabled={saving} onChange={(event) => setZoom(Number(event.target.value))} /></label>
      <label>Horizontal position<input type="range" min="0" max="1" step="0.01" value={position.x} disabled={saving} onChange={(event) => setPosition({ ...position, x: Number(event.target.value) })} /></label>
      <label>Vertical position<input type="range" min="0" max="1" step="0.01" value={position.y} disabled={saving} onChange={(event) => setPosition({ ...position, y: Number(event.target.value) })} /></label>
    </>}
    <div className="admin-actions">
      <button type="button" disabled={saving} onClick={onCancel}>Cancel</button>
      <button type="button" disabled={!photo || saving} onClick={() => { setZoom(1); setPosition({ x: 0.5, y: 0.5 }); }}>Reset</button>
      <button type="button" className="admin-gold" disabled={!photo || saving} onClick={apply}>{saving ? "Cropping…" : "Apply crop"}</button>
    </div>
  </div>;
}

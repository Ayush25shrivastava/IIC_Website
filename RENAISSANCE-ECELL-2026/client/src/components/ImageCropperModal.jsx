import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles } from "lucide-react";

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose, targetTitle = "Image Space" }) {
  const canvasRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);

  // Settings
  const [preset, setPreset] = useState("3:4");
  const [targetWidth, setTargetWidth] = useState(600);
  const [targetHeight, setTargetHeight] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      // Center position
      setPosition({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle Preset change
  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
    if (newPreset === "3:4") {
      setTargetWidth(600);
      setTargetHeight(800);
    } else if (newPreset === "4:5") {
      setTargetWidth(800);
      setTargetHeight(1000);
    } else if (newPreset === "1:1") {
      setTargetWidth(600);
      setTargetHeight(600);
    }
  };

  // Redraw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext("2d");
    const previewWidth = 320;
    const aspectRatio = targetHeight / targetWidth;
    const previewHeight = Math.round(previewWidth * aspectRatio);

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    ctx.clearRect(0, 0, previewWidth, previewHeight);

    // Save state
    ctx.save();

    // Move to center of preview
    ctx.translate(previewWidth / 2 + position.x, previewHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);

    // Base scale to cover preview
    const scaleToCover = Math.max(previewWidth / imageObj.width, previewHeight / imageObj.height);
    const finalScale = scaleToCover * zoom;

    const drawW = imageObj.width * finalScale;
    const drawH = imageObj.height * finalScale;

    ctx.drawImage(imageObj, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Subtle framing border
    ctx.strokeStyle = "rgba(227, 85, 33, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, previewWidth - 2, previewHeight - 2);
  }, [imageObj, targetWidth, targetHeight, zoom, rotation, position]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Generate output image at desired resolution
  const handleSave = () => {
    if (!imageObj) return;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = targetWidth;
    outCanvas.height = targetHeight;
    const ctx = outCanvas.getContext("2d");

    // Center and transform
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Scale ratio between output canvas and preview
    const previewWidth = 320;
    const scaleMultiplier = targetWidth / previewWidth;

    const scaleToCover = Math.max(previewWidth / imageObj.width, previewHeightCover(previewWidth));
    const finalScale = scaleToCover * zoom * scaleMultiplier;

    const drawW = imageObj.width * finalScale;
    const drawH = imageObj.height * finalScale;

    ctx.drawImage(
      imageObj,
      -drawW / 2 + position.x * scaleMultiplier,
      -drawH / 2 + position.y * scaleMultiplier,
      drawW,
      drawH
    );

    const croppedDataUrl = outCanvas.toDataURL("image/webp", 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  const previewHeightCover = (pWidth) => {
    return (pWidth * targetHeight) / (targetWidth * imageObj.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#3b1717] bg-[#140b0b] p-6 text-neutral-100 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-orange-500">
              <Sparkles size={18} /> Edit & Crop Image
            </h3>
            <p className="text-xs text-neutral-400">
              Adjust position, zoom, and resolution for: <span className="font-semibold text-neutral-200">{targetTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-[#0c0505] p-4">
            <div
              className="relative cursor-move overflow-hidden rounded-lg shadow-lg select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="block" />
              <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] text-neutral-300">
                <Move size={12} /> Drag to position
              </div>
            </div>
            <span className="mt-2 text-[11px] font-mono text-neutral-400">
              Output: {targetWidth} × {targetHeight} px ({preset})
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                  Aspect Ratio & Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["3:4", "Portrait 3:4"],
                    ["4:5", "Portrait 4:5"],
                    ["1:1", "Square 1:1"],
                  ].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetChange(val)}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                        preset === val
                          ? "border-orange-500 bg-orange-600/20 text-orange-400"
                          : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution settings */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-300">
                  Target Resolution (Pixels)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="mb-0.5 block text-[10px] text-neutral-500">Width</span>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => {
                        setTargetWidth(Math.max(100, Number(e.target.value)));
                        setPreset("custom");
                      }}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                  <span className="mt-4 text-xs text-neutral-500">×</span>
                  <div className="flex-1">
                    <span className="mb-0.5 block text-[10px] text-neutral-500">Height</span>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => {
                        setTargetHeight(Math.max(100, Number(e.target.value)));
                        setPreset("custom");
                      }}
                      className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Zoom slider */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-semibold text-neutral-300">
                  <span className="flex items-center gap-1">
                    <ZoomIn size={14} /> Zoom
                  </span>
                  <span className="font-mono text-orange-400">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-300">Rotate</label>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-300 transition hover:bg-neutral-800"
                >
                  <RotateCw size={14} /> Rotate 90° ({rotation}°)
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-neutral-800 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-orange-500"
              >
                <Check size={16} /> Apply & Use Crop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

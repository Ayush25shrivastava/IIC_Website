import { useState, useRef, useEffect, useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles } from "lucide-react";

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose, targetTitle = "Image Space" }) {
  const canvasRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);

  // Settings - defaults to Square 1:1 matching card layout
  const [preset, setPreset] = useState("1:1");
  const [targetWidth, setTargetWidth] = useState(600);
  const [targetHeight, setTargetHeight] = useState(600);
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
    if (newPreset === "1:1") {
      setTargetWidth(600);
      setTargetHeight(600);
    } else if (newPreset === "3:4") {
      setTargetWidth(600);
      setTargetHeight(800);
    } else if (newPreset === "4:5") {
      setTargetWidth(800);
      setTargetHeight(1000);
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
    ctx.strokeStyle = "rgba(225, 188, 115, 0.85)";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062030]/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#b4dbe3] bg-gradient-to-br from-[#eaf7fa] to-[#cbeaf0] p-6 text-[#173f52] shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-[#b0d8e2] pb-3">
          <div>
            <h3 className="flex items-center gap-2 font-cinzel text-lg font-bold text-[#173f52]">
              <Sparkles size={18} className="text-[#b17e2e]" /> Edit & Crop Portrait Image
            </h3>
            <p className="text-xs text-[#527e8e]">
              Adjust framing, zoom, and orientation for: <span className="font-semibold text-[#173f52]">{targetTitle}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#527e8e] transition hover:bg-[#d0ecf2] hover:text-[#173f52]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#b4dbe3] bg-[#0c2433] p-4 shadow-inner">
            <div
              className="relative cursor-move overflow-hidden rounded-lg shadow-lg select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="block" />
              <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded bg-[#062030]/80 px-2 py-0.5 text-[10px] text-[#e2f4f7]">
                <Move size={12} className="text-[#efd084]" /> Drag to position
              </div>
            </div>
            <span className="mt-2 text-[11px] font-mono text-[#a2cbdb]">
              Output: {targetWidth} × {targetHeight} px ({preset})
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="mb-1.5 block font-montserrat text-xs font-bold text-[#173f52]">
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
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                        preset === val
                          ? "border-[#b17e2e] bg-[#f9ebbd] text-[#72551c] shadow-sm"
                          : "border-[#b8dce4] bg-[#e4f5f8] text-[#4d7b8d] hover:bg-[#d6f0f5]"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution settings */}
              <div>
                <label className="mb-1.5 block font-montserrat text-xs font-bold text-[#173f52]">
                  Target Resolution (Pixels)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <span className="mb-0.5 block text-[10px] text-[#527e8e]">Width</span>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => {
                        setTargetWidth(Math.max(100, Number(e.target.value)));
                        setPreset("custom");
                      }}
                      className="w-full rounded-md border border-[#afd6e1] bg-[#f0fbfc] px-2.5 py-1 text-xs text-[#173f52]"
                    />
                  </div>
                  <span className="mt-4 text-xs text-[#527e8e]">×</span>
                  <div className="flex-1">
                    <span className="mb-0.5 block text-[10px] text-[#527e8e]">Height</span>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => {
                        setTargetHeight(Math.max(100, Number(e.target.value)));
                        setPreset("custom");
                      }}
                      className="w-full rounded-md border border-[#afd6e1] bg-[#f0fbfc] px-2.5 py-1 text-xs text-[#173f52]"
                    />
                  </div>
                </div>
              </div>

              {/* Zoom slider */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-bold text-[#173f52]">
                  <span className="flex items-center gap-1">
                    <ZoomIn size={14} className="text-[#0d7892]" /> Zoom
                  </span>
                  <span className="font-mono text-[#b17e2e]">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#b17e2e]"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="mb-1.5 block font-montserrat text-xs font-bold text-[#173f52]">Orientation</label>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#b8dce4] bg-[#e4f5f8] px-3 py-1.5 text-xs font-semibold text-[#376579] transition hover:bg-[#d5eff4]"
                >
                  <RotateCw size={14} /> Rotate 90° ({rotation}°)
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#b0d8e2] pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#b8dce4] bg-[#e4f5f8] px-4 py-2 text-xs font-semibold text-[#527e8e] transition hover:bg-[#d6f0f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg border border-[#d8b15c] bg-gradient-to-r from-[#f9ebbd] to-[#efd084] px-4 py-2 text-xs font-bold text-[#72551c] shadow transition hover:brightness-105 active:scale-95"
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

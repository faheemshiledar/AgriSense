import React, { useCallback, useState } from "react";
import { Upload, X, ImageIcon, CheckCircle } from "lucide-react";

export default function UploadZone({ label, hint, onFileSelect, accept = "image/*", icon }) {
  const [preview,   setPreview]   = useState(null);
  const [dragOver,  setDragOver]  = useState(false);
  const [fileName,  setFileName]  = useState(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileSelect(file);
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, [processFile]);

  const onInputChange = (e) => processFile(e.target.files[0]);

  const clear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    onFileSelect(null);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
        ${dragOver
          ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
          : preview
            ? "border-emerald-500/40 bg-slate-900/60"
            : "border-slate-700 bg-slate-900/40 hover:border-emerald-500/50 hover:bg-slate-900/60"}`}
    >
      <label className="block cursor-pointer">
        <input
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="sr-only"
        />

        {preview ? (
          /* Preview state */
          <div className="p-3">
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-800">
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-2 left-3 right-10 flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-white truncate">{fileName}</span>
              </div>
              {/* Clear button */}
              <button
                onClick={clear}
                className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 rounded-full flex items-center justify-center
                           hover:bg-red-500/80 transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
            <p className="text-center text-xs text-emerald-400 mt-2 font-medium">✓ {label} ready</p>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-3
                            group-hover:bg-emerald-500/10 transition-colors">
              {icon || <ImageIcon size={24} className="text-slate-500" />}
            </div>
            <p className="text-sm font-semibold text-slate-300">{label}</p>
            <p className="text-xs text-slate-500 mt-1">{hint || "Drag & drop or click to browse"}</p>
            <div className="mt-3 px-3 py-1.5 bg-slate-800/80 rounded-lg flex items-center gap-1.5">
              <Upload size={12} className="text-emerald-400" />
              <span className="text-xs text-slate-400">Choose image</span>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

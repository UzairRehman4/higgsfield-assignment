import { useRef } from "react";

export function ReferenceUpload({
  thumb,
  onAdd,
  onRemove,
}: {
  thumb: string | null;
  onAdd: (dataUrl: string, img: HTMLImageElement) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => onAdd(dataUrl, img);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  if (thumb) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5">
        <img src={thumb} alt="Reference" className="h-8 w-8 rounded object-cover" />
        <span className="text-xs text-muted">Reference attached</span>
        <button
          onClick={onRemove}
          className="ml-auto rounded-md px-1.5 py-0.5 text-xs text-faint transition-colors hover:bg-surface-hover hover:text-ink"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
    >
      <span className="grid h-5 w-5 place-items-center rounded-md bg-surface-raised text-sm">+</span>
      Add a reference image
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </button>
  );
}

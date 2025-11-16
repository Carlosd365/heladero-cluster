import { useEffect, useRef, useState } from "react";
import "./Autocomplete.css";

export default function Autocomplete({
  fetcher,
  onSelect,
  placeholder,
}: {
  fetcher: (q: string) => Promise<any[]>;
  onSelect: (item: any) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(async () => {
      if (!q.trim()) {
        setItems([]);
        return;
      }
      try {
        const data = await fetcher(q);
        setItems(data ?? []);
        setOpen(true);
      } catch (e) {
        console.error("Autocomplete fetch error:", e);
      }
    }, 200);

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [q, fetcher]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="autocomplete" ref={containerRef}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={async () => {
          if (!q.trim()) {
            // cargar lista completa cuando el input está vacío
            const data = await fetcher("");
            setItems(data ?? []);
            setOpen(true);
          }
        }}
        placeholder={placeholder}
        className="autocomplete-input"
      />
      {open && items.length > 0 && (
        <div className="autocomplete-list">
          {items.map((it) => (
            <button
              key={it._id}
              onClick={() => {
                onSelect(it);
                setOpen(false);
                setQ("");
              }}
              type="button"
              className="autocomplete-item"
            >
              {it.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

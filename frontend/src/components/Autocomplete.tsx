import { useEffect, useRef, useState } from "react";

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
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(async () => {
      if (!q.trim()) {
        setItems([]);
        return;
      }
      let data: any[] = [];
      try {
        data = await fetcher(q);
      } catch (e) {
        console.error("Autocomplete fetch error:", e);
      }
      setItems(data ?? []);
    }, 200);

    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [q, fetcher]);

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
        className="border rounded px-3 py-2 w-72"
      />
      {open && items.length > 0 && (
        <div className="absolute z-10 bg-white border rounded w-full max-h-64 overflow-auto">
          {items.map((it) => (
            <button
              key={it.id_cliente ?? it.id_producto}
              onClick={() => {
                onSelect(it);
                setOpen(false);
                setQ("");
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
            >
              {it.nombre || `${it.nombres} ${it.apellidos ?? ""}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

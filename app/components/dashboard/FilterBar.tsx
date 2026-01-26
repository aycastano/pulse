"use client";

interface Props {
  search: string;
  setSearch: (v: string) => void;
}

export function FilterBar({ search, setSearch }: Props) {
  return (
    <input
      type="search"
      placeholder="Buscar items..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border rounded-lg px-4 py-2"
      aria-label="Buscar por título"
    />
  );
}

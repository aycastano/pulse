"use client"; // 👈 esto va en la primera línea

import itemsJson from "./data/items.json";
import { usePulseItems } from "./hooks/usePulseItems";
import { ItemCard } from "./components/dashboard/ItemCard";
import { FilterBar } from "./components/dashboard/FilterBar";
import type { PulseItem } from "./types/pulse";

export default function HomePage() {
  const items = itemsJson as PulseItem[];
  const pulse = usePulseItems(items);

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Pulse</h1>
        <p className="text-gray-600">Prioriza lo que realmente importa</p>
      </header>

      <FilterBar {...pulse} />

      {pulse.items.length === 0 ? (
        <p className="text-center text-gray-500">No hay resultados</p>
      ) : (
        <section className="space-y-3">
          {pulse.items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}

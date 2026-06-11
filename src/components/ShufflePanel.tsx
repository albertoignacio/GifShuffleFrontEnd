import { useState, useMemo, useEffect } from "react";
import client from "../api/client";
import { isAxiosError } from "axios";
import type { FriendResponse, ShuffleResponse } from "../types";

interface ShufflePanelProps {
  friends: FriendResponse[];
  onShuffle: () => void;
}

function Sparkle({ delay }: { delay: number }) {
  const style = {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${delay}ms`,
    width: `${4 + Math.random() * 8}px`,
    height: `${4 + Math.random() * 8}px`,
  };
  return (
    <span
      className="absolute rounded-full bg-gold-300 animate-sparkle pointer-events-none"
      style={style}
    />
  );
}

export default function ShufflePanel({
  friends,
  onShuffle,
}: ShufflePanelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [giftAmount, setGiftAmount] = useState("");
  const [includeCurrentUser, setIncludeCurrentUser] = useState(false);
  const [result, setResult] = useState<ShuffleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const [clearing, setClearing] = useState(false);

  const parsedAmount = useMemo(() => parseFloat(giftAmount) || 0, [giftAmount]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function isSelectionValid() {
    if (includeCurrentUser) return selectedIds.length >= 1;
    return selectedIds.length >= 2;
  }

  function selectionError() {
    if (includeCurrentUser) return "Seleccioná al menos 1 participante";
    return "Seleccioná al menos 2 participantes";
  }

  async function handleShuffle() {
    setError("");
    setResult(null);
    if (!isSelectionValid()) {
      setError(selectionError());
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.post<ShuffleResponse>("/shuffle", {
        friendIds: selectedIds,
        giftAmount: parsedAmount,
        includeCurrentUser,
      });
      setResult(data);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
      onShuffle();
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al ejecutar el sorteo");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleClearHistory() {
    if (
      !confirm(
        "¿Limpiar historial? Los pares anteriores podrán volver a asignarse.",
      )
    )
      return;
    setClearing(true);
    setError("");
    try {
      await client.delete("/shuffle/history");
      onShuffle();
    } catch {
      setError("Error al limpiar el historial");
    } finally {
      setClearing(false);
    }
  }

  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setCelebrating(false), 2000);
    return () => clearTimeout(timer);
  }, [result]);

  return (
    <div className="relative bg-warm-900/60 border border-warm-700/40 rounded-2xl p-6 sm:p-8 animate-fade-in-up overflow-hidden">
      {celebrating && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <Sparkle key={i} delay={i * 60} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl" aria-hidden="true">
          🎲
        </span>
        <h3 className="font-display text-lg text-cream-100">Sorteo</h3>
      </div>

      <div className="mb-5">
        <p className="text-sm text-cream-200/60 mb-3">
          Seleccioná los participantes:
        </p>
        <div className="flex flex-wrap gap-2">
          {friends.map((f) => {
            const selected = selectedIds.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggle(f.id)}
                className={`px-3.5 py-2 rounded-full text-sm border transition-all duration-200 cursor-pointer
                  ${
                    selected
                      ? "bg-crimson-600 text-cream-50 border-crimson-500 shadow-lg shadow-crimson-600/20"
                      : "bg-warm-800/40 text-cream-200/70 border-warm-700/40 hover:border-gold-400/30 hover:text-cream-100"
                  }`}
              >
                {f.name} {f.lastName}
              </button>
            );
          })}
        </div>
        {!friends.length && (
          <p className="text-cream-200/30 text-sm mt-3">
            Agregá amigos primero
          </p>
        )}
      </div>

      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-4">
          <label className="text-sm text-cream-200/60">
            Monto sugerido ($):
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className="bg-warm-800/60 border border-warm-700/50 rounded-lg px-4 py-2 w-32 text-cream-50 placeholder:text-cream-200/30 focus:outline-none focus:border-gold-400/50 transition-colors text-sm"
            value={giftAmount}
            onChange={(e) => setGiftAmount(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-cream-200/60 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeCurrentUser}
            onChange={() => setIncludeCurrentUser(!includeCurrentUser)}
            className="w-4 h-4 rounded border-warm-700/50 bg-warm-800/60 accent-crimson-600 cursor-pointer"
          />
          Participar yo también
        </label>
      </div>

      {error && (
        <p className="text-crimson-400 text-sm bg-crimson-600/10 rounded-lg py-2 px-4 mb-4 inline-block">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleShuffle}
          disabled={loading}
          className="bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-400 text-cream-50 px-8 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-40 cursor-pointer font-medium text-sm tracking-wide shadow-lg shadow-crimson-600/20"
        >
          {loading ? "Sortando..." : "¡Sortear!"}
        </button>
        <button
          onClick={handleClearHistory}
          disabled={clearing}
          className="border border-warm-700/50 text-sm text-cream-200/50 hover:text-cream-200 hover:border-warm-600 px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
        >
          {clearing ? "Limpiando..." : "Limpiar historial"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-5 bg-gradient-to-br from-gold-400/10 to-transparent border border-gold-400/20 rounded-xl animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg" aria-hidden="true">
              🎉
            </span>
            <p className="text-gold-300 font-display text-base">
              ¡Sorteo realizado con éxito!
            </p>
          </div>
          <div className="flex gap-6 text-sm mt-3">
            <span className="text-cream-200/60">
              Participantes:{" "}
              <strong className="text-cream-100">
                {result.participantCount}
              </strong>
            </span>
            <span className="text-cream-200/60">
              Monto:{" "}
              <strong className="text-gold-300">
                ${result.giftAmount.toFixed(2)}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

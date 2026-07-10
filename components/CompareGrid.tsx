import type { CompareResult } from "@/types";

type CompareGridProps = {
  results: CompareResult[];
  selectedProvider: CompareResult["provider"] | null;
  onSelect: (provider: CompareResult["provider"]) => void;
};

export default function CompareGrid({
  results,
  selectedProvider,
  onSelect,
}: CompareGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {results.map((result) => {
        const isSelected = selectedProvider === result.provider;

        return (
          <button
            key={result.provider}
            type="button"
            onClick={() => {
              if (result.status === "success" && result.text) {
                onSelect(result.provider);
              }
            }}
            disabled={result.status !== "success" || !result.text}
            className={`rounded-xl border p-3 text-left transition sm:p-4 ${
              isSelected
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                : "border-neutral-300 bg-white"
            } ${result.status === "success" && result.text ? "cursor-pointer active:bg-neutral-50 sm:hover:bg-neutral-50" : "cursor-default opacity-90"}`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-semibold">{result.label}</h3>
              {isSelected && (
                <span className="text-xs font-medium text-blue-600">Selected</span>
              )}
            </div>

            {result.status === "loading" && (
              <p className="text-sm text-neutral-500">Running extraction...</p>
            )}

            {result.status === "error" && (
              <p className="text-sm text-red-600">{result.error}</p>
            )}

            {result.status === "idle" && (
              <p className="text-sm text-neutral-500">Waiting to run...</p>
            )}

            {result.status === "success" && result.text && (
              <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-neutral-800">
                {result.text}
              </pre>
            )}
          </button>
        );
      })}
    </div>
  );
}

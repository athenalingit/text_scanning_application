import Link from "next/link";

type HeaderProps = {
  documentTitle: string;
  onDocumentTitleChange: (title: string) => void;
  onExport: () => void;
};

export default function Header({
  documentTitle,
  onDocumentTitleChange,
  onExport,
}: HeaderProps) {
  return (
    <header className="mb-3 rounded-2xl bg-white p-3 shadow-sm sm:mb-4 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500 sm:text-sm">Text Scanning App</p>
          <input
            value={documentTitle}
            onChange={(event) => onDocumentTitleChange(event.target.value)}
            className="w-full border-none text-xl font-bold outline-none sm:text-2xl"
          />
        </div>

        <button
          onClick={onExport}
          className="min-h-11 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white active:bg-neutral-800 sm:w-auto sm:py-2 sm:hover:bg-neutral-800"
        >
          Export TXT
        </button>
      </div>
    </header>
  );
}

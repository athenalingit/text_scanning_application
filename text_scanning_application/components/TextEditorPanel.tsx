type TextEditorPanelProps = {
  chapterTitle: string;
  text: string;
  onTextChange: (text: string) => void;
};

export default function TextEditorPanel({
  chapterTitle,
  text,
  onTextChange,
}: TextEditorPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="truncate text-base font-semibold sm:text-lg">
          {chapterTitle}
        </h2>
        <p className="shrink-0 text-xs text-neutral-500 sm:text-sm">
          {text.length} chars
        </p>
      </div>

      <textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Extracted text will appear here..."
        className="min-h-[50vh] w-full resize-y rounded-xl border border-neutral-300 p-3 text-base leading-7 outline-none focus:border-blue-500 sm:min-h-[600px] sm:p-4 sm:leading-8"
      />
    </section>
  );
}

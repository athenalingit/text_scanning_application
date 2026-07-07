type TextEditorPanelProps = {
  chapterTitle: string;
  text: string;
  onChapterTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
};

export default function TextEditorPanel({
  chapterTitle,
  text,
  onChapterTitleChange,
  onTextChange,
}: TextEditorPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="chapter-title" className="sr-only">
            Chapter name
          </label>
          <input
            id="chapter-title"
            value={chapterTitle}
            onChange={(event) => onChapterTitleChange(event.target.value)}
            placeholder="Chapter name"
            className="w-full border-none bg-transparent text-base font-semibold outline-none sm:text-lg"
          />
        </div>
        <p className="shrink-0 pt-1 text-xs text-neutral-500 sm:text-sm">
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

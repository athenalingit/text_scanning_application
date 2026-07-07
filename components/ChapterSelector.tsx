import type { Chapter } from "@/types";

type ChapterSelectorProps = {
  chapters: Chapter[];
  activeChapterId: string;
  onChapterChange: (chapterId: string) => void;
  onAddChapter: () => void;
};

export default function ChapterSelector({
  chapters,
  activeChapterId,
  onChapterChange,
  onAddChapter,
}: ChapterSelectorProps) {
  return (
    <div>
      <label
        htmlFor="chapter-select"
        className="mb-2 block text-sm font-medium sm:mb-3"
      >
        Current Chapter
      </label>

      <select
        id="chapter-select"
        value={activeChapterId}
        onChange={(event) => onChapterChange(event.target.value)}
        className="mb-3 min-h-11 w-full rounded-xl border border-neutral-300 p-3 text-base sm:p-2 sm:text-sm"
      >
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.title}
          </option>
        ))}
      </select>

      <button
        onClick={onAddChapter}
        className="min-h-11 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm active:bg-neutral-100 sm:py-2 sm:hover:bg-neutral-100"
      >
        + New Chapter
      </button>
    </div>
  );
}

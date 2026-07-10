#!/usr/bin/env python3
import json
import sys


def extract_text(image_path: str) -> str:
    from paddleocr import PaddleOCR

    ocr = PaddleOCR(use_angle_cls=True, lang="ch", show_log=False)
    result = ocr.ocr(image_path, cls=True)

    lines = []

    if result and result[0]:
        for line in result[0]:
            if line and len(line) > 1 and line[1] and line[1][0]:
                lines.append(line[1][0])

    return "\n".join(lines)


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Image path required"}))
        sys.exit(1)

    try:
        text = extract_text(sys.argv[1])
        print(json.dumps({"text": text}))
    except Exception as error:
        print(json.dumps({"error": str(error)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

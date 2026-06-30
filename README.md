# text_scanning_application

Idea: a web app where the user is able to create a "document", take photos of book pages and each scanned page is transcribed and appended in order into one growing text document. 

Important design decisions: split by chapter

User Flow:
1. Create new document
2. Scan a page
3. Preview page
4. OCR processing
5. Append page text
6. Edit text
7. Export Document

Tech Stack:
1. Frontend:
2. Backend: OCR processing
3. Database:
4. File storage:

OCR: Google Cloud Vision OCR supports text detection from images and dense document text detection. Also supports langage detection across many languages.
The pipeline for OCR: user takes picture -> frontend compresses image -> upload image to storage -> create page record with status "processing" -> backend sends image to OCR -> OCR returns text -> backend saves OCR text -> frontend refreshes document text

Notes: 
- horizontal vs vertical text

However, the app may still keep a hidden scan history:

Document
  └── Chapter
        └── Scan 1
        └── Scan 2
        └── Scan 3
        └── Combined chapter text

This allows the app to support features like undoing the last scan, retrying OCR, or reviewing the original scanned image.

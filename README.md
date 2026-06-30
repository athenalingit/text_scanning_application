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


# Web app layout
Dashboard Page

The dashboard is where users manage their documents.
------------------------------------------------
Text Scanning Application
------------------------------------------------

[ + New Document ]

Recent Documents
------------------------------------------------
Document Title              Last Edited
------------------------------------------------
Chinese Book Notes          June 30, 2026
Translation                 June 28, 2026
Class Reading               June 25, 2026
------------------------------------------------

Main features:

View all existing documents.
Create a new document.
Open a previous document.
Delete or rename a document later.
Document Editor Page

The document editor is the main workspace where users scan pages and edit text.

------------------------------------------------
[ Back ]  Document Title                 [ Export ]
------------------------------------------------

Current Chapter: [ Chapter 1 ▼ ]   [ + New Chapter ]

------------------------------------------------
Scan Area
------------------------------------------------

[ Camera Preview / Uploaded Image Preview ]

[ Scan Page ]   [ Upload Image ]   [ Retake ]

OCR Status: Processing...

------------------------------------------------
Chapter Text Editor
------------------------------------------------

Chapter 1

[ Continuous editable text area ]

The OCR text from each scanned page is appended here
chronologically as the user continues scanning.

------------------------------------------------

[ Undo Last Scan ]   [ Save Changes ]   [ Copy Text ]
------------------------------------------------

Main features:

Select the current chapter.
Add a new chapter.
Scan or upload a page image.
Preview the image before OCR.
Send the image to OCR.
Append OCR text to the current chapter.
Edit the chapter text directly.
Undo the last scan.
Export the full document.
Document Structure

The application should structure documents like this:

Document
  └── Chapter 1
        └── continuous transcribed text
  └── Chapter 2
        └── continuous transcribed text
  └── Chapter 3
        └── continuous transcribed text

The user-facing text should be chapter-based, not page-based.

However, the app may still keep a hidden scan history:

Document
  └── Chapter
        └── Scan 1
        └── Scan 2
        └── Scan 3
        └── Combined chapter text

This allows the app to support features like undoing the last scan, retrying OCR, or reviewing the original scanned image.

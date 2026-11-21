# Roll Rescue: Build Spec (MVP)

Read this whole file first. Then build exactly what is written here. Keep the code simple and easy to read. Do not add features that are not listed.

## 1. What we are building
A small website that helps a voter in India check if their name was removed from the voter list (the "ASDD" list: Absent, Shifted, Dead, Duplicate) and what to do next.

Two modes:
- **Voter mode:** search your name, or upload a photo of a list page. See status, booth number, and a "what to do next" checklist.
- **Volunteer mode:** upload a booth list and get a clean table with simple stats and flags.

## 2. Tech rules (very important)
- The site must deploy on **Vercel**.
- Use **Next.js (App Router) + TypeScript + Tailwind CSS**.
- **No Python server and no Tesseract on the server.** Vercel cannot run them.
- Sample data is stored as **JSON files in `/data`**.
- Reading a photo of a list page is done by a **vision AI API (Gemini)**, called from a Next.js API route. Read the key from `GEMINI_API_KEY` and the model name from `GEMINI_MODEL` (environment variables). Never put the key in the code.
- Fuzzy search uses **fuse.js**.
- Compress uploaded photos in the browser (max width about 1600 px) before sending. Vercel request bodies are small.
- Mobile first. Big buttons. Simple English.

## 3. Data format
One record per person in `/data/sample-booth.json`:

```json
{
  "id": "1",
  "serial_no": 12,
  "name": "Venkata Ramana",
  "name_local": "వెంకట రమణ",
  "relative_name": "Subba Rao",
  "relative_name_local": "సుబ్బారావు",
  "age": 52,
  "gender": "M",
  "part_no": 45,
  "old_part_no": 38,
  "status": "Shifted"
}
```

`status` is one of: `Absent`, `Shifted`, `Dead`, `Duplicate`, `Other`.

**Use fake (synthetic) names for the demo data. Do not use real people's names.** Make about 150 records, with some similar names and different spellings so the fuzzy search can be shown off.

## 4. Pages

### `/` Home
- Short title and one-line description.
- Two big buttons: "Check my name" and "Volunteer mode".
- Small note: "This tool shows possible matches only. Please confirm with your Booth Level Officer (BLO)."

### `/check` Voter mode
- Form: your name, relative's name (optional), age (optional).
- Button: "Search".
- Button: "Upload a photo of a list page". The photo goes to `/api/extract`. The extracted rows are shown in a table and become searchable.
- Results: show up to 5 matches as cards. Each card shows name, relative, age, old and new booth number, and status in plain words (for example, "Shifted means the officer believed you moved to another address").
- Below the results, show the "What to do next" checklist (see `/guide`).
- Always show: "Possible match. Please verify with your BLO."

### `/volunteer` Volunteer mode
- Upload one or more photos, or a CSV, of a booth list.
- Show a clean table (sortable, searchable).
- Show counts per status with a simple bar chart.
- Show flags, each labelled "needs human check":
  - status is `Dead` but age is under 25
  - two records with the same name, relative and similar age (possible duplicate)
- Button: "Download CSV".

### `/guide` What to do next
- Static page with a printable checklist.
- Say that a left-out voter may need to apply again using **Form 6**, and tell the user to check the latest rules on the official Election Commission or state CEO website.
- Keep the text (documents list, deadlines) in one editable file, `/data/guide.json`, because the facts must be checked against official sources before the demo.

## 5. API routes
- `POST /api/extract`: receives an image (base64). Calls the vision API and returns rows in the data format above as JSON. Must handle Telugu, Hindi and English text. If the API fails, return a clear error message.
- (Optional, if time) `POST /api/explain`: receives one match and a language, and returns a short plain-language explanation.

## 6. Matching rules
- Normalize text: lowercase, remove dots and extra spaces.
- Treat common spelling variants as similar (v/w, th/t, double letters, "kumar/kumaar").
- Search both `name` and `name_local`, and use `relative_name` as an extra signal.
- Use fuse.js with a score threshold. Show the top 5 only.

## 7. Privacy and neutrality
- No login and no database. Do not save uploaded images or extracted data. Process in memory only.
- No political content or opinions anywhere. The tool helps every eligible voter equally.
- Never say "you were wrongly deleted." Only say "possible match" and "please verify."

## 8. Build order (do one step at a time and stop after each)
1. Project setup, Tailwind, home page.
2. Sample data file, and the `/check` page with fuzzy search on the sample data.
3. `/guide` page and the checklist.
4. `/api/extract` and photo upload on `/check`.
5. `/volunteer` page: table, stats, flags, CSV download.
6. Claim Pack (see section 10A).
7. Voice search (see section 10B).
8. Clean up the UI, add loading and error states, write the README, and prepare for Vercel.

## 9. Done means
- `npm run build` passes with no errors.
- The demo flow works: search a name with a different spelling → match appears → checklist shows → upload a photo → rows appear → volunteer mode shows stats.
- The site runs on Vercel with the environment variables set.

## 10. Extra features (build ONLY after steps 1 to 5 work)

### 10A. Claim Pack (printable, ready to submit)
Goal: after a voter finds their match, they get one printable page they can take to the BLO or office. This turns the site from "search" into "get the work done".

- On each result card, add a button: "Get my Claim Pack".
- Ask only for the details we need, in a small form: full name, relative's name, age, current address (typed by the user). All of this stays in the browser. Never save or send it to a server except the translation call below.
- Build a one-page printable sheet (use print CSS or jsPDF, client side) with:
  1. The voter's details, pre-filled.
  2. The match details: old and new part number, serial number, status.
  3. A checklist of documents, read from `/data/guide.json`.
  4. A short script: "What to say to the BLO" (3 to 4 simple sentences).
- Language: show the sheet in English, and also in the voter's chosen language (Telugu or Hindi). Translate with the Gemini API in `POST /api/translate`. Add this line under the translated text: "Machine translated. Please check with someone who knows the language."
- Do NOT invent legal rules, deadlines or form names. Take them only from `/data/guide.json`. If a value is missing, print "Check the official Election Commission website."
- Add a "Share on WhatsApp" button that shares a short text summary (no personal details).

### 10B. Voice search (for people who cannot type well)
Goal: a voter can say their name out loud and the site searches for it.

- On `/check`, add a big microphone button next to the name field.
- Use the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Let the user pick English, Telugu (`te-IN`) or Hindi (`hi-IN`).
- Put the recognized text into the name field and run the search. The user must be able to edit the text.
- If the browser does not support speech recognition, hide the button and show a small note. Do not break the page.
- Show a short privacy note: "Your browser's speech service may process your voice."
- Speech recognition is not perfect for names, so the fuzzy search and the "possible match" wording matter even more.

# Valdara Dressage

High-fidelity prototype of the Valdara Dressage website — a static HTML/CSS/JS site hosted on Vercel. Every push to `main` deploys automatically.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Program Curriculum | `curriculum.html` |
| Our Horses | `horses.html` |
| Calendar | `calendar.html` |
| Lessons | `lessons.html` |
| Blog | `blog.html`, `blog-bwp-stallion-selection.html` |
| Contact Us | `contact.html` |

## Editing

Pages are generated from `src/` so the header and footer live in one place:

- `src/layout.html` — shared `<head>`, navigation, and footer
- `src/pages/*.html` — each page's content (first line holds its title, description, and active nav tab)

After editing anything in `src/`, rebuild the root HTML files and commit them:

```bash
python3 build.py
```

Styles are in `css/styles.css` and behavior (nav, filters, calendar, forms) in `js/main.js`; those are edited directly.

## Brand

- Colors: `#000000` black · `#372314` espresso · `#8C0000` oxblood · `#FAF3CD` cream · `#FFC917` gold · `#CD8417` copper
- Headings: Raleway · Body: Inter (self-hosted in `assets/fonts/`)

## Prototype notes

Forms (contact, newsletter) show a confirmation but do not send anything yet. Horse names and pedigrees, event dates, prices, statistics, phone number, and email are placeholders to replace with real details.

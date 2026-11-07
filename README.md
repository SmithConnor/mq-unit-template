# MQ Unit Template (Quarto)

A reusable Quarto template for developing teaching materials for a Macquarie University unit. Each new unit starts from this repo, so every unit has the same folder structure, styling and conventions.

Each week has four parts:

| Part | File | Format | Purpose |
|------|------|--------|---------|
| Lecture | `wkNN-lecture.qmd` | Reveal.js slides | 2-hour core lecture with speaker notes |
| Advanced | `wkNN-advanced.qmd` | Reveal.js slides | 1-hour extension lecture |
| SGTA | `wkNN-sgta.qmd` | HTML | 1-hour tutorial revising the *previous* week's core theory |
| Practical | `wkNN-practical.qmd` | HTML | 1-hour hands-on practical (e.g. Excel) |

SGTA and practical solutions sit in the same source files and only appear when you render with the `solutions` profile.

---

## Requirements

- [Quarto](https://quarto.org/docs/get-started/) 1.4 or later
- Git
- [GitHub CLI](https://cli.github.com/) (`gh`), optional but recommended
- R or Python, only if your files run code chunks

Check your Quarto version with:

```bash
quarto --version
```

---

## Starting a new unit

**Option A: GitHub CLI**

```bash
gh repo create unit0000-s1-2027 --private --template SmithConnor/mq-unit-template --clone
cd unit0000-s1-2027
```

**Option B: Quarto**

```bash
quarto use template SmithConnor/mq-unit-template
```

**Option C: GitHub website**

Go to [github.com/SmithConnor/mq-unit-template](https://github.com/SmithConnor/mq-unit-template), click **Use this template → Create a new repository**, set the visibility to **Private**, then clone it.

### Then set up the unit details

1. Edit `_variables.yml` with the unit code, name, session and convenor:

   ```yaml
   unit:
     code: STAT1170
     name: Introductory Statistics
     session: Session 1, 2027
     convenor: Convenor Name
     ilearn: https://ilearn.mq.edu.au/
   ```

2. Update `website.title` in `_quarto.yml` and `_quarto-solutions.yml`.
3. Update the schedule table in `index.qmd`.
4. Commit:

   ```bash
   git add -A && git commit -m "Set up unit details"
   ```

---

## Weekly workflow

### Create a week

```bash
quarto run scripts/new-week.ts 5 "Discrete random variables and the binomial"
```

This creates:

```
weeks/wk05/
├── wk05-lecture.qmd
├── wk05-advanced.qmd
├── wk05-sgta.qmd
└── wk05-practical.qmd
```

The script never overwrites existing files, so it's safe to re-run. If you forget the week number, it prints a usage message and stops without creating anything.

### Preview while you write

```bash
quarto preview weeks/wk05/wk05-lecture.qmd
```

The browser reloads each time you save.

### Render everything

```bash
quarto render                       # student version   → _site/
quarto render --profile solutions   # staff/solutions   → _site-solutions/
```

To render a single file with solutions:

```bash
quarto render weeks/wk05/wk05-sgta.qmd --profile solutions
```

---

## Writing conventions

### Speaker notes (lecture and advanced decks)

```markdown
## Slide title

Slide content…

::: notes
What to say on this slide.
:::
```

Press **S** in a rendered deck to open speaker view.

### Solutions (SGTA and practical)

```markdown
## Question 1

Question text…

::: {.content-visible when-profile="solutions"}
::: {.callout-tip title="Solution"}
Worked solution…
:::
:::
```

Solutions are hidden in the default render and shown only with `--profile solutions`.

### Unit variables

Use variables instead of hard-coding unit details, so a new offering only needs `_variables.yml` changed:

```markdown
Welcome to {{< var unit.code >}} {{< var unit.name >}}, {{< var unit.session >}}.
```

### Data files

Put shared datasets in `data/`. Put week-specific files (e.g. `wk05-data.xlsx`) in that week's folder so download links stay simple.

### File naming

Always use `wkNN-part.qmd` with a two-digit week number (`wk01`, not `wk1`) so files sort correctly.

---

## Repository layout

```
mq-unit-template/
├── _quarto.yml                  # project + website config
├── _quarto-solutions.yml        # "solutions" profile overrides
├── _variables.yml               # unit code, name, session, convenor
├── _extensions/mqteach/         # MQ styling (slides + documents)
├── templates/                   # skeleton files used by new-week.ts
├── scripts/new-week.ts          # week scaffolding script
├── weeks/                       # wk01/, wk02/ … (created by the script)
├── data/                        # shared datasets
├── index.qmd                    # unit home page + schedule
└── README.md
```

---

## Customising the look

All styling is in the `mqteach` extension:

- `_extensions/mqteach/_extension.yml`: format options (slide size, slide numbers, TOC, etc.)
- `_extensions/mqteach/mq-slides.scss`: slide theme
- `_extensions/mqteach/mq-docs.scss`: SGTA/practical theme

Files use it via `format: mqteach-revealjs` or `format: mqteach-html`.

> **Note:** The colour values are approximations. Check them against the current MQ brand guidelines, and add the official logo from MQ brand assets before using the materials publicly.

To change what new weeks look like, edit the files in `templates/`. Tokens replaced by the script:

| Token | Replaced with | Example |
|-------|---------------|---------|
| `__WEEK__` | Week number | `5` |
| `__WK__` | Zero-padded week | `05` |
| `__PREV__` | Previous week | `4` |
| `__TOPIC__` | Topic text | `Discrete random variables` |

---

## Keeping units up to date with the template

Repos created from a GitHub template start with fresh history, so later changes to this template **do not** flow automatically into existing units.

- **Styling:** if the `mqteach` extension is moved to its own repo, existing units can update with:

  ```bash
  quarto update SmithConnor/mqteach
  ```

- **Other changes** (scripts, skeletons): copy the changed files across manually.

---

## Privacy and copyright

- **Keep unit repos private.** Solutions are stored in the same source files as the student materials.
- Only publish or upload the **default** render (`_site/`), never `_site-solutions/`.
- Check that any textbook figures, datasets or third-party content can be reused under the relevant licence or copyright provisions.
- Deliver materials to students through iLearn as usual.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Usage: quarto run scripts/new-week.ts …` | You left out the week number or it wasn't a number. Run e.g. `quarto run scripts/new-week.ts 5 "Topic"`. |
| `Unknown format mqteach-revealjs` | The `_extensions/mqteach/` folder is missing. Re-copy it from this template. |
| Solutions appear in the student version | Check the block uses `when-profile="solutions"` (spelled exactly) and that you didn't render with `--profile solutions`. |
| Code changes not showing | `freeze: auto` caches results. Re-render the file, or delete `_freeze/` to force a full re-run. |
| Excel lock files committed | `~$*.xlsx` is in `.gitignore`. Close Excel and remove them with `git rm --cached`. |

---

## Maintainer

Maintained by [SmithConnor](https://github.com/SmithConnor), Macquarie University. Suggestions and fixes welcome via [issues](https://github.com/SmithConnor/mq-unit-template/issues) or pull requests.
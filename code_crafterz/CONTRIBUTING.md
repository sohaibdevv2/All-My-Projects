<div align="center">

<img src="assets/banner.svg" width="100%" alt="CodeCrafterz"/>

# 🤝 Contributing to CodeCrafterz

**Thank you for wanting to make this collection even better.**<br/>
Every great tutorial added here helps another developer understand technology more deeply.

</div>

---

## 📋 Table of Contents

- [Before You Start](#-before-you-start)
- [What Makes a Great Tutorial](#-what-makes-a-great-tutorial)
- [How to Submit](#-how-to-submit)
- [Content Standards](#-content-standards)
- [Adding a New Category](#-adding-a-new-category)
- [Style Guide](#-style-guide)

---

## 🌱 Before You Start

Please read these guidelines carefully. Pull requests that don't follow them may be closed without review.

> **The core principle:** A tutorial must build something **meaningful, from scratch**, in a **step-by-step** manner.

---

## ✅ What Makes a Great Tutorial

A tutorial is a good fit if it:

- ✅ Builds a real, recognizable technology from scratch (no wrappers/facades)
- ✅ Is step-by-step - not just a code dump
- ✅ Is publicly available and free to read
- ✅ Uses a real programming language (not pseudocode only)
- ✅ Is well-written and maintained
- ✅ Produces a working final product

A tutorial is **not** a good fit if it:

- ❌ Uses a high-level library that does all the heavy lifting
- ❌ Is behind a paywall
- ❌ Is a "use this framework" tutorial rather than building from scratch
- ❌ Duplicates an existing entry exactly
- ❌ Is just a GitHub repo with no explanation or article

---

## 🔃 How to Submit

### Step 1 - Fork & Clone

```bash
git clone https://github.com/<your-username>/code_crafterz.git
cd code_crafterz
```

### Step 2 - Add Your Entry

Find the correct section in `README.md`. Entries within a section should be sorted **alphabetically by language**.

Use this table row format:

```markdown
| `Language` | [Tutorial Title](https://url-to-tutorial.com) | Difficulty |
```

For the `index.html`, add a matching `<a class="tutorial-card">` entry in the appropriate section.

### Step 3 - Commit

```bash
git add README.md index.html
git commit -m "add: [Language] Tutorial Title"
```

### Step 4 - Open a Pull Request

- Title: `add: [Language] Tutorial Title`
- Body: Brief description of what the tutorial builds and why it's a good fit

---

## 📐 Content Standards

### Difficulty Ratings

| Rating | Meaning |
|:---:|:---|
| `⭐` | Beginner - can be done in a few hours |
| `⭐⭐` | Easy - a weekend project |
| `⭐⭐⭐` | Intermediate - solid fundamentals needed |
| `⭐⭐⭐⭐` | Advanced - deep knowledge required |
| `⭐⭐⭐⭐⭐` | Expert - serious commitment needed |

### Media Tags

Add `📹 Video` in the Type column if the tutorial is video-based.
Add `📝 Article` for text-based tutorials (default - no tag needed).
Add `📚 Book` for full books.

---

## 🗂️ Adding a New Category

If you'd like to add a whole new category:

1. The category must have at least **4 high-quality tutorials** ready to be added
2. Open an issue first with the proposed category name and initial tutorials
3. If approved, add it to both `README.md` and `index.html`
4. Add the category to the navigation table at the top of the README

---

## 🎨 Style Guide

- Use backtick formatting for language names: `` `Python` ``, `` `Rust` ``
- Tutorial titles should match the original article title as closely as possible
- Links must be direct to the tutorial, not to a homepage
- Keep descriptions concise - the title should speak for itself

---

<div align="center">

*Questions? Open an [issue](https://github.com/sohaibdevv/code_crafterz/issues).*

**Maintained by [sohaib malik](https://github.com/sohaibdevv)**

</div>

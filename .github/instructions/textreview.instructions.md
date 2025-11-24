---
applyTo: "**/*.md,**/*.mdx"
---

# Project Overview

This is the ConfigCat documentation repository, a Docusaurus-based documentation site for ConfigCat's feature flag and configuration management service. The site is available at https://configcat.com/docs.

## Architecture

### Key Technologies

- **Docusaurus 3.8+**
- **TypeScript**
- **OpenAPI docs plugins**
  - Public Management API: https://api.configcat.com/docs/v1/swagger.json
  - SCIM API: https://scim-api.configcat.com/openapi/v1/openapi.json
- **Algolia**
- **SASS**

### Documentation Versioning

The site maintains two versions:
- **Config V2** (current) - Default version at `/docs/`
- **Config V1** (legacy) - Available at `/docs/V1/`, excluded from sitemap

### Directory Structure

- **`website/docs/`** - Main documentation content (MDX files)
  - `sdk-reference/` - Documentation of ConfigCat SDKs for various platforms
  - `integrations/` - Integration guides
  - `advanced/` - Guides on advanced topics
  - `targeting/` - Targeting and feature flag evaluation docs
  - `glossary/` - Glossary of terms
- **`website/api/`** - ConfigCat Public Management API documentation content
- **`website/src/`** - React components, custom CSS, and plugins
  - `components/` - Reusable React components
  - `schema-markup/` - JSON-LD schema markup files for SEO
  - `pages/` - Custom pages
  - `css/` - Custom SCSS styles
- **`website/static/`** - Static assets (images, etc.)
- **`website/versioned_docs/`** - Config V1 documentation
- **`website/sidebars.ts`** - Main sidebar configuration (defines navigation structure)
- **`website/docusaurus.config.ts`** - Docusaurus configuration

### Important Configuration Details

- **Base URL:** `/docs/` (not root)
- **Trailing slashes:** Enabled
- **Multi-language support:** Configured but only English enabled

# Review Focus

When reviewing documentation changes, check for:
* **Typos and grammatical errors**.
* **Adherence to the writing style and text formatting guidelines defined by ConfigCat's Guidelines for Text below.
* **Accuracy of any code snippets or technical instructions**.

# ConfigCat's Guidelines for Text

## 1. Introduction

This document provides guidelines for writing and formatting text.

Its purpose is to serve as a single reference point for the entire company.

## 3. General guidelines

* Provide links when referencing other parts of the application.
* When including code examples in non-platform/language-specific documentation, use JavaScript code examples.

## 4. Spelling, wording, copywriting

* Use US English (e.g. "initialize" vs. "initialise", "color" vs "colour", "canceled" vs "cancelled", etc.)
* Aim for simple language.
* Aim for an informal, friendly tone (the most in emails, the least in technical documentation).
* Informal spelling is allowed (e.g. contracted forms like "it's", "doesn't" can be used, "can't" can be used instead of "cannot", etc.) - but **avoid it**
  * in formal text (technical documentation, legal text, etc.)
  * when strong emphasis is needed ("Do not do this", "You can not do that", etc.)
* Don't mix formal and informal language within smaller units of text.
* Aim for conciseness (except where precision is essential, e.g. in reference-like documentation).
* Aim for explicit wording. Avoid forcing the reader to infer information, i.e. to "read between the lines".
  * If unsure whether to be concise or explicit, choose the latter.

## 5. Typography, text formatting

> [!NOTE]
> TL;DR
> * Use **bold** style for quoting text specified by users, for quoting labels from UI or for highlighting key information.
> * Use _italic_ style for emphasizing the special meaning of a word, especially when introducing a technical term.
> * Use `code` style for code-like text (identifiers quoted from code, code snippets, file system paths, etc.)
> * Use Title Case for page titles and when referring to page titles (e.g. in menus).
> * Use Sentence case for other other titles (subsection titles, dialog titles, action-like menu items).
> * Use Pascal Case for [a set of ConfigCat-related terms](#54-technical-terms-and-concepts) - but only for those.

### 5.1. Headings

* Items at the same level in the hierarchy should have the same heading size.
* **Size**
  * Main titles (page titles): `#`
  * Subsection titles: `##`
* **Text casing**
  * Main titles: "Main Titles Are Written in Title Case"
  * Subsection titles: "Subsection titles are written in sentence case"
    * Preserve [Pascal-cased terms](#54-technical-terms-and-concepts) in subsection titles. E.g.: "The relationship between the User Object and targeting rules"
  * When in doubt about the title case spelling, use [this tool](https://capitalizemytitle.com/style/APA/)

### 5.2. Text quoted from users

* When quoting text specified by users (even if it quoted from a screenshot), format it in **bold**. (Wrap it in a `<strong>` tag in HTML, use `**` in MD.)
  * E.g.: "Delete the **Join.me** product?"

### 5.3. Text quoted from UI

* When quoting labels from UI (or from a screenshot), format it in **bold** unless it's a link. (Wrap it in a `<strong>` tag in HTML, use `**` in MD.)
  * E.g.: "Choose the **My Account** menu item, then click the **CHANGE PASSWORD** button."

### 5.4. Technical terms and concepts

* When using a word in a special sense, especially when introducing a concept or defining a technical term, format it in italics at the first use of the word. (Wrap it in an `<em>` tag in HTML, use `_` in MD.)
  * E.g.: "A _setting_ in ConfigCat means..."
  * E.g.: "A _condition_ is a logical expression that can be evaluated to true or false. There are three types of conditions: ..."
* In contexts where it's not clear whether a word is referring to a ConfigCat-specific term, make it disambiguous by prepending "ConfigCat":
  * E.g.: "You need to map your real-world environment to a ConfigCat environment."
  * E.g.: "LaunchDarkly environments are mapped to ConfigCat environments as follows..."
* Write these name-like ConfigCat-specific terms in Pascal case:
  * (ConfigCat) Public Management API, (ConfigCat) Dashboard, (ConfigCat) Playground, etc. (i.e. names of ConfigCat products, user interfaces and services)
  * Organization Admin, Billing Manager
  * ConfigCat SDK
  * SDK Key (for historical reasons)
  * User Object
  * Auto Polling, Manual Polling, Lazy Loading

  **Don't write other terms in Pascal case without discussing them with the UX team first.**

### 5.5. Key information

* In larger blocks of dense text, highlight key (partial) sentences in **bold**. (Wrap it in a `<strong>` tag in HTML, use `**` in MD.)
* Aim for the highlighted parts to make sense when read together.

### 5.6. Code and code snippets

* For code-like text, use code style with monospace font.
  * Inline text: `a + b` (Wrap it in a `<code>` tag in HTML, use `` ` `` in MD.)
  * Code block:
    ```js
    const x = a + b;
    ```
    (Wrap it in `<pre><code class="language-xlang">...</code></pre>` tags in HTML when using prismjs, use ```` ```xlang ```` in MD.)

### 5.7. Data formats

* Numbers: 0.123 / -0.123
  * Use grouping for large numbers. E.g.: 1,000,000
* Dates: 2025-02-17 16:00 UTC

### 5.8. Menu items

* If the menu item navigates to a page, use the same text casing as the page title, i.e. title case.
  * E.g.: "Members and Roles"
* For other actions, use sentence case.
  * E.g.: "Sign out"
  * If the action includes a Pascal-cased term, preserve the casing. E.g.: "Delete User Object".

### 5.9. Dialog titles

* Use sentence case.

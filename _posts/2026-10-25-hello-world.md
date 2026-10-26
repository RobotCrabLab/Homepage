---
title: Hello, world
tags: [meta]
---

This site is up and running. This first post doubles as a reminder of how to write the next one.

## Writing a new post

1. Open the `_posts` folder in the repository.
2. Click **Add file → Create new file**.
3. Name it with the date first, like `2026-11-02-my-new-post.md`.
4. Start the file with a short header between two `---` lines, like this:

```
---
title: My new post
tags: [projects, electronics]
---
```

Write the post below that header in Markdown, then click **Commit changes**.

The site rebuilds on its own, and the post shows up on the [blog page]({{ '/blog/' | relative_url }}) a minute or two later.

## A few Markdown basics

Use `**bold**` for **bold**, `*italic*` for *italic*, and `[link text](https://example.com)` for links. Start a line with `## ` for a heading, or `- ` for a bulleted list.

> A line that starts with `>` becomes a quote, like this one.

To add a picture, upload it to `assets/images/` and write:

```
![What the picture shows]({{ '{{' }} '/assets/images/photo.jpg' | relative_url }})
```

Feel free to delete this post once you've written your own.

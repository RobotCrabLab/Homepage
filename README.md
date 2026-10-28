# Homepage

Breadboard Bay: my personal site, with portfolio, resume, photography and blog. It's built with Jekyll and published by GitHub Pages at **https://robotcrablab.github.io/Homepage/**.

Every change committed to `main` rebuilds the site automatically within a minute or two. You can watch the build in the **Actions** tab.

## Where things live

| To change…                    | Edit this                          |
| ----------------------------- | ---------------------------------- |
| Your name, tagline, email, links | `_config.yml`                    |
| The home page                 | `index.html`                       |
| Resume                        | `_data/resume.yml`                 |
| Photography page              | `_data/photos.yml` (photos in `assets/images/photography/`) |
| Projects                      | one file per project in `_projects/` |
| Blog posts                    | one file per post in `_posts/`     |
| Colors and fonts              | `assets/css/style.css` (top of file) |
| Images                        | upload to `assets/images/`         |

## Add a project

Create a file in `_projects/`, for example `_projects/my-project.md`:

```
---
title: My project
summary: One sentence about what it is.
year: 2026
status: Finished          # or In progress, Paused…
tools: [Python, Arduino]
link: https://github.com/RobotCrabLab/my-project   # optional
image: /assets/images/my-project.jpg                # optional
featured: true            # show it on the home page
order: 1                  # lower numbers come first
---

Write about the project here in Markdown.
```

## Add a photo

Resize it to about 2000px wide and save a second copy about 900px wide with `-sm` on the end of the name (for example `great-egret.jpg` and `great-egret-sm.jpg`). Upload both to `assets/images/photography/`, then add a block to `_data/photos.yml`:

```
- file: great-egret.jpg
  title: Great egret
  note: Optional second line
  alt: A short description of the photo
  wide: true            # only for landscape shots
  width: 2000
  height: 1333
```

## Write a blog post

Create a file in `_posts/` named with the date first, like `_posts/2026-11-02-first-real-post.md`:

```
---
title: First real post
tags: [electronics]
---

The post text goes here.
```

Posts dated in the future won't appear until that date.

## Rename to a shorter address

To serve the site at `https://robotcrablab.github.io/` instead, rename the repository to `robotcrablab.github.io` and set `baseurl: ""` in `_config.yml`.

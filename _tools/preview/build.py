"""Rough Jekyll stand-in so the site can be previewed without Ruby gems.
Usage: python3 build.py SRC OUT
"""
import os, re, sys, shutil, datetime, yaml, markdown
from liquid import Environment

SRC, OUT = sys.argv[1], sys.argv[2]
cfg = yaml.safe_load(open(os.path.join(SRC, "_config.yml")))
BASE = cfg.get("baseurl", "")

env = Environment()
env.filters["relative_url"] = lambda v: BASE + str(v)
env.filters["date_to_xmlschema"] = lambda d: d.isoformat()
env.filters["date"] = lambda d, fmt: d.strftime(fmt)
def _sort(seq, key=None):
    return sorted(seq, key=lambda x: (x.get(key) is None, x.get(key) or 0)) if key else sorted(seq)
env.filters["sort"] = _sort
env.filters["where"] = lambda seq, k, v: [x for x in seq if x.get(k) == v]

FM = re.compile(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", re.S)
def read(path):
    raw = open(path, encoding="utf-8").read()
    m = FM.match(raw)
    if not m: return None, raw
    return (yaml.safe_load(m.group(1)) or {}), m.group(2)

INC = re.compile(r"{%-?\s*include\s+(\S+)(.*?)-?%}")
ARG = re.compile(r'(\w+)=("([^"]*)"|\S+)')
def expand(tpl, ctx):
    def rep(m):
        name, argstr = m.group(1), m.group(2)
        args = {}
        for a in ARG.finditer(argstr):
            v = a.group(3) if a.group(3) is not None else a.group(2)
            v = {"true": True, "false": False}.get(v, v)
            if isinstance(v, str) and v.isdigit(): v = int(v)
            args[a.group(1)] = v
        body = open(os.path.join(SRC, "_includes", name), encoding="utf-8").read()
        return render(body, {**ctx, "include": args})
    return INC.sub(rep, tpl)

def render(tpl, ctx):
    tpl = tpl.replace("{% seo %}", "<title>{{ page.title | default: site.title }}</title>").replace("{% feed_meta %}", "")
    return env.from_string(expand(tpl, ctx)).render(**ctx)

md = lambda s: markdown.markdown(s, extensions=["fenced_code", "tables"])

def layout_chain(name, content, ctx):
    while name:
        fm, body = read(os.path.join(SRC, "_layouts", name + ".html"))
        content = render(body, {**ctx, "content": content})
        name = (fm or {}).get("layout")
    return content

def defaults(kind):
    return {"posts": "post", "projects": "project"}.get(kind, "page")

site = {**cfg, "data": {}}
for f in os.listdir(os.path.join(SRC, "_data")):
    site["data"][f.rsplit(".", 1)[0]] = yaml.safe_load(open(os.path.join(SRC, "_data", f)))

# collections
posts = []
for f in sorted(os.listdir(os.path.join(SRC, "_posts"))):
    fm, body = read(os.path.join(SRC, "_posts", f))
    y, mo, d, slug = f[:4], f[5:7], f[8:10], f[11:].rsplit(".", 1)[0]
    fm.update(date=datetime.datetime(int(y), int(mo), int(d)), url=f"/blog/{y}/{mo}/{slug}/",
              tags=fm.get("tags", []), _body=body, _md=f.endswith(".md"), _kind="posts")
    posts.append(fm)
posts.sort(key=lambda p: p["date"], reverse=True)
for i, p in enumerate(posts):
    p["next"] = posts[i - 1] if i > 0 else None
    p["previous"] = posts[i + 1] if i + 1 < len(posts) else None
projects = []
for f in sorted(os.listdir(os.path.join(SRC, "_projects"))):
    fm, body = read(os.path.join(SRC, "_projects", f))
    fm.update(url=f"/projects/{f.rsplit('.',1)[0]}/", _body=body, _md=True, _kind="projects")
    projects.append(fm)
site["posts"], site["projects"] = posts, projects

def emit(page):
    ctx = {"site": site, "page": page}
    content = render(page["_body"], ctx)
    if page["_md"]: content = md(content)
    html = layout_chain(page.get("layout") or defaults(page["_kind"]), content, ctx)
    url = page["url"]
    dest = os.path.join(OUT, BASE.strip("/"), url.strip("/"))
    if not url.endswith(".html"): dest = os.path.join(dest, "index.html")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w").write(html)

shutil.rmtree(OUT, ignore_errors=True)
for p in posts + projects: emit(p)
for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if not d.startswith(("_", ".")) ]
    for f in files:
        path = os.path.join(root, f); rel = os.path.relpath(path, SRC)
        if f in ("README.md",): continue
        fm, body = read(path) if f.endswith((".html", ".md")) else (None, None)
        if fm is None:
            dest = os.path.join(OUT, BASE.strip("/"), rel); os.makedirs(os.path.dirname(dest), exist_ok=True); shutil.copy(path, dest); continue
        url = fm.get("permalink") or "/" + re.sub(r"(index)?\.(html|md)$", "", rel).replace("\\", "/")
        if url != "/" and not url.endswith((".html", "/")): url += "/"
        fm.update(url=url, _body=body, _md=f.endswith(".md"), _kind="pages")
        emit(fm)
print("built", len(posts), "posts", len(projects), "projects")

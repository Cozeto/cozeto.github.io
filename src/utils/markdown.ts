import { marked } from "marked";
import markedKatex from "marked-katex-extension";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import mermaid from "mermaid";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import "github-markdown-css/github-markdown.css";

mermaid.initialize({ startOnLoad: false });

marked.use(
  markedKatex({
    throwOnError: false,
    strict: false,
    nonStandard: true,
    output: "html"
  }),
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  })
);

marked.setOptions({
  gfm: true,
  breaks: true
});

export async function renderMarkdown(md: string) {
  const html = await marked.parse(md);

  const container = document.createElement("div");
  container.innerHTML = html;

  const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headings.forEach((h) => {
    const text = h.textContent || "";
    const id = slugify(text);
    h.id = id;
  });

  const mermaidBlocks = container.querySelectorAll("code.language-mermaid");

  mermaidBlocks.forEach((block, i) => {
    const parent = block.parentElement;
    if (!parent) return;

    const div = document.createElement("div");
    const id = "mermaid-" + i;

    div.className = "mermaid";
    div.id = id;
    div.textContent = block.textContent || "";

    parent.replaceWith(div);
  });

  await mermaid.run({
    nodes: container.querySelectorAll(".mermaid")
  });

  return container.innerHTML;
}

export function generateTOC(md: string) {
  const tokens = marked.lexer(md);

  const toc: { text: string; id: string; level: number }[] = [];

  tokens.forEach((token: any) => {
    if (token.type === "heading") {
      toc.push({
        text: token.text,
        id: slugify(token.text),
        level: token.depth
      });
    }
  });

  return toc;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
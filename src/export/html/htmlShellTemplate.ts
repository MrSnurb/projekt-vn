interface ShellOptions {
  css: string
  js: string
  projectJson: string
  title: string
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildHtmlShell({ css, js, projectJson, title }: ShellOptions): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<style>${css}</style>
</head>
<body>
<div id="vn-root"></div>
<script>window.__VN_PROJECT__ = ${projectJson};</script>
<script>${js}</script>
</body>
</html>
`
}

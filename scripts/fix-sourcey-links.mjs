import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, posix, relative, resolve, sep} from 'node:path';

const outputDirectory = resolve(process.argv[2] ?? 'static/api');
const baseUrl = normalizeBaseUrl(process.argv[3] ?? '/api/');

const htmlFiles = await listHtmlFiles(outputDirectory);
if (htmlFiles.length === 0) {
  throw new Error(`No Sourcey HTML files found in ${outputDirectory}`);
}

const outputFiles = new Set(
  (await listFiles(outputDirectory)).map((file) => resolve(file)),
);

const generatedPages = new Set(
  htmlFiles.map((file) =>
    relative(outputDirectory, file).split(sep).join(posix.sep),
  ),
);

let rewrittenLinks = 0;
let removedBrokenLinks = 0;

for (const file of htmlFiles) {
  const original = await readFile(file, 'utf8');
  const rewritten = original.replace(/href="([^"]+)"/g, (match, href) => {
    const rewritten = rewriteGeneratedPageHref(href);
    if (rewritten === href) return match;
    rewrittenLinks += 1;
    return `href="${rewritten}"`;
  });
  const updated = rewritten.replace(
    /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,
    (match, href, label) => {
      if (isResolvableHref(href, file)) return match;
      removedBrokenLinks += 1;
      return `<span>${label}</span>`;
    },
  );

  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
  }
}

const unresolved = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (rewriteGeneratedPageHref(href) !== href) {
      unresolved.push(`${relative(outputDirectory, file)}: ${href}`);
    }
  }
}

if (unresolved.length > 0) {
  throw new Error(
    `Sourcey page links still need rewriting:\n${unresolved.slice(0, 20).join('\n')}`,
  );
}

process.stdout.write(
  `${JSON.stringify({
    status: 'fixed',
    pages: htmlFiles.length,
    rewrittenLinks,
    removedBrokenLinks,
  })}\n`,
);

function rewriteGeneratedPageHref(href) {
  if (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('data:') ||
    href.startsWith('javascript:')
  ) {
    return href;
  }

  const suffixIndex = href.search(/[?#]/);
  const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex);
  const withoutParentSegments = path.replace(/^(?:\.\.\/)+/, '');
  const normalized = withoutParentSegments.replace(/^\/+/, '');

  if (normalized === '' && path.includes('/')) {
    return `${baseUrl}${suffix}`;
  }

  if (!normalized.endsWith('.html')) return href;

  const pageSlug = normalized.slice(0, -'.html'.length);
  const generatedPath = `${pageSlug}/index.html`;
  if (!generatedPages.has(generatedPath)) return href;

  return `${baseUrl}${pageSlug}/${suffix}`;
}

function isResolvableHref(href, sourceFile) {
  if (
    href.startsWith('#') ||
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('data:') ||
    href.startsWith('javascript:')
  ) {
    return true;
  }

  const path = href.split(/[?#]/, 1)[0];
  let target;
  if (path.startsWith(baseUrl)) {
    target = resolve(outputDirectory, path.slice(baseUrl.length));
  } else if (path.startsWith('/')) {
    return false;
  } else {
    target = resolve(sourceFile, '..', path);
  }

  if (path.endsWith('/')) target = resolve(target, 'index.html');
  return outputFiles.has(target);
}

async function listHtmlFiles(directory) {
  return (await listFiles(directory)).filter((file) => file.endsWith('.html'));
}

async function listFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

function normalizeBaseUrl(value) {
  const normalized = `/${value.trim().replace(/^\/+|\/+$/g, '')}/`;
  return normalized === '//' ? '/' : normalized;
}

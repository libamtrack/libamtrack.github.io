import {readdir, readFile, writeFile} from 'node:fs/promises';
import {basename, join, resolve} from 'node:path';

const libraryRoot = resolve(process.argv[2] ?? '.sourcey/library');
const includeDirectory = join(libraryRoot, 'include');
const marker = 'sourcey-file-group';

const headers = (await readdir(includeDirectory, {withFileTypes: true}))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.h'))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right));

if (headers.length === 0) {
  throw new Error(`No public headers found in ${includeDirectory}`);
}

const groupDefinitions = [
  '/**',
  ' * @page sourcey_reference libamtrack C API reference',
  ' * @brief Searchable reference generated from the public C headers.',
  ' */',
  '',
];

for (const header of headers) {
  const stem = basename(header, '.h');
  const groupId = `sourcey_${stem.replace(/[^A-Za-z0-9_]/g, '_')}`;
  const headerPath = join(includeDirectory, header);
  const original = await readFile(headerPath, 'utf8');

  const openMarker = `${marker}-open: ${groupId}`;
  if (!original.includes(openMarker)) {
    const legacyAnnotation = [
      '/**',
      ` * ${marker}: ${groupId}`,
      ` * @ingroup ${groupId}`,
      ' */',
      '',
    ].join('\n');
    const cleanSource = original.startsWith(legacyAnnotation)
      ? original.slice(legacyAnnotation.length)
      : original;
    const groupOpen = [
      '/**',
      ` * ${openMarker}`,
      ` * @addtogroup ${groupId}`,
      ' * @{',
      ' */',
      '',
    ].join('\n');
    const groupClose = [
      '',
      '/**',
      ` * ${marker}-close: ${groupId}`,
      ' * @}',
      ' */',
      '',
    ].join('\n');
    await writeFile(
      headerPath,
      `${groupOpen}${cleanSource.trimEnd()}${groupClose}`,
      'utf8',
    );
  }

  groupDefinitions.push(
    '/**',
    ` * @defgroup ${groupId} ${stem}`,
    ` * @brief Public declarations from ${header}.`,
    ' */',
    '',
  );
}

await writeFile(
  join(libraryRoot, 'sourcey-groups.dox'),
  `${groupDefinitions.join('\n')}\n`,
  'utf8',
);

process.stdout.write(
  `${JSON.stringify({status: 'prepared', publicHeaders: headers.length})}\n`,
);

import {defineConfig, doxygen} from 'sourcey';

export default defineConfig({
  name: 'libamtrack C API',
  siteUrl: 'https://libamtrack.github.io',
  baseUrl: '/api/',
  repo: 'https://github.com/libamtrack/library',
  prettyUrls: 'slash',
  theme: {
    preset: 'default',
    colors: {
      primary: '#2e8555',
      light: '#3cad6e',
      dark: '#205d3b',
    },
  },
  navigation: {
    tabs: [
      {
        tab: 'C API Reference',
        slug: '',
        source: doxygen({
          xml: './.sourcey/library/doxygen-sourcey/xml',
          // Moxygen's C++ template also handles C declarations and headers.
          language: 'cpp',
          groups: false,
          sourceUrl:
            'https://github.com/libamtrack/library/blob/ef78da9ac3342dadbc1854df9534d45ccaeeb3c9/{path}#L{line}',
        }),
      },
    ],
  },
});

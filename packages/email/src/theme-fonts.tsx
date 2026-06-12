import { Font } from 'react-email';

/**
 * Inter variable family (weights 100–900) via Google CSS `@import`.
 * Many webmail clients strip `@import`; the `<Font>` entries below register 400 / 500 / 600 / 700 / 800 / 900
 * static files as a fallback when the import does not run.
 */
export function EmailFonts() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');`,
        }}
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf',
          format: 'truetype',
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf',
          format: 'truetype',
        }}
        fontWeight={500}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf',
          format: 'truetype',
        }}
        fontWeight={600}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_fjbvMwCp50BTca1ZL7W0Q5nw.woff2',
          format: 'truetype',
        }}
        fontWeight={700}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_fjbvMwCp50Yjca1ZL7W0Q5nw.woff2',
          format: 'truetype',
        }}
        fontWeight={800}
        fontStyle="normal"
      />
      <Font
        fontFamily="Inter"
        fallbackFontFamily={['Arial', 'sans-serif']}
        webFont={{
          url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_fjbvMwCp50Szca1ZL7W0Q5nw.woff2',
          format: 'truetype',
        }}
        fontWeight={900}
        fontStyle="normal"
      />
    </>
  );
}

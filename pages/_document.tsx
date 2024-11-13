import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="light only"></meta>
        <style id="fontFaces"></style>
      </Head>
      <body>
        <Main />

        <div id="portalRoot"></div>
        <NextScript />
      </body>
    </Html>
  )
}

/**
 * @jest-environment node
 */

import { render, renderToString, tsx } from '../dist/server.esm.js'

describe('server render', () => {
  it('can render', () => {
    const el: Element = render(
      <html>
        <head></head>
        <body></body>
      </html>,
    )

    expect(render).toBeDefined()
    console.log('el server', el)
  })

  it('can renderToString', () => {
    const html: string = renderToString(
      render(
        <html>
          <head></head>
          <body></body>
        </html>,
      ),
    )

    expect(html).toBeDefined()

    console.log('el html server', html)
  })
})

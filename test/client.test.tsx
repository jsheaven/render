/**
 * @jest-environment jsdom
 */

import { render, renderToString, tsx } from '../dist/client.esm.js'

describe('client render', () => {
  it('can render', () => {
    const el: Element = render(<p>In body</p>)

    expect(render).toBeDefined()

    console.log('el', el)
  })

  it('can renderToString', () => {
    const html: string = renderToString(render(<p>In body</p>))

    expect(html).toBeDefined()

    console.log('el html', html)
  })
})

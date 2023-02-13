import { JSDOM } from 'jsdom'

export class DOM {
  constructor(html: string) {
    const dom = new JSDOM(html || '<html><head></head><body></body></html>')
    // @ts-ignore
    global.window = dom.window
    global.document = global.window.document
    global.Element = global.window.Element
  }

  clear() {
    global.document.head.innerHTML = ''
    global.document.body.innerHTML = ''
  }

  destroy() {
    // @ts-ignore
    typeof global.window === 'function' && global.window.close()

    delete global.document
    delete global.window
  }
}

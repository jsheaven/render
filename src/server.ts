import { parseHTML } from 'linkedom'
import { Globals, renderIsomorphic } from './index'
import { VNode, VElement } from './types'

export interface RenderOptions {
  /** choose an arbitrary server-side DOM / Document implementation; this library defaults to 'linkedom'; default: undefined */
  browserGlobals?: Globals

  /** creates a synthetic <html> root element in case you want to render in isolation; default: false; also happens when parentDomElement isn't present */
  createRoot?: boolean
}

export const render = (
  virtualNode: VNode | undefined | string | Array<VNode | undefined | string>,
  parentDomElement?: VElement,
  options: RenderOptions = {},
): Array<VElement | Text | undefined> | VElement | Text | undefined => {
  const browserGlobals = options.browserGlobals ? options.browserGlobals : getBrowserGlobals()
  const document = getDocument(options.createRoot, browserGlobals)

  if (!parentDomElement) {
    parentDomElement = createRoot(document)
  }
  if (options.browserGlobals) {
    console.log('browserGlobals parentDomElement', parentDomElement)
  }
  return renderIsomorphic(virtualNode, parentDomElement, browserGlobals)
}

export const createRoot = (document: Document): VElement => {
  const htmlElement = document.createElement('html')
  document.appendChild(htmlElement)
  return document.documentElement
}

export const getBrowserGlobals = (initialHtml?: string): Globals => parseHTML(initialHtml || '')

export const getDocument = (shouldCreateRoot = false, browserGlobals?: Globals): Document => {
  const document = (browserGlobals || getBrowserGlobals()).document
  if (shouldCreateRoot) {
    createRoot(document)
    return document
  }
  return document
}

export const renderToString = (el: Node) => el.toString()

export * from './index'

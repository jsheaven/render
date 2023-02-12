import { parseHTML } from 'linkedom'
import { renderIsomorphic } from './index'
import { IVirtualNode, IElement } from './types'

export interface RenderOptions {
  /** choose an arbitrary server-side DOM / Document implementation; this library defaults to 'linkedom'; default: undefined */
  document?: Document

  /** creates a synthetic <html> root element in case you want to render in isolation; default: false */
  createRoot?: boolean
}

export const render = (
  virtualNode: IVirtualNode | undefined | string | Array<IVirtualNode | undefined | string>,
  parentDomElement?: IElement,
  options: RenderOptions = {},
): Array<IElement | Text | undefined> | IElement | Text | undefined => {
  const document = options.document || getDocument(options.createRoot)

  if (!parentDomElement) {
    parentDomElement = createRoot(document)
  }
  return renderIsomorphic(virtualNode, parentDomElement, document)
}

export const createRoot = (document: Document): IElement => {
  const htmlElement = document.createElement('html')
  document.appendChild(htmlElement)
  return document.documentElement
}

export const getDocument = (shouldCreateRoot = false): Document => {
  const document = parseHTML('').document
  if (shouldCreateRoot) {
    createRoot(document)
    return document
  }
  return document
}

export const renderToString = (el: Node) => el.toString()

export * from './index'

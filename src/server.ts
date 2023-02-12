import { parseHTML } from 'linkedom'
import { renderIsomorphic } from './index'
import { IVirtualNode, IElement } from './types'

export const render = (
  virtualNode: IVirtualNode | undefined | string | Array<IVirtualNode | undefined | string>,
  parentDomElement?: IElement,
): Array<IElement | Text | undefined> | IElement | Text | undefined => {
  const { document } = parseHTML('')
  if (!parentDomElement) {
    parentDomElement = document.documentElement
  }
  return renderIsomorphic(virtualNode, parentDomElement, document)
}

export const renderToString = (el: Node) => el.toString()

export * from './index'

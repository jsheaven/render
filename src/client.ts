import { renderIsomorphic } from './index'
import { IVirtualNode, IElement } from './types'

export const render = (
  virtualNode: IVirtualNode | undefined | string | Array<IVirtualNode | undefined | string>,
  parentDomElement: IElement | Document = document.documentElement,
): Array<IElement | Text | undefined> | IElement | Text | undefined =>
  renderIsomorphic(virtualNode, parentDomElement, window)

export const renderToString = (el: Node) => new XMLSerializer().serializeToString(el)

export * from './index'

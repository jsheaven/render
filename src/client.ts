import { renderIsomorphic } from './index'
import { VNode, VElement } from './types'

export const render = (
  virtualNode: VNode | undefined | string | Array<VNode | undefined | string>,
  parentDomElement: VElement | Document = document.documentElement,
): Array<VElement | Text | undefined> | VElement | Text | undefined =>
  renderIsomorphic(virtualNode, parentDomElement, window)

export const renderToString = (el: Node) => new XMLSerializer().serializeToString(el)

export * from './index'

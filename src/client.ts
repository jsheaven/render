import { renderIsomorphic } from './index'
import { RenderInput, RenderResult } from './types'

export const render = <T extends RenderInput>(
  virtualNode: T,
  parentDomElement: Element | Document = document.documentElement,
): RenderResult<T> => renderIsomorphic(virtualNode, parentDomElement, window) as any

export const renderToString = (el: Node) => new XMLSerializer().serializeToString(el)

export * from './index'

import {
  IVirtualChild,
  IVirtualChildren,
  IVirtualNode,
  IVirtualNodeType,
  Ref,
  IElement,
  IVirtualNodeAttributes,
} from './types'

export type Globals = Window & typeof globalThis

const CLASS_ATTRIBUTE_NAME = 'class'
const XLINK_ATTRIBUTE_NAME = 'xlink'
const XMLNS_ATTRIBUTE_NAME = 'xmlns'
const REF_ATTRIBUTE_NAME = 'ref'

const nsMap = {
  [XMLNS_ATTRIBUTE_NAME]: 'http://www.w3.org/2000/xmlns/',
  svg: 'http://www.w3.org/2000/svg',
  [XLINK_ATTRIBUTE_NAME]: 'http://www.w3.org/1999/xlink',
}

// If a JSX comment is written, it looks like: { /* this */ }
// Therefore, it turns into: {}, which is detected here
const isJSXComment = (node: IVirtualNode): boolean =>
  // istanbul ignore next
  node && typeof node === 'object' && !node.attributes && !node.type && !node.children

// Filters comments and undefines like: ['a', 'b', false, {}] to: ['a', 'b', false]
const filterComments = (children: Array<IVirtualNode> | Array<IVirtualChild>) =>
  children.filter((child: IVirtualChild) => !isJSXComment(child as IVirtualNode))

const onUpdateFn = function (this: Ref, callback: Function) {
  this.update = callback as any
}

export const tsx = (
  // if it is a function, it is a component
  type: IVirtualNodeType | Function | any,
  attributes: (JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any>) | null,
  ...children: Array<IVirtualChildren> | IVirtualChildren
): Array<IVirtualNode> | IVirtualNode => {
  children = filterComments(
    // Implementation to flatten virtual node children structures like:
    // [<p>1</p>, [<p>2</p>,<p>3</p>]] to: [<p>1</p>,<p>2</p>,<p>3</p>]
    ([] as Array<IVirtualChildren>).concat.apply([], children as any) as Array<IVirtualChildren>,
  )

  // clone attributes as well
  attributes = { ...attributes }

  // effectively unwrap by directly returning the children
  if (type === 'fragment') {
    return filterComments(children) as Array<IVirtualNode>
  }

  // it's a component, divide and conquer children
  if (typeof type === 'function') {
    if (attributes.ref) {
      // references an onUpdate assignment function to be called inside of the functional component
      // to register an "update" function that can be called from the outside (ref.current.update(state?))
      ;(attributes.ref as Ref)!.onUpdate = onUpdateFn.bind(attributes.ref as Ref) as any
    }

    return type({
      children,
      ...attributes,
    })
  }

  // @ts-ignore as type allows for Function here, but internally we wouldn't
  // want to deal with Function, only "string". However, in this method it is indeed possible
  return {
    type,
    attributes: attributes as any,
    children,
  }
}

export const getRenderer = (document: Document) => {
  // DOM abstraction layer for manipulation
  const renderer = {
    hasElNamespace: (domElement: Element | Document): boolean => (domElement as Element).namespaceURI === nsMap.svg,

    hasSvgNamespace: (parentElement: Element | Document, type: string): boolean =>
      renderer.hasElNamespace(parentElement) && type !== 'STYLE' && type !== 'SCRIPT',

    createElementOrElements: (
      virtualNode: IVirtualNode | undefined | Array<IVirtualNode | undefined | string>,
      parentDomElement?: IElement | Document,
    ): Array<IElement | Text | undefined> | IElement | Text | undefined => {
      if (Array.isArray(virtualNode)) {
        return renderer.createChildElements(virtualNode, parentDomElement)
      }
      if (typeof virtualNode !== 'undefined') {
        return renderer.createElement(virtualNode as IVirtualNode | undefined, parentDomElement)
      }
      // undefined virtualNode -> e.g. when a tsx variable is used in markup which is undefined
      return renderer.createTextNode('', parentDomElement)
    },

    createElement: (virtualNode: IVirtualNode, parentDomElement?: IElement | Document): IElement | undefined => {
      let newEl: Element

      if (
        virtualNode.type.toUpperCase() === 'SVG' ||
        (parentDomElement && renderer.hasSvgNamespace(parentDomElement, virtualNode.type.toUpperCase()))
      ) {
        newEl = document.createElementNS(nsMap.svg, virtualNode.type as string)
      } else {
        newEl = document.createElement(virtualNode.type as string)
      }

      if (virtualNode.attributes) {
        renderer.setAttributes(virtualNode.attributes, newEl as IElement)
      }

      if (virtualNode.children) {
        renderer.createChildElements(virtualNode.children, newEl as IElement)
      }

      if (parentDomElement) {
        parentDomElement.appendChild(newEl)

        // check for a lifecycle "onMount" hook and call it
        if (typeof (newEl as any).$onMount === 'function') {
          ;(newEl as any).$onMount!()
        }
      }
      return newEl as IElement
    },

    createTextNode: (text: string, domElement?: IElement | Document): Text => {
      const node = document.createTextNode(text.toString())

      if (domElement) {
        domElement.appendChild(node)
      }
      return node
    },

    createChildElements: (
      virtualChildren: IVirtualChildren,
      domElement?: IElement | Document,
    ): Array<IElement | Text | undefined> => {
      const children: Array<IElement | Text | undefined> = []

      for (let i = 0; i < virtualChildren.length; i++) {
        const virtualChild = virtualChildren[i]
        if (virtualChild === null || (typeof virtualChild !== 'object' && typeof virtualChild !== 'function')) {
          children.push(
            renderer.createTextNode(
              (typeof virtualChild === 'undefined' || virtualChild === null ? '' : virtualChild!).toString(),
              domElement,
            ),
          )
        } else {
          children.push(renderer.createElement(virtualChild as IVirtualNode, domElement))
        }
      }
      return children
    },

    setAttribute: (name: string, value: any, domElement: IElement) => {
      // attributes not set (undefined) are ignored; use null value to reset an attributes state
      if (typeof value === 'undefined') return

      // save ref as { current: DOMElement } in ref object
      // allows for ref={someRef}
      if (name === REF_ATTRIBUTE_NAME && typeof value !== 'function') {
        value.current = domElement
      } else if (name === REF_ATTRIBUTE_NAME && typeof value === 'function') {
        // allow for functional ref's like: render(<div ref={(el) => console.log('got el', el)} />)
        value(domElement)
      }

      if (name.startsWith('on') && typeof value === 'function') {
        let eventName = name.substring(2).toLowerCase()
        const capturePos = eventName.indexOf('capture')
        const doCapture = capturePos > -1

        if (eventName === 'mount') {
          ;(domElement as any).$onMount = value
        }

        // onClickCapture={...} support
        if (doCapture) {
          eventName = eventName.substring(0, capturePos)
        }
        domElement.addEventListener(eventName, value, doCapture)
        return
      }

      // transforms className="..." -> class="..."
      // allows for React TSX to work seamlessly
      if (name === 'className') {
        name = CLASS_ATTRIBUTE_NAME
      }

      // transforms class={['a', 'b']} into class="a b"
      if (name === CLASS_ATTRIBUTE_NAME && Array.isArray(value)) {
        value = value.join(' ')
      }

      const nsEndIndex = name.match(/[A-Z]/)?.index
      if (renderer.hasElNamespace(domElement) && nsEndIndex) {
        const ns = name.substring(0, nsEndIndex).toLowerCase()
        const attrName = name.substring(nsEndIndex, name.length).toLowerCase()
        domElement.setAttributeNS(
          nsMap[ns],
          ns === XLINK_ATTRIBUTE_NAME || ns == 'xmlns' ? `${ns}:${attrName}` : name,
          value,
        )
      } else if (name === 'style' && typeof value !== 'string') {
        const propNames = Object.keys(value)

        // allows for style={{ margin: 10 }} etc.
        for (let i = 0; i < propNames.length; i++) {
          domElement.style[propNames[i] as any] = value[propNames[i]]
        }
      } else if (typeof value === 'boolean') {
        // for cases like <button checked={false} />
        ;(domElement as any)[name] = value
      } else {
        // for any other case
        domElement.setAttribute(name, value)
      }
    },

    setAttributes: (attributes: IVirtualNodeAttributes, domElement: IElement) => {
      const attrNames = Object.keys(attributes)
      for (let i = 0; i < attrNames.length; i++) {
        renderer.setAttribute(attrNames[i], attributes[attrNames[i]], domElement)
      }
    },
  }
  return renderer
}

export const renderIsomorphic = (
  virtualNode: IVirtualNode | undefined | string | Array<IVirtualNode | undefined | string>,
  parentDomElement: IElement | Document,
  globals: Globals,
): Array<IElement | Text | undefined> | IElement | Text | undefined => {
  if (typeof virtualNode === 'string') {
    return getRenderer(globals.window.document).createTextNode(virtualNode, parentDomElement)
  }
  return getRenderer(globals.window.document).createElementOrElements(virtualNode, parentDomElement)
}

export const Fragment = (props: IVirtualNode) => props.children

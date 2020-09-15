const RENDER_TO_DOM = Symbol('render to dom')

export class Component {
    constructor() {
        this.props = Object.create(null)
        this.children = []
        this._root = null
        this._range = null
    }

    setAttribute(name, value) {
        this.props[name] = value
    }

    appendChild(component) {
        this.children.push(component)
    }

    get vdom () {
        return this.render().vdom
    }

    [RENDER_TO_DOM](range) {
        this._range = range
        this._vdom = this.vdom
        this._vdom[RENDER_TO_DOM](range)
    }

    update() {
        const isSameNode = (oldNode, newNode) => {
            if (oldNode.type !== newNode.type) {
                return false
            }

            for (let name in newNode.props) {
                if (newNode.props[name] !== oldNode.props[name]) {
                    return false
                }
            }

            if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length) {
                return false
            }

            if (newNode.type === '#text') {
                if (newNode.content !== oldNode.content) {
                    return false
                }
            }

            return true
        }
        const update = (oldNode, newNode) => {
            // type, props, children
            // #text content

            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
                return
            }

            newNode._range = oldNode._range

            const [newChildren, oldChildren] = [newNode.vchildren, oldNode.vchildren]

            if (!newChildren || !newChildren.length) return

            let tailRange = oldChildren[oldChildren.length - 1]._range

            for (let i = 0; i < newChildren.length; i++) {
                const [newChild, oldChild] = [newChildren[i], oldChildren[i]]

                if (i < oldChildren.length) {
                    update(oldChild, newChild)
                } else { // TODO
                    const range = document.createRange()
                    range.setStart(tailRange.endContainer, tailRange.endOffset)
                    range.setEnd(tailRange.endContainer, tailRange.endOffset)

                    newChild[RENDER_TO_DOM](range)

                    tailRange = range
                    // range.insertNode()
                }
            }
        }
        const vdom = this.vdom
        update(this._vdom, vdom)
        this._vdom = vdom
    }

    // rerender() {
    //     const oldRange = this._range

    //     const range = document.createRange()
    //     range.setStart(oldRange.startContainer, oldRange.startOffset)
    //     range.setEnd(oldRange.startContainer, oldRange.startOffset)
    //     this[RENDER_TO_DOM](range)
    //     // console.log(oldRange)
    //     // console.log(range)
    //     // debugger
    //     oldRange.setStart(range.endContainer, range.endOffset)
    //     oldRange.deleteContents()
    // }

    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState
        } else {
            let mearge = (oldState, newState) => {
                for(let p in newState) {
                    if (oldState[p] === null || typeof oldState[p] !== 'object') {
                        oldState[p]  = newState[p]
                    } else {
                        mearge(oldState[p], newState[p])
                    }
                }
            }
    
            mearge(this.state, newState)
        }

        this.update()
    }
}

class ElementWrapper extends Component {
    constructor(type) {
        super(type)
        this.type = type
    }

    get vdom () {
        this.vchildren = this.children.map(child => child.vdom)
        return this
        // {
        //     type: this.type,
        //     props: this.props,
        //     children: this.children.map(child => child.vdom)
        // }
    }

    // setAttribute(name, value) {
    //     if (name.match(/^on([\s\S]+)$/)) {
    //         this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
    //     } else if (name === 'className') {
    //         this.root.setAttribute('class', value)
    //     } else {
    //         this.root.setAttribute(name, value)
    //     }
    // }

    // appendChild(component) {
    //     const range = document.createRange()
    //     range.setStart(this.root, this.root.childNodes.length)
    //     range.setEnd(this.root, this.root.childNodes.length)

    //     component[RENDER_TO_DOM](range)
    // }

    [RENDER_TO_DOM](range) {
        this._range = range

        const root = document.createElement(this.type)

        for (let name in this.props) {
            const value = this.props[name]
            if (name.match(/^on([\s\S]+)$/)) {
                root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
            } else if (name === 'className') {
                root.setAttribute('class', value)
            } else {
                root.setAttribute(name, value)
            }
        }
        if (!this.vchildren) {
            this.vchildren = this.children.map(child => child.vdom)
        }

        for (let child of this.vchildren) {
            const childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)

            child[RENDER_TO_DOM](childRange)
        }

        replaceContent(range, root)
    }
}

class TextWrapper extends Component  {
    constructor(content) {
        super(content)
        this.type = '#text'
        this.content = content
    }

    get vdom () {
        return this
        // {
        //     type: '#text',
        //     content: this.content,
        // }
    }

    [RENDER_TO_DOM](range) {
        this._range = range
        const root = document.createTextNode(this.content)
        replaceContent(range, root)
    }
}

function replaceContent(rang, node) {
    rang.insertNode(node)
    rang.setStartAfter(node)
    rang.deleteContents()

    rang.setStartBefore(node)
    rang.setEndAfter(node)
}

export function creatElement(type, attribute, ...children) {
    let ele;
    if (typeof type === 'string') {
        ele = new ElementWrapper(type)
    } else {
        ele  = new type
    }

    for (let attr in attribute) {
        ele.setAttribute(attr, attribute[attr])
    }

    let insertChildren = (children) => {
        for (let child of children) {
            if (typeof child === 'string') {
                child = new TextWrapper(child)
            }

            if (child === null) {
                continue
            }
    
            if (typeof child === 'object' && child instanceof Array) {
                insertChildren(child)
            } else {
                ele.appendChild(child)
            }
        }
    }

    insertChildren(children)

    return ele
}

export const render = (component, parentElement) => {
    const range = document.createRange()
    range.setStart(parentElement, 0)
    range.setEnd(parentElement, parentElement.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
}


const ToyReact = {
    Component,
    creatElement,
    render,
}

export default ToyReact
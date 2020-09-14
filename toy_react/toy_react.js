const RENDER_TO_DOM = Symbol('render to dom')

class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }

    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) {
            this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value)
        } else if (name === 'className') {
            this.root.setAttribute('class', value)
        } else {
            this.root.setAttribute(name, value)
        }
    }

    appendChild(component) {
        const range = document.createRange()
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root, this.root.childNodes.length)

        component[RENDER_TO_DOM](range)
    }

    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }

    [RENDER_TO_DOM](range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}

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

    [RENDER_TO_DOM](range) {
        this._range = range
        this.render()[RENDER_TO_DOM](range)
    }

    rerender() {
        const oldRange = this._range

        const range = document.createRange()
        range.setStart(oldRange.startContainer, oldRange.startOffset)
        range.setEnd(oldRange.startContainer, oldRange.startOffset)
        this[RENDER_TO_DOM](range)
        // console.log(oldRange)
        // console.log(range)
        // debugger
        oldRange.setStart(range.endContainer, range.endOffset)
        oldRange.deleteContents()
    }

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

        this.rerender()
    }

    // get root() {
    //     if (!this._root) {
    //         this._root = this.render().root
    //     }

    //     return this._root
    // }
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
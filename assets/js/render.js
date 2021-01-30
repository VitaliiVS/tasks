export class Render {
    constructor() { }

    setAttributes(elem, attrs) {
        for (const key in attrs) {
            elem.setAttribute(key, attrs[key])
        }
    }

    createElem(props) {
        const elem = document.createElement(props.tag)
        if (props.classNames) {
            elem.classList.add(...props.classNames)
        }
        if (props.attributes) {
            this.setAttributes(elem, props.attributes)
        }
        if (props.textContent) {
            elem.textContent = props.textContent
        }
        if (props.value) {
            elem.value = props.value
        }

        return elem
    }
}
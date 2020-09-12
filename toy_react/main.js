import ToyReact, { Component, render } from './toy_react'

class MyComponent extends Component {
    render() {
        return (
            <div>
                123456
                {this.children}
            </div>
        )
    }
}

render(
    <MyComponent id="sss">
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
    </MyComponent>,
    document.body
)
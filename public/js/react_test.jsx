"use strict"
var Window = React.createClass({
    render: function() {
        return <div>Hello {this.props.name}</div>;
    }
});

ReactDOM.render(
<Window name="World" />,
    document.getElementById('container')
);
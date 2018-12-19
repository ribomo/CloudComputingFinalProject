import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {text: props.text}
  }
  render() {
    return (
      <div className="Message">
        <Card className="Bubble">
            {this.state.text}
        </Card>
      </div>
    );
  }
}

export default Message;

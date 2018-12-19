import React, { Component } from 'react';
import Chat from './Components/Chat';
import Grid from '@material-ui/core/Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={10}>
            <Chat></Chat>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;

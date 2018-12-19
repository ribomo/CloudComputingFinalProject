import React, { Component } from 'react';
import AWS from 'aws-sdk';
import awsmobile from '../app-config/aws-exports';
import Button from '@material-ui/core/Button';
import Helper from './Helper'

class Chat extends Component {
    constructor(props) {
        super(props);

        AWS.config.update({
            region: awsmobile.aws_cognito_region,
            credentials: new AWS.CognitoIdentityCredentials({
              IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
            })
        });
    }

    uploadHandler= (event)=>{
        // this.ProcessImage(event.target.files[0]);
        Helper.Rec(event.target.files[0], this.props.recResult)
    }
    
    render() {
        return (
            <div className="Chat">
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        style={{ display: 'none' }}
                        onChange={this.uploadHandler}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span">
                        Upload
                        </Button>
                    </label>
            </div>
        );
    }
}

export default Chat;

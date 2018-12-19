import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Message from './Message'
import '../Css/Chat.css'
import Upload from './Upload'
import AWS from 'aws-sdk';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Helper from './Helper'

const axios = require('axios');
var apigClientFactory = require('aws-api-gateway-client').default;

const styles = {
    'background-color': '#E0E0E0',
    display: 'grid'
}

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    timeout: 1000
});

class Chat extends Component {
    sendText = ()=>{
        this.addMsg(this.state.inputText)
        this.callChat(this.state.inputText)
        this.scrollToBottom()
        this.setState({
            inputText: ''
        })
    }
    constructor(props) {
        super(props);
        this.state = { 
            messages: [
                {
                    response: true,
                    text: "How can I help you"
                },
                {
                    response: false,
                    text: "Nihao"
                },
                {
                    response: true,
                    text: "Yooo"
                }
            ],
            inputText: '',
            labels: []
        };
    }
    addMsg = (text, response=false)=>{
        this.setState({
            messages: this.state.messages.concat({response:response, text:text})
        })
    }
    updataRecResult = (theFile, data) =>{
        let labels = data.Labels
        console.log(data)
        this.setState({
            labels: labels,
            messages: this.state.messages.concat(
                [{
                    response: true,
                    text: "Upload Success! What's your question?"
                }]
            )
        })
        let img = <img
            src={URL.createObjectURL(theFile)}
            style={ {width:"100%"} }
        />
        this.addMsg(img, true)
        this.scrollToBottom()
    }

    imageSearch(text){
        axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                cx: '005173730916124689159:zyqyt3odmyo',
                key: 'AIzaSyCH6r7OoA0WSMJUHuLYyWS_VCQtVYT5DmQ',
                searchType: 'image',
                q: text
            }
        })  
        .then( (response) => {
            let data = response.data
            if(data['items'] === undefined){
                this.addMsg("Didn't found any result.", true);
                return
            }
            let imageUrl = data.items[0].link
            let img = <img
                src={imageUrl}
                style={ {width:"100%"} }
            />
            this.addMsg("We found a picture please wait for it to be processed.", true)
            console.log(imageUrl);

            fetch(imageUrl).then(function(response) {
                if(response.ok) {
                  return response.blob();
                }
                throw new Error('Network response was not ok.');
              }).then( (myBlob) => { 
                // var objectURL = URL.createObjectURL(myBlob); 
                // console.log(myBlob)
                // myImage.src = objectURL; 
                Helper.Rec(myBlob, this.updataRecResult)
              }).catch(function(error) {
                console.log('There has been a problem with your fetch operation: ', error.message);
              });

            this.scrollToBottom()
        })
        .catch( (error)=> {
            console.log(error);
        });
    }

    callChat= (text)=>{
        var config = {
            invokeUrl: 'https://37vqt6r0ph.execute-api.us-east-1.amazonaws.com',
            accessKey: AWS.config.credentials.accessKeyId,
            secretKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken,
            region: 'us-east-1'
          }
          console.log(config)
          var apigClient = apigClientFactory.newClient(config);
          var pathParams = {
            //This is where path request params go. 
          };
          var pathTemplate = '/test';
          var method = 'POST';
          var body = {
            message: text
          };
          var additionalParams = {

          }
          apigClient.invokeApi(pathParams, pathTemplate, method, additionalParams, body)
            .then((result) => {
              //This is where you would put a success callback
              console.log(result)
              if (result.data.message){
                this.addMsg(result.data.message, true)
                if (result.data.intent === 'Object'){
                    if(this.state.labels.length === 0){
                        this.addMsg("Sorry, it seems that you haven't uploaded anything yet or the serivce can't find any useful object to detect", true)
                    }else{
                        let elements = []
                        this.state.labels.forEach(label => {
                            elements.push(
                            <ListItem key={label.Name}>
                                <ListItemText
                                  primary={label.Name}
                                />
                              </ListItem>,
                            )
                        });
                        let htmlReturn =  <div>
                            <Typography variant="h6">
                                List of item detected:
                            </Typography>
                            <List>{elements}</List>
                        </div>
                        this.addMsg(htmlReturn, true)
                    }
                }
                else if(result.data.intent === 'Search' && 'keyword' in result.data){
                    this.imageSearch(result.data.keyword);
                }
              }
            }).catch(function (result) {
              //This is where you would put an error callback
              console.log(result)
            });
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
    componentDidMount() {
    this.scrollToBottom();
    }
    
    componentDidUpdate() {
    this.scrollToBottom();
    }
    render() {
        return (
            <div className="Chat">
                <br></br>
                <div className="Chatbox">
                    {this.state.messages.map((message, i) => <div key={i} className={message.response ? 'Left' : 'Right'}><Message text={message.text}/></div>)}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <br></br>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={8}
                    // alignItems="flex-start"
                >   
                    <Grid item>                    
                        <Input
                            placeholder="Talk to the chatbot"
                            value={this.state.inputText}
                            onChange={(event)=>{this.setState({inputText: event.target.value})}}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.sendText}>
                            Send
                        </Button>
                    </Grid>
                    <Grid item>
                        <Upload recResult={this.updataRecResult}> 
                        </Upload>
                    </Grid>
                    {/* <Grid item>
                    <Button variant="contained" color="primary" onClick={()=>{this.imageSearch(this.state.inputText)}}>
                            Search
                        </Button>
                        </Grid> */}
                </Grid>
            </div>
        );
    }
}

export default Chat;

import AWS from 'aws-sdk';
import awsmobile from '../app-config/aws-exports';
import Compressor from 'compressorjs';

class Helper{
    static processImage = (file, callback)=>{
        // this.AnonLog()
    
        // Load base64 encoded image 
        AWS.config.update({
            region: awsmobile.aws_cognito_region,
            credentials: new AWS.CognitoIdentityCredentials({
              IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
            })
        });

        var reader = new FileReader();
        reader.onload = ((theFile)=>{
          return (e)=>{
            var img = document.createElement('img');
            var image = null;
            img.src = e.target.result;
            var jpg = true;
            try {
              image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
    
            } catch (e) {
              jpg = false;
            }
            if (jpg === false) {
              try {
                image = atob(e.target.result.split("data:image/png;base64,")[1]);
              } catch (e) {
                alert("Not an image file Rekognition can process");
                return;
              }
            }
            //unencode image bytes for Rekognition DetectFaces API 
            var length = image.length;
            let imageBytes = new ArrayBuffer(length);
            var ua = new Uint8Array(imageBytes);
            for (var i = 0; i < length; i++) {
              ua[i] = image.charCodeAt(i);
            }
            //Call Rekognition  
            Helper.reco(theFile, imageBytes, callback);
          };
        })(file);
        reader.readAsDataURL(file);
    }

    static reco = (theFile, imageData, callback)=>{
        let rekognition = new AWS.Rekognition();
        let params = {
            Image: {
              Bytes: imageData
            }
          };
        rekognition.detectLabels(params, (err, data) => {
            if (err) alert(err); // an error occurred
            else{
              callback(theFile, data);
                // callback(theFile, data);
            };  // successful response
        });
    }

    static Rec = (file, callback)=>{
        AWS.config.update({
            region: awsmobile.aws_cognito_region,
            credentials: new AWS.CognitoIdentityCredentials({
              IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
            })
        });
        
        new Compressor(file, {
          quality: 0.6,
          maxWidth: 1024,
          maxheight: 800,
          success: (result)=>{
            Helper.processImage(result, callback)
          },
          error(err) {
            console.log(err.message);
          },
        });    
        // Helper.processImage(file, callback)
    }

}

export default Helper;
import {getAuthToken} from './auth';
import { API_URL } from './config';

export async function fileUploadUsingJson(event, callback) {
     const file = event.target.files[0];
     const token = getAuthToken();

     const reader = new FileReader();
     reader.onload = async (event) => {
         const base64 = reader.result.split(',')[1];

         const imageData = {
             ImageName: file.name,
             ImageContent: base64,
         }

         let url = `${API_URL}/cdn`;

         try {
             const response = await fetch(url, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer ' + token
                 },
                 body: JSON.stringify(imageData)
             });


             if (!response.ok) {
                 throw error('File not uploaded properly.');
             }

             const resData = await response.json();
             console.log("image url ", resData);

             callback(resData.imageUrl);
         } catch (error) {
             console.log(error);
         }
     }

     reader.readAsDataURL(file);

 }


 
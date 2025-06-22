import {getAuthToken} from './auth';

export async function fileUploadUsingJson(event, callback) {
     const file = event.target.files[0];
     const token = getAuthToken();

     const reader = new FileReader();
     reader.onload = async (event) => {
         const base64 = reader.result.split(',')[1];

         const imageData = {
             fileName: file.name,
             fileContent: base64,
         }

         let url = 'http://localhost:8080/cdn/urlGenerate';

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
             callback(resData.url);
         } catch (error) {
             console.log(error);
         }
     }

     reader.readAsDataURL(file);

 }


 
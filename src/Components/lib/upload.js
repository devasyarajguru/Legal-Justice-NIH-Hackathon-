import { getDownloadURL , ref , uploadBytesResumable } from "firebase/storage";
import {storage} from "./firebase";

const upload = async(file) =>
{ 
    console.log("Upload function called with file:", file); 
    const date = new Date()
    const storageRef = ref(storage, `images/${date + file.name}`);
    console.log("Storage Reference:", storageRef.fullPath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve,reject)=>
    {
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          // setUploadProgress(progress)
            }, 
            (error) => {
              console.error("Upload error:", error);
              reject("Something went wrong" + error.message)
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("Download URL:", downloadURL);
                resolve(downloadURL);
              });
            }
          );
        })
}

export default upload;

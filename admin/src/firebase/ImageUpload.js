
// // uploadImage.js
// import { storage } from './firebaseConfig'; // Import the storage instance

// export const uploadImage = async (file) => {
//   try {
//     // Create a reference to the 'images' folder
//     const storageRef = storage.ref();
//     const imageRef = storageRef.child(`images/${file.name}`);
    
//     // Upload the file
//     const uploadTask = imageRef.put(file);

//     // Monitor the upload process
//     uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         // Progress function
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log(`Upload is ${progress}% done`);
//       },
//       (error) => {
//         // Error function
//         console.error('Upload failed:', error);
//       },
//       async () => {
//         // Complete function
//         const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
//         console.log('File available at', downloadURL);
//         return downloadURL; // Return the download URL if needed
//       }
//     );
//   } catch (error) {
//     console.error('Error uploading image:', error);
//   }
// };

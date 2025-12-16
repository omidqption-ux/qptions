export const convertFileToBase64 = (file) => {
     return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onloadend = () => {
               resolve(reader.result.split(',')[1]) // Remove the "data:image/png;base64," part
          }

          reader.onerror = (error) => {
               reject(error)
          }

          reader.readAsDataURL(file)
     })
}
export const compressImage = (file, quality = 0.7) => {
     return new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (event) => {
               const img = new Image()
               img.src = event.target.result
               img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')

                    const maxWidth = 800 // Reduce width
                    const scale = maxWidth / img.width
                    canvas.width = maxWidth
                    canvas.height = img.height * scale

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    resolve(
                         canvas.toDataURL('image/jpeg', quality).split(',')[1]
                    ) // Convert to Base64
               }
          }
     })
}
export const compressBase64Image = (base64Image, quality = 0.7) => {
     return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Image;
          img.onload = () => {
               const canvas = document.createElement('canvas');
               const ctx = canvas.getContext('2d');

               const maxWidth = 800; // Set max width
               const scale = maxWidth / img.width;
               canvas.width = maxWidth;
               canvas.height = img.height * scale;

               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
               
               // Convert to compressed base64 and remove metadata (split(',')[1])
               resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]);
          };
     });
};
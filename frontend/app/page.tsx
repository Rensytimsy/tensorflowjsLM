"use client"

import {useState, useRef} from "react"
import axios from "axios"

//This is the images interface
interface UploadedImage {
  id: string,
  img: string
}

export default function Home() {

  const uploadElement = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  const handleFileUpload = () => {
    if(!uploadElement.current?.files) return;
    const uploadedFileImages = Array.from(uploadElement.current?.files);

    const imagesPromise = uploadedFileImages.map((file) => {
      return new Promise<UploadedImage>((resolve) => {
        const filePreview = new FileReader();
        filePreview.readAsDataURL(file);
        filePreview.onload = () => {
          if(typeof filePreview.result === "string"){
            resolve({
              id: `${Date.now()}-${Math.random().toString(20).substring(3, 18)}`,
              img: filePreview.result
            });
          }
        }
      });
    });

    Promise.all(imagesPromise).then((newImage) => {
      setUploadedImages((prevImg) => [...prevImg, ...newImage]);
    });
  }

  //const handle file upload to the backend
  const handleCheckFile = async(e: React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
    e.preventDefault();
    const formdata = new FormData();
    uploadedImages.forEach((image) => {
      formdata.append("image", image.img);
    });
    console.log(formdata.getAll("image"));
    const response = await axios.post("")
  }

  return (
    <div className="flex flex-row justify-center align-center">
      <div className="flex flex-col mt-[10%]">
        <div className="flex flex-row space-x-4">
          {uploadedImages.map((img) => (
            <div key={img.id}>
              <img 
              src={img.img} 
              alt="an uploaded image" 
              className="max-w-[200px] max-h-[200px]"
              />
            </div>
          ))}
        </div>
        <div
        className="flex flex-row space-x-4 p-2"
        >
          <form 
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleCheckFile}
          >
            <input 
            type="file"
            ref={uploadElement}
            multiple
            onChange={handleFileUpload}
            />
            <button
            className="p-1 bg-blue-300 cursor-pointer"
            type="submit"
            >
              Detect Image
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

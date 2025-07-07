"use client"

import {useState, useRef} from "react"
import axios from "axios"

//This is the images interface
interface UploadedImage {
  id: string,
  img: string,
  file: File
}

export default function Home() {

  const uploadElement = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [result, setResult] = useState<string[]>([]);

  const handleFileUpload = () => {
    if(!uploadElement.current?.files) return;
    const uploadedFileImages = Array.from(uploadElement.current?.files);

    const imagesPromise = uploadedFileImages.map((file) => {
      console.log(file);
      return new Promise<UploadedImage>((resolve) => {
        const filePreview = new FileReader();
        filePreview.readAsDataURL(file);
        filePreview.onload = () => {
          if(typeof filePreview.result === "string"){
            resolve({
              id: `${Date.now()}-${Math.random().toString(20).substring(3, 18)}`,
              img: filePreview.result,
              file: file
            });
          }
        }
      });
    });

    Promise.all(imagesPromise).then((newImage) => {
      setUploadedImages((prevImg) => [...prevImg, ...newImage]);
    });
  }

  const removeSelectedImg = (imageId: string) => {
    setUploadedImages((prevImageId) => uploadedImages.filter((img) => img.id !== imageId));
  }


  //const handle file upload to the backend
  const handleCheckFile = async(e: React.MouseEvent<HTMLButtonElement>) : Promise<void> => {
    e.preventDefault();
    try{
        const formdata = new FormData();
        uploadedImages.forEach((image) => {
          formdata.append("image", image.file);
        });
        console.log(formdata.getAll("image"));
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lm/detect`, formdata, {
          withCredentials: true
        });
        console.log(response.data[0].class);
        console.log(response.data);
        setResult(response.data[0].class);
    }catch(error){
      console.log(error);
    }
  }


  return (
    <div className="flex flex-row justify-center align-center">
      <div className="flex flex-col mt-[10%]">
        <div className="flex flex-col space-x-4 space-y-5">
          <div className="text-center">
            <p className="text-red-500">
              Please note that clicking on an image will delete it!
            </p>
          </div>
          <div className="flex flex-row mb-5">
            {uploadedImages.map((img) => (
              <div key={img.id}>
                <img 
                src={img.img} 
                alt="an uploaded image" 
                className="max-w-[200px] max-h-[200px]"
                onClick={() => removeSelectedImg(img.id)}
                />
              </div>
            ))}
          </div>
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
            name="image"
            />
            <button
            className="p-1 bg-blue-300 cursor-pointer"
            type="submit"
            >
              Detect Image
            </button>
          </form>
        </div>
        <div
        className="mt-[5%]"
        >
           <p>Image detected as: {result}</p>
        </div>
      </div>
    </div>
  )
}

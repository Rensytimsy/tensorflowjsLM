"use client"

import Image from "next/image";
import {useState, useRef} from "react"

export default function Home() {
  const inputDomElement = useRef<HTMLInputElement>(null);
  const [image, setImages] = useState<{ img: string }[]>([]);

  const processUploadedFile = () => {
    if (!inputDomElement.current?.files) return;

    const uploadedFiles = Array.from(inputDomElement.current.files);

    const imagePromises = uploadedFiles.map((img) => {
      return new Promise<{ img: string }>((resolve) => {
        const imagePreview = new FileReader();
        imagePreview.readAsDataURL(img);
        imagePreview.onload = () => {
          if (typeof imagePreview.result === 'string') {
            resolve({ img: imagePreview.result });
          }
        };
      });
    });

    Promise.all(imagePromises).then((uploadedImages) => {
      setImages((prevImg) => [...prevImg, ...uploadedImages]);
    });
  };

  console.log(image)

  return (
    <div className="flex flex-row justify-center align-center">
      <div className="mt-[5%] flex flex-col space-y-4">
        <form
          action="POST"
          encType="multipart/form-data"
          className="cursor-pointer"
        >
          <input
            type="file"
            multiple
            onChange={processUploadedFile}
            ref={inputDomElement}
          />
          <button className="border rounded-md p-2">Detect Image</button>
        </form>
        <div className="mt-4 flex flex-row space-x-2">
          {image.map((imgObj, index) => (
            <img
              key={index}
              src={imgObj.img}
              alt={`uploaded-preview-${index}`}
              className="w-40 h-40 object-cover mb-4"
            />
          ))}
        </div>
      </div>

    </div>
  );
}

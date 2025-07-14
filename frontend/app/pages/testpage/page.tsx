"use client"
import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Sortable } from "@/app/components/sortable";

interface UploadedImage {
    id: string,
    url: string
}

import {
    useSensor,
    useSensors,
    DndContext,
    PointerSensor,
    KeyboardSensor,
    DragEndEvent,
    closestCenter
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    horizontalListSortingStrategy,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { restrictToHorizontalAxis, restrictToVerticalAxis } from "@dnd-kit/modifiers"

export default function TestPage() {

    const inputField = useRef<HTMLInputElement>(null);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFileUpload = () => {
        if (!inputField.current?.files) return;
        const uploadedFiles = Array.from(inputField.current?.files);

        const imagePromise = uploadedFiles.map((file) => {
            return new Promise<UploadedImage>((resolve) => {
                const fileUrlPreview = new FileReader();
                fileUrlPreview.readAsDataURL(file);
                fileUrlPreview.onload = () => {
                    if (typeof fileUrlPreview.result === "string") {
                        resolve({
                            id: uuidv4(),
                            url: fileUrlPreview.result
                        })
                    }
                }
            })
        });

        Promise.all(imagePromise).then((newImage) => {
            setUploadedImages((prevImg) => ([...prevImg, ...newImage]));
        })
    }

    const removeImage = (id: string) => {
        setUploadedImages((prevImg) => (prevImg.filter((img) => img.id !== id)))
    }

    //sortable functionality below
    const sensors = useSensors(
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(PointerSensor)
    );

    const handleEndEventDrag = useCallback((event: DragEndEvent) => {
        const { over, active } = event;
        if (over && active.id !== over.id) {
            setUploadedImages((images) => {
                const oldIdx = images.findIndex(img => img.id === active.id);
                const newIdx = images.findIndex(img => img.id === over.id);
                return arrayMove(images, oldIdx, newIdx);
            });
        }

        setIsDragging(false);
    }, []);

    const handleDragStart = useCallback(() => {
        setIsDragging(true)
    }, []);

    return (
        <div className="flex felx-row justify-center align-center">
            <div className="flex flex-col mt-[10%]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleEndEventDrag}
                    onDragStart={handleDragStart}
                    modifiers={[restrictToHorizontalAxis]}
                >
                    <SortableContext
                        items={uploadedImages}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-row space-x-2 rounded-md">
                            {uploadedImages.map((img, idx) => (
                                <div className="relative">
                                        <RiDeleteBin5Line
                                            size={28}
                                            className="text-red-500 absolute bg-gray-400/50 rounded-full p-1 right-1 top-1 cursor-pointer"
                                            onClick={() => removeImage(img.id)}
                                        />
                                        <Sortable
                                            key={img.id}
                                            url={img.url}
                                            id={img.id}
                                        />
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    ref={inputField}
                />
                <button
                >generate uuid</button>
            </div>
        </div>
    )
}
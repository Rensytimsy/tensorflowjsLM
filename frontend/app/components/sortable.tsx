"use client"
import {FC, useState} from "react"
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"
import { RiDeleteBin5Line } from "react-icons/ri";

interface UploadedImage {
    id: string,
    url: string
}

export const Sortable:FC<UploadedImage> = ({id, url}) => {

    const {
        attributes, 
        listeners, 
        transform, 
        setNodeRef, 
        transition, 
        isDragging
    } = useSortable({id});

    const styles = {
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        transition,
        transform: CSS.Transform.toString(transform),
        position: "relative"
    }

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <div className="rounded-md">
                <img 
                src={url} 
                alt="uploaded images" 
                className="max-w-[150px] min-h-[150px] rounded-md cursor-pointer"
                />
            </div>
        </div>
    )
}
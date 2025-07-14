"use client"
import { useDraggable, DragOverlay } from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {FC, ReactNode} from "react";

interface IncomingProps {
    id: string,
    children: ReactNode
}

export const Draggable: FC<IncomingProps> = ({id, children}) => {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: id
    });

    const styles = {
        transform: CSS.Translate.toString(transform)
    }

    return(
        <div
        ref={setNodeRef}
        style={styles}
        {...listeners}
        {...attributes}
        className="border max-w-[20vw] min-h-[20vh] cursor-pointer bg-blue-300"
        >
            {children}
        </div>
    )
}

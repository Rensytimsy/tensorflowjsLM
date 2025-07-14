"use client";
import {useDroppable} from "@dnd-kit/core";
import {Children, FC, ReactNode} from "react";

interface IncomingProps {
    id: string,
    children: ReactNode
}

export const Droppable:FC<IncomingProps> = ({id, children}) => {

    const {setNodeRef, isOver} = useDroppable({
        id: id
    });

    const style = {
        opacity: isOver ? 1 : 0.5,
    }

    return (
        <div className="flex flex-row justify-center align-center mt-[10%]">
            <div
            style={style}
            ref={setNodeRef}
            className="min-w-[500px] min-h-[500px] border"
            >
                {children}
            </div>
        </div>
    )
}

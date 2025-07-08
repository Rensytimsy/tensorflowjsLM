import {NextFunction, Request, Response} from "express";


interface CustomError extends Error {
    status?: number
}

export const customError = async(err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const errorMessage = err.message || "Opps! Something went wrong";
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        status: status,
        message: errorMessage,
        stack: err.stack
    });
}
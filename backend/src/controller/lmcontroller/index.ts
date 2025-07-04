import {NextFunction, Request, Response} from "express";
import { initializeModel } from "../../config/tensorflowinit";
import bb from "busboy";

//this just the testing endpoint
export const LmEndpoint = async(req: Request, res:Response) => {
     res.send({message: "Hello world  this is the lm server endpoint!"});
}

//below is the lm functionality on a post route
export const LmDetect = async(req: Request, res:Response, next: NextFunction) => {
     try{
          if(!initializeModel){
               res.status(500).json({message: "Model not initilized!"});
          }
          let bbp = bb({headers: req.headers});
          bbp.on("file", (name, file: NodeJS.WriteStream, info) => {
               const {filename, mimeType} = info;
               const buffer = [];

               file.on("data", (data) => {
                    buffer.push(data);
               });
               
          });

          req.pipe(bbp);
          res.status(200).json("model initialized successfully");
     }catch(error){
          next(error);
     }
}
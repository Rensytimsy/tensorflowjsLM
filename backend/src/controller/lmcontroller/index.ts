import {NextFunction, Request, Response} from "express";
import {initializeModel, model} from "../../config/tensorflowinit";
import busboy from "busboy";
import { createModel, preProcessImageUrls } from "../../testModel/model";
import { dataset } from "../../testModel/testdata";
import * as tf from "@tensorflow/tfjs-node"

// let newmodel; 
let isTraining = false;

const newmodel = createModel();

//this just the testing endpoint
export const LmTrainEndpoint = async(req: Request, res:Response, next: NextFunction) => {
    try{
      if(isTraining) {
        return res.status(400).json({error: "Model training already in process"});
      }

      //if the model is not training then set training to be true
      isTraining = true;


      //prepare data
      const images = [];
      const lables = [];

      //Below is processing images of the front profile of a chair
      for(const url of dataset[0].front.slice(0,25)){
        const tensor = await preProcessImageUrls(url);
        if(tensor){
          images.push(tensor);
          lables.push(0);
        }
      }

      //Below is processing images of the side profile of a chair
      for(const url of dataset[1].side.slice(0,25)){
        const tensor = await preProcessImageUrls(url);
        if(tensor){
          images.push(tensor),
          lables.push(1);
        }
      }

      //Below is processing images of the back profile of a chair
      for(const url of dataset[2].back.slice(0,25)){
        const tensor = await preProcessImageUrls(url);
        if(tensor){
          images.push(tensor),
          lables.push(2);
        }
      }

      const xs = tf.stack(images);
      const ys = tf.oneHot(tf.tensor1d(lables, "int32"), 3); 

      const history = await newmodel.fit(xs, ys, {
        epochs: 5,
        batchSize: 8,
        validationSplit: 0.2
      });

      isTraining = false;

      res.json({
        message: "Training complete",
        history: {
          loss: history.history.loss,
          accuracy: history.history.acc
        }
      });
    }catch(error){
      isTraining = false;
      console.log("Training error");
      next(error);
    }
}

export const LmDetect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!model) {
      return res.status(500).json({ message: "Model not initialized!" });
    }

    const bb = busboy({ headers: req.headers });
    const imageChunks: Buffer[] = [];

    bb.on("file", (fieldname, file, info) => {
      const { filename, mimeType } = info;
      console.log("Receiving file:", filename, "MIME:", mimeType);

      file.on("data", (chunk) => {
        imageChunks.push(chunk);
      });

      file.on("end", async () => {
        try {
          const imageBuffer = Buffer.concat(imageChunks);
          const decodedImage = tf.node.decodeImage(imageBuffer, 3);
          const predictions = await model.detect(decodedImage, 3, 0.25);
          res.json(predictions);
        } catch (err) {
          console.error("Error during prediction:", err);
          next(err);
        }
      });
    });

    bb.on("error", (err) => {
      console.error("Busboy error:", err);
      next(err);
    });

    req.pipe(bb);
  } catch (err) {
    next(err);
  }
};

export const LmPredict = async(req: Request, res: Response, next: NextFunction) => {
  try{
    if (!model) {
    return res.status(400).json({ error: 'Model not trained yet' });
  }
  
  const { imageUrl } = req.body;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' });
  }
  const tensor = await preProcessImageUrls(imageUrl);
    if (!tensor) {
      return res.status(400).json({ error: 'Failed to process image' });
    }
    
    const prediction = newmodel.predict(tensor.expandDims());
    const results = await prediction.data();
    
    const classes = ['Front', 'Side', 'Back'];
    const response = {};
    
    classes.forEach((cls, i) => {
      response[cls] = `${(results[i] * 100).toFixed(2)}%`;
    });
    
    res.json(response);
  
  }catch(error){
    next(error);
  }
}
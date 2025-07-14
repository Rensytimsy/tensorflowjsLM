import * as tf from "@tensorflow/tfjs-node";
import axios from 'axios'
import {Request, Response, NextFunction} from "express";
import { maizeModel, preProcessImages } from "../../testModel/maizemodel";
import { maizedataset } from "../../docs/maizedataset";

//create a model instance
let training = false;
let maizemodel = maizeModel();

export const LmTrainMaizeModel = async(req: Request, res: Response, next: NextFunction) => {
    try{
        if(training){
            return res.status(400).json({message: "Model already in training phase, please wait.."});
        }
        training = true;

        let images: tf.Tensor[] = [];
        let labels: number[] = [];

        // Helper function to process images with error handling
        const processImage = async (imgurl: string, label: number) => {
            try {
                const tensor = await preProcessImages(imgurl);
                images.push(tensor);
                labels.push(label);
            } catch (error) {
                console.warn(`Failed to process image ${imgurl}:`, error.message);
            }
        };

        // Process all images (with proper error handling)
        await Promise.all([
            ...maizedataset[0].healthy_maizeplant.slice(0, 10).map(url => processImage(url, 0)),
            ...maizedataset[1].Common_Rust.slice(0, 10).map(url => processImage(url, 1)),
            ...maizedataset[2].Northern_Corn_Leaf_Blight.slice(0, 10).map(url => processImage(url, 2)),
            ...maizedataset[3].Gray_Leaf_Spot.slice(0,20).map((url) => processImage(url, 3)),
            ...maizedataset[4].Anthracnose.slice(0,20).map((url) => processImage(url, 4)),
            ...maizedataset[5].Fusarium_Ear_Root.slice(0,10).map((url) => processImage(url, 5)),
            ...maizedataset[6].Maize_Streak_Virus.slice(0,20).map(url => processImage(url, 6))
        ]);

        if (images.length === 0) {
            training = false;
            return res.status(400).json({message: "No images were successfully processed"});
        }

        const xs = tf.stack(images);
        const ys = tf.oneHot(tf.tensor1d(labels, "int32"), 7); // Matches model's output units

        const history = await maizemodel.fit(xs, ys, {
            epochs: 5,
            batchSize: 8,
            validationSplit: 0.2
        });

        training = false;

        res.json({
            message: "Model training done!",
            history: {
                loss: history.history.loss,
                accuracy: history.history.acc
            }
        });
    } catch(error) {
        training = false;
        console.error("Training error:", error);
        next(error);
    }
}


export const LmPredictMaizeDisease = async(req: Request, res: Response, next: NextFunction) => {
    if(!maizemodel){
        return res.status(400).json({message: "Model not yet initialized!"});
    }

    const cropImage: string = await req.body.cropImage;
    const tensor= await preProcessImages(cropImage);

    if(!tensor){
        return res.status(400).json({message: "No image was provided for a crop"});
    }

    const predictDiseaseResults = await maizemodel.predict(tensor.expandDims());
    const predictResults = predictDiseaseResults.data();

    const cropDiseases: string[] = [
        "Healthy Maize plant", 
        "Common Rust", 
        "Northern Corn Leaf Blight", 
        "Gray Leaf Spot",
        "Anthracnose",
        "Fasarium Ear Root",
        "Maize Streak Virus"
    ];

    const results = {};

    cropDiseases.map((cls, idx) => (
        results[cls] = `${(predictResults[idx] * 100).toFixed(2)}%`
    ));

    res.json(results);
}
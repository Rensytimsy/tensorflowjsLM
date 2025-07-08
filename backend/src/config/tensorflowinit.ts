import * as tf from "@tensorflow/tfjs-node"
import coco_ssd from "@tensorflow-models/coco-ssd";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelJsonPath = path.join(__dirname, "../models/coco_ssd/model.json");

let model: coco_ssd.ObjectDetection | null = null;

const initializeModel = async() => {
    console.log("Initilizing model...");
    model = await coco_ssd.load({
        base: "mobilenet_v2",
        modelUrl: `file://${modelJsonPath}`
    });
    console.log("Model initialize!");
}


export {model, initializeModel};
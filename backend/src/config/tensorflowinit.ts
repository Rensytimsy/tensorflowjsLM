import * as tf from "@tensorflow/tfjs-node"
import coco_ssd from "@tensorflow-models/coco-ssd";

let model = undefined;

export const initializeModel = async() => {
    console.log("Initilizing model...");
    return model = await coco_ssd.load({
        base: "mobilenet_v1"
    });
}

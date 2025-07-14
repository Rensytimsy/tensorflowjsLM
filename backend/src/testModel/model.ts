import * as tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import fs from "fs";
import axios from "axios"
import { dataset } from "./testdata";
import { response } from "express";

//Since data set has images in url form we need axios to fetch and return the images as tensors for easier classifications

let model;
export let isTraining = false;
let IMAGE_SIZE = 224;

export const preProcessImageUrls = async(url: string) => {
    try{
        const response = await axios.get(url, { responseType: 'arraybuffer'});
        const buffer = Buffer.from(response.data, 'binary');

        //resize the image using sharp
        const image = await sharp(buffer)
            .resize(IMAGE_SIZE, IMAGE_SIZE)
            .toBuffer();

        //Convert teh bufferImage in to a tensor
        const tensor = tf.node.decodeImage(image, 3)
            .toFloat()
            .div(225.0);

        return tensor
    }catch(error){
        console.log(`Error processing image ${url}, can't be completed!`);
        return null;
    }
} 

export const createModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3],
        filters: 16,
        kernelSize: 3,
        activation: 'relu'
    }));

    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));

    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({ units: 3, activation: 'softmax'}));

    model.compile({
        optimizer: tf.train.adam(0.0001),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
    });

    return model;
}



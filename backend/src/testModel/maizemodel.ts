import * as tf from "@tensorflow/tfjs-node";
import sharp from "sharp";
import axios from "axios";

//Image url processor
export const preProcessImages = async (url: string) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Process to 224x224 RGB
    const processedImage = await sharp(imageBuffer)
        .resize(224, 224)
        .toBuffer();

    // Decode and normalize
    const tensor = tf.node.decodeImage(processedImage, 3)  // Force 3 channels
        .toFloat()
        .div(255.0);  // Normalize to [0, 1]

    return tensor;
};
 
export const maizeModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({
        inputShape: [224, 224, 3],
        filters: 16,
        kernelSize: 3,
        activation: "relu"
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({ units: 7, activation: 'softmax'}));

    model.compile({
        optimizer: tf.train.adamax(0.00001),
        loss: "categoricalCrossentropy",
        metrics: ['accuracy']
    });

    return model;
}
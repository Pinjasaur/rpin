#!/usr/bin/env node

// Modules
const vision   = require("@google-cloud/vision");
const uuidv4   = require("uuid/v4");
const fs       = require("fs");
const { exec } = require("child_process");

// Variables
const uuid     = uuidv4();

console.log("UUID:", uuid);

// Execute the Python to capture the image
exec(`./camera.py ${uuid}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec err: ${err}`);
    return;
  }

  const client = new vision.ImageAnnotatorClient();

  // Request text detection for the image
  client
    .documentTextDetection(`${__dirname}/captures/${uuid}.jpg`)
    .then(results => {
      const text = results[0].fullTextAnnotation;
      if (text && text.text)
        console.log(text.text);
      fs.writeFileSync(`${__dirname}/responses/${uuid}.json`, JSON.stringify(text, null, 2));
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});



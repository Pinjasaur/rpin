#!/usr/bin/env node

// Imports the Google Cloud client library
const vision   = require("@google-cloud/vision");
const uuidv4   = require("uuid/v4");
const { exec } = require("child_process");

const uuid     = uuidv4();

exec(`./camera.py ${uuid}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec err: ${err}`);
    return;
  }

  console.log("req");
  const client = new vision.ImageAnnotatorClient();

  client
    .textDetection(`${__dirname}/captures/${uuid}.jpg`)
    .then(results => {
      const texts = results[0].textAnnotations;
      texts.forEach(text => console.log(text.description));
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});



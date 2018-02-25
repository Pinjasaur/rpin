#!/usr/bin/env node

// Modules
const vision   = require("@google-cloud/vision");
const uuidv4   = require("uuid/v4");
const fs       = require("fs");
const { exec } = require("child_process");

// User Modules
const rpn      = require("./lib/rpn");
const util     = require("./lib/util");
const { normalize,
        format,
        validate } = util;

// Variables
const uuid     = uuidv4();
const client   = new vision.ImageAnnotatorClient();

console.log("UUID:", uuid);

// Execute the Python to capture the image
exec(`./camera.py ${uuid}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec err: ${err}`);
    return;
  }

  // Request text detection for the image
  client
    .documentTextDetection(`${__dirname}/captures/${uuid}.jpg`)
    .then(results => {
      const result = results[0].fullTextAnnotation;

      if (result && result.text) {
        console.log(result.text);

        fs.writeFileSync(`${__dirname}/responses/${uuid}.json`, JSON.stringify(result, null, 2));

        const normalized = result.text.split("\n").map(n => normalize(n)).filter(n => n.trim() !== "");
        //normalized.forEach(n => console.log(n));
        //console.log(normalized);

        const formatted  = normalized.map(f => format(f));
        //formatted.forEach(f => console.log(f));
        //console.log(formatted);

        if (!validate(formatted)) {
          console.error("Invalid RPN expression(s):", formatted.join(", "));
        } else {
          formatted.forEach(expr => {
            console.log(expr, "=", rpn(expr));
          })
        }
      } else {
        console.error("No detection!");
      }
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

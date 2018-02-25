#!/usr/bin/env node

// Modules
const vision   = require("@google-cloud/vision");
const uuidv4   = require("uuid/v4");
const fs       = require("fs");
const { exec } = require("child_process");

// User Modules
const rpn      = require("./lib/rpn");

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
      const normalized = text.text.split("\n").map(n => normalize(n));
      normalized.forEach(n => console.log(n));
      const formatted  = normalized.map(f => format(f));
      formatted.forEach(f => console.log(f));
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
});

const normalize = input => input.trim().replace(/[^\d+\-\/*%]/g, "");

function format(input) {
  let chars = input.split(""),
      acc   = "",
      expr  = [];

  chars.forEach(c => {
    if (c == +c) {
      acc += c;
    } else {
      expr.push(acc);
      expr.push(c);
      acc = "";
    }
  });

  return expr.join(" ");
}

'use strict';
const fs = require('fs');
const path = require('path');
const prettyjson = require('prettyjson');

/**
 * @param {Arrray} leads
 * @returns {string}
 */
const leadsToYamlString = (leads) => {
  return prettyjson.render(leads, {
    noColor: true
  });
};

const stringToFile = (str, outfile, projectId) => {
  console.log(`Writing ${projectId} leads to ${outfile}`);
  let filepath = path.resolve(process.cwd(), outfile);
  fs.writeFileSync(filepath, str);
};

module.exports = {
  stringToFile,
  leadsToYamlString
};

const fs = require("fs");
const csv = require("csv-parser");

let data = [
  {
    a: "2",
    b: "2",
    c: "1",
  },
  {
    a: "5",
    b: "1",
    c: "9",
  },
];
function writeToCSVFile(data) {
  const filename = "output.csv";
  fs.writeFile(filename, extractAsCSV(data), (err) => {
    if (err) {
      console.log("Error writing to csv file", err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
}

function extractAsCSV(data) {
  const header = ["Username, Password, Roles"];
  const rows = data.map((d) => `${d.a}, ${d.b}, ${d.c}`);
  return header.concat(rows).join("\n");
}

writeToCSVFile(data);

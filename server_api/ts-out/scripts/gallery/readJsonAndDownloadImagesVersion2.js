// Read path to json and image folder from the command line
// Read json file and download images
// Usage: node readJsonAndDownloadImages.js <path to json file> <path to image folder>
const fs = require("fs");
const path = require("path");
const http = require("https");
const jsonPath = process.argv[2];
const imageFolderPath = process.argv[3];
// Read and parse json file, use the callback function to download images
fs.readFile(jsonPath, "utf8", function (err, data) {
    if (err)
        throw err;
    const obj = JSON.parse(data);
    downloadImages(obj);
});
async function downloadImages(obj) {
    // Loop through the array of objects
    const theData = obj.response.data;
    for (let i = 0; i < theData.length; i++) {
        // Get the image url
        const imageUrl = theData[i].fieldData.Mynd;
        if (imageUrl && imageUrl.startsWith("https://")) {
            // Get the image name
            //console.log(theData[i])
            //console.log(imageUrl);
            let imageName = imageUrl.split("/").pop().split("?")[0];
            imageName = imageName.split("/").pop();
            imageName = imageName.replace(/'/g, "");
            //console.log(imageName);
            // Download the image
            await download(imageUrl, imageName);
            console.log(`"${imageName}",`);
        }
        else {
            console.error("No valid image found for: " + JSON.stringify(theData[i].fieldData));
        }
    }
}
// Download and save the image from url using the http module
async function download(url, imageName) {
    url = "https://www.citizens.is/wp-content/uploads/2020/01/cf-logo-small-final.jpg";
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(`${imageFolderPath}/${imageName}`);
        const request = http.get(url, function (response) {
            response.pipe(file);
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
                //console.log(`${imageName} downloaded`);
                resolve();
            });
        });
    });
}
export {};

const models = require("../../models");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const http = require("https");
const sizeOf = require("image-size");

const jsonPath =  process.argv[2]; // "/home/robert/Downloads/finalMyndThin.json";
//TODO: Finna út úr að gera þetta frá URLI!
const imageFolderPath = "/home/robert/Downloads/myndlistinOkkar/myndir/MyndlistinOkkar2023V2/"; //process.argv[3];
//const groupId = 28478; //process.argv[4];
const userId = 850; //process.argv[5];

const groupIds = {
  "Málverk - fyrir 1973": 28838,
  "Málverk - eftir 1973": 28837,
  "Málverk - án ártals": 28839,
  "Þrívíð verk": 28840,
  "Ljósmyndaverk": 28841,
  "Önnur verk": 28843,
  "Teikningar": 28844,
  "Grafík": 28842,
}

LOCAL_TEST = false

const urlbase =
  "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/MyndlistinOkkar2023V2/";


const createPost = async (
  groupId,
  groupName,
  name,
  description,
  imageFileName,
  imageFilePath,
  metaData
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageUrl = urlbase + imageFileName;
      let imageDimensions;

      if (LOCAL_TEST) {
        try {
          imageDimensions = sizeOf(imageFilePath);
          console.log(imageDimensions.width, imageDimensions.height);
        } catch (error) {
          resolve();
          return;
        }
      } else {
        imageDimensions = { width: 1000, height: 1000 }
      }

      console.error(imageUrl);

      const formats = JSON.stringify([imageUrl, imageUrl, imageUrl]);

      const image = models.Image.build({
        user_id: userId,
        s3_bucket_name: process.env.S3_BUCKET || "fromScript",
        original_filename: imageFileName,
        formats,
        user_agent: "Script",
        ip_address: "127.0.0.1",
      });

      await image.save();

      const post = models.Post.build({
        user_id: userId,
        group_id: groupId,
        name,
        description,
        content: description,
        status: "published",
        user_agent: "Script",
        ip_address: "127.0.0.1",
        content_type: models.Post.CONTENT_IDEA,
      });

      post.set("public_data", {
        galleryMetaData: metaData,
        galleryImageData: {
          width: imageDimensions.width,
          height: imageDimensions.height,
        },
      });

      await post.save();

      console.log(JSON.stringify(post));

      await post.addPostHeaderImage(image);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Empty anonymous function to avoid async/await error

(async () => {
  if (LOCAL_TEST) {
    fs.readFile(jsonPath, "utf8", async function (err, data) {
      if (err) throw err;
      const obj = JSON.parse(data);
      await downloadImages(obj);
      process.exit();
    });
  } else {
    // Load the JSON file with http request and then call the downloadImages function
    const obj = await new Promise((resolve, reject) => {
      http.get(jsonPath, (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          resolve(JSON.parse(data));
        });
      });
    });

    await downloadImages(obj);
    process.exit();
  }
})();

async function downloadImages(obj) {
  // Loop through the array of objects
  const theData = obj.response.data;
  for (let i = 0; i < theData.length; i++) {
    // Get the image url
    const imageUrl = theData[i].fieldData.Mynd;
    const postDescription = theData[i].fieldData.ListamadurHofundur;
    const postName = theData[i].fieldData.Verkheiti;
    const year = theData[i].fieldData["Upphafsar"];
    let groupName = theData[i].fieldData["Ljósmynd af"];

    if (groupName=="Málverk") {
      if (isNaN(year)) {
        groupName = "Málverk - án ártals";
      } else if (year < 1973) {
        groupName = "Málverk - fyrir 1973";
      } else {
        groupName = "Málverk - eftir 1973";
      }
    }

    const groupId = groupIds[groupName];

    if (!groupId) {
      console.error("No group found for: " + JSON.stringify(theData[i].fieldData))
    } else {
      const metaData = theData[i].fieldData;
      //console.log(imageUrl);
      if (imageUrl && imageUrl.startsWith("https://")) {
        // Get the image name
        //console.log(theData[i])
        //console.log(imageUrl);
        let imageName = imageUrl.split("/").pop().split("?")[0];
        imageName = imageName.split("/").pop();
        imageName = imageName.replace(/'/g, "");
        //console.log(imageName);
        // Download the image
        //console.log(imageName, postName, postDescription, metaData)
        //await download(imageUrl, imageName);
        if (imageName.indexOf(".jpg") == -1) {
          console.log("--------------------------------------")
          console.log(postName);
          console.log(postDescription);
          console.error(imageName);
        } else {
          await createPost(
            groupId,
            groupName,
            postName,
            postDescription,
            imageName,
            `${imageFolderPath}${imageName}`,
            metaData
          );
        }

        // change imageName to a random string from randomImages
        //imageName = randomImages[Math.floor(Math.random() * randomImages.length)];
      } else {
        console.error(
          "No valid image found for: " + JSON.stringify(theData[i].fieldData)
        );
      }
    }
  }
}

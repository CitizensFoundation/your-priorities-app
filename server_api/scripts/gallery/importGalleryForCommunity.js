const models = require("../../models");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const http = require("https");
const sizeOf = require("image-size");

const jsonPath = "/home/robert/Downloads/JSON_D.txt"; //process.argv[2];
//TODO: Finna út úr að gera þetta frá URLI!
const imageFolderPath = "/home/robert/Documents/ListasafnMyndirTest/"; //process.argv[3];
const groupId = 28478; //process.argv[4];
const userId = 850; //process.argv[5];

const urlbase =
  "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/ListasafnRvk2023/ListasafnMyndirTest/";

const randomImages = [
  "1127DAA13E76D3D9B8C90F309CA1E571DAAE7261C4239FE91753043973341B69.jpg",
  "16990423310630FE1F2C09D015315020060F272D9190865178CBA39B657C1C13.jpg",
  "17BF9A30F0059346892B79A5AD64F5B0C9B2BB2962281C5498A48A9305EBC38C.jpg",
  "186ADB99415E852B53D4A8B943CC8360B97D67AE904FEBE4BE12D43BCBA4D672.jpg",
  "1A8E72A617B267526913A7B8813B5DC72AE166945ECE247CDE1FEB5FD8EFF008.jpg",
  "1C146B32F1D171347DDFD50468D6DA968A7FFBD294FD04E4D16DB9462D1795FE.jpg",
  "2432FE9CB54FCDEAF180C8CED4EB002C75FF4B043BC3526FB21A678CC7E7ED7D.jpg",
  "291E68F2C56EC7CCCFCFE3E4DB5B8A94A8B0264C947B10FCA7FE5CC23772DC3A.jpg",
  "37E09A89F3F9D80D4F679EE6AEF9D6BEB12F3C31E1F98DBE73E4FF00F791AACB.jpg",
  "39E584382FD51F1F117E812C6CBB6B89B125C5E4FAF69445CD82396C47D9F8FD.jpg",
  "3A6FBF3DEC07FE10322226737C30A5291006362105BBDCEB524B9267B4EBC8E9.jpg",
  "449C128B6910B9DBEBE34C6E5940E0A4998928C7B4C1526EF7150CA90F8E05EF.jpg",
  "49F92F5ACDAB2A92B7B56021161945C768D12B0D50816BDC2BE1CEA8F8ABB1A2.jpg",
  "51681EF96AB41DBEE6409F4322FB39F17C79CFB2118B12AF2DA5E7BD03D4078D.jpg",
  "5220E91D7271F99BFBBD438DBF5791F5F99172B026BC4F452A76294E0BB127DE.jpg",
  "56FEAFCB1106EFB2E0183BEC346AEDEB900D4519D0F721B5AC85D8F85E41E775.jpg",
  "5D3F06A30B6803955F021F5735A60FA068B02B70D3A8917CBCE006DAB4FE641E.jpg",
  "67E6F86EBB3319F43FD4BE340A087204E76AFE3D060AF67265A184EB6BBFABD8.jpg",
  "7A21A90888D5DC3A6C2BE1820A2A412C2DED1B4AD4E10BBFD3BA4E6C732E0EF9.jpg",
  "81FDF11BEFC47499BE3B4FB773C2AEB0223DD913BE8B2AEF8C9B65710029C329.jpg",
  "87CDDEA7B92DC0616F066D20F0C8BC631F478D8484E8A46FEFBE3BD9247B6A09.jpg",
  "89C62F6941BDD33F127C68A4E182663CDEC1B527E45B8C5B79202D945DD9878B.jpg",
  "98AEFA63BC7DB93B3C393E8345A96621676367CFAA26D4F7B30F8DD0E190D087.jpg",
  "9A9B62BB11EE5D28A276BD76A4F5709A8204D8D78DF523B30F7A40B60A615B22.jpg",
  "A384224DF8BE2308E5FAA872A8D31B4428A893CE2E1DF6210DB8155310E350E8.jpg",
  "CAEB9F86C91C5A0D3464C9F11DDA2028BA3E73DD9C86130286F0A4DCA1418A07.jpg",
  "D1630A4AD88372995A34D60FB4487E59A802432A548E23355A5C94E020D23B1E.jpg",
  "D798E2D2D4438CA864A29C589173332C5C71993FC9E49DB425B3F2662D8C2E1F.jpg",
  "D7CA7DA2313B5AEF57A3B3F69E469A36367D7C81995572FBB5F06B88D5027AE3.jpg",
  "DBE74C18A3FA8FBCD5B5E7B62A81B495A1736109DF30F534DF352FBD423F6375.jpg",
  "E28BA8D813E7B6475A68BC8F4F46C579D17FE2D711D90C58427163635C428213.jpg",
  "EB2960887BC0CB033A224ABFAF740980B0CFCD6048E4A55CCFC2C92F8945AAF4.jpg",
  "F07A5A8D163BB3C1E3F425613AED8919D07A9274538D60EE59900CBC6258745D.jpg",
  "F0C62B8349ABCDEF4C8212A147F85BF6FA88114D04F0FE0C62250470FF7279E5.jpg",
  "F2421649EE76D2301CC4A127BB9448A09AEBB0D98F45382F0ADC2E504B4A29C4.jpg",
  "FAC1116A0F62001BF6F2E5E7707AA7B23A803E95B19D44B843519243A6D5E31C.jpg",
];

const createPost = async (
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

      try {
        imageDimensions = sizeOf(imageFilePath);
        console.log(imageDimensions.width, imageDimensions.height);
      } catch (error) {
        resolve();
        return;
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
  fs.readFile(jsonPath, "utf8", async function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);
    await downloadImages(obj);
    process.exit();
  });
})();

async function downloadImages(obj) {
  // Loop through the array of objects
  const theData = obj.response.data;
  for (let i = 0; i < theData.length; i++) {
    // Get the image url
    const imageUrl = theData[i].fieldData.Mynd;
    const postName = theData[i].fieldData.Verkheiti;
    const groupName = theData[i].fieldData.Grein;
    const postDescription = theData[i].fieldData["Lýsing verks"];
    const metaData = theData[i].fieldData;
    console.log(imageUrl);
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
      console.error(imageName);

      // change imageName to a random string from randomImages
      imageName = randomImages[Math.floor(Math.random() * randomImages.length)];

      await createPost(
        groupName,
        postName,
        postDescription,
        imageName,
        `${imageFolderPath}${imageName}`,
        metaData
      );
    } else {
      console.error(
        "No valid image found for: " + JSON.stringify(theData[i].fieldData)
      );
    }
  }
}

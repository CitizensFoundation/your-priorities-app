const models = require('../../models');
const moment = require('moment');
const aws = require('aws-sdk');
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: process.env.S3_ENDPOINT || null,
  s3ForcePathStyle: process.env.MINIO_ROOT_USER ? true : undefined,
  signatureVersion: process.env.MINIO_ROOT_USER ? 'v4' : undefined,
  region: process.env.S3_REGION ? process.env.S3_REGION : 'eu-west-1' // region of your bucket
})

const communityId = process.argv[2];

const uploadImage = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new aws.S3();
      //TODO: Look into making animated gifs work through sharp
      const isGif = (file && file.originalname.toLowerCase().indexOf(".gif"));
      const storage = s3Storage({
        Key: (req, file, cb) => {
          crypto.pseudoRandomBytes(16, (err, raw) => {
            cb(err, err ? undefined : `${raw.toString('hex')}.${isGif ? 'gif' : 'png'}`)
          })
        },
        s3,
        Bucket: process.env.S3_BUCKET,
        multiple: true,
        resize: models.Image.getSharpVersions(req.query.itemType),
        toFormat: isGif ? "gif" : "png"
      });

      const upload = multer({ storage });

      upload.single("file")(req, res, async function (error) {
        if (error) {
          reject(error);
        } else {
          const formats = JSON.stringify(models.Image.createFormatsFromSharpFile(req.file));
          const image = models.Image.build({
            user_id: req.user.id,
            s3_bucket_name: process.env.S3_BUCKET,
            original_filename: req.file.originalname,
            formats,
            user_agent: req.useragent.source,
            ip_address: req.clientIp
          });

          await image.save();
          log.info('Image Created', { imageId: image.id, context: 'create', userId: req.user ? req.user.id : -1 });
          res.send(image);
        }
      });
    } catch (error) {
      reject(error);
    }

  });


};

(async ()=>{



  process.exit();
})();

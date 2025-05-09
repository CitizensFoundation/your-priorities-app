import AWS from "aws-sdk";
import fs from "fs";
import axios from "axios";

export class S3Service {
  constructor(private cloudflareApiKey?: string, private cloudflareZoneId?: string) {}

  async uploadImageToS3(bucket: string, filePath: string, key: string) {
    const s3 = new AWS.S3();
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileContent,
      ACL: "public-read",
      ContentType: "image/png",
      ContentDisposition: "inline",
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err: any, data: any) => {
        if (err) {
          reject(err);
        }
        fs.unlinkSync(filePath);
        resolve(data);
      });
    });
  }

  async deleteS3Url(imageUrl: string) {
    const { bucket, key } = this.parseImageUrl(imageUrl);

    if (!bucket || !key) {
      throw new Error("Could not parse bucket or key from URL");
    }

    const s3 = new AWS.S3();

    const params = {
      Bucket: bucket,
      Key: key,
      ACL: "private",
    };

    console.log(`Disabling/Deleting Key from S3: ${JSON.stringify(params)}`);

    return new Promise((resolve, reject) => {
      s3.putObjectAcl(params, (err: any, data: any) => {
        if (err) {
          console.error(`Error deleting image from S3: ${err}`);
          reject(err);
        } else {
          console.log(`Deleted image from S3: ${imageUrl}`, data);
          if (this.cloudflareApiKey && this.cloudflareZoneId) {
            console.log("Purging Cloudflare cache for image:", imageUrl);
            axios
              .post(
                `https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/purge_cache`,
                { files: [imageUrl] },
                {
                  headers: {
                    Authorization: `Bearer ${this.cloudflareApiKey}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                console.log("Cloudflare cache purged:", response.data);
                resolve(data);
              })
              .catch((error) => {
                if (error.response) {
                  console.error(
                    "Error purging Cloudflare cache:",
                    error.response.data
                  );
                  console.error("Status code:", error.response.status);
                  console.error("Headers:", error.response.headers);
                } else if (error.request) {
                  console.error("No response received:", error.request);
                } else {
                  console.error("Error setting up request:", error.message);
                }
                resolve(data);
              });
          } else {
            resolve(data);
          }
        }
      });
    });
  }

  parseImageUrl(imageUrl: string) {
    let bucket, key;
    const cfImageProxyDomain = process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN;
    const s3Bucket = process.env.S3_BUCKET;

    if (cfImageProxyDomain && imageUrl.includes(cfImageProxyDomain)) {
      const urlPath = new URL(imageUrl).pathname;
      const [, ...pathParts] = urlPath.split("/");
      bucket = s3Bucket;
      key = pathParts.join("/");
    } else {
      const match = imageUrl.match(/https:\/\/(.+?)\.s3\.amazonaws\.com\/(.+)/);
      if (match) {
        bucket = match[1];
        key = match[2];
      }
    }
    return { bucket, key };
  }

  async deleteMediaFormatsUrls(formats: string[]) {
    for (const url of formats) {
      await this.deleteS3Url(url);
      console.log(`Deleted image from S3: ${url}`);
    }
  }
}

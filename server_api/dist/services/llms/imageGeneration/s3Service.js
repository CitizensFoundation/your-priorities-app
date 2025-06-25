import AWS from "aws-sdk";
import fs from "fs";
import axios from "axios";
import log from "../../../utils/loggerTs.js";
export class S3Service {
    constructor(cloudflareApiKey, cloudflareZoneId) {
        this.cloudflareApiKey = cloudflareApiKey;
        this.cloudflareZoneId = cloudflareZoneId;
    }
    async uploadImageToS3(bucket, filePath, key) {
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
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                fs.unlinkSync(filePath);
                resolve(data);
            });
        });
    }
    async deleteS3Url(imageUrl) {
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
        log.info(`Disabling/Deleting Key from S3: ${JSON.stringify(params)}`);
        return new Promise((resolve, reject) => {
            s3.putObjectAcl(params, (err, data) => {
                if (err) {
                    log.error(`Error deleting image from S3: ${err}`);
                    reject(err);
                }
                else {
                    log.info(`Deleted image from S3: ${imageUrl}`, data);
                    if (this.cloudflareApiKey && this.cloudflareZoneId) {
                        log.info("Purging Cloudflare cache for image:", imageUrl);
                        axios
                            .post(`https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/purge_cache`, { files: [imageUrl] }, {
                            headers: {
                                Authorization: `Bearer ${this.cloudflareApiKey}`,
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => {
                            log.info("Cloudflare cache purged:", response.data);
                            resolve(data);
                        })
                            .catch((error) => {
                            if (error.response) {
                                log.error("Error purging Cloudflare cache:", error.response.data);
                                log.error("Status code:", error.response.status);
                                log.error("Headers:", error.response.headers);
                            }
                            else if (error.request) {
                                log.error("No response received:", error.request);
                            }
                            else {
                                log.error("Error setting up request:", error.message);
                            }
                            resolve(data);
                        });
                    }
                    else {
                        resolve(data);
                    }
                }
            });
        });
    }
    parseImageUrl(imageUrl) {
        let bucket, key;
        const cfImageProxyDomain = process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN;
        const s3Bucket = process.env.S3_BUCKET;
        if (cfImageProxyDomain && imageUrl.includes(cfImageProxyDomain)) {
            const urlPath = new URL(imageUrl).pathname;
            const [, ...pathParts] = urlPath.split("/");
            bucket = s3Bucket;
            key = pathParts.join("/");
        }
        else {
            const match = imageUrl.match(/https:\/\/(.+?)\.s3\.amazonaws\.com\/(.+)/);
            if (match) {
                bucket = match[1];
                key = match[2];
            }
        }
        return { bucket, key };
    }
    async deleteMediaFormatsUrls(formats) {
        for (const url of formats) {
            await this.deleteS3Url(url);
            log.info(`Deleted image from S3: ${url}`);
        }
    }
}

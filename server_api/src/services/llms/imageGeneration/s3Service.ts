import AWS from "aws-sdk";
import fs from "fs";
import axios from "axios";
import log from "../../../utils/loggerTs.js";

const normalizeEndpointHost = (endpoint?: string) => {
  if (!endpoint) {
    return null;
  }

  try {
    const normalizedUrl = new URL(
      endpoint.includes("://") ? endpoint : `https://${endpoint}`
    );

    return {
      host: normalizedUrl.host,
      hostname: normalizedUrl.hostname,
    };
  } catch {
    return {
      host: endpoint,
      hostname: endpoint,
    };
  }
};

const getBucketFromVirtualHost = (
  parsedUrl: URL,
  normalizedEndpoint: { host: string; hostname: string } | null
) => {
  if (!normalizedEndpoint) {
    return null;
  }

  const hostSuffix = `.${normalizedEndpoint.host}`;
  const hostnameSuffix = `.${normalizedEndpoint.hostname}`;

  if (parsedUrl.host.endsWith(hostSuffix)) {
    return parsedUrl.host.slice(0, -hostSuffix.length) || null;
  }

  if (parsedUrl.hostname.endsWith(hostnameSuffix)) {
    return parsedUrl.hostname.slice(0, -hostnameSuffix.length) || null;
  }

  return null;
};

const getAwsBucketFromHostname = (hostname: string) => {
  const s3MarkerIndex = hostname.indexOf(".s3.");

  if (s3MarkerIndex > 0) {
    return hostname.slice(0, s3MarkerIndex) || null;
  }

  const legacyS3MarkerIndex = hostname.indexOf(".s3-");

  if (legacyS3MarkerIndex > 0) {
    return hostname.slice(0, legacyS3MarkerIndex) || null;
  }

  return null;
};

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
    };

    log.info(`Disabling/Deleting Key from S3: ${JSON.stringify(params)}`);

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err: any, data: any) => {
        if (err) {
          log.error("Error deleting image from S3", {
            imageUrl,
            bucket,
            key,
            err,
          });
          reject(err);
        } else {
          log.info(`Deleted image from S3: ${imageUrl}`, data);
          if (this.cloudflareApiKey && this.cloudflareZoneId) {
            log.info("Purging Cloudflare cache for image:", imageUrl);
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
                log.info("Cloudflare cache purged:", response.data);
                resolve(data);
              })
              .catch((error) => {
                if (error.response) {
                  log.error(
                    "Error purging Cloudflare cache:",
                    error.response.data
                  );
                  log.error("Status code:", error.response.status);
                  log.error("Headers:", error.response.headers);
                } else if (error.request) {
                  log.error("No response received:", error.request);
                } else {
                  log.error("Error setting up request:", error.message);
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
    const normalizedEndpoint = normalizeEndpointHost(process.env.S3_ENDPOINT);

    const parsedUrl = new URL(imageUrl);

    if (cfImageProxyDomain && imageUrl.includes(cfImageProxyDomain)) {
      const [, ...pathParts] = parsedUrl.pathname.split("/");
      bucket = s3Bucket;
      key = pathParts.join("/");
    } else if (
      normalizedEndpoint &&
      (parsedUrl.hostname === normalizedEndpoint.hostname ||
        parsedUrl.host === normalizedEndpoint.host)
    ) {
      const [, maybeBucket, ...pathParts] = parsedUrl.pathname.split("/");
      bucket = process.env.MINIO_ROOT_USER ? maybeBucket || s3Bucket : s3Bucket;
      key = process.env.MINIO_ROOT_USER ? pathParts.join("/") : parsedUrl.pathname.slice(1);
    } else {
      const virtualHostBucket =
        getBucketFromVirtualHost(parsedUrl, normalizedEndpoint) ||
        getAwsBucketFromHostname(parsedUrl.hostname);

      if (virtualHostBucket) {
        bucket = virtualHostBucket;
        key = parsedUrl.pathname.replace(/^\/+/, "");
      }
    }
    return { bucket, key };
  }

  async deleteMediaFormatsUrls(formats: string[]) {
    for (const url of formats) {
      try {
        await this.deleteS3Url(url);
        log.info(`Deleted image from S3: ${url}`);
      } catch (error) {
        log.warn("Best-effort image cleanup failed", { url, error });
      }
    }
  }
}

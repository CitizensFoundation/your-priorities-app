"use strict";

const sharp = require("sharp");
const mime = require("mime-types");

const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

const buildVariantKey = (baseKey, size) => {
  const suffix = size?.suffix || "";
  const directory = size?.directory;
  const dotIndex = baseKey.lastIndexOf(".");

  let variantKey;
  if (suffix && dotIndex > -1) {
    variantKey = `${baseKey.slice(0, dotIndex)}${suffix}${baseKey.slice(
      dotIndex
    )}`;
  } else if (suffix) {
    variantKey = `${baseKey}${suffix}`;
  } else {
    variantKey = baseKey;
  }

  return directory ? `${directory}/${variantKey}` : variantKey;
};

class MulterSharpS3Compat {
  constructor(options) {
    if (!options?.s3) {
      throw new Error("You have to specify s3 for AWS S3 to work.");
    }

    if (!options?.Bucket) {
      throw new Error("You have to specify Bucket for AWS S3 to work.");
    }

    this.opts = {
      ACL: process.env.AWS_ACL || "public-read",
      multiple: false,
      ...options,
    };
  }

  _removeFile(req, file, cb) {
    this.opts.s3.deleteObject({ Bucket: file.Bucket, Key: file.Key }, cb);
  }

  _handleFile(req, file, cb) {
    const baseParams = {
      Bucket: this.opts.Bucket,
      ACL: this.opts.ACL,
      CacheControl: this.opts.CacheControl,
      ContentDisposition: this.opts.ContentDisposition,
      ContentType: this.opts.ContentType,
      Metadata: this.opts.Metadata,
      StorageClass: this.opts.StorageClass,
      ServerSideEncryption: this.opts.ServerSideEncryption,
      SSEKMSKeyId: this.opts.SSEKMSKeyId,
    };

    const finalize = async (key) => {
      try {
        const params = { ...baseParams, Key: key };
        const result = file.mimetype?.includes("image")
          ? await this._uploadImageVariants(params, file)
          : await this._uploadNonImage(params, file);
        cb(null, JSON.parse(JSON.stringify(result)));
      } catch (error) {
        cb(error);
      }
    };

    if (typeof this.opts.Key === "function") {
      this.opts.Key(req, file, (error, key) => {
        if (error) {
          cb(error);
        } else {
          finalize(key);
        }
      });
    } else {
      finalize(this.opts.Key);
    }
  }

  async _uploadImageVariants(params, file) {
    const inputBuffer = await streamToBuffer(file.stream);
    const sizes =
      this.opts.multiple && Array.isArray(this.opts.resize) && this.opts.resize.length
        ? this.opts.resize
        : [this.opts.resize || {}];

    const uploads = {};

    for (const size of sizes) {
      let transformer = sharp(inputBuffer, { animated: true, failOn: "none" });
      const outputFormat = file.outputFormat || this.opts.toFormat;

      if (size?.width || size?.height || size?.options) {
        transformer = transformer.resize(size.width, size.height, size.options);
      }

      if (outputFormat) {
        transformer = transformer.toFormat(outputFormat);
      }

      const { data, info } = await transformer.toBuffer({ resolveWithObject: true });
      const contentType =
        this.opts.ContentType ||
        mime.contentType(info.format) ||
        `image/${info.format}`;

      const uploadResult = await this.opts.s3
        .upload({
          ...params,
          Key: buildVariantKey(params.Key, size),
          Body: data,
          ContentType: contentType,
        })
        .promise();

      uploads[size?.suffix || "default"] = {
        ACL: this.opts.ACL,
        ContentDisposition: this.opts.ContentDisposition,
        StorageClass: this.opts.StorageClass,
        ServerSideEncryption: this.opts.ServerSideEncryption,
        Metadata: this.opts.Metadata,
        ...uploadResult,
        size: info.size,
        ContentType: contentType,
      };
    }

    uploads.mimetype =
      this.opts.ContentType ||
      mime.contentType(file.outputFormat || this.opts.toFormat || "png") ||
      file.mimetype;

    return uploads;
  }

  async _uploadNonImage(params, file) {
    const body = await streamToBuffer(file.stream);
    const contentType = params.ContentType || file.mimetype;
    const uploadResult = await this.opts.s3
      .upload({
        ...params,
        Body: body,
        ContentType: contentType,
      })
      .promise();

    return {
      size: body.length,
      ACL: this.opts.ACL,
      ContentDisposition: this.opts.ContentDisposition,
      StorageClass: this.opts.StorageClass,
      ServerSideEncryption: this.opts.ServerSideEncryption,
      Metadata: this.opts.Metadata,
      ContentType: contentType,
      mimetype: contentType,
      ...uploadResult,
    };
  }
}

module.exports = function multerSharpS3Compat(options) {
  return new MulterSharpS3Compat(options);
};

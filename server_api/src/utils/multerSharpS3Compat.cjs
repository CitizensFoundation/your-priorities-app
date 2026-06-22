"use strict";

const crypto = require("crypto");
const fs = require("fs");
const sharp = require("sharp");
const mime = require("mime-types");
const os = require("os");
const path = require("path");
const { PassThrough } = require("stream");
const { pipeline } = require("stream/promises");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

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

const createTempUploadPath = (originalName) => {
  const extension = path.extname(originalName || "");
  const randomSuffix = crypto.randomBytes(6).toString("hex");

  return path.join(
    os.tmpdir(),
    `multer-sharp-s3-${process.pid}-${Date.now()}-${randomSuffix}${extension}`
  );
};

const getUploadedObjects = (file) => {
  const uploads = [];
  const seen = new Set();

  const addUpload = (value) => {
    if (!value?.Bucket || !value?.Key) {
      return;
    }

    const key = `${value.Bucket}/${value.Key}`;
    if (!seen.has(key)) {
      seen.add(key);
      uploads.push({ Bucket: value.Bucket, Key: value.Key });
    }
  };

  addUpload(file);
  Object.values(file || {}).forEach(addUpload);

  return uploads;
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
    const uploads = getUploadedObjects(file);

    if (!uploads.length) {
      cb(null);
      return;
    }

    Promise.allSettled(
      uploads.map(({ Bucket, Key }) =>
        this.opts.s3.send(new DeleteObjectCommand({ Bucket, Key }))
      )
    )
      .then((results) => {
        const failed = results.find((result) => result.status === "rejected");
        cb(failed ? failed.reason : null);
      })
      .catch(cb);
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

  async _deleteUploadedObjects(uploads) {
    if (!uploads.length) {
      return;
    }

    await Promise.allSettled(
      uploads.map(({ Bucket, Key }) =>
        this.opts.s3.send(new DeleteObjectCommand({ Bucket, Key }))
      )
    );
  }

  async _uploadStreamToS3(params, readable) {
    let uploadedSize = 0;
    const body = new PassThrough();
    const upload = new Upload({
      client: this.opts.s3,
      params: { ...params, Body: body },
    });
    const uploadPromise = upload.done().catch((error) => {
      if (typeof upload.abort === "function") {
        try {
          upload.abort();
        } catch (abortError) {
          // Ignore abort cleanup failures and preserve the original error.
        }
      }
      readable.destroy(error);
      body.destroy(error);
      throw error;
    });

    body.on("data", (chunk) => {
      uploadedSize += chunk.length;
    });

    readable.on("error", (error) => {
      body.destroy(error);
    });

    readable.pipe(body);

    const uploadResult = await uploadPromise;
    return { uploadResult, size: uploadedSize };
  }

  async _uploadImageVariant(tempFilePath, params, file, size) {
    let transformer = sharp(tempFilePath, { animated: true, failOn: "none" });
    const outputFormat = file.outputFormat || this.opts.toFormat;

    if (size?.width || size?.height || size?.options) {
      transformer = transformer.resize(size.width, size.height, size.options);
    }

    if (outputFormat) {
      transformer = transformer.toFormat(outputFormat);
    }

    const contentType =
      this.opts.ContentType ||
      mime.contentType(outputFormat || file.mimetype) ||
      file.mimetype;

    const { uploadResult, size: uploadedSize } = await this._uploadStreamToS3(
      {
        ...params,
        ContentType: contentType,
      },
      transformer
    );

    return { uploadResult, uploadedSize, contentType };
  }

  async _uploadImageVariants(params, file) {
    const tempFilePath = createTempUploadPath(file.originalname || params.Key);
    const sizes =
      this.opts.multiple &&
      Array.isArray(this.opts.resize) &&
      this.opts.resize.length
        ? this.opts.resize
        : [this.opts.resize || {}];
    const uploads = {};
    const uploadedObjects = [];

    try {
      await pipeline(file.stream, fs.createWriteStream(tempFilePath));

      for (const size of sizes) {
        const variantKey = buildVariantKey(params.Key, size);
        const { uploadResult, uploadedSize, contentType } =
          await this._uploadImageVariant(
            tempFilePath,
            { ...params, Key: variantKey },
            file,
            size
          );

        uploadedObjects.push({
          Bucket: uploadResult.Bucket || params.Bucket,
          Key: uploadResult.Key || variantKey,
        });

        uploads[size?.suffix || "default"] = {
          ACL: this.opts.ACL,
          ContentDisposition: this.opts.ContentDisposition,
          StorageClass: this.opts.StorageClass,
          ServerSideEncryption: this.opts.ServerSideEncryption,
          Metadata: this.opts.Metadata,
          ...uploadResult,
          Bucket: uploadResult.Bucket || params.Bucket,
          Key: uploadResult.Key || variantKey,
          size: uploadedSize,
          ContentType: contentType,
        };
      }

      uploads.mimetype =
        this.opts.ContentType ||
        mime.contentType(file.outputFormat || this.opts.toFormat || "png") ||
        file.mimetype;

      return uploads;
    } catch (error) {
      await this._deleteUploadedObjects(uploadedObjects);
      throw error;
    } finally {
      await fs.promises.unlink(tempFilePath).catch(() => {});
    }
  }

  async _uploadNonImage(params, file) {
    const contentType = params.ContentType || file.mimetype;
    const { uploadResult, size } = await this._uploadStreamToS3(
      {
        ...params,
        ContentType: contentType,
      },
      file.stream
    );

    return {
      size,
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

export function createS3ClientForBucket(bucket: any, options?: {}): Promise<S3Client>;
export function createS3Client(options?: {}): S3Client;
export function getBucketRegion(bucket: any, options?: {}): Promise<any>;
export function getPresignedGetObjectUrl(client: any, params: any, options?: {}): Promise<string>;
export function getPresignedGetObjectUrlForBucket(params: any, clientOptions?: {}, presignOptions?: {}): Promise<string>;
export function getPresignedPutObjectUrl(client: any, params: any, options?: {}): Promise<string>;
export function getPresignedPutObjectUrlForBucket(params: any, clientOptions?: {}, presignOptions?: {}): Promise<string>;
export function normalizeS3Endpoint(endpoint: any): any;
import { S3Client } from "@aws-sdk/client-s3/dist-types/S3Client";

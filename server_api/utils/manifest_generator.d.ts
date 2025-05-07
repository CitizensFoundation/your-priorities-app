declare module '@yrpri/api/utils/manifest_generator.cjs' {
  import { Request, Response } from 'express';

  interface YpRequest extends Request {
    ypCommunity?: YpCommunity;
    ypDomain?: YpDomain;
  }

  /**
   * Generates a web app manifest.
   * The manifest content depends on the properties found on req.ypCommunity or req.ypDomain.
   * @param req The Express request object, expected to be augmented with ypCommunity and/or ypDomain properties.
   * @param res The Express response object used to send the generated manifest.
   */
  function generateManifest(req: YpRequest, res: Response): void;

  export default generateManifest;
}
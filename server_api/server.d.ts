declare module 'logger';

interface Logger {
  debug(text: string): void;
  info(text: string): void;
  warn(text: string): void;
  error(text: string): void;
}

interface Models {
  [key: string]: typeof DbData; // Assuming all models extend DbData
  Post?: typeof PostData;
}

interface DbData extends Model {
  created_at: string;
  updated_at: string;
  id: number;
  static findOne(options: any): Promise<any>;
  static destroy(options: any): Promise<any>;
  static update(options: any, data: any): Promise<any>;
  static create(options: any): Promise<any>;
  static build(options: any): Promise<any>;
  save(): Promise<any>;
}

interface PostClass extends DbData {
  data?: {
    crt?: LtpCurrentRealityTreeData
  };
}

interface GroupClass extends DbData {
  configuration: {
    ltp?: {
      crt?: LtpCurrentRealityTreeData
    }
  };
}

interface AcBackgroundJobClass extends DbData {
  static updateDataAsync(jobId: number, data: any): Promise<any>;
  static updateErrorAsync(jobId: number, error: string): Promise<any>;
}

interface ImageClass extends DbData {
  formats: string[];
}
declare module 'logger';
declare module 'iso-639-1';
declare module 'newrelic';
declare module 'html-to-docx';

interface Logger {
  debug(text: string): void;
  info(text: string): void;
  warn(text: string): void;
  error(text: string): void;
}

interface Models {
  [key: string]: typeof DbData; // Assuming all models extend DbData
  Post?: typeof PostData;
  Domain?: typeof DomainData;
  User?: typeof UserData;
}

interface DbData extends Model {
  created_at: string;
  updated_at: string;
  id: number;
  static findOne(options: any): Promise<any>;
  static findAll(options: any): Promise<any>;
  static destroy(options: any): Promise<any>;
  static update(options: any, data: any): Promise<any>;
  static create(options: any): Promise<any>;
  static count(options: any | undefined = undefined): Promise<any>;
  static build(options: any): Promise<any>;
  save(): Promise<any>;
  set(col: string, value: any): void;
}

interface DomainClass extends DbData {
  configuration: {
    ltp?: {
      crt?: LtpCurrentRealityTreeData
    }
  };
}

interface CommunityClass extends DbData {
  Domain: DomainClass;
}

interface PostClass extends DbData {
  data?: {
    crt?: LtpCurrentRealityTreeData
  };
}

interface GroupClass extends DbData {
  description: string;
  configuration: YpGroupConfiguration;
  hasGroupAdmins(user: UserClass): Promise<boolean>;
  addGroupAdmins(user: UserClass): Promise<void>;
  hasGroupUsers(user: UserClass): Promise<boolean>;
  addGroupUsers(user: UserClass): Promise<void>;
  changed(field: string, value: any): void;

}

interface UserClass extends DbData {
  email: string;
  name: string;
  new (): Promise<UserClass>;
}


interface AcBackgroundJobClass extends DbData {
  static updateDataAsync(jobId: number, data: any): Promise<any>;
  static updateErrorAsync(jobId: number, error: string): Promise<any>;
  static createJob(data: any, dataTwo: any, done: Function): Promise<any>;
}

interface AcXlsExportJobData {
  jobId: number;
  userId: number;
  exportType: string;
  fileName: string;
  utmSource: string;
  questionId: number;
}

interface ImageClass extends DbData {
  formats: string[];
}

type YpChatBotMemoryStageTypes = PsMemoryStageTypes | "chatbot-conversation";

interface PsChatBotMemoryData extends PsBaseMemoryData {
  stages: Record<any, any>;
  chatLog?: YpSimpleChatLog[];
  problemStatement?: PsProblemStatement;
  currentStage: YpChatBotMemoryStageTypes;
  groupId?: number;
  communityId?: number;
  domainId?: number;
  totalCost?: number;
  customInstructions?: object,
  subProblems?: IEngineSubProblem[],
  currentStageData?: undefined;
}

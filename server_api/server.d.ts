declare module 'logger';
declare module 'iso-639-1';

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

type YpChatBotMemoryStageTypes = PsMemoryStageTypes | "chatbot-conversation";

interface PsChatBotMemoryData extends PsBaseMemoryData {
  stages: Record<YpChatBotMemoryStageTypes, IEngineInnovationStagesData>;
  chatLog?: PsSimpleChatLog[];
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

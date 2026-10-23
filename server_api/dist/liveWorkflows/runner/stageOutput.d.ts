export declare function stageChunks(value: YpWorkflowJson): {
    chunks: string[];
    checksum: string;
};
export declare function decodeStage(chunks: string[], output: YpWorkflowStageOutput): YpWorkflowJson;

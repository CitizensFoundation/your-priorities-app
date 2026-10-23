import path from "node:path";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmDatasetValidateCommandEnvelopeSchema, VmDatasetValidatedResponseEnvelopeSchema, } from "../../contracts/index.js";
import { VmCommandValidationError } from "./runtimeEnsureImageCommandHandler.js";
export class DatasetValidateCommandHandler {
    constructor(datasets) {
        this.datasets = datasets;
        this.path = "/commands/dataset.validate";
    }
    async handle(body, context) {
        const envelope = VmDatasetValidateCommandEnvelopeSchema.parse(body);
        const sourcePath = path.resolve(envelope.data.sourcePath);
        const allowedSourceRootPath = path.resolve(envelope.data.allowedSourceRootPath);
        if (!isPathInside(allowedSourceRootPath, sourcePath)) {
            throw new VmCommandValidationError("Dataset source path must stay inside the allowed dataset output root");
        }
        const validated = await this.datasets.validateHotDataset({
            sourcePath,
            allowedSourceRootPath,
            expectedFiles: envelope.data.expectedFiles ?? [],
            assets: envelope.data.assets ?? [],
        });
        return VmDatasetValidatedResponseEnvelopeSchema.parse({
            ok: true,
            protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
            messageType: "dataset.validated",
            commandId: envelope.commandId,
            ts: context.now().toISOString(),
            data: {
                ok: true,
                commandId: envelope.commandId,
                workspaceId: envelope.data.workspaceId,
                vmHostId: envelope.data.vmHostId,
                sourcePath: validated.sourcePath,
                uri: validated.uri,
                validatedAt: context.now().toISOString(),
                sizeBytes: validated.sizeBytes,
                mountedFiles: validated.mountedFiles,
                mountedFileCount: validated.mountedFileCount,
                mountedFilesTruncated: validated.mountedFilesTruncated,
                files: validated.files,
                missingExpectedFiles: validated.missingExpectedFiles,
                missingAssetFiles: validated.missingAssetFiles,
                checksumFailures: validated.checksumFailures,
                sizeMismatches: validated.sizeMismatches,
                metadata: envelope.data.metadata ?? {},
            },
        });
    }
}
function isPathInside(basePath, targetPath) {
    const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
    return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

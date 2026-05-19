import { EvidencePortalService } from "../evidence/evidencePortalService.js";
import { EvidenceDeepResearchService } from "../evidence/evidenceDeepResearchService.js";
import { EvidenceResearchService } from "../evidence/evidenceResearchService.js";
import { EvidenceSynthesisService } from "../evidence/evidenceSynthesisService.js";
import log from "../../utils/loggerTs.js";

type EvidenceWorkPackage = {
  type: "research" | "deepResearch" | "synthesize" | "analyzePortal";
  bundleId?: number;
  runId?: number;
  groupId?: number;
  userId?: number;
};

export class EvidenceWorker {
  private researchService = new EvidenceResearchService();
  private deepResearchService = new EvidenceDeepResearchService();
  private synthesisService = new EvidenceSynthesisService();
  private portalService = new EvidencePortalService();

  async process(workPackage: EvidenceWorkPackage, callback: (error?: any) => void) {
    try {
      switch (workPackage.type) {
        case "research":
          if (!workPackage.bundleId) {
            throw new Error("Missing bundleId for evidence research work");
          }
          await this.researchService.processResearch(workPackage.bundleId);
          break;
        case "deepResearch":
          if (!workPackage.runId) {
            throw new Error("Missing runId for deep evidence research work");
          }
          await this.deepResearchService.processDeepResearch(workPackage.runId);
          break;
        case "synthesize":
          if (!workPackage.bundleId) {
            throw new Error("Missing bundleId for evidence synthesis work");
          }
          await this.synthesisService.synthesizeBundle(workPackage.bundleId);
          break;
        case "analyzePortal":
          if (!workPackage.groupId) {
            throw new Error("Missing groupId for evidence portal work");
          }
          await this.portalService.analyzePortal(
            workPackage.groupId,
            workPackage.userId
          );
          break;
        default:
          throw new Error(`Unknown evidence work package type: ${workPackage.type}`);
      }

      callback();
    } catch (error) {
      log.error("Evidence worker failed", { workPackage, error });
      callback(error);
    }
  }
}

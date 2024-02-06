const _ = require("lodash");
const FraudDeleteEndorsements = require('./FraudDeleteEndorsements.js');
const models = require("../../../../models/index.cjs");
//TODO: Change to native JS instead of lodash
class FraudDeleteRatings extends FraudDeleteEndorsements {
    async destroyChunkItems(items) {
        return this.destroyChunkItemsByModel(models.Rating, items);
    }
    async getItemsById() {
        const itemsContainer = await this.getModelItemsById(models.Rating);
        return itemsContainer.itemsToAnalyse;
    }
}
module.exports = FraudDeleteRatings;
export {};

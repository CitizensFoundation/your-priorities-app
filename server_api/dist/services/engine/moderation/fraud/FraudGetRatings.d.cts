export = FraudGetRatings;
declare class FraudGetRatings extends FraudGetEndorsements {
    ratingDimensionCountsByGroupId: {};
    getRatingDimensionCountsByGroupId(items: any): Promise<{}>;
    getRatingDimensionsForItem(item: any): any;
    getNormalizedRatingCount(items: any): number;
}
import FraudGetEndorsements = require("./FraudGetEndorsements.cjs");

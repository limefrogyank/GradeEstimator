import Enumerable from "linq";
import { Category, WeightDistributionType } from "./interfaces";

export function calculateWeights(category: Category) {

    if (category.weightDistributionType == WeightDistributionType.EvenlyDistributed) {
        
        Enumerable.from(category.gradeItems).select(item => {
            item.isDropped = false;
            item.weight = 0;
            item.weightedValue = 0;
            return item;
        }).toArray();

        const lowest = Enumerable.from(category.gradeItems)
            .where(item => item.value !== null)
            .orderBy(x => x.value)
            .take(category.numberOfLowestToDrop)
            .select(item => {
                //console.log(item.value);
                item.weight = 0;
                item.weightedValue = 0;
                item.isDropped = true;
                return item;
            });
        const highest = Enumerable.from(category.gradeItems)
            .where(x => x.value !== null)
            .orderByDescending(x => x.value)
            .take(category.numberOfHighestToDrop)
            .select(item => {
                item.weight = 0;
                item.weightedValue = 0;
                item.isDropped = true;
                return item;
            });
        const shouldHaveWeights = Enumerable.from(category.gradeItems).where(x => x.value !== null).except(lowest).except(highest);

        shouldHaveWeights.forEach(item => {
            //console.log(item.value);
            item.weight = 100.0 / shouldHaveWeights.count();
            item.weightedValue = item.weight * item.value! / item.maxValue;
            item.isDropped = false;

        });
    } else if (category.weightDistributionType == WeightDistributionType.ByIndividualWeight) {
        Enumerable.from(category.gradeItems).where(x=> x.value == null).select(item => {
            item.isDropped = false;
            item.weight = 0;
            item.weightedValue = 0;
            return item;
        }).toArray();

        const shouldHaveWeights = Enumerable.from(category.gradeItems).where(x => x.value !== null);
        let sum=0;

        let weightTotal = shouldHaveWeights.sum(x=>x.weight);
        shouldHaveWeights.forEach(item => {
            let tempWeight = item.weight/weightTotal ;            
            item.weightedValue = tempWeight * item.value! / item.maxValue ;
            item.isDropped = false;
            sum += item.weightedValue;
        });
        category.weightedValue = sum*category.weight;

    } else {
        let sum=0;
        category.gradeItems.forEach(x => {
            x.weightedValue = (x.value == null ? 0 : x.value) * x.weight /100;
            sum += x.weightedValue;
        });
        category.weightedValue = sum;
    }
}
import Enumerable from "linq";
import { Category, WeightDistributionType } from "./interfaces";

export function calculateWeights(category: Category) {

    if (category.weightDistributionType == WeightDistributionType.EvenlyDistributed) {

        Enumerable.from(category.gradeItems).select(item => {
            item.isDropped = false;
            item.actualWeight = 0;
            item.weightedValue = 0;

            return item;
        }).force();


        const lowest = Enumerable.from(category.gradeItems)
            .where(item => item.value !== null)
            .orderBy(x => x.value)
            .take(category.numberOfLowestToDrop)
            .select(item => {
                //console.log(item.value);
                item.actualWeight = 0;
                item.weightedValue = 0;
                item.isDropped = true;
                return item;
            }).toArray();
        const highest = Enumerable.from(category.gradeItems)
            .where(x => x.value !== null)
            .orderByDescending(x => x.value)
            .take(category.numberOfHighestToDrop)
            .select(item => {
                item.actualWeight = 0;
                item.weightedValue = 0;
                item.isDropped = true;
                return item;
            });

        const shouldHaveWeights = Enumerable.from(category.gradeItems).where(x => x.value !== null).except(lowest).except(highest).select(item => {
            item.actualWeight = item.weight;
            return item;
        });

        let sum = 0;
        const count = shouldHaveWeights.count();
        shouldHaveWeights.select(item => {
            //console.log(item.value);
            item.actualWeight = 100.0 / count;
            item.weightedValue = item.actualWeight * item.value! / item.maxValue;
            item.isDropped = false;
            sum += item.weightedValue;
            return item;
        }).force();
        //console.log(JSON.stringify(category.gradeItems));
        console.log(category.isExpanded);
        if (category.isExpanded) {
            category.weightedValue = sum * category.weight / 100;
        } else {
            category.weightedValue = (category.value !== null ? category.value : 0) * category.weight / 100;
        }



    } else if (category.weightDistributionType == WeightDistributionType.ByIndividualWeight) {

        Enumerable.from(category.gradeItems).where(x => x.value == null).select(item => {
            item.isDropped = false;
            item.actualWeight = 0;
            item.weightedValue = 0;
            return item;
        }).toArray();

        const shouldHaveWeights = Enumerable.from(category.gradeItems).where(x => x.value !== null).select(item => {
            item.actualWeight = item.weight;
            return item;
        });
        let sum = 0;

        let weightTotal = shouldHaveWeights.sum(x => x.actualWeight);
        shouldHaveWeights.forEach(item => {
            let tempWeight = item.actualWeight / weightTotal;
            item.weightedValue = tempWeight * item.value! / item.maxValue;
            item.isDropped = false;
            sum += item.weightedValue;
        });
        category.weightedValue = sum * category.weight;

    } else {
        let sum = 0;
        category.gradeItems.forEach(x => {
            x.weightedValue = (x.value == null ? 0 : x.value) * x.actualWeight / 100;
            sum += x.weightedValue;
        });
        category.weightedValue = sum;
    }
}
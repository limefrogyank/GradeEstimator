export enum WeightDistributionType {
    ByPoints = 0,
    EvenlyDistributed = 1,
    ByIndividualWeight = 2
}

export enum GradeType {
    Numeric = "Numeric",
    PassFail = "PassFail",
    SelectBox = "SelectBox",
    Text = "Text"


}


export interface Category {
    name: string;
    excludeFromFinalGrade: boolean;
    gradeItems: GradeItem[];
    id: number;
    maxValue: number;
    numberOfHighestToDrop: number;
    numberOfLowestToDrop: number;
    weight: number;
    weightDistributionType: WeightDistributionType;

    value: number | null;
    weightedValue: number;

    isExpanded: boolean;
    categoryObject: any;
}

export interface GradeItem {
    name: string;
    excludeFromFinalGrade: boolean;
    gradeType: GradeType;
    id: number;
    weight: number;  // D2L version not used or reliable if ByPoints or EvenlyDistributed 
    maxValue: number;  // not reliable if EvenlyDistributed or ByIndividualWeight
    canExceedMaxPoints: boolean;
    isBonus: boolean;

    value: number | null;
    actualWeight: number; //useful for when a value is blank in a category and weights are recalculated.
    weightedValue: number;

    parent: Category | null;
    gradeObject: any;
    gradeValue: any;
    isDropped:boolean;
}

export function createCategory(x: any): Category {

    const category : Category = {
        name: x.Name,
        excludeFromFinalGrade: x.ExcludeFromFinalGrade,
        gradeItems: new Array<GradeItem>(),
        id: x.Id,
        maxValue: x.WeightDistributionType == WeightDistributionType.ByPoints ? x.MaxPoints : 100,
        numberOfHighestToDrop: x.NumberOfHighestToDrop,
        numberOfLowestToDrop: x.NumberOfLowestToDrop,
        weight: x.Weight,
        weightDistributionType: x.WeightDistributionType,
        isExpanded: false,
        value: null,
        weightedValue: 0,
        categoryObject: null
    }

    for (const item of x.Grades) {
        const gradeItem = createGradeItem(item, category);
        category.gradeItems.push(gradeItem);
    }

    return category;

}

export function createGradeItem(x: any, category: Category | null): GradeItem {
    return {
        name: x.Name,
        excludeFromFinalGrade: x.ExcludeFromFinalGrade,
        gradeType: x.GradeType,
        id: x.Id,
        weight: x.Weight,
        maxValue: x.MaxPoints,
        canExceedMaxPoints: x.CanExceedMaxPoints,
        isBonus: x.IsBonus,
        parent: category,

        value: null,
        actualWeight: x.Weight,
        weightedValue: 0,
        gradeObject: null,
        gradeValue: null,
        isDropped:false
    }

}

export enum GradeObjectType {
    Numeric = 1,  // for now, only using this one
    PassFail = 2,
    SelectBox = 3,
    Text = 4,
    Calculated = 5,
    Formula = 6,
    FinalCalculated = 7,
    FinalAdjusted = 8,
    Category = 9
}

export interface GradeValue {
    gradeObjectType: GradeObjectType;
    value: number;
    id: number;
}

// if parent distribution type is evenly distributed, then individual weight   

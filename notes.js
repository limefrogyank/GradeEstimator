//WEIGHTED 

//same weight each:

let object = {
    "MaxPoints": 100,
    "CanExceedMaxPoints": true,
    "IsBonus": false,
    "ExcludeFromFinalGradeCalculation": false,
    "GradeSchemeId": null,
    "GradeSchemeUrl": "/d2l/api/le/1.67/521618/grades/schemes/0",
    "Id": 3144963,
    "Name": "Exam 1",
    "ShortName": "",
    "GradeType": "Numeric",
    "CategoryId": 3144962,
    "Description": { "Text": "", "Html": "" },
    "Weight": 33.333333333,
    "AssociatedTool": null,
    "IsHidden": false
}



//by points:

let object2 = {
    "MaxPoints": 15,
    "CanExceedMaxPoints": false,
    "IsBonus": false, 
    "ExcludeFromFinalGradeCalculation": false, 
    "GradeSchemeId": null, 
    "GradeSchemeUrl": "/d2l/api/le/1.67/521618/grades/schemes/0", 
    "Id": 3144958, 
    "Name": "Q2", 
    "ShortName": "", 
    "GradeType": "Numeric", 
    "CategoryId": 3144956, 
    "Description": { "Text": "", "Html": "" }, 
    "Weight": 1, 
    "AssociatedTool": null, 
    "IsHidden": false
};

let grade2 = {
    "PointsNumerator": 9,
    "PointsDenominator": 15,
    "WeightedNumerator": 15, 
    "WeightedDenominator": 25, 
    "GradeObjectIdentifier": "3144958", 
    "GradeObjectName": "Q2", 
    "GradeObjectType": 1, 
    "GradeObjectTypeName": "Numeric", 
    "DisplayedGrade": "60 %", 
    "Comments": { "Text": "", "Html": "" }, 
    "PrivateComments": { "Text": "", "Html": "" }, 
    "LastModified": "2024-06-05T20:47:27.957Z", 
    "LastModifiedBy": 850894, 
    "ReleasedDate": null
};
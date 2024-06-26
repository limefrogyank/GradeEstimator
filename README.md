# GradeEstimator
Easy to use webpage grade estimator for students to use.  Good for posting to LMS like D2L or Blackboard.

These tools depend on [AG-Grid Community edition](https://www.ag-grid.com/community/) and use a JSDelivr link.  If you prefer, you can download a copy of AG-Grid and store it on your server directly.

Demo:  https://limefrogyank.github.io/GradeEstimator/pointsBased.html

Demo: https://limefrogyank.github.io/GradeEstimator/percentBased.html

# Why use it?

1.  This is better than a shared spreadsheet (MS Excel or Google Sheets) because students do NOT need to sign in to their accounts.  Also, spreadsheets like this are shared so you need to make one for each student or else they'll end up seeing each other's grades.  Asking them to make a copy is mostly futile.

2.  This calculator will save the scores they enter into their browser.  If they reopen the page at a later date, the scores will return.  If they are using a public computer, they can instantly wipe out the save file with a button at the top of the table.  However, this data contains no personally identifying information, so if they forget, no big deal.

3.  This estimator will copy just fine when you copy your course shell for next term.

4.  It should be fully accessible.


# To Use

To edit the categories and weights/points, open the HTML file you want to use and scroll down to `const rowDataEditable`.  (Below is the points-based version, but percent-based will be similar.)

```
// Edit categories and maximum points HERE!  
const rowDataEditable = [
    { category: "Exam 1", maxPoints: 50 },
    { category: "Exam 2", maxPoints: 50 },
    { category: "Final Exam", maxPoints: 50 },
    { category: "HW1", maxPoints: 15 },
    { category: "HW2", maxPoints: 15 },
    { category: "HW3", maxPoints: 15 },
    { category: "HW4", maxPoints: 15 }
];

```
Edit this list to match your grading scheme.  Inside the square brackets "[ ]", line must start and end with curly braces "{ }" and each line must end with a comma ",".  You don’t need a comma for the last line.  Inside the curly braces you must have:

Points-based:
`category: "Some Name with quotes", maxPoints: some number `

Percentage-based:
`category: "Some Name with quotes", weight: some percentage without percent symbol`

Points-based `maxPoints` values must add up to the total points you’re using in the class to calculate a final grade correctly. Percentage-based `weight` values must add up to 100. Mis-spellings will likely cause errors.

_OPTIONAL_:   You can change the default grade (when a student hasn’t entered anything yet) to something other than the max points/percentage using the `defaultPercentage` variable that is just below what you just edited.  I have set it to full credit by default.

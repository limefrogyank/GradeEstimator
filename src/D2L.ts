import { GridOptions, ColDef, createGrid, GridApi, CellStyle, IRowNode } from 'ag-grid-community';
import { Category, GradeItem, GradeObjectType, GradeType, createCategory, createGradeItem } from './interfaces';
import { sampleObjects } from './sampleData/sampleData';
import { sampleCategories } from './sampleData/sampleCategories';
import { sampleGrades } from './sampleData/sampleGradeValues';
import { calculateWeights } from './util';

// Created by Lee McPherson, May 2024 (lee.mcpherson@pcc.edu, leemcpherson@hotmail.com)

// Column Definitions: Defines the columns to be displayed.

const isDebugging: boolean = true;

let parentGrid: GridApi<GradeItem | Category>;
let isWeighted: boolean = false;

const columnDefsWeighted: ColDef<GradeItem | Category>[] = [
    {
        field: "name",
        cellRenderer: p => {
            const div = document.createElement('div');
            div.style.cssText = "display: inline-flex;align-items: center;";

            const title = document.createElement('span');

            if (p.data.gradeItems && p.data.gradeItems.length > 0) {
                //if (p.data.gradeItems.length > 1) {

                const button = document.createElement('button');
                button.classList.add('ag-button');
                button.classList.add('ag-floating-filter-button-button');
                button.style.cssText = "display:flex;";
                const innerspan = document.createElement('span');
                innerspan.classList.add('ag-icon');
                innerspan.classList.add('ag-icon-tree-closed');
                button.appendChild(innerspan);
                //button.innerHTML = "&#xf130";
                button.onclick = () => {
                    p.data.isExpanded = !p.data.isExpanded;
                    calculateWeights(p.data);
                    p.api.resetRowHeights();
                    p.api.redrawRows({ rowNodes: [p.node] });
                    generatePinnedBottomData(parentGrid);
                };
                div.appendChild(button);

                title.innerHTML = 'Category: ' + p.data.name + ' (' + p.data.gradeItems.length + ')';
            } else {
                title.innerHTML = p.data.name;
            }
            div.appendChild(title);
            return div;
        }

    },
    {
        field: "value",
        editable: true,
        singleClickEdit: true,
        cellStyle: p => {
            if (p.data && p.data.name === 'Class Grade') {
                return { display: 'none' } as CellStyle;
            }
            return { backgroundColor: "yellow" } as CellStyle;

            //return { border: '2px black solid' }
        },
        onCellValueChanged: (e) => {
            // Write to browser first.
            if (e.data) {
                console.log(e.data);
                if ("parent" in e.data && e.data.parent != null) {
                    const category = e.data.parent;
                    console.log(category);
                    calculateWeights(category);

                    e.api.redrawRows();
                    //generatePinnedBottomData(parentGrid);
                } else {
                    // Calculate aggregation row
                    e.data.weightedValue = e.newValue * e.data.weight / 100;
                    //console.log(e.data.weightedValue);

                    e.api.redrawRows({ rowNodes: [e.node as IRowNode<Category | GradeItem>] });

                }

                generatePinnedBottomData(parentGrid);
            }
        }
    },
    {
        // remove this field if category & isWeighted
        field: "maxValue",
        width: 150,
        cellStyle: p => {
            if (p.data && p.data.name === 'Class Grade') {
                return { display: 'none' };
            }
            return;
        },
    },
    {
        field: "weight",
        width: 100,
        cellStyle: p => {
            if (p.data && p.data.name === 'Class Grade') {
                return { display: 'none' };
            }
            return;
        },
        valueGetter: p => {
            if (p.data) {
                if ("actualWeight" in p.data) {
                    return p.data.actualWeight;
                } else {
                    return p.data.weight;
                }

            }
        },
        valueFormatter: p => {
            if (p.data && p.data.name === 'Class Grade' && p.value !== null) {
                return (p.value ? p.value.toFixed(1) + '%' : '0%');
            } else {
                if (p.data) {
                    return (p.value != null ? Math.round(p.value * 10) / 10 + '%' : '0%');
                } else {
                    return '0%';
                }
            }
        }
    },
    {
        field: "weightedValue",
        width: 200,
        valueGetter: p => {
            if (p.data && p.data.name === 'Class Grade') {
                let total = p.data.value !== null ? p.data.value / p.data.maxValue * 100.0 : 0;
                return total;
            }
            if (p.data) {
                return p.data.weightedValue;
            } else
                return "";
        },
        valueFormatter: p => {
            if (p.data) {

                if (p.data.name === 'Class Grade') {
                    return p.value !== null ? (Math.round(p.value * 100) / 100).toString() + '%' : '0%';
                } else {
                    if ("isDropped" in p.data && p.data.isDropped){
                        return "dropped";
                    }else{
                        return p.value != null ? (Math.round(p.value * 100) / 100).toString() : '';
                    }
                }
            } else {
                return '0';
            }
        },
        cellStyle: p => {
            if (p.data && "isDropped" in p.data && p.data.isDropped){
                return {background: 'lightblue'};
            }
            return;
        }
    }


];

const columnDefsPoints: ColDef[] = [
    {
        field: "name",
        cellRenderer: p => {
            const div = document.createElement('div');
            div.style.cssText = "display: inline-flex;align-items: center;";

            const title = document.createElement('span');

            if (p.data.gradeItems && p.data.gradeItems.length > 0) {
                //if (p.data.gradeItems.length > 1) {

                const button = document.createElement('button');
                button.classList.add('ag-button');
                button.classList.add('ag-floating-filter-button-button');
                button.style.cssText = "display:flex;";
                const innerspan = document.createElement('span');
                innerspan.classList.add('ag-icon');
                innerspan.classList.add('ag-icon-tree-closed');
                button.appendChild(innerspan);
                //button.innerHTML = "&#xf130";
                button.onclick = () => {
                    p.data.isExpanded = !p.data.isExpanded;
                    calculateWeights(p.data);
                    p.api.resetRowHeights();
                    p.api.redrawRows({ rowNodes: [p.node] });
                    generatePinnedBottomData(parentGrid);
                };
                div.appendChild(button);

                title.innerHTML = 'Category: ' + p.data.name + ' (' + p.data.gradeItems.length + ')';
            } else {
                title.innerHTML = p.data.name;
            }
            div.appendChild(title);
            return div;
        }

    },
    {
        field: "value",
        editable: p => p.data.name !== 'Class Grade',
        singleClickEdit: true,
        cellStyle: p => {
            if (p.data.name === 'Class Grade') {
                return null;
            }
            return { background: "yellow" };
            //return { border: '2px black solid' }
        },
        onCellValueChanged: (e) => {
            // check if cell is inside a category... if so, change category total/percentage

            if (e.data.parent != null) {
                let parent = e.data.parent;
                let total = 0;
                for (const item of parent.rowData) {
                    total += item.value;
                }
                parent.value = total;
                generatePinnedBottomData(parentGrid);
            } else {
                // Calculate aggregation row
                generatePinnedBottomData(e.api);
            }
        }
    },
    {
        field: "maxValue"
    },
    {
        field: "percentage",
        valueGetter: p => {
            if (p.data.category === 'Class Grade') {
                return p.data.points;
            }
            return p.data.value / p.data.maxValue * 100;
        },
        valueFormatter: p => {
            return p.value.toFixed(1) + '%';
        }
    }
];


interface D2LStorage {
    "*:*:*": Token;
}
interface Token {
    expires_at: number;
    access_token: string;
}




export async function getAPIDataAsync() {

    // D2L specific:  try and get token then download grades from API

    let token: string | undefined;
    let tokenData: D2LStorage;
    let tokenRaw = await window.localStorage.getItem('D2L.Fetch.Tokens');
    if (tokenRaw && tokenRaw !== null) {
        tokenData = JSON.parse(tokenRaw);
        let tokenDate = new Date(tokenData!["*:*:*"]["expires_at"] * 1000);
        if (tokenDate.getTime() > Date.now()) {
            token = tokenData!["*:*:*"]["access_token"];
        }
    }

    if (isDebugging) {
        token = "TEST";
    }

    if (token) {
        //tokenData = JSON.parse(tokenData);
        //console.log(tokenData);
        //const token = tokenData["*:*:*"]["access_token"];
        //console.log(token);

        // get org unit
        const hrefsplit = window.parent.location.href.split('/');
        const orgUnitId = hrefsplit[hrefsplit.indexOf('content') + 1];

        const fetchOptions: RequestInit = {
            method: 'GET',
            //withCredentials: true,
            credentials: 'include',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        };


        //let isPoints = false;
        let scheme;
        let gradeObjects;
        let categories;
        let myGrades;

        if (isDebugging) {
            isWeighted = true;
            gradeObjects = sampleObjects;
            categories = sampleCategories;
            myGrades = sampleGrades;

        } else {
            const responseSetup = await fetch(window.location.origin + "/d2l/api/le/1.67/" + orgUnitId + "/grades/setup/");
            const setup = await responseSetup.json();
            isWeighted = setup.GradingSystem === "Weighted";
            // isPoints = setup.GradingSystem === "Points";

            const responseScheme = await fetch(window.location.origin + "/d2l/api/le/1.67/" + orgUnitId + "/grades/schemes/");
            scheme = await responseScheme.json();
            console.log(scheme);

            const responseGradeObjects = await fetch(window.location.origin + "/d2l/api/le/1.67/" + orgUnitId + "/grades/");
            gradeObjects = await responseGradeObjects.json();
            console.log(JSON.stringify(gradeObjects));

            const responseCategories = await fetch(window.location.origin + "/d2l/api/le/1.67/" + orgUnitId + "/grades/categories/", fetchOptions);
            categories = await responseCategories.json();
            console.log(JSON.stringify(categories));

            const responseMyGrades = await fetch(window.location.origin + "/d2l/api/le/1.67/" + orgUnitId + "/grades/values/myGradeValues/", fetchOptions);
            myGrades = await responseMyGrades.json();
            console.log(JSON.stringify(myGrades));
        }

        let rowData = gradeObjects.filter(v => v.CategoryId == 0 && v.Weight != 0 && v.GradeType == 'Numeric').map(v => {
            const gradeItem = createGradeItem(v, null);
            gradeItem.value = gradeItem.maxValue;
            let grade = myGrades.find(x => x.GradeObjectIdentifier == v.Id);
            if (grade) {
                if (grade.GradeObjectType == GradeObjectType.Numeric) {
                    gradeItem.value = grade.PointsNumerator;
                }
            }


            return gradeItem;
        });

        let rowDataCategories = categories.filter((v: any) => v.Grades && v.Grades.filter((x: any) => x.GradeType == 'Numeric').length > 0).map(v => {

            const category = createCategory(v);

            let grade = myGrades.find((x: any) => x.GradeObjectIdentifier == v.Id);
            if (grade) {
                if (grade.GradeObjectType == GradeObjectType.Category) {
                    category.value = grade.PointsNumerator;
                }
            }
            // get items inside category and add values (that exist) to them
            category.gradeItems.forEach(v2 => {
                if (v2.gradeType == GradeType.Numeric) {
                    let grade = myGrades.find(x => x.GradeObjectIdentifier == v2.id);
                    if (grade) {
                        if (grade.GradeObjectType == GradeObjectType.Numeric) {
                            v2.value = grade.PointsNumerator;
                        }
                    }
                }
            });
            // if evenly weighted, must calculate weights
            calculateWeights(category);

            return category;

        });
        rowData = rowData.concat(rowDataCategories);

        function createGridOptions(rowData): GridOptions {
            // Grid Options: Contains all of the data grid configurations
            const gridOptions: GridOptions = {
                domLayout: 'autoHeight',
                stopEditingWhenCellsLoseFocus: true,
                getRowHeight: p => {
                    if (p.node.rowPinned && p.node.rowPinned === "bottom") {
                        return 70;
                    }
                    if (p.data.isExpanded) {  //title + header + cells + final border
                        return 39 + 48 + (p.data.gradeItems.filter(v => v.gradeType == GradeType.Numeric).length * 42) + 30;
                    }
                },
                getRowStyle: p => {
                    if (p.node.rowPinned && p.node.rowPinned === "bottom") {
                        return { fontSize: 'x-large', background: '#F4F4F4', paddingTop: '10px' };
                    }
                },
                isFullWidthRow: p => {
                    return p.rowNode.data.isExpanded;
                },
                fullWidthCellRenderer: fullWidthCellRenderer,
                // Row Data: The data to be displayed.
                rowData: rowData,

                columnDefs: isWeighted ? columnDefsWeighted : columnDefsPoints,

                defaultColDef: {
                    suppressKeyboardEvent: suppressKeyboardEvent,
                }
            };
            return gridOptions;
        }

        function fullWidthCellRenderer(p) {
            //create new grid inside with sub data
            const div = document.createElement('div');
            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = "display: inline-flex;align-items: center;";
            div.appendChild(titleDiv);

            const button = document.createElement('button');
            button.classList.add('ag-button');
            button.classList.add('ag-floating-filter-button-button');
            button.style.cssText = "display:flex;margin-left:10px;";
            const innerspan = document.createElement('span');
            innerspan.classList.add('ag-icon');
            innerspan.classList.add('ag-icon-tree-open');
            button.appendChild(innerspan);
            //button.innerHTML = "&#xf130";
            button.onclick = () => {
                p.data.isExpanded = !p.data.isExpanded;
                p.api.resetRowHeights();
                calculateWeights(p.data);
                p.api.redrawRows({ rowNodes: [p.node] });
                generatePinnedBottomData(parentGrid);
            };
            titleDiv.appendChild(button);

            const title = document.createElement('span');
            //title.classList.add('ag-cell');
            title.style.cssText = "margin: 10px;";
            title.innerHTML = "Category: " + p.data.name + "";
            titleDiv.appendChild(title);

            const subGridDiv = document.createElement('div');
            subGridDiv.style.cssText = 'margin-left: 30px';
            subGridDiv.classList.add('ag-theme-quartz');
            div.appendChild(subGridDiv);

            createGrid(subGridDiv, createGridOptions(p.data.gradeItems));

            return div;
        }

        // Your Javascript code to create the data grid
        const myGridElement = document.querySelector('#myGrid') as HTMLElement;
        parentGrid = createGrid(myGridElement, createGridOptions(rowData));

        generatePinnedBottomData(parentGrid);
        //grid.setGridOption('rowData', newData);
    } else {
        const myGridElement = document.querySelector('#myGrid') as HTMLElement;
        myGridElement.innerHTML = `<h2>There was a problem accessing the token that allows access to D2L services.  It may have expired or was erased.
                        Try navigating back to the class home page and reloading.</h2>`;
    }
}


// Function that aggregates the values from each row
function calculatePinnedBottomData(grid: GridApi<Category | GradeItem>, target) {
    grid.forEachNodeAfterFilter((rowNode: IRowNode<Category | GradeItem>) => {

        if (rowNode.data && rowNode.data.value != null) {

            if ("isExpanded" in rowNode.data && rowNode.data.isExpanded) {
                let subValue = 0;
                let subMaxValue = 0;
                for (const gradeItem of rowNode.data.gradeItems) {
                    if (isWeighted) {
                        subValue += gradeItem.weightedValue;
                        subMaxValue += gradeItem.actualWeight;
                    } else {
                        if (gradeItem.value !== null)
                            subValue += gradeItem.value;
                        subMaxValue += gradeItem.maxValue;
                    }
                }
                if (isWeighted) {
                    target.value += (subValue * rowNode.data.weight / 100);
                    target.maxValue += (subMaxValue * rowNode.data.weight / 100);
                } else {
                    target.value += subValue;
                    target.maxValue += subMaxValue;
                }
            } else {
                if (isWeighted) {
                    console.log(rowNode.data)
                    target.value += rowNode.data.weightedValue;
                    target.maxValue += rowNode.data.weight;
                } else {
                    if (rowNode.data.value !== null)
                        target.value += rowNode.data.value;
                    target.maxValue += rowNode.data.maxValue;
                }
            }
        }
    });

    return target;
};

// Function that creates the last pinned row that displays aggregate results
function generatePinnedBottomData(grid: GridApi<Category | GradeItem>) {
    // generate a row-data with null values
    let result: any = { name: 'Class Grade' };
    result['value'] = 0;
    result['maxValue'] = 0;
    const t = calculatePinnedBottomData(grid, result);
    //t['name'] = 'Class Grade';
    grid.setGridOption('pinnedBottomRowData', [t]);
}

// This next section handles keyboard navigation to the custom content inside the cells.
// i.e. the button that "expands" the cell to show items inside a category
//      and the new grid inside the category cell 

function getAllFocusableElementsOf(el) {
    return Array.from<HTMLElement>(
        el.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),).filter((focusableEl) => {
            return focusableEl.tabIndex !== -1;
        });
}

function getEventPath(event) {
    const path: HTMLElement[] = [];
    let currentTarget = event.target as HTMLElement | null;

    while (currentTarget) {
        path.push(currentTarget);
        currentTarget = currentTarget.parentElement;
    }

    return path;
}

const GRID_CELL_CLASSNAME = "ag-cell";

function suppressKeyboardEvent({ event }) {
    const { key, shiftKey } = event;
    const path = getEventPath(event);
    const isTabForward = key === "Tab" && shiftKey === false;
    const isTabBackward = key === "Tab" && shiftKey === true;

    let suppressEvent = false;

    // Handle cell children tabbing
    if (isTabForward || isTabBackward) {
        const eGridCell = path.find((el) => {
            if (el.classList === undefined) return false;
            return el.classList.contains(GRID_CELL_CLASSNAME);
        });

        if (!eGridCell) {
            return suppressEvent;
        }

        const focusableChildrenElements = getAllFocusableElementsOf(eGridCell);
        const lastCellChildEl =
            focusableChildrenElements[focusableChildrenElements.length - 1];
        const firstCellChildEl = focusableChildrenElements[0];

        // Suppress keyboard event if tabbing forward within the cell and the current focused element is not the last child
        if (focusableChildrenElements.length === 0) {
            return false;
        }

        const currentIndex = focusableChildrenElements.indexOf(document.activeElement as HTMLElement);

        if (isTabForward) {
            const isLastChildFocused =
                lastCellChildEl && document.activeElement === lastCellChildEl;

            if (!isLastChildFocused) {
                suppressEvent = true;
                if (currentIndex !== -1 || document.activeElement === eGridCell) {
                    event.preventDefault();
                    focusableChildrenElements[currentIndex + 1].focus();
                }
            }
        }
        // Suppress keyboard event if tabbing backwards within the cell, and the current focused element is not the first child
        else {
            const cellHasFocusedChildren =
                eGridCell.contains(document.activeElement) &&
                eGridCell !== document.activeElement;

            // Manually set focus to the last child element if cell doesn't have focused children
            if (!cellHasFocusedChildren) {
                lastCellChildEl.focus();
                // Cancel keyboard press, so that it doesn't focus on the last child and then pass through the keyboard press to
                // move to the 2nd last child element
                event.preventDefault();
            }

            const isFirstChildFocused =
                firstCellChildEl && document.activeElement === firstCellChildEl;
            if (!isFirstChildFocused) {
                suppressEvent = true;
                if (currentIndex !== -1 || document.activeElement === eGridCell) {
                    event.preventDefault();
                    focusableChildrenElements[currentIndex - 1].focus();
                }
            }
        }
    }

    return suppressEvent;
}


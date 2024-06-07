import { getAPIDataAsync } from './D2L';
/* CSS Community */
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

//export { getAPIDataAsync} from './D2L';

//(window as any).getAPIDataAsync = getAPIDataAsync;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Calculate your class grade</h1>
    <p>Click on a value cell to change the value to one that fits your results.</p>
    
    <div id="myGrid" class="ag-theme-quartz"></div>
  
  </div>
`

getAPIDataAsync();
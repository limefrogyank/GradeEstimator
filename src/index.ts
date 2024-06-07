import { getAPIDataAsync } from './D2L';
/* CSS Community */
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export { getAPIDataAsync} from './D2L';

(window as any).getAPIDataAsync = getAPIDataAsync;
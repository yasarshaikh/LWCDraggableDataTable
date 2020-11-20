import { createElement } from "lwc";
import { registerLdsTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import DataTableDragable from "c/dataTableDragable";
import getUsers from "@salesforce/apex/UserUtil.getUsers";

const mockGetRecord = require("./data/users.json");
const getRecordWireAdapter = registerLdsTestWireAdapter(getUsers);

describe("c-data-table-dragable", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);

      // Prevent data saved on mocks from leaking between tests
      jest.clearAllMocks();
    }
  });

  it("Check if data is loaded or not", () => {
    const element = createElement("c-data-table-dragable", {
      is: DataTableDragable
    });
    document.body.appendChild(element);
    getRecordWireAdapter.emit(mockGetRecord);
 
    return Promise.resolve().then(() => {
      expect(element).toBeAccessible();
      const trEls = element.shadowRoot.querySelectorAll('tr');
      expect(trEls.length).toBeGreaterThan(mockGetRecord.length);//header tr is also present, hence greater than is used. 
    });
  });

 
});

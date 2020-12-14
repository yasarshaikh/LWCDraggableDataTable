import { LightningElement, wire, api } from "lwc";
import getUsers from "@salesforce/apex/UserUtil.getUsers";

export default class DataTableDragable extends LightningElement {
  @wire(getUsers)
  users;

  @api userMap;
  @api dragMap;

  renderedCallback() {
    if (!!this.users && !!this.users.data) {
      this.userMap = new Map();
      let tempArray = JSON.parse(JSON.stringify(this.users.data));
      tempArray.forEach((arrayElement, index) => {
        arrayElement.index = index;
        this.userMap.set(arrayElement.Id, arrayElement);
      });
      console.log(
        ": ------------------------------------------------------------"
      );
      console.log(
        "DataTableDragable -> renderedCallback -> tempArray",
        JSON.stringify(tempArray)
      );
      console.log(
        ": ------------------------------------------------------------"
      );
      this.users.data = JSON.parse(JSON.stringify(tempArray));
    }
  }

  handleSubmit() {
    console.log("in submit method");
    let data = this.users.data;
    console.log(": ----------------------------------------------");
    console.log(
      "DataTableDragable -> handleSubmit -> data",
      JSON.stringify(data)
    );
    console.log(": ----------------------------------------------");
  }

  processRowNumbers() {
    const trs = this.template.querySelectorAll(".myIndex");
    const ids = this.template.querySelectorAll(".myId");
    for (let i = 0; i < trs.length; i++) {
      let currentRowId = ids[i].innerText;
      let currentRowRef = this.userMap.get(currentRowId);
      currentRowRef.index = i;
      this.userMap.set(currentRowId, currentRowRef);
      trs[i].innerText = i;
    }
    this.users.data = Array.from(this.userMap.values());
  }

  onDragStart(evt) {
    const inputs = this.template.querySelectorAll(".mychkbox");
    this.dragMap = new Map();

    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
          let currentRow = inputs[i].parentNode.parentNode;
          let currentDragId = currentRow.dataset.dragId;
          this.dragMap.set(currentDragId, currentRow);
          //currentRow.classList.add("grabbed");
        }
      }
    }

    let eventRowDataId = evt.currentTarget.dataset.dragId;
    evt.dataTransfer.setData("dragId", eventRowDataId);
    evt.dataTransfer.setData("sy", evt.pageY);
    evt.dataTransfer.effectAllowed = "move";
    evt.currentTarget.classList.add("grabbed");

    if (this.dragMap.has(eventRowDataId)) {
      this.dragMap.forEach((value) => value.classList.add("grabbed"));
    }
  }

  onDragOver(evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }

  onDrop(evt) {
    evt.preventDefault();
    let sourceId = evt.dataTransfer.getData("dragId");

    const sy = evt.dataTransfer.getData("sy");
    const cy = evt.pageY;

    if (sy > cy) {
      if (this.dragMap.has(sourceId)) {

        Array.from(this.dragMap).reverse().forEach( element => {
          let key = element[0];
          const elm = this.template.querySelector(`[data-drag-id="${key}"]`);
          if (!!elm) {
            elm.classList.remove("grabbed");
          }
          evt.currentTarget.parentElement.insertBefore(elm, evt.currentTarget);
        });
      } else {
        const elm = this.template.querySelector(`[data-drag-id="${sourceId}"]`);
        if (!!elm) {
          elm.classList.remove("grabbed");
        }
        evt.currentTarget.parentElement.insertBefore(elm, evt.currentTarget);
      }
    } else {
      if (this.dragMap.has(sourceId)) {
        this.dragMap.forEach((value, key, map) => {
          const elm = this.template.querySelector(`[data-drag-id="${key}"]`);
          if (!!elm) {
            elm.classList.remove("grabbed");
          }
          evt.currentTarget.parentElement.insertBefore(
            elm,
            evt.currentTarget.nextElementSibling
          );
        });
      } else {
        const elm = this.template.querySelector(`[data-drag-id="${sourceId}"]`);
        if (!!elm) {
          elm.classList.remove("grabbed");
        }
        evt.currentTarget.parentElement.insertBefore(
          elm,
          evt.currentTarget.nextElementSibling
        );
      }
    }
    this.processRowNumbers();
  }
}

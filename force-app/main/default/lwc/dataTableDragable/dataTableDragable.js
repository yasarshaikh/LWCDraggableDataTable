import { LightningElement, wire } from "lwc";
import getUsers from "@salesforce/apex/UserUtil.getUsers";


export default class DataTableDragable extends LightningElement {
  @wire(getUsers)
  users;

  userMap; 

  renderedCallback(){
    if( !!this.users  && !!this.users.data){
      this.userMap = new Map();
      let tempArray = JSON.parse( JSON.stringify(this.users.data) );
      tempArray.forEach( (arrayElement, index) => {
        arrayElement.index = index;
        this.userMap.set(arrayElement.Id, arrayElement);
      });
      
      this.users.data = JSON.parse( JSON.stringify(tempArray) );
    }
  }


  handleSubmit(){
    let data = this.users.data;
    console.log(": ----------------------------------------------")
    console.log("DataTableDragable -> handleSubmit -> data", JSON.stringify(data))
    console.log(": ----------------------------------------------")
    
  }

  processRowNumbers(){
    const trs = this.template.querySelectorAll(".myIndex");
    const ids = this.template.querySelectorAll(".myId");
    for( let i =0;i< trs.length; i++){
      let currentRowId = ids[i].innerText;
      let currentRowRef = this.userMap.get(currentRowId );      
      currentRowRef.index = i;
      this.userMap.set(currentRowId , currentRowRef);
      trs[i].innerText = i;
    }
    this.users.data = Array.from(this.userMap.values() );

  } 
  
  onDragStart(evt) {
    evt.dataTransfer.setData("dragId", evt.currentTarget.dataset.dragId);
    evt.dataTransfer.setData("sy", evt.pageY );	//storing starting y pixels
    evt.dataTransfer.effectAllowed = "move";
    evt.currentTarget.classList.add("grabbed");
  }

  onDragOver(evt) {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }

  onDrop(evt) {
    evt.preventDefault();
    let sourceId = evt.dataTransfer.getData("dragId");
    const elm = this.template.querySelector(`[data-drag-id="${sourceId}"]`);
    const sy = evt.dataTransfer.getData("sy");
    const cy = evt.pageY;
    elm.classList.remove("grabbed");
	//comparing starting Y-pixel and current Y-pixel. 	
    if( sy > cy)
    {
	  //in this case, starting Y-pixel is more, so user is dragging from bottom to top. 
      evt.currentTarget.parentElement.insertBefore(elm, evt.currentTarget);
    }
    else{
	  //in this case, user is dragging from top-to-bottom. So we need to add it after the current element.
      evt.currentTarget.parentElement.insertBefore(elm, evt.currentTarget.nextElementSibling)
    }
    this.processRowNumbers();    //reordering the index
  }
}
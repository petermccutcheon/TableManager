/**********************************************************************************************************************************
**	Author: Peter McCutcheon
**	Date Create: 09/21/2016
**	Last Modified: 12/7/2016
**
**----------------------------------------------------------------------------------------
**Documentation, description of code,and Notes:
**
**	TblMgr is an object that helps to manage html tables that are data dependend.
**	All of the properties and methods are defined here.  New tables in your DOm
**	should have a TblMgr object associated with them.  This should be done using
**	the new TblMgr(<table data>)
**
**	Table data is a data structure (properties only object, technically JSON file) that is used to 
**	define your html table and the data it contains.
**
***********************************************************************************************************************************/

var TblMgr = function(tData)
{
	this.tData = tData;
	
	//
	//	Get the div element from the DOM.
	//	Create the table element and append it to the div.
	//	The ID for the table is always the div ID + "tbl"
	//
	var divElement = document.getElementById(this.tData.divID);
	var tableElement = document.createElement("table");
	var tableID = this.tData.divID + "tbl";
	tableElement.setAttribute("id", this.tData.divID + "tbl");
	tableElement.setAttribute("class", this.tData.tCLS);
	divElement.appendChild(tableElement);
	
	//
	//	Now we will put a thead and tbody section on our table.
	//
	var theadElement = document.createElement("thead");
	var tbodyElement = document.createElement("tbody");
	var thID = tableID + "head";
	var tbID = tableID + "body";
	theadElement.setAttribute("id", thID);
	tbodyElement.setAttribute("id", tbID);
	tableElement.appendChild(theadElement);
	tableElement.appendChild(tbodyElement);
	var tblHead = document.getElementById(thID);
	var tblBody = document.getElementById(tbID);
	
	//
	//	Check headings and data first.
	//
	if (this.tData.head && this.tData.data)
	{
		//
		//	We will call a function to create the heading row and
		//	append the completed heading row to the table.
		//
		tblHead.appendChild(this.createHeadRow());

		//
		//	Call a function that will create and append all the data rows.
		//
		var ret = this.createDataRows(tblBody);
		if (!ret)
		{
			alert("Internal error!! -- Error in TblMgr routine: createDataRows -- Contact developer or IT.");
		}
	}
	
	//
	//	Process headings with no data.
	//
	if (this.tData.head && !this.tData.data)
	{
		//
		//	Just need to call the function that creates the heading row.
		//
		tblHead.appendChild(createHeadRow());
	}
	
	//
	//	Ok so now process a table with data and no headings.
	//
	if (!this.tData.head && this.tData.data)
	{
		var ret = createDataRows(tblBody);
		if (!ret)
		{
			alert("Internal error!! -- Error in TblMgr routine: createDataRows -- Contact developer or IT.");
		}
	}

	//
	//	This section of code will create the standard buttons associated with the table.
	//	If other buttons have been added those will be created per the data structure.
	//	By the way the standard buttons are Add Row, Remove Row, Save Table.
	//
	for (i = 0; i < this.tData.bCnt; i++)
	{
		btn = document.createElement("button");
		btn.setAttribute("id", tableID + this.tData.bttns[i].ids);
		btn.setAttribute("class", this.tData.bttns[i].cls);
		btn.innerText = this.tData.bttns[i].txt;
		divElement.appendChild(btn);
	}
	
	//
	//	Add standard event listeners provided by this object.
	//	The listeners are for click, blur, keyup for the table.
	//	These events are to primarily handle the hightlighting of rows.
	//
	tableElement.addEventListener("click", this.processEvt.bind(this), false);
	tableElement.addEventListener("blur", this.processEvt.bind(this), false);
	tableElement.addEventListener("keyup", this.processEvt.bind(this), false);
	tableElement.addEventListener("change",this.processEvt.bind(this), false);
	
}
	
TblMgr.prototype.createHeadRow = function ()
{
	//
	//	This method creates the heading row and returns the row.
	//
	var headRow = document.createElement("tr");
	headRow.setAttribute("class", this.tData.hCLS);
	for (i = 0; i < this.tData.cCnt; i++)
	{
		headCell = document.createElement("th");
		headText = document.createTextNode(this.tData.headings[i]);	// Get the text for the heading from the data structure.
		headCell.appendChild(headText);								// Append the text to the cell.
		if (!this.tData.colDisplay[i])
		{
			headCell.style.display = "none";
		}
		headRow.appendChild(headCell);								// Append the cell to the row.			
	}
	//
	//	Send the heading row back.
	//
	return headRow;
}
	
TblMgr.prototype.createDataRows = function (TE)
{
	//
	//	This method creates all the data rows from the
	//	JSON data structure.
	//
	//	Now we will put in the actual data by row and column.
	//	Row IDs will be the table id + "row" + number. Row
	//	class will come from the data structure. (rCLS).
	//
	for (var i = 0; i < this.tData.rCnt; i++)
	{
		//
		//	First we will create a single row and then we have to append the row to the table element.
		//
		var sRow = {};
		sRow = this.createSingleRow(i, this.tData.data, TE, "L");
		TE.appendChild(sRow);
	}		
	return true;
}

TblMgr.prototype.createSingleRow = function(k, withData, tblElem, typ)
{
	//
	//	This method creates a single row and returns the row.
	//
	if (!withData)
	{
		k = tblElem.rows.length;					// We need this to create the ids properly.
		if (k > 0)
		{
			var beforeRow = document.getElementById(this.tData.divID + "tblrow" + k);
		}
	}
	var dataRow = document.createElement("tr");
	var dataRowID = this.tData.divID + "tblrow" + (k+1);
	dataRow.setAttribute("id", dataRowID);
	dataRow.setAttribute("class", this.tData.rCLS);
	for (var j = 0; j < this.tData.cCnt; j++)
	{
		//
		//	Create the cell element and assign both the ID and the class.
		//	The ID is the table ID plus r#c#. 
		//	The class comes from the data structure.
		//
		var dataCell = document.createElement("td");
		var dataCellID = this.tData.divID + "tblr" + (k+1) + "c" + j;
		dataCell.setAttribute("id", dataCellID);
		dataCell.setAttribute("class", this.tData.cCLS);
		
		//
		//	Create the input element and assign both the ID and the class.
		//	The ID is the table ID plus r#c# plus "inp". 
		//	The class comes from the data structure.
		//	The input will also have a type which comes from the data structure.
		//	The value of the input also comes from the data structure.
		//
		if (this.tData.seltbl[j])
		{
			var dataInput = document.createElement("select");
			var dataInputID = dataCellID + "inp";
			dataInput.setAttribute("id", dataInputID);
			var optCnt = this.tData.seltblopt[j].length;
			for (var l = 0; l < optCnt; l++)
			{
				var opt = document.createElement("option");
				opt.text = this.tData.seltblopt[j][l];
				opt.setAttribute("value", this.tData.seltblvalue[j][l]);
				dataInput.options.add(opt,l);
				// Here we need to actually select the option from the cdata element.
				// We'll do that later for now just get this working.
				// and if we don't have data we'll do nothing so there won't be an else.
				if (withData)
				{
					if (this.tData.seltblvalue[j][l] == this.tData.theRows[k].cdata[j])
					{
						opt.setAttribute("selected", true);
					}
				}
			}
		}
		else
		{
			var dataInput = document.createElement("input");
			var dataInputID = dataCellID + "inp";
			dataInput.setAttribute("id", dataInputID);
			if (withData)
			{
				dataInput.setAttribute("type", this.tData.types[j]);
				dataInput.setAttribute("class", this.tData.cls[j]);
				dataInput.setAttribute("value", this.tData.theRows[k].cdata[j]);
				//
				//	If the current field is a key on the SQL table then don't allow user to change it.
				//
				if (this.tData.keys[j] != "")
				{
					dataInput.setAttribute("readonly", true);
				}
			}
			else
			{
				dataInput.setAttribute("type", this.tData.types[j]);	// When we don't have data we always look at the
				dataInput.setAttribute("class", this.tData.cls[j]);	// zero element of theRows because that will have our input types and classes.
				//
				//	If the current field is a key on the SQL table then don't allow user to change it.
				//
				if (this.tData.keys[j] != "")
				{
					dataInput.setAttribute("readonly", true);
				}
			}
		}
		//
		//	Append the data input element to the cell. Then append
		//	the cell to the row.  Also append a holder cell that tells
		//	if the row is loaded, deleted, or inserted after initial load.
		//
		if (!this.tData.colDisplay[j])
		{
			dataCell.setAttribute("style", "display: none");
			if (!withData)
			{
				if (k > 0)
				{
					var input = beforeRow.cells[j].childNodes[0].value; // If we are dealing with a column field that is not displayed then copy the value from above.					
				}														// This is most likely some sort of a key or a value necessary for the SQL table.
				else
				{
					var input = "";										// However if we don't have a row before then we can't copy anything.
				}
				dataInput.setAttribute("value", input);
			}
		}
		dataCell.appendChild(dataInput);
		dataRow.appendChild(dataCell);
	}
	//
	//	Append a hidden cell to the end of the row.
	//	This cell contains flag information that tells,
	//	if the row was loaded on initial load, if the
	//	row was deleted, or if the row was added after
	//	initial load.  The flag information is passed
	//	into this method as: L-initial load, I-insert after load.
	//	It can also contain D for deleted, but that is 
	//	maintained by the remRow method.
	//
	var rowTypeCell = document.createElement("td");
	var rowTypeCellText = document.createTextNode(typ);
	rowTypeCell.appendChild(rowTypeCellText);
	rowTypeCell.style.display = "none";
	rowTypeCell.setAttribute("id", dataRowID + "flag");
	dataRow.appendChild(rowTypeCell);
	//
	//	Now return the newly created row.
	//
	return dataRow;
}

TblMgr.prototype.addRow  = function()
{
	//
	//	This method adds a single empty data to the end of a
	//	table specified by tbl.  The method uses the table passed
	//	to find the tbody and then add a single row to that.
	//	This is the method fired by the standard Add Row button.
	//
	var addBtn = document.getElementById(event.target.id);
	var parentDiv = addBtn.parentNode;
	var tbSel = "#" + parentDiv.id + "tbl tbody";
	var tb = document.querySelector(tbSel);
	var aRow = {};
	aRow = this.createSingleRow(0, false, tb, "I");
	tb.appendChild(aRow);
}
	
TblMgr.prototype.remRow  = function()
{
	//
	//	This method removes a row from a table.
	//	It does this by changing the informational flag
	//	to "D" to indicate a deleted row and then hides
	//	the row.
	//	This method is fired by the standard Remove Row button.
	//
	var hiLite = 0;
	var hiLiteCnt = 0;
	var remBtn = document.getElementById(event.target.id);
	var parentDiv = remBtn.parentNode;
	var tbSel = "#" + parentDiv.id + "tblbody tr";
	var tbodyElement = document.getElementById(parentDiv.id + "tblbody");
	let rows = document.querySelectorAll(tbSel);
	for (let r of rows)
	{
		if (r.style.backgroundColor == "red")
		{
			rowToRem = document.getElementById(r.id);
			hiLite = r.rowIndex;
			hiLiteCnt++;
		}
	}
	
	if (hiLiteCnt == 0)
	{
		txt = "No row is highlighted, please highlight a row first."
		alert(txt);
	}
	else
	{
		txt = "Are you sure you want to remove the highlighted row?";
		var retVal = confirm(txt);
		if (retVal)
		{
			rowToRem.style.display = "none";
			var flagCell = document.getElementById(rowToRem.id + "flag");
			flagCell.innerHTML = "D";
		}
	}
}

TblMgr.prototype.dbMaintAjax = function (request, tblDivID)
{
	alert("Running dbMaint");
	tblsaveRequest = new XMLHttpRequest();
	tblsaveRequest.open("POST", "../php/saveMainTables.php");
	tblsaveRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if (!tblsaveRequest)
	{
		alert("Error - Ajax object not created, browser may not support Ajax.");
		return false;
	}
	tblsaveRequest.onreadystatechange = function ()
	{
		if (tblsaveRequest.readyState == 4 && tblsaveRequest.status === 200)
		{
			var type = tblsaveRequest.getResponseHeader("Content-Type");
			if (type.match(/^text/))
			{
				alert("Returned with: " + tblsaveRequest.responseText);
				if (tblsaveRequest.responseText == "Success")
				{
					alert("Successfull Database update -- Table will be closed.")
					var cDiv = document.getElementById(tblDivID);
					cDiv.innerHTML = "";
				}
				else
				{
					//alert("Error processing request SQL statement: " + tblsaveRequest.responseText + "\n Please contact developer of IT.");
				}
			}
		}
		else
		{
			if (tblsaveRequest.status != 200)
			{
				alert("AJAX Error: " + tblsaveRequest.readyState + " --- " + tblsaveRequest.status);
			}
		}
	}
	//
	// Send the ajax request to the server.
	//
	tblsaveRequest.send(request);
}
	
TblMgr.prototype.savTbl = function ()
{
	var tEvt = document.getElementById(event.target.id);
	var tblID = document.getElementById(this.tData.divID + "tbl");
	var rowCount = tblID.rows.length;
	var txt = "Do you wish to save? \nPress cancel to just close the table or Ok to save.";
	var ans = confirm(txt);
	if (!ans)
	{
		var cDiv = document.getElementById(this.tData.divID);
		cDiv.innerHTML = "";
		return;
	}
	var transactionCount = 0;
	ajaxReq = "";
	for (var i = 1; i < rowCount; i++)
	{
		//console.log("Working on row: " + i);
		var chngFields = "";
		var chngValues = "";
		var whereClause = "";
		var whereValue = "";
		var colCount = tblID.rows[i].cells.length;
		console.log("# of Columns: " + colCount);
		var flagCell = tblID.rows[i].cells[colCount-1].innerHTML;
		switch (flagCell)
		{
			case "L":
				for (var j = 0; j < colCount-1; j++)
				{
					var inpCell = document.getElementById(this.tData.divID + 'tblr' + i + "c" + j + 'inp');
					var dataValue = this.tData.theRows[i-1].cdata[j];
					if (this.tData.keys[j] != "")
					{
						whereClause = whereClause + this.tData.keys[j] + "@@";
						whereValue = whereValue + inpCell.value + "@@";
					}
					if (inpCell.value != dataValue)
					{
						console.log("Input value: " + inpCell.value);
						console.log("Saved value: " + dataValue);
						chngFields = chngFields + this.tData.fnames[j] + "@@";
						chngValues = chngValues + inpCell.value + "@@";
					}
				}
				if (chngFields != "")
				{
					console.log("Row: " + i + " Changed");
					console.log("Changes: " + chngFields);
					chngFields = chngFields.substr(0, (chngFields.length-2));
					chngValues = chngValues.substr(0, (chngValues.length-2));
					whereClause = whereClause.substr(0, (whereClause.length-2));
					whereValue = whereValue.substr(0, (whereValue.length-2));
					ajaxReq = ajaxReq + "tblnam=" + this.tData.tblName + "|transtyp=U" + "|" + chngFields + "|" + chngValues + "|" + whereClause + "|" + whereValue + "|" + "~~";
					//ajaxReq += "transtyp=C&" + ajaxReq + "&fldnam=" + chngFields + "&fldval=" + chngValues + "&wherecls=" + whereClause + "&whereval=" + whereValue + this.tData.AppInfo + "|||";
					//dbmaintAjax(ajaxReq, this.tData.divID);
					transactionCount += 1;
				}
				break;
			case "D":
				for (var j = 0; j < colCount-1; j++)
				{
					var inpCell = document.getElementById(this.tData.divID + 'tblr' + i + "c" + j + 'inp');
					chngFields += this.tData.fnames[j] + "@@";
					chngValues += inpCell.value + "@@";
					if (this.tData.keys[j] != "")
					{
						whereClause += this.tData.keys[j] + "@@";
						whereValue += inpCell.value + "@@";
					}
				}
				chngFields = chngFields.substr(0, (chngFields.length-2));
				chngValues = chngValues.substr(0, (chngValues.length-2));
				whereClause = whereClause.substr(0, (whereClause.length-2));
				whereValue = whereValue.substr(0, (whereValue.length02));
				ajaxReq = ajaxReq + "tblnam=" + this.tData.tblName + "|transtyp=D" + "|" + chngFields + "|" + chngValues + "|" + whereClause + "|" + whereValue + "|" + "~~";
				//ajaxReq = "transtyp=D&" + ajaxReq + "&fldnam=" + chngFields + "&fldval=" + chngValues + "&wherecls=" + whereClause + "&whereval=" + whereValue + this.tData.AppInfo;
				//dbmaintAjax(ajaxReq, this.tData.divID);
				transactionCount += 1;
				break;
			case "I":
				for (var j = 0; j < colCount-1; j++)
				{
					var inpCell = document.getElementById(this.tData.divID + 'tblr' + i + "c" + j + 'inp');
					chngFields += this.tData.fnames[j] + "@@";
					chngValues += inpCell.value + "@@"
				}
				chngFields = chngFields.substr(0, (chngFields.length-2));
				chngValues = chngValues.substr(0, (chngValues.length-2));
				ajaxReq = ajaxReq + "tblnam=" + this.tData.tblName + "|transtyp=I" + "|" + chngFields + "|" + chngValues + "|" + "~~";
				//ajaxReq = "transtyp=I&" + ajaxReq + "&fldnam=" + chngFields + "&fldval=" + chngValues + this.tData.AppInfo;
				//dbmaintAjax(ajaxReq, this.tData.divID);
				transactionCount += 1;
				break;
			default:
				txt = "Internal Error -- routine savTbl, invalid or unknown flag value, contact developer or IT.";
				alert(txt);
		}
	}
	ajaxReq = ajaxReq.substr(0, (ajaxReq.length-2));		// Take off the last two tildes (~)
	alert("Appinfo: " + this.tData.AppInfo);
	ajaxReq = "database='" + this.tData.database + "'" + "&transcnt=" + transactionCount + "&" + this.tData.AppInfo + "&data=" + ajaxReq;
	alert("savTbl Ajax Request: " + ajaxReq);
	this.dbMaintAjax(ajaxReq, this.tData.divID);
}

TblMgr.prototype.processEvt  = function()
{
	//
	//	This method is fired by the listeners for click, keyup, and blur.
	//	This method is primarily to deal with highlighting rows in a table.
	//
	//	Generally speaking this function will be run when some event is triggered.
	//	Then it will process those that need to make a change to the table.
	//	As of 12/6/2016 that would be just for highlighting.  This could potentially
	//	be modified to do other things to the table.
	//	
	switch (event.target.tagName)
	{
		case "INPUT":
			inpElement = document.getElementById(event.target.id);
			cellElement = inpElement.parentNode;
			rowElement = cellElement.parentNode;
			tbodyElement = rowElement.parentNode;
			tbodySel = "#" + tbodyElement.id + " tr";
			break;
		case "TD":
			cellElement = document.getElementById(event.target.id);
			rowElement = cellElement.parentNode;
			tbodyElement = rowElement.parentNode;
			tbodySel = "#" + tbodyElement.id + " tr";			
			break;
		case "TR":
			rowElement = document.getElementById(event.target.id);
			tbodyElement = rowElement.parentNode;
			tbodySel = "#" + tbodyElement.id + " tr";			
			break;
		case "TBODY":
			return;
			break;
		case "TABLE":
			return;
			break;
		case "TH":
			return;
			break;
		case "SELECT":
			inpElement = document.getElementById(event.target.id);
			cellElement = inpElement.parentNode;
			rowElement = cellElement.parentNode;
			tbodyElement = rowElement.parentNode;
			tbodySel = "#" + tbodyElement.id + " tr";
			break;
		default:
			txt = "Internal Error!!  Routine: processEvt  (Untrapped Tagname!) Notifiy developer or IT.";
			alert(txt);
			break;
	}
	saveColor = rowElement.style.backgroundColor;
	switch (event.type)
	{
 		case "click":
			let rows = document.querySelectorAll(tbodySel);
			for (let r of rows)
			{
				if (r.style.backgroundColor == "red")
				{
					r.style.backgroundColor = "";
				}
			}
			rowElement.style.backgroundColor = "red";
			break;
		case "blur":
			// As of 12/6/2016 we are not doing anything with blur. (Maybe later).
			//
			//rowElement.style.backgroundColor = "";
			break;
		case "keyup":
			k = event.key;
			if (k == "Tab")
			{
				let rows = document.querySelectorAll(tbodySel);
				for (let r of rows)
				{
					if (r.style.backgroundColor == "red")
					{
						r.style.backgroundColor = "";
					}
				}	
				rowElement.style.backgroundColor = "red";
			}
			break;
		case "change":
			switch (event.target.tagName)
			{
				case "SELECT":
					selectedValue = inpElement.options[inpElement.selectedIndex].value;
					selectedText = inpElement.options[inpElement.selectedIndex].innerText;
					if (selectedValue == 0)
					{
						//
						//	Run a function that creates a temporary div with a form to get
						//	the new value(s) for the lookup (SQL) table in question.
						//	
						newLookupRow(this.tData.seltblnam[cellElement.cellIndex]);				
					}
					break;
			}
			break;
		default:
			txt = "Internal Error!!  Routine: processEvt  (Untrapped Event!) Notifiy developer or IT.";
			alert(txt);
			break;
	}
}
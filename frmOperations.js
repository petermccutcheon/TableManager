/*******************************************************************************
**	Author: Peter McCutcheon
**	Date Created:  12/6/2016
**	Last Modified: 01/29/2017
**
**------------------------------------------------------------------------------
**Description of Code:
**
**	This code implements methods to manipulate a basic form.  NOTE: THIS IS DONE 
**	STRICTLY WITH FUNCTIONS AND THIS IS NOT A MODULE IMPLEMENTATION.
**
********************************************************************************/

function frmBasicOps(frmID)
{
	var frmObj = document.getElementById(frmID);
	var frmLen = frmObj.elements.length;
	var retStruct = {modified: 0, flds: [{IDname: "", IDvalue: ""}]};
	
	this.showFldValues = function()
	{
		var i;
		var txt = "";
		for (i=0; i < frmLen; i++)
		{
			tag = frmObj.elements[i].tagName;
			fid = frmObj.elements[i].id;
			val = frmObj.elements[i].value;
			typ = frmObj.elements[i].type;
			txt = "Tag type: " + tag + " Id is: " + fid + " Value is: " + val + " Type is: " + typ;
			alert(txt);
		}
	}
	
	this.checkMod = function()
	{
		var i;
		var j = 0;
		var origValue = "";
		var actValue = "";
		var IDName = "";
		//
		//		Loop through the elements of the given form and get the id, defaultValue, and value.
		//		Check to see if the defaultValue and value are different, if they are then the fields
		//		was changed.  We will keep a count of the fields that were modified.
		//		The informat is stored in a data structure that contains the modified count, and an 
		//		object array of the modified fields with both the modified value and the field id.
		//
		var modCount = 0;
		for (i=0; i < frmLen; i++)
		{
			tag = frmObj.elements[i].tagName;
			//
			//		Check to see what type of html tag this field is.
			//		Depending on what it is we may do nothing or check to see
			//		if there was a change.  This has to be accomplished
			//		differently for different types of fields.
			//
			switch (tag)
			{
				case "FIELDSET":
					break;
				case "BUTTON":
					break;
				case "LEGEND":
					break;
				case "SELECT":
					var curState = frmObj.elements[i].value;
					var origState = frmObj.elements[i].defaultValue;
					IDName = frmObj.elements[i].id;
					if (curState != origState)
					{
						retStruct.flds[modCount] = {IDname: IDName, IDvalue: curState};
						modCount += 1;
					}
					break;
				case "INPUT":
					if (frmObj.elements[i].type != "password")
					{
						origValue = frmObj.elements[i].defaultValue;
						actValue = frmObj.elements[i].value;
						IDName = frmObj.elements[i].id;
						if (origValue != actValue)
						{
							retStruct.flds[modCount] = {IDname: IDName, IDvalue: actValue};
							modCount += 1;
							
						}
					}
					break;
				default:
					break;
			}
		}
		retStruct.modified = modCount;
		alert(JSON.stringify(retStruct, null, 4));
		return retStruct;
	}
}

var  formBasic = function(formData)
{
	this.formData = formData;
	
	var divContainer = document.getElementById(formData.Container);
	var frmBasic = document.createElement("form");
	frmBasic.setAttribute("class", formData.Formclass);
	frmBasic.setAttribute("onsubmit", "return false");
	var fldsetBasic = document.createElement("fieldset");
	fldsetBasic.setAttribute("class", formData.MainFSClass);
	var fldsetlgndBasic = document.createElement("legend");
	var txtlgndBasic = document.createTextNode(formData.Fieldsetlegend);
	fldsetlgndBasic.appendChild(txtlgndBasic);
	fldsetBasic.appendChild(fldsetlgndBasic);

	var lenForm = formData.Fieldlist.length;
	for (var i = 0; i < lenForm; i++)
	{
		switch (formData.Fieldtypes[i])
		{
			case "number":			// Here we will just fall through to "text" because we want to do the same processing for both.
			case "text":
				var lblField = document.createElement("label");
				var inpField = document.createElement("input");
				var txtlblField = document.createTextNode(formData.Fieldlabels[i]);
				inpField.setAttribute("id", formData.Fieldlist[i]);
				inpField.setAttribute("class", formData.Fieldclass[i]);
				inpField.setAttribute("type", formData.Fieldtypes[i]);
				lblField.setAttribute("for", "pdm-input-fld" + i);
				lblField.setAttribute("class", formData.Fieldlabelclass[i]);
				lblField.appendChild(txtlblField);
				fldsetBasic.appendChild(lblField);
				fldsetBasic.appendChild(inpField);
				break;
			case "radio":
				var fldsetRadio = document.createElement("fieldset");
				fldsetRadio.setAttribute("class", formData.RadioFSClass);
				var fldsetlgndRadio = document.createElement("legend");
				var txtlgndRadio = document.createTextNode(formData.Fieldlabels[i]);
				fldsetlgndRadio.appendChild(txtlgndRadio);
				fldsetRadio.appendChild(fldsetlgndRadio);
				var lblFld = document.createElement("label");
				var txtlblFld = document.createTextNode(formData.Fieldlabels[i]);
				lblFld.appendChild(txtlblFld);
				var radioLen = formData.RadioInfo[i].length;
				for (var j = 0; j < radioLen; j++)
				{
					var radioFld = document.createElement("input");
					var radioText = document.createTextNode(formData.RadioInfo[i][j]);
					var someLbl = document.createElement("label");
					someLbl.appendChild(radioText);
					someLbl.setAttribute("for", "pdm-input-radio" + i + j);
					radioFld.setAttribute("type", "radio");
					radioFld.setAttribute("name", formData.Fieldlist[i]);
					radioFld.setAttribute("value", formData.RadioInfo[i][j]);
					radioFld.setAttribute("id", "pdm-input-radio" + i + j);
					radioFld.setAttribute("class", "radiotest");
					fldsetRadio.appendChild(radioFld);
					fldsetRadio.appendChild(someLbl);
				}
				fldsetBasic.appendChild(fldsetRadio);
				break;
			case "checkbox":
				var brFld = document.createElement("br");
				var lblField = document.createElement("label");
				var inpField = document.createElement("input");
				var txtlblField = document.createTextNode(formData.Fieldlabels[i]);
				inpField.setAttribute("id", "pdm-input-fld" + i);
				inpField.setAttribute("class", formData.Fieldclass[i]);
				inpField.setAttribute("type", formData.Fieldtypes[i])
				lblField.setAttribute("for", "pdm-input-fld" + i);
				lblField.setAttribute("class", formData.Fieldlabelclass[i])
				lblField.appendChild(txtlblField);
				fldsetBasic.appendChild(inpField);
				fldsetBasic.appendChild(lblField);
				fldsetBasic.appendChild(brFld);
				break;
			case "textarea":
				break;
		}
	}
	frmBasic.appendChild(fldsetBasic);
	divContainer.appendChild(frmBasic);
	//
	//		Append the standard buttons
	//
	var btnPrev = document.createElement("button");
	var btnNext = document.createElement("button");
	var btnRetrieve = document.createElement("button");
	var btnDelete = document.createElement("button");
	var btnSave = document.createElement("button");
	var btnClose = document.createElement("button");
	//
	var txtbtnPrev = document.createTextNode("Prev");
	var txtbtnNext = document.createTextNode("Next");
	var txtbtnRetrieve = document.createTextNode("Retrieve Data");
	var txtbtnDelete = document.createTextNode("Delete Record");
	var txtbtnSave = document.createTextNode("Save Changes");
	var txtbtnClose = document.createTextNode("Close");
	//
	btnPrev.setAttribute("class",formData.Buttonprevclass);
	btnNext.setAttribute("class",formData.Buttonnextclass);
	btnRetrieve.setAttribute("class",formData.Buttonretrieveclass);
	btnDelete.setAttribute("class",formData.Buttondeleteclass);
	btnSave.setAttribute("class",formData.Buttonsaveclass);
	btnClose.setAttribute("class",formData.Buttoncloseclass);
	//
	btnPrev.setAttribute("id","btnprev");
	btnNext.setAttribute("id","btnnext");
	btnRetrieve.setAttribute("id","btnretrieve");
	btnDelete.setAttribute("id","btndelete");
	btnSave.setAttribute("id","btnsave");
	btnClose.setAttribute("id","btnclose");
	//
	btnPrev.appendChild(txtbtnPrev);
	btnNext.appendChild(txtbtnNext);
	btnRetrieve.appendChild(txtbtnRetrieve);
	btnDelete.appendChild(txtbtnDelete);
	btnSave.appendChild(txtbtnSave);
	btnClose.appendChild(txtbtnClose);
	//
	fldsetBasic.appendChild(document.createElement("br"));
	fldsetBasic.appendChild(btnNext);
	fldsetBasic.appendChild(btnPrev);
	fldsetBasic.appendChild(btnRetrieve);
	fldsetBasic.appendChild(btnDelete);
	fldsetBasic.appendChild(btnSave);
	fldsetBasic.appendChild(btnClose);
	//
	//		Set up the event handlers for the buttons.
	//
	btnPrev.addEventListener("click", this.processButton.bind(this), false);
	btnNext.addEventListener("click", this.processButton.bind(this), false);
	btnRetrieve.addEventListener("click", this.processButton.bind(this), false);
	btnDelete.addEventListener("click", this.processButton.bind(this), false);
	btnSave.addEventListener("click", this.processButton.bind(this), false);
	btnClose.addEventListener("click", this.processButton.bind(this), false);
	//
}

formBasic.prototype.processButton = function ()
{
	function processRetData(recordData)
	{
		var strLen = recordData.length;
		var cleanedData = recordData.substring(2,strLen);
		var rowArray = [[]];
		var tmpArray = cleanedData.split("**");
		var tmpArrayLen = tmpArray.length;
		for (var i = 0; i < tmpArrayLen; i++)
		{
			var rowLen = tmpArray[i].length;
			var tmpStr = tmpArray[i].substring(0,(rowLen-1));
			var colArray = tmpStr.split("|");
			rowArray[i] = colArray;
		}
		return rowArray;
	}
	
	function loadOrigData(recordData, fData)
	{
		alert("Called loadFormData with DB: " + fData.Database);
		var rowCnt = recordData.length;
		for (var i = 0; i < rowCnt; i++)
		{
			var colCnt = recordData[i].length
			for (j = 0; j < colCnt; j++)
			{
				this.formData.Fieldorigdata[i][j] = recordData[i][j];
			}
		}
	}
	
	function loadFormData(rowNum)
	{
		var fldName = "";
		var colCnt = this.formData.Fieldorigdata[rowNum].length;
		for (var i = 0; i < colCnt; i++)
		{
			fldName = this.formData.Fieldlist[i];
			var fld = document.getElementById(fldName);
			switch (fld.type)
			{
				case "textarea":
				case "number":
				case "text":
					fld.value = this.formData.Fieldorigdata[i];
					break;
				case "radio":
					break;
				case "checkbox":
					break;
			}
		}		
	}
	
	var txt = this.formData.Tablename;
	var eventElement = event.target.id;
	alert("Clicked a button and the table name is: " + txt + " Event id: " + eventElement);
	
	switch (eventElement)
	{
		case "btnretrieve":
			var msg = "database=" + this.formData.Database + "&tblnam=" + this.formData.Tablename + "&flds=";
			console.log(msg);
			for (var i = 0; i < this.formData.Fieldlist.length; i++)
			{
				msg += this.formData.Fieldlist[i] + "**";
			}
			msg = msg.substring(0,(msg.length-2));
			if (this.formData.Sortbycount > 0)
			{
				var whereClause = "where ";
				for (var i = 0; i < this.formData.Sortbycount; i++)
				{
					var sFld = this.formData.Sortbyfields[i];
					var dataFld = document.getElementById(sFld);
					if (dataFld.value != "")
					{
						whereClause += sFld + " like '" + dataFld.value + "' " + this.formData.Whereconnect + " ";
					}
				}				
				if (whereClause != "")
				{
					whereClause = whereClause.substring(0, (whereClause.length-5));
				}
			}
			else
			{
				whereClause = "";
			}
			var dataArray = [[]];
			alert("Msg: " + msg + " Where: " + whereClause);
			msg += "&wherecls=" + whereClause;
			recRequest = new XMLHttpRequest();
			recRequest.open("POST", "../php/getTableRecords.php");
			recRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	
			if (!recRequest)
			{
				alert("Error - Ajax object not created, browser may not support Ajax.");
				return false;
			}
			recRequest.onreadystatechange = function ()
			{
				if (recRequest.readyState == 4 && recRequest.status === 200)
				{
					if (recRequest.responseText != null)
					{
						alert("Returned Data: " + recRequest.responseText);
						dataArray = processRetData(recRequest.responseText);
						alert("Returned Array: " + dataArray);
						alert("The database is: " + this.formData.Database);
						loadOrigData(dataArray, this.formData);
						loadFormData(0);
					}
				}
				else
				{
					if (recRequest.status != 200)
					{
						alert("AJAX Error: " + recRequest.readyState + " --- " + recRequest.status);
					}
				}
			};
			//
			// Send the ajax request to the server.
			//
			recRequest.send(msg); 
			break;
		case "btnnext":
			break;
		case "btnprev":
			break;
		case "btnsave":
			break;
		case "btndelete":
			break;
		case "btnclose":
			break;
	}
}


/* var  formBasic = function(formData)
{
	this.formData = formData;
	
	var divContainer = document.getElementById(formData.Container);
	var frmBasic = document.createElement("form");
	frmBasic.setAttribute("class", formData.Formclass);
	frmBasic.setAttribute("onsubmit", "return false");
	var fldsetBasic = document.createElement("fieldset");
	fldsetBasic.setAttribute("class", formData.MainFSClass);
	var fldsetlgndBasic = document.createElement("legend");
	var txtlgndBasic = document.createTextNode(formData.Fieldsetlegend);
	fldsetlgndBasic.appendChild(txtlgndBasic);
	fldsetBasic.appendChild(fldsetlgndBasic);

	var lenForm = formData.Fieldlist.length;
	for (var i = 0; i < lenForm; i++)
	{
		switch (formData.Fieldtypes[i])
		{
			case "number":			// Here we will just fall through to "text" because we want to do the same processing for both.
			case "text":
				var lblField = document.createElement("label");
				var inpField = document.createElement("input");
				var txtlblField = document.createTextNode(formData.Fieldlabels[i]);
				inpField.setAttribute("id", formData.Fieldlist[i]);
				inpField.setAttribute("class", formData.Fieldclass[i]);
				inpField.setAttribute("type", formData.Fieldtypes[i]);
				lblField.setAttribute("for", "pdm-input-fld" + i);
				lblField.setAttribute("class", formData.Fieldlabelclass[i]);
				lblField.appendChild(txtlblField);
				fldsetBasic.appendChild(lblField);
				fldsetBasic.appendChild(inpField);
				break;
			case "radio":
				var fldsetRadio = document.createElement("fieldset");
				fldsetRadio.setAttribute("class", formData.RadioFSClass);
				var fldsetlgndRadio = document.createElement("legend");
				var txtlgndRadio = document.createTextNode(formData.Fieldlabels[i]);
				fldsetlgndRadio.appendChild(txtlgndRadio);
				fldsetRadio.appendChild(fldsetlgndRadio);
				var lblFld = document.createElement("label");
				var txtlblFld = document.createTextNode(formData.Fieldlabels[i]);
				lblFld.appendChild(txtlblFld);
				var radioLen = formData.RadioInfo[i].length;
				for (var j = 0; j < radioLen; j++)
				{
					var radioFld = document.createElement("input");
					var radioText = document.createTextNode(formData.RadioInfo[i][j]);
					var someLbl = document.createElement("label");
					someLbl.appendChild(radioText);
					someLbl.setAttribute("for", "pdm-input-radio" + i + j);
					radioFld.setAttribute("type", "radio");
					radioFld.setAttribute("name", formData.Fieldlist[i]);
					radioFld.setAttribute("value", formData.RadioInfo[i][j]);
					radioFld.setAttribute("id", "pdm-input-radio" + i + j);
					radioFld.setAttribute("class", "radiotest");
					fldsetRadio.appendChild(radioFld);
					fldsetRadio.appendChild(someLbl);
				}
				fldsetBasic.appendChild(fldsetRadio);
				break;
			case "checkbox":
				var brFld = document.createElement("br");
				var lblField = document.createElement("label");
				var inpField = document.createElement("input");
				var txtlblField = document.createTextNode(formData.Fieldlabels[i]);
				inpField.setAttribute("id", "pdm-input-fld" + i);
				inpField.setAttribute("class", formData.Fieldclass[i]);
				inpField.setAttribute("type", formData.Fieldtypes[i])
				lblField.setAttribute("for", "pdm-input-fld" + i);
				lblField.setAttribute("class", formData.Fieldlabelclass[i])
				lblField.appendChild(txtlblField);
				fldsetBasic.appendChild(inpField);
				fldsetBasic.appendChild(lblField);
				fldsetBasic.appendChild(brFld);
				break;
			case "textarea":
				break;
		}
	}
	frmBasic.appendChild(fldsetBasic);
	divContainer.appendChild(frmBasic);
	//
	//		Append the standard buttons
	//
	var btnPrev = document.createElement("button");
	var btnNext = document.createElement("button");
	var btnRetrieve = document.createElement("button");
	var btnDelete = document.createElement("button");
	var btnSave = document.createElement("button");
	var btnClose = document.createElement("button");
	//
	var txtbtnPrev = document.createTextNode("Prev");
	var txtbtnNext = document.createTextNode("Next");
	var txtbtnRetrieve = document.createTextNode("Retrieve Data");
	var txtbtnDelete = document.createTextNode("Delete Record");
	var txtbtnSave = document.createTextNode("Save Changes");
	var txtbtnClose = document.createTextNode("Close");
	//
	btnPrev.setAttribute("class",formData.Buttonprevclass);
	btnNext.setAttribute("class",formData.Buttonnextclass);
	btnRetrieve.setAttribute("class",formData.Buttonretrieveclass);
	btnDelete.setAttribute("class",formData.Buttondeleteclass);
	btnSave.setAttribute("class",formData.Buttonsaveclass);
	btnClose.setAttribute("class",formData.Buttoncloseclass);
	//
	btnPrev.setAttribute("id","btnprev");
	btnNext.setAttribute("id","btnnext");
	btnRetrieve.setAttribute("id","btnretrieve");
	btnDelete.setAttribute("id","btndelete");
	btnSave.setAttribute("id","btnsave");
	btnClose.setAttribute("id","btnclose");
	//
	btnPrev.appendChild(txtbtnPrev);
	btnNext.appendChild(txtbtnNext);
	btnRetrieve.appendChild(txtbtnRetrieve);
	btnDelete.appendChild(txtbtnDelete);
	btnSave.appendChild(txtbtnSave);
	btnClose.appendChild(txtbtnClose);
	//
	fldsetBasic.appendChild(document.createElement("br"));
	fldsetBasic.appendChild(btnNext);
	fldsetBasic.appendChild(btnPrev);
	fldsetBasic.appendChild(btnRetrieve);
	fldsetBasic.appendChild(btnDelete);
	fldsetBasic.appendChild(btnSave);
	fldsetBasic.appendChild(btnClose);
	//
	//		Set up the event handlers for the buttons.
	//
	btnPrev.addEventListener("click", this.processButton.bind(this), false);
	btnNext.addEventListener("click", this.processButton.bind(this), false);
	btnRetrieve.addEventListener("click", this.processButton.bind(this), false);
	btnDelete.addEventListener("click", this.processButton.bind(this), false);
	btnSave.addEventListener("click", this.processButton.bind(this), false);
	btnClose.addEventListener("click", this.processButton.bind(this), false);
	//
}

formBasic.prototype.processButton = function ()
{
	function processRetData(recordData)
	{
		var strLen = recordData.length;
		var cleanedData = recordData.substring(2,strLen);
		var rowArray = [[]];
		var tmpArray = cleanedData.split("**");
		var tmpArrayLen = tmpArray.length;
		for (var i = 0; i < tmpArrayLen; i++)
		{
			var rowLen = tmpArray[i].length;
			var tmpStr = tmpArray[i].substring(0,(rowLen-1));
			var colArray = tmpStr.split("|");
			rowArray[i] = colArray;
		}
		return rowArray;
	}
	
	function loadOrigData(recordData, fData)
	{
		alert("Called loadFormData with DB: " + fData.Database);
		var rowCnt = recordData.length;
		for (var i = 0; i < rowCnt; i++)
		{
			var colCnt = recordData[i].length
			for (j = 0; j < colCnt; j++)
			{
				this.formData.Fieldorigdata[i][j] = recordData[i][j];
			}
		}
	}
	
	function loadFormData(rowNum)
	{
		var fldName = "";
		var colCnt = this.formData.Fieldorigdata[rowNum].length;
		for (var i = 0; i < colCnt; i++)
		{
			fldName = this.formData.Fieldlist[i];
			var fld = document.getElementById(fldName);
			switch (fld.type)
			{
				case "textarea":
				case "number":
				case "text":
					fld.value = this.formData.Fieldorigdata[i];
					break;
				case "radio":
					break;
				case "checkbox":
					break;
			}
		}		
	}
	
	var txt = this.formData.Tablename;
	var eventElement = event.target.id;
	alert("Clicked a button and the table name is: " + txt + " Event id: " + eventElement);
	
	switch (eventElement)
	{
		case "btnretrieve":
			var msg = "database=" + this.formData.Database + "&tblnam=" + this.formData.Tablename + "&flds=";
			console.log(msg);
			for (var i = 0; i < this.formData.Fieldlist.length; i++)
			{
				msg += this.formData.Fieldlist[i] + "**";
			}
			msg = msg.substring(0,(msg.length-2));
			if (this.formData.Sortbycount > 0)
			{
				var whereClause = "where ";
				for (var i = 0; i < this.formData.Sortbycount; i++)
				{
					var sFld = this.formData.Sortbyfields[i];
					var dataFld = document.getElementById(sFld);
					if (dataFld.value != "")
					{
						whereClause += sFld + " like '" + dataFld.value + "' " + this.formData.Whereconnect + " ";
					}
				}				
				if (whereClause != "")
				{
					whereClause = whereClause.substring(0, (whereClause.length-5));
				}
			}
			else
			{
				whereClause = "";
			}
			var dataArray = [[]];
			alert("Msg: " + msg + " Where: " + whereClause);
			msg += "&wherecls=" + whereClause;
			recRequest = new XMLHttpRequest();
			recRequest.open("POST", "../php/getTableRecords.php");
			recRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	
			if (!recRequest)
			{
				alert("Error - Ajax object not created, browser may not support Ajax.");
				return false;
			}
			recRequest.onreadystatechange = function ()
			{
				if (recRequest.readyState == 4 && recRequest.status === 200)
				{
					if (recRequest.responseText != null)
					{
						alert("Returned Data: " + recRequest.responseText);
						dataArray = processRetData(recRequest.responseText);
						alert("Returned Array: " + dataArray);
						alert("The database is: " + this.formData.Database);
						loadOrigData(dataArray, this.formData);
						loadFormData(0);
					}
				}
				else
				{
					if (recRequest.status != 200)
					{
						alert("AJAX Error: " + recRequest.readyState + " --- " + recRequest.status);
					}
				}
			};
			//
			// Send the ajax request to the server.
			//
			recRequest.send(msg); 
			break;
		case "btnnext":
			break;
		case "btnprev":
			break;
		case "btnsave":
			break;
		case "btndelete":
			break;
		case "btnclose":
			break;
	}
} /*
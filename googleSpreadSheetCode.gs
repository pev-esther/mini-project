function doGet()
{
  return HtmlService.createHtmlOutputFromFile('pageHtml');
}

function userClicked(apiUrl, ssUrl, varsColName, varsNameToServer){
  var x = varsNameToServer.length;
  if (x==0) return;
  var params = new Array(x); 
  var res = UrlFetchApp.fetch(apiUrl ,{muteHttpExceptions: true});
  var responseBody = res.getContentText();
  if(!responseBody.startsWith("{")) { ss = SpreadsheetApp.openByUrl("this is a bad url...");  }
  var ss = SpreadsheetApp.openByUrl(ssUrl);
  //clears the content of the spread sheet: 
  ClearSpreadSheet(ssUrl);
  //converts it to string:
  var content = res.getContentText();
  //JSON parse of the string
  var jsonContent = JSON.parse(content); 
  //looking only at the records:
  jsonContent =  jsonContent["result"]["records"]; 
  var len = jsonContent.length; 
  //a very important part; here we need to add rows to the ss because the 
  //delete function deletes the row not contant. so we have to make sure the 
  //rows are enoth in the file;
  ss.insertRowsAfter(1, len);
  //in this part, there is the writing to the sheet:
  //first, set the titels on the colums:
  ss.appendRow(varsColName);
  //sets the info:
  for(var i = 0; i < len; i++){
    for(var j = 0; j < x; j++)
      params[j] = jsonContent[i][varsNameToServer[j]];  
    ss.appendRow(params);
  }
}  
function rrrr(apiUrl)
{
  var keys=[];
  var res = UrlFetchApp.fetch(apiUrl);
  var content = res.getContentText();
  //JSON parse of the string
  var jsonContent = JSON.parse(content);
  
  jsonContent =  jsonContent["result"]["records"][1]; 
  Object.keys(jsonContent).forEach(key => { 
        keys.push(key); //keys 
    })
    Logger.log(keys);
  return keys  ;
}
function ClearSpreadSheet(the_url)
{
  var ss = SpreadsheetApp.openByUrl(the_url);
  var lastRow = ss.getLastRow();
  if(lastRow != 0)
     ss.deleteRows(1, lastRow);  
}

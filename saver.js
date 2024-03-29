function downloadCSV(csv, filename){
  var csvfile;
  var downloadLink;

  //retrieve CSV from experiment
  csvFile = new Blob([csv], {type: "text/csv"});

  //downloadLink
  downloadLink = document.createElement("a");

  //Retrieve filename
  downloadLink.download = filename;

  //Create Link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download Link
  downloadLink.style.display = 'none';

  //Add Link to the DOM
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
  

function submitQuery() {
  var inputData = document.getElementById('userQuery').value;
  console.log(inputData);
  httpGet('http://locate.mediaiqdigital.com/explore/' + inputData)
}

function stopDefAction(evt) {
    evt.preventDefault();
    submitQuery();
}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true );
    xmlHttp.send();
    return xmlHttp.responseText;
}

document.getElementById('buttonSubmit').addEventListener(
    'click', stopDefAction, false
);


$("#getFiles").click(function(){
    $.getJSON("http://locate.mediaiqdigital.com/getFiles", function(result){
        $.each(result, function(i, fileLocation){
            $("#results").append('<li><a href=' + fileLocation + '>' + fileLocation + '</a></li>');
        });
    });
});

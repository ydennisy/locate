var locationOfScript = window.location.href;

function submitQuery() {
  var inputData = document.getElementById('userQuery').value;
  var inputCountry = document.getElementById('userCountry').value;
  console.log(inputData);
  httpGet(locationOfScript + 'explore/' + inputData + '/' + inputCountry)
}

function stopDefAction(evt) {
    evt.preventDefault();
    submitQuery();
}

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( 'GET', theUrl, true );
    xmlHttp.send();
    return xmlHttp.responseText;
}

document.getElementById('buttonSubmit').addEventListener(
    'click', stopDefAction, false
);

  $('#getFiles').click(function(){
    setTimeout(function(){
      $('#results').empty();
      $.getJSON(locationOfScript + 'getFiles/', function(result){
          $.each(result, function(i, fileLocation){
              $('#results').append('<li><a href=' + fileLocation + '>' + fileLocation + '</a></li>');
          });
      });
    }, 500);
  });

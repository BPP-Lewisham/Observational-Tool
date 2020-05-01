let SPREADSHEET = 'https://script.google.com/macros/s/AKfycbyZxaXyLX5YdXpVtDPh8ioEy2PpuvGq35VJ5HWh9BMum15Ki6Q7/exec'
var prevDateTime = "none"
var curDateTime = "none"
var counter = 0;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const encodeParams = (p) => 
Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

async function logEntry(tup) {
    //params is a tuple of length 2
    params = tup[0]
    var key = params.date
    //Async request to put data into google sheets
    fetch(SPREADSHEET + "?" + encodeParams(params))
    .then(
        function(response) {
            
            if (response.status === 200) {
                ///console.log('All ok');
                //console.log("removing: " + key)
                if(tup[1] == -1){
                    window.localStorage.removeItem(key);
                }
                else{
                    window.localStorage.removeItem(key + '_' + tup[1]);
                }
                window.localStorage.removeItem(key);
                updateNumberOfEnteries()
                //Use key to delete
            }
            else{
                errorOnSync = true;
                 alert('Problem syncing data. Did not remove this entry from local storage. Try Again');
                return
            }
        }
        )
      .catch(function(err) {
          alert("Error contacting google sheets. Please check your connection and try again")
          errorOnSync = true;
        //console.log('Fetch Error :-S', err);
      });
}

window.addEventListener('online', updateIndicator);
window.addEventListener('offline', updateIndicator);

function updateIndicator(){
    if(navigator.onLine){
       //Change status to online
       document.getElementById('status').innerHTML = "Online";
       document.getElementById('send-data-button').disabled = false;
       //updateNumberOfEnteries()
    }
    else{
        //Change status to offline
        document.getElementById("status").innerHTML = "Offline";
        document.getElementById('send-data-button').disabled = true;
        //updateNumberOfEnteries()
    }
}   

function sendData(){
    document.getElementById('send-data-button').disabled = true;
    var arrayOfLocalStorage = getLocalStorage()
    //TODO: Add more functionality to handle extreme cases like when there is nothing to sync
    for (var i = 0; i < arrayOfLocalStorage.length; i++){
        var values = arrayOfLocalStorage[i]
        logEntry(values)
    }
    //updateNumberOfEnteries();
}

function updateNumberOfEnteries(){
    //console.log(window.localStorage.length.toString)
    var localStorageLength = window.localStorage.length
    document.getElementById('toSync').innerHTML = "Enteries to be synced: ".concat(localStorageLength.toString());
    if (errorOnSync){
        errorOnSync = false
    }
    else if(localStorageLength === 0 && !firstLoad){
        alert("The Data is Finished syncing");
        document.getElementById('send-data-button').disabled = false;
    }
}

function setLocalStorage(obj){
    if(prevDateTime === "none"){
        prevDateTime = curDateTime
    }
    else{
        curDateTime = prevDateTime.concat("_",counter.toString())
        counter = counter + 1
    }
    window.localStorage.setItem(curDateTime, JSON.stringify(obj)); 
}

function getLocalStorage(){
    //master array to store all the information about the objects in individual arrays within it
    obj_array = []
    for (var i = 0; i < window.localStorage.length; i++){
        //Get all the objects in local storage
        obj = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)))
        
        var split = window.localStorage.key(i).split("_")
        var tup;
        if(split.length === 1){
            obj.date = split[0];
            tup = [obj, -1]
        }
        else{
            obj.date = split[0];
            tup = [obj, split[1]]
        }
        //console.log("The tuple is: " + tup)
        //adding the array to the master array
        obj_array.push(tup)
    }
    //clear the local storage to avoid duplicates
    //window.localStorage.clear()
    //returning the master array
    return obj_array
}

//The interactive map made using d3js


var width = 380//303
var height = 335//267

var svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

var img = svg.append('image')
    .attr('xlink:href', 'map.png')
    .attr('width', width)
    .attr('height', height)
   

svg.on('click', locationFinder)

function locationFinder(){
    firstLoad = false;
    var e = d3.mouse(this)
    var x = e[0];
    var y = e[1];
    var initial_latitude = 51.4242
    var initial_longitude = -0.0225
    var final_latitude = 51.4135
    var final_longitude = -0.0031
    var diff_lat = (final_latitude-initial_latitude)
    var diff_long = final_longitude-initial_longitude
    var lat_scale = diff_lat/height
    var long_scale = diff_long/width

    d3.selectAll('#dot')
        .remove()

    svg.append("circle")
        .attr("id", "dot")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1)
        .attr("fill", "red")

    latitude = (initial_latitude + (y * lat_scale))
    longitude = (initial_longitude + (x * long_scale))
}

//Declaring global variable map
var map;
//set marker to null or true to make it visible
function setMarker(data) {
    // body...
    if (data.boolTest === true) {
        data.visible(true);
        data.marker.setMap(map);
    } else {
        data.visible(false);
        data.marker.setMap(null);
    }
}

//Location function to create location object
var Location = function(data) {
    var largeInfowindow = new google.maps.InfoWindow();
    var self = this;
    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;
    this.visible = data.visible;
    this.boolTest =data.boolTest;
    //creating marker
    this.marker = new google.maps.Marker({
        title: this.title,
        position: {
            lat: data.lat,
            lng: data.lng
        },
        draggable: false,
        animation: google.maps.Animation.DROP,
        map: map
    });
    //ading listener to marker
    this.marker.addListener('click', function(){
        populateInfoWindow(this,largeInfowindow);
        map.setZoom(16);
        map.setCenter(this.getPosition());
        //Animation when marker is clicked
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        //Setting animation to null
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
    });
    //click button when the name in list is clicked
    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

function populateInfoWindow(marker, infowindow){
    //Declaring variables to store lat and lng value associated with marker
    var latWindow = marker.position.lat().toString();
    var lngWindow = marker.position.lng().toString();
    //Using weather API to check the weather of the location
    var weather = "http://api.openweathermap.org/data/2.5/weather?lat="
    +latWindow+"&lon="+lngWindow+"&appid=379d8f0d9c544840b81cc943b70aa884";
    //Displaying information in Window
    if (infowindow.marker !=marker) {
        infowindow.setContent("<div><b>" + marker.title + "</b></div><br>");
        $.getJSON(weather,function(data){
            infowindow.setContent("<div><b>" + marker.title + "</b></div><br>"
                + "<div><b>Weather: </b>" + data.weather[0].description + "</div><br>"
                +"<div><b>Min Temp: </b>" + data.main.temp_min + "</div><br>"
                +"<div><b>Max Temp: </b>" + data.main.temp_max + "</div><br>");
        }).fail(function() {
        alert("Error in loading weather API refresh to load again");
    });
    infowindow.open(map,marker);
    }
}

//Locations data
var locations = [{
    title: "The Thomas Jefferson Memorial",
    lat: 38.881004,
    lng: -77.036463,
    visible: ko.observable(true),
    cityAddress: "Washington, DC 20242,usa",
    boolTest: true
}, {
    title: "The Lincoln Memorial",
    lat: 38.889269,
    lng: -77.050176,
    visible: ko.observable(true),
    cityAddress: "Washington, DC 20037,usa",
    boolTest: true
}, {
    title: "The Washington Monument",
    lat: 38.889484,
    lng: -77.0363733,
    visible: ko.observable(true),
    cityAddress: "Washington, DC 20007,usa",
    boolTest: true
}, {
    title: "The United States Capital",
    lat: 38.889939,
    lng: -77.00905,
    visible: ko.observable(true),
    cityAddress: "Washington, DC 20004,usa",
    boolTest: true
}, {
    title: "The White House",
    lat: 38.8989013,
    lng: -77.0324048,
    visible: ko.observable(true),
    cityAddress: "Washington, DC 20500,usa",
    boolTest: true
}];


var viewModel = function() {
    //Displaying Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.889269,
            lng: -77.050176
        },
        zoom: 13
    });
    //Storing the scope of this in self variable
    var self = this;
    //Creating the observable array to display the list
    self.locationList = ko.observableArray([]);
    //storing the search value in observable self.searchInput
    self.searchInput = ko.observable();
    //function to display the list
    self.shownPoints = ko.computed(function() {
    //removing all the elements from the list every time user enter the text
    //self.locationList.removeAll();
    //search function
    if (self.searchInput()) {
        for (var i = 0; i < self.locationList().length; i++) {
            if (self.locationList()[i].title.toLowerCase().indexOf(self.searchInput().toLowerCase()) >= 0) {
                self.locationList()[i].boolTest = true;
                setMarker(self.locationList()[i]);
            } else {
                self.locationList()[i].boolTest = false;
                setMarker(self.locationList()[i]);

            }
        }
    }
    //Displaying the markers if searchbox is empty
    if(self.locationList().length > 0  ) {
        if(!self.searchInput()){
        for (var i = 0; i < self.locationList().length; i++) {
         self.locationList()[i].boolTest = true;
         setMarker(self.locationList()[i]);
        }
      }
    }
    //Displaying the markers initially
    if(self.locationList().length === 0) {
        locations.forEach(function(locationItem) {
            self.locationList.push(new Location(locationItem));
        });
    }

})
};

//Applying binding on View Model
function startApp() {
    ko.applyBindings(new viewModel());
}
//Menu cick button to open the list in mobile view
$('#list').on('click', function() {
    // body...
    // stores the value of list button
    var menu_value = $('#list').attr("value")
    //open and close the menu
    if (menu_value === 'notVisible') {
        $('#list').attr("value", "visible");
        $('#display').attr("class", "options-box-responsive");
    } else {
        $('#list').attr("value", "notVisible");
        $('#display').attr("class", "options-box");
    }
});

function myErrorFunction(){
    alert("Error in loading google Map check your internet connection and refresh");
}






   var fyr_latlong = new google.maps.LatLng();

     function fyr_set_map() {
     
        var mapOptions = {
          center: new google.maps.LatLng(fyr_latlong.lat(), fyr_latlong.lng()),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
      }

    function fyr_ajax_successfn(fyr_results, status, xhr) {
              
         var fyr_rep_info = document.getElementById('fyr_find_reps');         
         fyr_rep_info.innerHTML = '<b>Your Representatives Are:</b><br>';

         jQuery.each(fyr_results, function (index, value) {

             var fyr_photoElement = document.createElement("div");
             var fyr_nameElement = document.createElement("div");

             fyr_photoElement.innerHTML = '<b><br><img src="' + this.photo_url + '" style="width:100px;height:150px;" alt="' + this.full_name + '">';
             fyr_nameElement.innerHTML = "<br><b>" + this.full_name + "</b>";

             var fyr_officesElement = document.createElement("div");
             var fyr_nameWebsiteEmailElement = document.createElement("div");

             for (var i = 0; i < this.offices.length; i++) {
                 if (this.offices[i].name == "District Office") {
                     fyr_officesElement.innerHTML += "<br><br><b>Distric Office<br></b>" + this.offices[i].address.replace(/\n/g, "<br>");
                     if (this.offices[i].phone != null) { fyr_officesElement.innerHTML += "<br>" + this.offices[i].phone; }
                     
                 }
                 else {
                     fyr_officesElement.innerHTML += "<br><br><b>Capitol Office<br></b>" + this.offices[i].address.replace(/\n/g, "<br>");
                     if (this.offices[i].phone != null) { fyr_officesElement.innerHTML += "<br>" + this.offices[i].phone; }
                 }
             }

             fyr_nameWebsiteEmailElement.innerHTML += '<br><b>Website:</b> <a href = "' + this.url +'" target="_blank">'+ this.url + "</a>";
             fyr_nameWebsiteEmailElement.innerHTML += '<br><b>Email:</b> <a href="mailto:' + this.email + '">'+this.email+"</a><br><br>";
             fyr_rep_info.appendChild(fyr_photoElement);
             fyr_rep_info.appendChild(fyr_nameElement);
             fyr_rep_info.appendChild(fyr_officesElement);
             fyr_rep_info.appendChild(fyr_nameWebsiteEmailElement);

         }); 

         fyr_set_map();
    }

    function fyr_ajax_errorfn(xhr, status, strErr) {
        alert("There was an error processing your request. Please try again.");
    }

    function fyr_get_state_rep_data(f) {

        fyr_street_address = document.getElementById("fyr_street_address").value;
        if (fyr_street_address == null || fyr_street_address == "") { 
            alert("Address Line 1 is a required field"); 
                return false; 
        }
        
        fyr_city = document.getElementById("fyr_city").value;
        if (fyr_city == null || fyr_city == "") { 
            alert("City is a required field"); 
                return false; 
        }
                        
        fyr_state = document.getElementById("fyr_state").value;
        if (fyr_state == null || fyr_state == "") { 
            alert("State is a required field"); 
                return false; 
        }
                
        fyr_zipcode = document.getElementById("fyr_zipcode").value;
        if (fyr_zipcode == null || fyr_zipcode == "") { 
            alert("Zipcode is a required field"); 
                return false; 
        }
        
        fyr_full_address = fyr_street_address +  ", " + fyr_city + ", " + fyr_state;
        
        var fyr_geocoder = new google.maps.Geocoder();
        
        fyr_geocoder.geocode({ 'address': fyr_full_address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                fyr_latlong = results[0].geometry.location;
                //  Create the Sundlight Foundation API url request        
                var fyr_slapi_url = "http://openstates.org/api/v1/legislators/geo/?long=" + fyr_latlong.lng() + "&lat=" + fyr_latlong.lat() + "&apikey=" + fyr_plugin_options_for_javascript.fyr_sunlight_key;
                fyr_slapi_url += "&fields=full_name,photo_url,email,url,offices";
                               
                // Create a jQuery ajax request to the sunlight foundation api
                jQuery.ajax({
                    url: fyr_slapi_url,
                    type: "GET",
                    dataType: "jsonp",
                    success: fyr_ajax_successfn,
                    error: fyr_ajax_errorfn,
                    complete: function (xhr, status) {
                    }

                });

            } else {
                alert("We are unable to process your request..." + status);
            }

        });

        return false;
        
    } 

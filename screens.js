function initMap() {
    const lightModeStyle = [
        { elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f0f0f0" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#dcdcdc" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#e0e0e0" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
    ];

    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 6.673175, lng: -1.565423 },
        zoom: 15,
        styles: lightModeStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });

    const locations = [
        { name: "Prempeh II Library", lat: 6.675207910091469, lng: -1.5729058193823366, logo: "assets/prempehlogo.png" },
        { name: "Unity Hall", lat: 6.679681217402366, lng: -1.5715789032888348, logo: "assets/unityhallogo.png" },
        { name: "Katanga Hall", lat: 6.6724073201346155, lng: -1.5726251255443031, logo: "assets/katlogo.png" },
        { name: "Republic Hall", lat: 6.678008434341525, lng: -1.5738099498214058, logo: "assets/repulogo.png" },
        { name: "Queens Hall", lat: 6.677146720992234, lng: -1.5745116842892422, logo: "assets/queenslogo.png" },
        { name: "Casely Hayford Hall", lat: 6.675879492708804, lng: -1.5677112394953698, logo: "assets/caselylogo.png" },
        { name: "College of Humanities", lat: 6.666560425176299, lng: -1.568452216527733, logo: "assets/sociologo.png" },
        { name: "College of Health Sciences", lat: 6.672280414817865, lng: -1.5684903087077724, logo: "assets/collegeofHeallogo.png" },
        { name: "College of Agriculture", lat: 6.677461573598219, lng: -1.5647099554585195, logo: "assets/collegeofhumalogo.png" },
        { name: "College of Science", lat: 6.673120312570144, lng: -1.5674706266156406, logo: "assets/collegeofScielogo.png" },
        { name: "College of Engineering", lat: 6.672747347139659, lng: -1.564852790636157, logo: "assets/collegeOfEnglogo.png" },
        { name: "Paa Joe Stadium", lat: 6.67651961297116, lng: -1.5704747007534645, logo: "assets/paajoelogo.png" },
        { name: "Independence Hall", lat: 6.677465936342277, lng: -1.5718770509272135, logo: "assets/independencelogo.png" },
        { name: "Africa Hall", lat: 6.680716022767249, lng: -1.5749991422630731, logo: "assets/africalogo.png" },
        { name: "Main Administration", lat: 6.674789038964718, lng: -1.5713792484255629, logo: "assets/mainadminlogo.png" },
        { name: "Great Hall", lat: 6.674611480084023, lng: -1.5716241487561804, logo: "assets/greathalllogo.png" },
        { name: "Commercial Area", lat: 6.6831979546109945, lng: -1.5761251637754503, logo: "assets/commercialarealogo.png" },
        { name: "Parade Grounds", lat: 6.6768002242852456, lng: -1.5734032220907999, logo: "assets/paradegroundslogo.png" },
    ];

    function createRoundedMarkerImage(imageUrl, size, callback) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = function () {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, 0, 0, size, size);
            callback(canvas.toDataURL());
        };
    }

    // Add markers with logos
    locations.forEach((location) => {
        createRoundedMarkerImage(location.logo, 60, (roundedImage) => {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                icon: {
                    url: roundedImage,
                    scaledSize: new google.maps.Size(50, 50),
                },
            });
const tourPageMap = {
    "Africa Hall": "africa.html",
    "Casely Hayford Hall": "caselyhayford.html",
    "College of Agriculture": "collegeofagriculture.html",
    "College of Engineering": "collegeofengineering.html",
    "College of Health Sciences": "collegeofhealthscience.html",
    "College of Science": "collegeofscienc.html",
    "College of Humanities": "collegeofsocialscience.html",
    "Commercial Area": "commercial.html",
    "Katanga Hall": "katanga.html",
    "Paa Joe Stadium": "paajoe.html",
    "Prempeh II Library": "prempeh.html",
    "Queens Hall": "queens.html",
    "Republic Hall": "republic.html",
    "Unity Hall": "unity.html"
};

const tourPageName = tourPageMap[location.name] || location.name.toLowerCase().replace(/\s+/g, '-') + '.html';

            
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                        <img src="${location.logo}" width="40" height="40" style="border-radius: 50%; object-fit: cover;">
                        <div>
                            <strong>${location.name}</strong><br>
                            <a href="${tourPageName}" class="tour-button">Start Tour</a>
                        </div>
                    </div>
                `,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        });
    });

    // Check URL parameters for navigation
    const urlParams = new URLSearchParams(window.location.search);
    const navigateTo = urlParams.get('navigate');

    if (navigateTo) {
        const location = locations.find(loc => loc.name === navigateTo);
        if (location) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const start = { lat: position.coords.latitude, lng: position.coords.longitude };
                    const end = { lat: location.lat, lng: location.lng };

                    // Use Routes API via fetch
                    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Goog-Api-Key': 'AIzaSyAOc_aOf-SO8JX328V_R34FOBwxiB0bLE4',
                            'X-Goog-FieldMask': 'routes.legs,routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline'
                        },
                        body: JSON.stringify({
                            origin: { 
                                location: { 
                                    latLng: { 
                                        latitude: start.lat, 
                                        longitude: start.lng 
                                    } 
                                } 
                            },
                            destination: { 
                                location: { 
                                    latLng: { 
                                        latitude: end.lat, 
                                        longitude: end.lng 
                                    } 
                                } 
                            },
                            travelMode: 'WALK'
                        })
                    });

                    const data = await response.json();
                    if (response.ok && data.routes && data.routes.length > 0) {
                        // Use Polyline to draw the route on the map
                        const polyline = new google.maps.Polyline({
                            path: google.maps.geometry.encoding.decodePath(data.routes[0].polyline.encodedPolyline),
                            geodesic: true,
                            strokeColor: '#FF0000',
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        polyline.setMap(map);
                        map.fitBounds({
                            north: Math.max(start.lat, end.lat),
                            south: Math.min(start.lat, end.lat),
                            east: Math.max(start.lng, end.lng),
                            west: Math.min(start.lng, end.lng)
                        });
                    } else {
                        console.error('Routes API Error:', response.status, JSON.stringify(data, null, 2));
                        alert('Routes request failed with status ' + response.status + '. Check the console.');
                    }
                },
                (error) => {
                    console.error('Geolocation Error:', error.message);
                    alert('Geolocation permission denied or unavailable.');
                }
            );
        } else {
            console.error('Location not found:', navigateTo);
            alert('Location not found: ' + navigateTo);
        }
    
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Add fade-in effect when the page loads
    document.body.style.opacity = 1;
  
    // Select all "Start Tour" links inside info windows
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("tour-button")) {
            event.preventDefault(); // Prevent instant navigation

            let targetUrl = event.target.getAttribute("href");
            document.body.style.opacity = 0; // Fade out
            
            setTimeout(() => {
                window.location.href = targetUrl; // Navigate after fade-out
            }, 500); // Delay navigation for smooth transition
        }
    });
});



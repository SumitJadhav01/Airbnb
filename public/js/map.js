
mapboxgl.accessToken =  mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center:list.geometry.coordinates, // starting position
zoom: 9 // starting zoom
});

console.log(coordinates);

const marker = new mapboxgl.Marker({color:'red'})
.setLngLat(list.geometry.coordinates)
.setPopup (new mapboxgl.Popup({offset:25 })
.setHTML(`<h4>${list.title }</h4><p>Exact location will be provided after that booking</p>`))
.addTo(map);

// Add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.NavigationControl());
 

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campgrounds.geometry.coordinates, // starting position [lng, lat]
    zoom: 3 // starting zoom
});

new mapboxgl.Marker({ color: 'red'})
    .setLngLat(campgrounds.geometry.coordinates)
    .addTo(map);

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
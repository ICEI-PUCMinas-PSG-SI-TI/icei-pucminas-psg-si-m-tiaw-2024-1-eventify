
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        lat: parseFloat(params.get('lat')),
        lng: parseFloat(params.get('lng'))
    };
}

function initMap() {
    const { lat, lng } = getQueryParams();
    const mapOptions = {
        center: { lat: lat, lng: lng },
        zoom: 10
    };
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Localizacao do Evento'
    });
}

window.onload = initMap;
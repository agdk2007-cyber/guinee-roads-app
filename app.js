var map = L.map('map').setView([9.9456, -9.6966], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

function getColor(surface) {
    if (surface === "asphalt") return "darkblue";
    if (surface === "dirt") return "darkred";
    return "black";
}

function style(feature) {
    return {
        color: getColor(feature.properties.surface),
        weight: 3
    };
}

function onEachFeature(feature, layer) {
    let distance = turf.length(feature, { units: 'kilometers' }).toFixed(2);

    let info = `
        <b>Type :</b> ${feature.properties.highway || "N/A"}<br>
        <b>Surface :</b> ${feature.properties.surface || "N/A"}<br>
        <b>Distance :</b> ${distance} km
    `;

    layer.on({
        click: function () {
            layer.setStyle({ weight: 6 });
            layer.bindPopup(info).openPopup();
        }
    });
}

fetch('data/routes.geojson.json')
  .then(res => res.json())
  .then(data => {

    L.geoJSON(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

  })
  .catch(err => {
    console.error("Erreur chargement :", err);
  });

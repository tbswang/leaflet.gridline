import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import '../src/index';

const mymap = L.map('mapid').setView([39.9, 116.4], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

L.gridlineLayer({ geohashLength: 6 }).addTo(mymap);

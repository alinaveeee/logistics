async function promiseData(url){
    return new Promise( async (resolve, reject) => {
      try {
        const request = await fetch(url);
        const json = await request.json();
        resolve(json);
      } catch (err) {
        reject(err);
      }
    })
};

const soCal = [34.078078186587135, -117.82424488747395]; // SoCal 
const pola = [33.742029, -118.264366]; // POLA // custom from geojson.io 
const psp1 = [33.929155, -117.003732]; // PSP1 in Beaumont // "apn": "424050033" in WC 
const ont5 = [34.090816, -117.239844]; // ONT5 in Ontario // "apn": "013637139" in WC 
const dlx9 = [33.984466, -118.398315]; // DLX9 in Culver City // custom from geojson.io 
const culver = [34.012677, -118.394091]; // Culver City

async function mainEvent() { 

    let map = L.map('map').setView(soCal, 9);

    L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=rpac02Coa75Y9XMRctEM', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }).addTo(map);

    // geojson layers
    const warehousesLayerData = await fetch(`data/warehouse-city.geojson`);
    const warehousesLayer = await warehousesLayerData.json();

    const polaLayerData = await fetch(`data/pola.geojson`);
    const polaLayer = await polaLayerData.json();

    const psp1LayerData = await fetch(`data/psp1.geojson`);
    const psp1Layer = await psp1LayerData.json();

    const ont5LayerData = await fetch(`data/ont5.geojson`);
    const ont5Layer = await ont5LayerData.json();

    const dlx9LayerData = await fetch(`data/dlx9.geojson`);
    const dlx9Layer = await dlx9LayerData.json();

    const freewaysLayerData = await fetch(`data/freeways.geojson`);
    const freewaysLayer = await freewaysLayerData.json();

    const warehouseCity = L.geoJSON(warehousesLayer, {
        style: {
            "smoothFactor": 0,
            "color": "rgb(255, 120, 0)",
            "weight": 1,
            // "stroke": false,
            // "fill": true,
            "fillColor": "rgb(255, 120, 0)",
            "opacity": 0.8
        },
        attribution: '&copy; <a href="https://radicalresearch.shinyapps.io/WarehouseCITY/" target="_blank">Warehouse CITY</a>'
    }).addTo(map);

    const featured = L.geoJSON([polaLayer, psp1Layer, ont5Layer, dlx9Layer], {
        style: {
            "smoothFactor": 0,
            "color": "rgb(0, 128, 255)",
            "weight": 1
        }
    }).addTo(map);

    const freeways = L.geoJSON(freewaysLayer, {
        style: {
            "smoothFactor": 0,
            "color": "rgb(255, 120, 0)",
            "weight": 1,
            "opacity": 0.4
        },
        attribution: '&copy; Caltrans (CC-BY)'
    });

    const openrailwaymap = new L.TileLayer('http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">(CC-BY-SA)</a> and OpenStreetMap',
        minZoom: 2,
        maxZoom: 19,
        tileSize: 256
    });

    L.control.layers(null, {
        "Featured": featured,
        "Freeways": freeways,
        "Rail": openrailwaymap,
        "Warehouses": warehouseCity
    }).addTo(map);

    // text content + photos
    const contentData = await fetch(`data/content.json`);
    const content = await contentData.json();
    
    const introduction = content[0];
    const polaContent = content[1];
    const psp1Content = content[2];
    const ont5Content = content[3];
    const dlx9Content = content[4];
    const culverContent = content[5];
    const conclusion = content[6];

    // sound!
    const oceanSound = new Howl({
        src: ['audio/ocean.mp3'],
        loop: true
    });

    const trainSound = new Howl({
        src: ['audio/train.mp3'],
        loop: true
    });

    const trafficSound = new Howl({
        src: ['audio/traffic.mp3'],
        loop: true
    });

    const airportSound = new Howl({
        src: ['audio/airport.mp3'],
        loop: true
    });

    const photo = document.querySelector('#photo');
    const photoCredit = document.querySelector('#photo-credit');
    const status = document.querySelector('#status');
    const description = document.querySelector('#description');
    const btn = document.querySelector('#btn');
    const restart = document.querySelector('#restart');

    function visitCLUI() {
        window.open("https://clui.org/projects/going-flow-amazon-southland", "_blank");
    };

    function polaView() {
        map.flyTo(pola, 13); // (view, zoom level)
        photo.setAttribute("src", polaContent.photo);
        photoCredit.textContent = polaContent.credit;
        status.textContent = polaContent.status;
        description.textContent = polaContent.description;
        oceanSound.volume(0.5).play();
        trainSound.volume(0.5).play();
        trafficSound.volume(0.5).play();
        btn.addEventListener("click", psp1View);
    };

    function psp1View() {
        map.flyTo(psp1, 15);
        photo.setAttribute("src", psp1Content.photo);
        photoCredit.textContent = psp1Content.credit;
        status.textContent = psp1Content.status;
        description.textContent = psp1Content.description;
        oceanSound.fade(0.5, 0, 3000); // fade (from volume, to volume, duration)
        trainSound.fade(0.5, 0, 3000);
        btn.removeEventListener("click", polaView);
        btn.removeEventListener("click", psp1View);
        btn.addEventListener("click", ont5View);
    };

    function ont5View() {
        map.flyTo(ont5, 15);
        photo.setAttribute("src", ont5Content.photo);
        photoCredit.textContent = ont5Content.credit;
        status.textContent = ont5Content.status;
        description.textContent = ont5Content.description;
        airportSound.volume(0.5).play();
        btn.removeEventListener("click", ont5View);
        btn.addEventListener("click", dlx9View);
    };

    function dlx9View() {
        map.flyTo(dlx9, 16);
        photo.setAttribute("src", dlx9Content.photo);
        photoCredit.textContent = dlx9Content.credit;
        status.textContent = dlx9Content.status;
        description.textContent = dlx9Content.description;
        airportSound.fade(0.5, 0, 3000);
        btn.removeEventListener("click", dlx9View);
        btn.addEventListener("click", culverView);
    };

    function culverView() {
        map.flyTo(culver, 13);
        photo.setAttribute("src", culverContent.photo);
        photoCredit.textContent = culverContent.credit;
        status.textContent = culverContent.status;
        description.textContent = culverContent.description;
        btn.removeEventListener("click", culverView);
        btn.addEventListener("click", cluiView);
    };

    function cluiView() {
        map.flyTo(soCal, 9);
        photo.setAttribute("src", conclusion.photo);
        photoCredit.textContent = conclusion.credit;
        status.textContent = conclusion.status;
        description.textContent = conclusion.description;
        trafficSound.fade(0.5, 0, 3000);
        btn.removeEventListener("click", cluiView);
        btn.textContent = "Read about the exhibit";
        btn.addEventListener("click", visitCLUI);
        restart.style.display = "inline-block";
    };

    function socalView() {
        map.flyTo(soCal, 9);
        photo.setAttribute("src", introduction.photo);
        photoCredit.textContent = introduction.credit;
        status.textContent = introduction.status;
        description.textContent = introduction.description;
        btn.removeEventListener("click", visitCLUI);
        btn.removeEventListener("click", socalView);
        btn.textContent = "Next";
        btn.addEventListener("click", polaView);
        restart.style.display = "none";
        oceanSound.stop();
        trainSound.stop();
        trafficSound.stop();
        airportSound.stop();
    };

    btn.addEventListener("click", polaView);
    restart.addEventListener("click", socalView);
};

document.addEventListener("DOMContentLoaded", async () => mainEvent());
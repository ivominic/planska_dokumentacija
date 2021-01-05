/**Inicijalna deklaracija vrijednosti koje se korite u stranici*/
const domainUrl = location.origin;
//const domainUrl = "http://localhost:8088";
//const domainUrl = "http://167.172.171.249";
const wmsUrl = domainUrl + "/geoserver/winsoft/wms";
const wfsUrl = domainUrl + "/geoserver/winsoft/wfs";
const imageUrl = domainUrl + "/slike/";
const point = "Point",
    lineString = "LineString",
    polygon = "Polygon",
    tacke = [],
    linije = [],
    poligoni = [];
let draw,
    modify,
    cqlFilter = "",
    idObjekta = 0,
    akcija = "pan",
    slikaUrl = "",
    slikeUrl = [],
    slikeIndex = 0;
let geometrijaZaBazuWkt = "",
    nacrtan = false,
    modifikovan = false;

/**Definisanje podloga */
let osmBaseMap = new ol.layer.Tile({
    title: "Open Street Maps",
    source: new ol.source.OSM(),
});
let satelitBaseMap = new ol.layer.Tile({
    title: "Satelitski snimak",
    source: new ol.source.XYZ({
        url: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
        maxZoom: 23,
    }),
});
let topoMap = new ol.layer.Tile({
    title: "Open Topo Maps",
    type: "base",
    visible: true,
    source: new ol.source.XYZ({
        url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"
    })
});
let hikerMap = new ol.layer.Tile({
    title: "Pješačka mapa",
    type: "base",
    visible: true,
    source: new ol.source.XYZ({
        url: "https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png"
    })
});

var katastarBaseMap = new ol.layer.Tile({
    title: "Katastar",
    name: "uzn",
    source: new ol.source.TileWMS({
        url: wmsUrl,
        params: {
            LAYERS: "ekip:uzn",
        },
        ratio: 1,
        serverType: "geoserver",
    }),
});

/**Stilizacija vektora */
var fill = new ol.style.Fill({
    color: "rgba(255,0,0,0.3)",
});
var stroke = new ol.style.Stroke({
    color: "#ff0000",
    width: 2,
});
var circle = new ol.style.Circle({
    radius: 7,
    fill: fill,
    stroke: stroke,
});
var vectorStyle = new ol.style.Style({
    fill: fill,
    stroke: stroke,
    image: circle,
});

/**Setovanje centra mape */
let center = ol.proj.transform([19.26, 42.43], "EPSG:4326", "EPSG:3857");
let view = new ol.View({
    center: center,
    zoom: 14,
});

/** Prikaz razmjernika na mapi*/
const razmjera = new ol.control.ScaleLine({
    target: document.querySelector("#razmjera"),
    units: "metric",
    bar: true,
    steps: 4,
    text: true,
    minWidth: 100
});

/** Vraća well known tekst reprezentaciju geometrije za predati feature */
function wktGeometrije(feature) {
    let format = new ol.format.WKT();
    return format.writeGeometry(feature.getGeometry(), {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
    });
}

/**Kreiranje vektorskih lejera za crtanje i kreiranje nove geometrije ili edit postojeće (point, linestring, polygon, new i edit) */
function kreirajVektorLejerZaCrtanje(olCollection) {
    return new ol.layer.Vector({
        source: new ol.source.Vector({
            features: olCollection,
        }),
        style: vectorStyle,
    });
}
/**Definisanje vektor lejera za crtanje figura i kreiranje i izmjenu tekuće geometrije */
let featuresPoint = new ol.Collection(),
    featuresLine = new ol.Collection(),
    featuresPolygon = new ol.Collection(),
    featuresTekuci = new ol.Collection();
let featurePointOverlay = kreirajVektorLejerZaCrtanje(featuresPoint),
    featureLineOverlay = kreirajVektorLejerZaCrtanje(featuresLine),
    featurePolygonOverlay = kreirajVektorLejerZaCrtanje(featuresPolygon),
    featureTekuciOverlay = kreirajVektorLejerZaCrtanje(featuresTekuci);
featureLineOverlay.getSource().on("addfeature", (evt) => linije.push(wktGeometrije(evt.feature)));
featurePointOverlay.getSource().on("addfeature", (evt) => tacke.push(wktGeometrije(evt.feature)));
featurePolygonOverlay.getSource().on("addfeature", (evt) => poligoni.push(wktGeometrije(evt.feature)));

/** Klikom na modalnu sliku, otvara novi tab sa istom slikom */
document.querySelector("#imgModal").onclick = function () {
    //window.open(slikaUrl, "_blank");
    window.open(slikeUrl[slikeIndex], "_blank");
};

/** Podešava vrijednost ddl liste */
function setujDdlVrijednost(ddl, vrijednost) {
    for (let i = 0; i < document.querySelector(ddl).length; i++) {
        document.querySelector(ddl).options[i].text === vrijednost && (document.querySelector(ddl).options[i].selected = true);
    }
}

/** Sljedeća ili prethodna slika, zavisno je li n=1 ili n=-1*/
function prikaziSliku(n) {
    slikeIndex += n;
    slikeIndex < 0 && (slikeIndex = slikeUrl.length - 1);
    slikeIndex >= slikeUrl.length && (slikeIndex = 0);
    document.querySelector("#imgModal").src = slikeUrl[slikeIndex];
}

/** Prikazuje sliku za odabrani objekat u modalnom prozoru */
function slika() {
    slikeIndex = 0;
    slikeUrl = [];

    if (location.hash && location.hash.substring(1)) {
        let objekat = location.hash.substring(1).split(".");
        let lejerSlike = preimenujNazivLejeraZaFotografije(objekat[0]);
        let idObjekta = objekat[1];
        let parametri = new FormData();
        parametri.append("lejer", lejerSlike);
        parametri.append("id", idObjekta);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', citajSlikeUrl, true);
        xhr.send(parametri);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(xhr.responseText);
                    let jsonResponse = JSON.parse(xhr.responseText);
                    if (jsonResponse["success"] === true && jsonResponse["data"].length > 0) {
                        for (let i = 0; i < jsonResponse["data"].length; i++) {
                            let tmpSlika = jsonResponse["data"][i].fotografija;
                            tmpSlika.length && (tmpSlika = tmpSlika.substring(tmpSlika.lastIndexOf("/") + 1, tmpSlika.length));
                            slikeUrl[i] = imageUrl + tmpSlika;
                            console.log(i, slikeUrl[i]);
                        }
                        //akcija = "slika";
                        document.querySelector("#modalFotografija").style.display = "block";
                        prikaziSliku(0);
                        document.querySelector("#naslovFotografija").innerHTML = opisSlike;

                        document.querySelector("#zatvoriModalFotografija").onclick = function () {
                            document.querySelector("#modalFotografija").style.display = "none";
                        };
                        //setujAktivnu("#slika"); //Da ne zatvara stranicu sa atributima
                    } else {
                        if (jsonResponse["data"].length == 0) {
                            poruka("Upozorenje", "Ne postoji slika za odabrani objekat.");
                        }
                    }
                } else {
                    poruka("Greska", xhr.statusText);
                }
            }
        };
    } else {
        poruka("Upozorenje", "Nije odabran objekat na mapi za koji želite da se prikaže fotografija.");
    }
}

function crtajTacku() {
    akcija = point;
    setujAktivnu("#marker");
}

function crtajLiniju() {
    akcija = lineString;
    setujAktivnu("#linija");
}

function crtajPoligon() {
    akcija = polygon;
    setujAktivnu("#poligon");
}

/**Funkcija koja prolazi kroz nizove tačaka, linija i polgiona i kreira CQL uslov u zavisnosti od odabranih opcija */
function kreiranjeCqlFilteraProstorno() {
    let retVal = "";
    let pretragaTacka = document.querySelector("#pretragaTacke").checked;
    let pretragaTackaUdaljenost = document.querySelector("#pretragaTackeUdaljenost").value;
    let pretragaLinije = document.querySelector("#pretragaLinije").checked;
    let pretragaPoligonObuhvata = document.querySelector("#pretragaPoligonObuhvata").checked;
    let pretragaPoligonPresijeca = document.querySelector("#pretragaPoligonPresijeca").checked;
    if (pretragaTacka && pretragaTackaUdaljenost === "") {
        poruka("Upozorenje", "Potrebno je unijeti udaljenost od iscrtanih tačaka na kojoj će se prikazivati objekti iz sloja koji se pretražuje.");
        return false;
    }
    if (pretragaTacka && tacke.length === 0) {
        poruka("Upozorenje", "Potrebno je nacrtati bar jednu tačku za pretragu objekata po udaljenosti.");
        return false;
    }
    if (pretragaLinije && linije.length === 0) {
        poruka("Upozorenje", "Potrebno je nacrtati bar jednu liiju za pretragu objekata koje linija presijeca.");
        return false;
    }
    if ((pretragaPoligonPresijeca || pretragaPoligonObuhvata) && poligoni.length === 0) {
        poruka("Upozorenje", "Potrebno je nacrtati bar jedan poligon za pretragu objekata koje poligon presijeca ili obuhvata.");
        return false;
    }

    pretragaTacka &&
    tacke.forEach((item) => {
        if (retVal === "") {
            retVal = "DWITHIN(geom," + item + "," + pretragaTackaUdaljenost + ",meters) ";
        } else {
            retVal += " OR DWITHIN(geom," + item + "," + pretragaTackaUdaljenost + ",meters) ";
        }
    });

    pretragaLinije &&
    linije.forEach((item) => {
        if (retVal === "") {
            retVal = "INTERSECTS(geom," + item + ") ";
        } else {
            retVal += " OR INTERSECTS(geom," + item + ") ";
        }
    });

    (pretragaPoligonObuhvata || pretragaPoligonPresijeca) &&
    poligoni.forEach((item) => {
        if (retVal === "") {
            if (pretragaPoligonPresijeca) {
                retVal = "INTERSECTS(geom," + item + ") ";
            } else {
                retVal = "WITHIN(geom," + item + ") ";
            }
        } else {
            if (pretragaPoligonPresijeca) {
                retVal += " OR INTERSECTS(geom," + item + ") ";
            } else {
                retVal += " OR WITHIN(geom," + item + ") ";
            }
        }
    });

    return retVal;
}

/**Prikaz toast poruke. Od naslova zavisi boja, tj klasa koja se dodjeljuje */
function poruka(naslov, tekst) {
    let klasa = naslov.toLowerCase().trim();
    klasa !== "uspjeh" && klasa !== "upozorenje" && klasa !== "greska" && (klasa = "obavjestenje");
    document.querySelector("#toast").innerHTML = tekst;
    document.querySelector("#toast").className = klasa;
    setTimeout(function () {
        document.querySelector("#toast").className = "";
        document.querySelector("#toast").innerHTML = "";
    }, 3000);
}

/** Akcija promjene ikonice u navbaru */
function setujAktivnu(element) {
    if (nacrtan || modifikovan) {
        poruka("Upozorenje", "Nije moguće promijeniti aktivnost dok ne poništite crtanje nove ili izmjenu postojeće geometrije.");
        return false;
    }
    let els = document.querySelectorAll(".active");
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove("active");
    }
    document.querySelector(element).classList.add("active");
    closeDiv("#pretragaDiv");
    closeDiv("#lejeriDiv");
    if (element === "#lejeri") {
        showDiv("#lejeriDiv");
    }
    if (element === "#pretraga") {
        showDiv("#pretragaDiv");
    }
    if (element === "#atributi") {
        showDiv("#atributiDiv");
    }
    podesiInterakciju();
    zatvoriHamburger();
}

/** Zatvara meni nakon odabira akcije, na malim ekranima */
function zatvoriHamburger() {
    let x = document.querySelector("#topNav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function closeDiv(nazivDiva) {
    document.querySelector(nazivDiva).style.width = "0";
}

function showDiv(nazivDiva) {
    if (screen.width < 650) {
        document.querySelector(nazivDiva).style.width = "75%";
    }
    else if (screen.width >= 650 && screen.width < 1390) {
        document.querySelector(nazivDiva).style.width = "45%";
    }
    else {
        document.querySelector(nazivDiva).style.width = "26%";
        // document.querySelector(nazivDiva).style.width = "500px";
    }

}

/**Tri funkcije koje rade sa konfirm modalom - za potvrdu akcija/brisanja */
function confirmModal(naslov, text, funkcija) {
    document.querySelector("#modalConfirmHeader").innerHTML = naslov;
    document.querySelector("#modalConfirmText").innerHTML = text;
    document.querySelector("#modalConfirm").style.display = "block";
}

function confirmPotvrdi(funkcija) {
    document.querySelector("#modalConfirm").style.display = "none";
    brisanje();
}

function confirmOdustani() {
    document.querySelector("#modalConfirm").style.display = "none";
}

function openModalSpinner() {
    document.querySelector('#modalSpinner').style.display = 'block';
    document.querySelector('#fadeSpinner').style.display = 'block';
}

function closeModalSpinner() {
    document.querySelector('#modalSpinner').style.display = 'none';
    document.querySelector('#fadeSpinner').style.display = 'none';
}

/**Funkcije za download WFS-a */
function shpDownload() {
    zatvoriHamburger();
    wfsDownload("SHAPE-ZIP");
}

function kmlDownload() {
    zatvoriHamburger();
    wfsDownload("KML");
}

function excelDownload() {
    zatvoriHamburger();
    wfsDownload("excel2007");
}

/** Funkcije za rad sa navigacionim barom*/
function pan() {
    akcija = "pan";
    setujAktivnu("#pan");
}


function lejeri() {
    akcija = "lejeri";
    setujAktivnu("#lejeri");
}

function atributi() {
    akcija = "atributi";
    setujAktivnu("#atributi");
}

function pretraga() {
    akcija = "pretraga";
    setujAktivnu("#pretraga");
}

function restart() {
    location.reload(true);
}

/**Povezivanje kontrola sa akcijama */
document.querySelector("#pan").addEventListener("click", pan);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#lejeri").addEventListener("click", lejeri);
document.querySelector("#marker").addEventListener("click", crtajTacku);
document.querySelector("#linija").addEventListener("click", crtajLiniju);
document.querySelector("#poligon").addEventListener("click", crtajPoligon);
document.querySelector("#pretraga").addEventListener("click", pretraga);
document.querySelector("#restart").addEventListener("click", restart);

document.querySelector("#confirmPotvrdi").addEventListener("click", confirmPotvrdi);
document.querySelector("#confirmOdustani").addEventListener("click", confirmOdustani);


/**Kreiranje wms lejera za mape */
function kreirajNoviImageWmsLejer(title, name, fullname) {
    return new ol.layer.Image({
        title: title,
        name: name,
        source: new ol.source.ImageWMS({
            url: wmsUrl,
            params: {
                LAYERS: fullname,
                feature_count: "5",
            },
            ratio: 1,
            serverType: "geoserver",
        }),
    });
}


/****PREVOĐENJE NAZIVA LEJERA I POLJA */
function preimenujNazivLejeraZaAtributJavneStrane(nazivLejera) {
    let retVal = nazivLejera;
    switch (nazivLejera) {
        case "drvece_v":
            retVal = "Drveće";
            break;
        case "zbunje_linija_v":
            retVal = "Žbunje linija";
            break;
        case "zbunje_tacka_v":
            retVal = "Žbunje tačka";
            break;
        case "zelene_povrsine_v":
            retVal = "Zelene površine";
            break;
        case "urbani_mobilijar_v":
            retVal = "Urbani mobilijar";
            break;
        case "rekreativne_povrsine_v":
            retVal = "Rekreativne površine";
            break;
        default:

    }
    return retVal;
}

function preimenujNazivLejeraZaFotografije(nazivLejera) {
    let retVal = nazivLejera;
    switch (nazivLejera) {
        case "drvece_v":
            retVal = "Drvece";
            break;
        case "zbunje_linija_v":
            retVal = "ZbunjeLinija";
            break;
        case "zbunje_tacka_v":
            retVal = "ZbunjeTacka";
            break;
        case "zelene_povrsine_v":
            retVal = "ZelenePovrsine";
            break;
        case "urbani_mobilijar_v":
            retVal = "UrbaniMobilijar";
            break;
        case "rekreativne_povrsine_v":
            retVal = "RekreativnePovrsine";
            break;
        default:

    }
    return retVal;
}


/**Funkcija koja vrši preimenovanje naziva atributa za prikaz na javnoj stranici */
function preimenujNazivAtributaZaJavnuStranu(nazivAtributa) {
    let retVal = nazivAtributa;
    switch (nazivAtributa) {
        case "id":
            retVal = "ID";
            break;
        case "tip":
            retVal = "Tip";
            break;
        case "tip_kragne":
            retVal = "Tip kragne";
            break;
        case "narodni_naziv":
            retVal = "Narodni naziv";
            break;
        case "latinski_naziv":
            retVal = "Latinksi naziv";
            break;
        case "opis":
            retVal = "Opis";
            break;
        case "napomena":
            retVal = "Napomena";
            break;
        case "kvalitet":
            retVal = "Kvalitet";
            break;
        case "namjena":
            retVal = "Namjena";
            break;
        case "url_fotografije":
            retVal = "URL fotografije";
            break;
        case "visina":
            retVal = "Visina (m)";
            break;
        case "ocekivano_trajanje_zivota":
            retVal = "Očekivano trajanje života (godine)";
            break;
        case "ocjena_dekorativnosti":
            retVal = "Ocjena dekorativnosti";
            break;
        case "ocjena_vitalnosti":
            retVal = "Ocjena vitalnosti";
            break;
        case "ostali_detalji":
            retVal = "Ostali detalji";
            break;
        case "premazivanje_nakon_sjece":
            retVal = "Premazivanje nakon sječe";
            break;
        case "slomljene_grane":
            retVal = "Slomljene grane";
            break;
        case "suhovrhost":
            retVal = "Suhovrhost";
            break;
        case "pripadnost_drvoredu":
            retVal = "Pripadnost drvoredu";
            break;
        case "prsni_precnik":
            retVal = "Prsni prečnik (cm)";
            break;
        case "sirina_krosnje":
            retVal = "Širina krošnje (m)";
            break;
        case "starost":
            retVal = "Starost (godine)";
            break;
        case "cijena_sadnice":
            retVal = "Procijenjena vrijednost (€)";
            break;
        case "visina_debla":
            retVal = "Visina debla (m)";
            break;
        case "visina_stabla":
            retVal = "Visina stabla (m)";
            break;
        case "entomoloske_promjene":
            retVal = "Entomološke promjene";
            break;
        case "fitopatoloske_promjene":
            retVal = "Fitopatološke promjene";
            break;
        case "vrsta_entomoloske_promjene":
            retVal = "Vrsta entomološke promjene";
            break;
        case "vrsta_fitopatoloske_promjene":
            retVal = "Vrsta fitopatološke promjene";
            break;
        case "suve_grane":
            retVal = "Suve grane";
            break;
        case "validiran":
            retVal = "Validiran";
            break;
        case "vrijeme_sadnje":
            retVal = "Vrijeme sadnje";
            break;
        case "opseg_starosti":
            retVal = "Opseg starosti";
            break;
        case "isjecene_debele_grane":
            retVal = "Isječene debele grane";
            break;
        case "isjeceno_uklonjeno_stablo":
            retVal = "Isječeno uklonjeno stablo";
            break;
        case "izrazenost_otvorene_trulezi_debla":
            retVal = "Izraženost otvorene truleži debla";
            break;
        case "izrazenost_otvorene_trulezi_grana":
            retVal = "Izraženost otvorene truleži grana";
            break;
        case "velicina_otvorene_trulezi_debla":
            retVal = "Veličina otvorene truleži debla";
            break;
        case "velicina_otvorene_trulezi_grana":
            retVal = "Veličina otvorene truleži grana";
            break;
        default:

    }
    retVal = retVal.replace(/_/g, " ");
    return retVal;
}

function uklanjanjeCrteza(){
    brisanjeMjerenja();
    featureLineOverlay.getSource().clear();
    featurePointOverlay.getSource().clear();
    featurePolygonOverlay.getSource().clear();
}
document.querySelector("#brisanje").addEventListener("click", uklanjanjeCrteza);



function popuniDdl(idDdl, urlMetode) {
    //document.querySelector(idDdl).innerHTML="";
    //$(idDdl).empty();

    let parametri = new FormData();
    let xhr = new XMLHttpRequest();
    xhr.open('GET', urlMetode, true);
    xhr.send(parametri);
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                //console.log(xhr.responseText);
                let jsonResponse = JSON.parse(xhr.responseText);
                if (jsonResponse["success"] === true && jsonResponse["data"].length > 0) {
                    jsonResponse["data"].forEach(function(response) {
                        let option = document.createElement("option");
                        option.text = response.naziv;
                        option.value = response.id;
                        document.querySelector(idDdl).appendChild(option);
                    });
                }
            } else {
                poruka("Greska", xhr.statusText);
            }
        }
    }
}
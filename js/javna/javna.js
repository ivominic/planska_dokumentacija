const tipGeometrije = point;
let opisSlike = "";

/**Popunjavanje komponenti u divu za prikaz atributa, nakon pročitanog odgovora za WMS objekat */
function popuniKontrole(odgovor) {
  let atributi = odgovor.features[0]["properties"];
  for (let i = 0; i < odgovor.features.length; i++) {
    let metapodaci = odgovor.features[i]["properties"];
    let element_id = odgovor.features[i]["id"];
    let objekat = element_id.split(".");
    let collapse_name = preimenujNazivLejeraZaAtributJavneStrane(objekat[0]) + " - " + metapodaci["id"];
    let collapse_id = objekat[0] + "." + metapodaci["id"];
    let div_heder = '<div class="collapse" id="' + collapse_id + '"><a href="#' + collapse_id + '">' + collapse_name + '</a><div class="content"><div class="inner-content">';
    //div_heder += '<div class="checkrow"><div class="column"><button onclick="slika()" style="width: 35px;height: 30px;font-size: 20px;"><i class="fas fa-camera-retro"></i></button></div><div class="column">x</div></div>'
    div_heder += '<button onclick="slika()" class="attr-img"><i class="fas fa-camera-retro"></i></button>';

    let isjeceneGrane = "Ne";
    if (metapodaci["isjecene_debele_grane"] === true) {
      isjeceneGrane = "Da";
    }
    let premazivanjeNakonSjece = "Ne";
    if (metapodaci["premazivanje_nakon_sjece"] === true) {
      premazivanjeNakonSjece = "Da";
    }
    let isjecenoUklonjenoStablo = "Ne";
    if (metapodaci["isjeceno_uklonjeno_stablo"] === true) {
      isjecenoUklonjenoStablo = "Da";
    }
    let pripadnostDrvoredu = "Ne";
    if (metapodaci["pripadnost_drvoredu"] === true) {
      pripadnostDrvoredu = "Da";
    }

    let div_sadrzaj = "";
    if (objekat[0] === "drvece_v") {
      console.log("pocetak", metapodaci);
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Narodni naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["narodni_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Latinski naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["latinski_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Visina stabla (m)</strong></div><div class="attr-value"><span>' +
        metapodaci["visina_stabla"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Visina debla (m)</strong></div><div class="attr-value"><span>' +
        metapodaci["visina_debla"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Prsni prečnik (cm)</strong></div><div class="attr-value"><span>' +
        metapodaci["prsni_precnik"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Širina krošnje (m)</strong></div><div class="attr-value"><span>' +
        metapodaci["sirina_krosnje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip kragne</strong></div><div class="attr-value"><span>' +
        metapodaci["tip_kragne"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Napomena</strong></div><div class="attr-value"><span>' +
        metapodaci["napomena"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Fitopatološke promjene</strong></div><div class="attr-value"><span>' +
        metapodaci["fitopatoloske_promjene"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Vrsta fitopatološke promjene</strong></div><div class="attr-value"><span>' +
        metapodaci["vrsta_fitopatoloske_promjene"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Entomološke promjene</strong></div><div class="attr-value"><span>' +
        metapodaci["entomoloske_promjene"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Vrsta entomološke promjene</strong></div><div class="attr-value"><span>' +
        metapodaci["vrsta_entomoloske_promjene"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Izražena trulež debla</strong></div><div class="attr-value"><span>' +
        metapodaci["izrazenost_otvorene_trulezi_debla"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Veličina truleži debla</strong></div><div class="attr-value"><span>' +
        metapodaci["velicina_otvorene_trulezi_debla"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Izražena trulež grana</strong></div><div class="attr-value"><span>' +
        metapodaci["izrazenost_otvorene_trulezi_grana"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Veličina truleži grana</strong></div><div class="attr-value"><span>' +
        metapodaci["velicina_otvorene_trulezi_grana"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Ocjena vitalnosti</strong></div><div class="attr-value"><span>' +
        metapodaci["ocjena_vitalnosti"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Ocjena dekorativnosti</strong></div><div class="attr-value"><span>' +
        metapodaci["ocjena_dekorativnosti"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Opseg starosti</strong></div><div class="attr-value"><span>' +
        metapodaci["opseg_starosti"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Vijek trajanja (godina)</strong></div><div class="attr-value"><span>' +
        metapodaci["ocekivano_trajanje_zivota"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Vrijeme sadnje</strong></div><div class="attr-value"><span>' +
        metapodaci["vrijeme_sadnje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Procijenjena vrijednost (€)</strong></div><div class="attr-value"><span>' +
        metapodaci["cijena_sadnice"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Ostali detalji</strong></div><div class="attr-value"><span>' +
        metapodaci["ostali_detalji"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Slomljene grane</strong></div><div class="attr-value"><span>' +
        metapodaci["slomljene_grane"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Suve grane</strong></div><div class="attr-value"><span>' +
        metapodaci["suve_grane"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Suhovrhost</strong></div><div class="attr-value"><span>' +
        metapodaci["suhovrhost"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Za uklanjanje</strong></div><div class="attr-value"><span>' +
        metapodaci["kvalitet"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Isječene debele grane</strong></div><div class="attr-value"><span>' +
        isjeceneGrane +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Premazivanje nakon sječe</strong></div><div class="attr-value"><span>' +
        premazivanjeNakonSjece +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Isječeno stablo</strong></div><div class="attr-value"><span>' +
        isjecenoUklonjenoStablo +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Pripada drvoredu</strong></div><div class="attr-value"><span>' +
        pripadnostDrvoredu +
        "</span></div></div>";
    } else if (objekat[0] === "zbunje_linija_v") {
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Latinski naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["latinski_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Narodni naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["narodni_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Zdravstveno stanje</strong></div><div class="attr-value"><span>' +
        metapodaci["zdravstveno_stanje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Napomena</strong></div><div class="attr-value"><span>' +
        metapodaci["napomena"] +
        "</span></div></div>";
    } else if (objekat[0] === "zbunje_tacka_v") {
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Latinski naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["latinski_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Narodni naziv</strong></div><div class="attr-value"><span>' +
        metapodaci["narodni_naziv"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Zdravstveno stanje</strong></div><div class="attr-value"><span>' +
        metapodaci["zdravstveno_stanje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Napomena</strong></div><div class="attr-value"><span>' +
        metapodaci["napomena"] +
        "</span></div></div>";
    } else if (objekat[0] === "urbani_mobilijar_v") {
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Materijal objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["materijal"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Boja</strong></div><div class="attr-value"><span>' +
        metapodaci["boja"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Stanje</strong></div><div class="attr-value"><span>' +
        metapodaci["stanje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Napomena</strong></div><div class="attr-value"><span>' +
        metapodaci["napomena"] +
        "</span></div></div>";
    } else if (objekat[0] === "zelene_povrsine_v") {
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Namjena</strong></div><div class="attr-value"><span>' +
        metapodaci["namjena"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Opis</strong></div><div class="attr-value"><span>' +
        metapodaci["opis"] +
        "</span></div></div>";
    } else if (objekat[0] === "rekreativne_povrsine_v") {
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>ID objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["id"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Tip objekta</strong></div><div class="attr-value"><span>' +
        metapodaci["tip"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Materijal</strong></div><div class="attr-value"><span>' +
        metapodaci["materijal"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Boja</strong></div><div class="attr-value"><span>' +
        metapodaci["boja"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Stanje</strong></div><div class="attr-value"><span>' +
        metapodaci["stanje"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Dimenzije</strong></div><div class="attr-value"><span>' +
        metapodaci["dimenzije"] +
        "</span></div></div>";
      div_sadrzaj +=
        '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>Napomena</strong></div><div class="attr-value"><span>' +
        metapodaci["napomena"] +
        "</span></div></div>";
    }
    // for (let key in metapodaci) {
    //     if (key !== "active" && key !== "version" && key !== "username" && key !== "validiran" && key !== "date_created" && key !== "last_updated") {
    //         naziv_atributa = preimenujNazivAtributaZaJavnuStranu(key);
    //         vrijednost_atributa = metapodaci[key];
    //         vrijednost_atributa === '"null"' && (vrijednost_atributa = '');
    //         vrijednost_atributa === true && (vrijednost_atributa = 'Da');
    //         vrijednost_atributa === false && (vrijednost_atributa = 'Ne');
    //         div_sadrzaj += '<div class="flex-row mb-8 pb-8 border-bottom-w"><div class="attr-name"><strong>' + naziv_atributa + '</strong></div><div class="attr-value"><span>' + vrijednost_atributa + '</span></div></div>';
    //         //div_sadrzaj += '<div class="istavrsta"><label">' + naziv_atributa + '</label><label">' + vrijednost_atributa + '</label></div>';
    //     }
    // }
    document.querySelector("#accordion").innerHTML += div_heder + div_sadrzaj + "</div></div></div>";
  }
}

/** Prazni sve promjenljive vezane za crtanje i edit geometrije*/
function isprazniGeometrije() {
  featureTekuciOverlay.getSource().clear();
  geometrijaZaBazuWkt = "";
  nacrtan = false;
  modifikovan = false;
}

/**Smještanje mape u div sa id-jem "map" */
let map = new ol.Map({
  target: "map",
  //interactions: ol.interaction.defaults().extend([new ol.interaction.PinchZoom(), new ol.interaction.DragPan()]),
  layers: [osmBaseMap], //, tkkCijev, antenskiStub
  view: view,
});

map.addControl(razmjera);

/** Dodavanje vektorskih lejera za crtanje i edit geometrije na mapu */
featureLineOverlay.setMap(map);
featurePointOverlay.setMap(map);
featurePolygonOverlay.setMap(map);
featureTekuciOverlay.setMap(map);

/**Podešava kada da se omogući crtanje i izmjena i na kojim lejerima */
function podesiInterakciju() {
  //uklanja draw i modify
  map.removeInteraction(draw);
  map.removeInteraction(modify);

  if (akcija === point) {
    draw = new ol.interaction.Draw({
      features: featuresPoint,
      type: akcija,
    });
    modify = new ol.interaction.Modify({
      features: featuresPoint,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
  if (akcija === lineString) {
    draw = new ol.interaction.Draw({
      features: featuresLine,
      type: lineString,
    });
    modify = new ol.interaction.Modify({
      features: featuresLine,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
  if (akcija === polygon) {
    draw = new ol.interaction.Draw({
      features: featuresPolygon,
      type: polygon,
    });
    modify = new ol.interaction.Modify({
      features: featuresPolygon,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
    });
    map.addInteraction(draw);
    map.addInteraction(modify);
  }
}

map.on("pointermove", onMouseMove);

function onMouseMove(evt) {
  let position = ol.proj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326");
  document.querySelector("#koordinate").innerHTML = "X:" + position[0] + " Y:" + position[1];
  if (evt.dragging) {
    return;
  }
  //map.getTargetElement().style.cursor = "";
  //let pixel = map.getEventPixel(evt.originalEvent);
}

/**Omogućava dodavanje novog vektor lejera drag-drop metodom */
let vektorSource = new ol.source.Vector();
let dragAndDrop = new ol.interaction.DragAndDrop({
  formatConstructors: [ol.format.GPX, ol.format.GeoJSON, ol.format.IGC, ol.format.KML, ol.format.TopoJSON],
});
dragAndDrop.on("addfeatures", function (event) {
  let vectorSource = new ol.source.Vector({
    features: event.features,
    projection: event.projection,
  });
  map.getLayers().push(
    new ol.layer.Vector({
      source: vectorSource,
      style: vectorStyle,
    })
  );
  view.fit(vectorSource.getExtent(), map.getSize());
});
map.addInteraction(dragAndDrop);

//Klik na feature
map.on("click", onMouseClick);

function onMouseClick(browserEvent) {
  if (akcija === "atributi") {
    document.querySelector("#accordion").innerHTML = "";
    let coordinate = browserEvent.coordinate;
    let pixel = map.getPixelFromCoordinate(coordinate);

    map.forEachLayerAtPixel(pixel, function (layer) {
      //console.log(pixel);
      console.log(layer);
      var title = layer.get("title");
      var vidljivost = layer.get("visible");
      console.log("vidljivost", vidljivost);
      //console.log(title);
      if (layer instanceof ol.layer.Image) {
        if (layer.N.visible && title !== "Staze" && title !== "Granica") {
          let url = layer.getSource().getGetFeatureInfoUrl(browserEvent.coordinate, map.getView().getResolution(), "EPSG:3857", {
            INFO_FORMAT: "application/json",
          });
          if (url) {
            fetch(url)
              .then(function (response) {
                //restartovanje();
                return response.text();
              })
              .then(function (json) {
                let odgovor = JSON.parse(json);
                if (odgovor.features.length > 0) {
                  console.log(odgovor);
                  popuniKontrole(odgovor);
                  //showDiv("#atributiDiv");
                }
              });
          }
        }
      }
    });
  }
}

function izbrisi() {
  confirmModal("UKLANJANJE", "Da li ste sigurni da želite da uklonite odabrani objekat?");
}

/**Metoda koja će sve resetovati na početne vrijednosti */
function ponisti() {
  //restartovanje();
}

function wfsFilter() {
  $.ajax({
    method: "POST",
    url: wfsUrl,
    data: {
      service: "WFS",
      request: "GetFeature",
      typename: fulllayername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: cqlFilter,
    },
    success: function (response) {
      console.log(response);
      let features = new ol.format.GeoJSON().readFeatures(response);
      console.log(features);
      vektorSource.addFeatures(features);
      console.log(vektorSource.getExtent());
      let boundingExtent = ol.extent.boundingExtent(vektorSource.getExtent());
      boundingExtent = ol.proj.transformExtent(boundingExtent, ol.proj.get("EPSG:4326"), ol.proj.get("EPSG:3857"));
      console.log(boundingExtent);
      console.log("size", map.getSize());
      //map.getView().fit(boundingExtent, map.getSize());
    },
    fail: function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    },
  });
}

/**Vraća jedan objekat čiji se id predaje i čija geometrija će se mijenjati */
function wfsZaEdit(id) {
  if (id === "") {
    poruka("Upozorenje", "Nije odabran objekat čija geometrija se želi mijenjati.");
    return false;
  }
  $.ajax({
    method: "POST",
    url: wfsUrl,
    data: {
      service: "WFS",
      request: "GetFeature",
      typename: fulllayername,
      outputFormat: "application/json",
      srsname: "EPSG:3857",
      //"maxFeatures": 50,
      CQL_FILTER: "id=" + id.toString(),
    },
    success: function (response) {
      let features = new ol.format.GeoJSON().readFeatures(response);
      featureTekuciOverlay.getSource().clear(); //Ispraznimo prethodne zapise da bi imali samo jedan koji ćemo editovati
      featureTekuciOverlay.getSource().addFeatures(features);
    },
    fail: function (jqXHR, textStatus) {
      console.log("Request failed: " + textStatus);
    },
  });
}

/** Download WFS-a u zavisnosti od predatog formata */
function wfsDownload(format) {
  let dodajCqlFilter = "";
  cqlFilter !== "" && (dodajCqlFilter = "&cql_filter=" + cqlFilter);
  window.open(wfsUrl + "?version=1.0.0&request=GetFeature&typeName=" + fulllayername + "&outputformat=" + format + dodajCqlFilter, "_blank");
  return false;
}

/*popuniDdl("#pretragaNarodniNaziv", drveceNarodniUrl);
popuniDdl("#pretragaLatinskiNaziv", drveceLatinskiUrl);
popuniDdl("#pretragaZLNarodniNaziv", zbunjeLinijaNarodniUrl);
popuniDdl("#pretragaZLLatinskiNaziv", zbunjeLinijaLatinskiUrl);
popuniDdl("#pretragaZTNarodniNaziv", zbunjeTackaNarodniUrl);
popuniDdl("#pretragaZTLatinskiNaziv", zbunjeTackaLatinskiUrl);*/

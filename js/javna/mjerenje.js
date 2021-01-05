let measureSource = new ol.source.Vector();

let measureVector = new ol.layer.Vector({
  source: measureSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(100, 80, 20, 0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33',
      }),
    }),
  }),
});

map.addLayer(measureVector);

let sketch;
let helpTooltipElement;
let helpTooltip;
let measureTooltipElement;
let measureTooltip;
let continuePolygonMsg = 'Kliknite za nastavak crtanja poligona';
let continueLineMsg = 'Kliknite za nastavak crtanja linije';
let crtanje = false;

let pointerMoveHandler = function (evt) {
  if (evt.dragging || !crtanje) {
    return;
  }
  let helpMsg = 'Kliknite da započnete mjerenje';

  if (sketch) {
    let geom = sketch.getGeometry();
    if (geom instanceof ol.geom.Polygon) {
      helpMsg = continuePolygonMsg;
    } else if (geom instanceof ol.geom.LineString) {
      helpMsg = continueLineMsg;
    }
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);

  helpTooltipElement.classList.remove('hidden');
};


map.on('pointermove', pointerMoveHandler);

map.getViewport().addEventListener('mouseout', function () {
  if (crtanje) {
    helpTooltipElement.classList.add('hidden');
  }
});

let drawMeasure; // global so we can remove it later
let formatLength = function (line) {
  let length = ol.Sphere.getLength(line);
  let output;
  if (length > 1000) {
    output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
  } else {
    output = Math.round(length * 100) / 100 + ' ' + 'm';
  }
  return output;
};

let formatArea = function (polygon) {
  let area = ol.Sphere.getArea(polygon);
  let output;
  if (area > 1000000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
  } else {
    output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
  }
  return output;
};

function addInteraction(type) {
  crtanje = true;
  drawMeasure = new ol.interaction.Draw({
    source: measureSource,
    type: type,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  });
  map.addInteraction(drawMeasure);

  createMeasureTooltip();
  createHelpTooltip();

  let listener;
  drawMeasure.on('drawstart', function (evt) {
    // set sketch
    sketch = evt.feature;
    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on('change', function (evt) {
      let geom = evt.target;
      let output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  drawMeasure.on('drawend', function () {
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.setOffset([0, -7]);
    measureSource.addFeatures(sketch);
    sketch = null;
    measureTooltipElement = null;
    createMeasureTooltip();
    ol.Observable.unByKey(listener);
    krajMjerenja();
  });
}

function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'ol-tooltip hidden';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  });
  map.addOverlay(helpTooltip);
}

function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
  });
  map.addOverlay(measureTooltip);
}

document.querySelector("#mjeraLinija").addEventListener("click", mjerenjeDuzine);
document.querySelector("#mjeraPoligon").addEventListener("click", mjerenjePovrsine);
//document.querySelector("#mjeraKraj").addEventListener("click", krajMjerenja);
document.querySelector("#mjeraUklanjanje").addEventListener("click", brisanjeMjerenja);
document.querySelector("#stampanje").addEventListener("click", stampaMape);

function mjerenjeDuzine() {
  map.removeInteraction(drawMeasure);
  addInteraction('LineString');
}

function mjerenjePovrsine() {
  map.removeInteraction(drawMeasure);
  addInteraction('Polygon');
}

function krajMjerenja() {
  map.removeInteraction(drawMeasure);
  crtanje = false;
  map.removeOverlay(measureTooltip);
  map.removeOverlay(helpTooltip);
}

function brisanjeMjerenja() {
  crtanje = false;
  map.removeInteraction(drawMeasure);
  measureSource.clear();
  let x = document.querySelectorAll(".ol-tooltip-static");
  for (let i = 0; i < x.length; i++) {
    x[i].parentNode.removeChild(x[i])
  }
  map.removeOverlay(measureTooltip);
  map.removeOverlay(helpTooltip);
}


function stampaMape() {
  map.once('postcompose', function (event) {
    var canvas = event.context.canvas;
    var link = document.getElementById("image-download");
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
  map.renderSync();
}

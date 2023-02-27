import './style.css';
import {
  Map,
  View
} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
//import Map from 'ol/Map.js';
//import OSM from 'ol/source/OSM.js';
import TileJSON from 'ol/source/TileJSON.js';
//import View from 'ol/View.js';
import {
  Group as LayerGroup
} from 'ol/layer.js';
import {
  addCoordinateTransforms,
  addProjection,
  transform,
  fromLonLat
} from 'ol/proj.js';
import Stamen from 'ol/source/Stamen.js';
import BingMaps from 'ol/source/BingMaps.js';
import {
  Control,
  ScaleLine,
  defaults as defaultControls
} from 'ol/control.js';
import {
  getRenderPixel
} from 'ol/render.js';
import MousePosition from 'ol/control/MousePosition.js';
import {
  createStringXY
} from 'ol/coordinate.js';
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';
import {Draw, Modify} from 'ol/interaction.js';
import {LineString, Point} from 'ol/geom.js';
import {getArea, getLength} from 'ol/sphere.js';
import { Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';

class RotateNorthControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'N';

    const element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleRotateNorth.bind(this), false);
  }

  handleRotateNorth() {
    this.getMap().getView().setRotation(0);
  }
}
class AddMeasureTool extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="far fa-ruler-combined"></i>';

    const element = document.createElement('div');
    element.className = 'custom-Measure ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleMeasure.bind(this), false);
  }

  handleMeasure() {
    //this.getMap().getView().setRotation(0);
    //startMeasureFunc()
    //addInteraction()
  }
} 
 
class viewInfoTool extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '<i class="far fa-info-square"></i>';

    const element = document.createElement('div');
    element.className = 'custom-info ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleInfo.bind(this), false);
  }

  handleInfo() {
    //this.getMap().getView().setRotation(0);
     alert("Info ON");
     if(localStorage.getItem("infoStatus")==="ON"){
      localStorage.setItem("infoStatus","OFF");
     }
     else
     {
      localStorage.setItem("infoStatus","ON");
     }
     
  }
} 

let LayerArrList = [];

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
});

function Progress(el) {
  this.el = el;
  this.loading = 0;
  this.loaded = 0;
}

/**
 * Increment the count of loading tiles.
 */
Progress.prototype.addLoading = function () {
  ++this.loading;
  this.update();
};

/**
 * Increment the count of loaded tiles.
 */
Progress.prototype.addLoaded = function () {
  ++this.loaded;
  this.update();
};

/**
 * Update the progress bar.
 */
Progress.prototype.update = function () {
  const width = ((this.loaded / this.loading) * 100).toFixed(1) + '%';
  this.el.style.width = width;
};

/**
 * Show the progress bar.
 */
Progress.prototype.show = function () {
  this.el.style.visibility = 'visible';
};

/**
 * Hide the progress bar.
 */
Progress.prototype.hide = function () {
  const style = this.el.style;
  setTimeout(function () {
    style.visibility = 'hidden';
    //style.width = 0;
  }, 250);
};

const progress = new Progress(document.getElementById('progress'));

//Layers From Geoserver

const stateBoundary = new TileLayer({
  //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:State_Boundary_Jhar0',
      'TILED': true
    },
    serverType: 'geoserver',
    //crossOrigin: 'anonymous',
    // Countries have transparency, so do not fade tiles:
    //transition: 0,
  }),
  visible: true,
  // preload: Infinity,
});
const districtBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': '	UAVDATA:District_Boundary_Jharkhand',
      'TILED': true
    },
    serverType: 'geoserver',
  }),
  visible: false,
});
const panchayatBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:Panchayat_20Boundary_Jharkhand',
      'TILED': true
    },
    serverType: 'geoserver',
  }),
  visible: false,
});
const villageBoundary = new TileLayer({
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {
      'LAYERS': 'UAVDATA:Village_Boundary_Jhar0',
      'TILED': true
    },
    serverType: 'geoserver',
  }),
  visible: false,
});


const view = new View({
  projection: 'EPSG:4326',
  center: [85.23, 23.81566],
  //center: fromLonLat([85.23, 23.81566]),
  //center: transform([85.23, 23.81566], 'EPSG:4326', 'EPSG:4326'),
  zoom: 7,
  //rotation: 1,
});

const source = new VectorSource();

const vector = new VectorLayer({
  source: source,
  style: function (feature) {
    return styleFunction(feature, showSegments.checked);
  },
});

const map = new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'metric',
    }),
    mousePositionControl,
   // new AddMeasureTool(),
    new viewInfoTool()
  ]),
  // controls: defaultControls().extend([new RotateNorthControl()]),
  layers: [
    vector,
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url': 'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: 'dY07ihXoIp15X3uz2p7u~XhaOOszGD1yRh0iA2siECg~ApUkGF8SU2HBMsmFOMX6wuknO-ehbjd919j8pD6Jg-fWqeJL97x3K3KtdApb7xTH',
        imagerySet: 'Aerial',
      }),
      visible: false,
      name: 'bingmaps'
    }),
    // for Admim layer groups: 
    new LayerGroup({
      layers: [
        // new TileLayer({
        //   //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
        //   source: new TileWMS({
        //     url: 'http://localhost:8880/geoserver/UAVDATA/wms',
        //     params: {'LAYERS': 'UAVDATA:State_Boundary_Jhar0', 'TILED': true},
        //     serverType: 'geoserver',
        //     // Countries have transparency, so do not fade tiles:
        //     //transition: 0,
        //   }),
        //   visible: false,
        //  // preload: Infinity,
        // }),
        stateBoundary,
        districtBoundary,
        panchayatBoundary,
        villageBoundary
      ],
    }),
    // for layer groups:
    // for Stamen layer groups: 
    new LayerGroup({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: 'watercolor',
          }),
          visible: false,
          name: 'watercolor',
        }),
        new TileLayer({
          source: new Stamen({
            layer: 'terrain-labels',
          }),
          visible: false,
          name: 'terrain',
        }),
      ],
    }),
    // for layer groups: 
  ],
  target: 'map',
  view: view,


});

map.on('tileloadstart', function () {
  progress.addLoading();
});
map.on(['tileloadend', 'tileloaderror'], function () {
  progress.addLoaded();
});
map.on('loadstart', function () {
  map.getTargetElement().classList.add('spinner');
  progress.show();
});
map.on('loadend', function () {
  map.getTargetElement().classList.remove('spinner');
  progress.hide();
});

LayerArrList.push('0_stateBoundary');

// Layer Group - show hide layers on map
function bindInputs(layerid, layer) {
  var visibilityInput = $(layerid + ' input.visible');
  visibilityInput.on('change', function () {
    layer.setVisible(this.checked);
    if (this.dataset.layrname) {
      if (this.checked === true) {
        LayerArrList.push(this.dataset.layrname);
        console.log(LayerArrList)
      } else if (this.checked === false) {
        LayerArrList.splice(LayerArrList.indexOf(this.dataset.layrname), 1);
        //LayerArrList.pop(this.dataset.layrname);
        console.log(LayerArrList)
      }
    }
  });

  visibilityInput.prop('checked', layer.getVisible());
  // if(layer.getVisible()){
  //   console.log("this");
  // }
  var opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input change', function () {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}
map.getLayers().forEach(function (layer, i) {
  bindInputs('#layer' + i, layer);
  if (layer instanceof LayerGroup) {
    layer.getLayers().forEach(function (sublayer, j) {
      bindInputs('#layer' + i + j, sublayer);
    });
  }
});

//swiper code
// const swipe = document.getElementById('swipe');
// //if(swipe.style.display!="none"){
//   stateBoundary.on('prerender', function (event) {
//     const ctx = event.context;
//     const mapSize = map.getSize();
//     const width = mapSize[0] * (swipe.value / 100);
//     const tl = getRenderPixel(event, [width, 0]);
//     const tr = getRenderPixel(event, [mapSize[0], 0]);
//     const bl = getRenderPixel(event, [width, mapSize[1]]);
//     const br = getRenderPixel(event, mapSize);

//     ctx.save();
//     ctx.beginPath();
//     ctx.moveTo(tl[0], tl[1]);
//     ctx.lineTo(bl[0], bl[1]);
//     ctx.lineTo(br[0], br[1]);
//     ctx.lineTo(tr[0], tr[1]);
//     ctx.closePath();
//     ctx.clip();
//   });

//   stateBoundary.on('postrender', function (event) {
//     const ctx = event.context;
//     ctx.restore();
//   });

//   swipe.addEventListener('input', function () {
//     map.render();
//   });
// //}



// function bindInputs(layerid, layer, i) {
//   const visibilityInput = $(layerid + ' input.visible');
//   visibilityInput.on('change', function () {
//     layer.setVisible(this.checked);
//   });
//   if(i===0){
//     visibilityInput.prop('checked', true);
//   }
//   else{
//     //layer.getVisible() retrurn true /false
//     visibilityInput.prop('checked', );
//   }


//   const opacityInput = $(layerid + ' input.opacity');
//   opacityInput.on('input', function () {
//     layer.setOpacity(parseFloat(this.value));
//   });
//   opacityInput.val(String(layer.getOpacity()));
// }
// function setup(id, group) {
//   group.getLayers().forEach(function (layer, i) {
//     const layerid = id + i;
//     bindInputs(layerid, layer,i);
//     if (layer instanceof LayerGroup) {
//       setup(layerid, layer);
//     }
//   });
// }
// setup('#layer', map.getLayerGroup());

///get map data on click

//get featured info by clicking on map

 map.on('singleclick',async function (evt) {
  if(localStorage.getItem("infoStatus")==="ON")
  {
      console.log(map);
      map.getTargetElement().classList.add('spinner');
      progress.show();
      document.getElementById('info').innerHTML = '';
      document.getElementById('info').innerHTML = "Clicked Mouse Location : " + evt.coordinate[0] + "," + evt.coordinate[1];
      // evt.pixel;
      console.log(evt.coordinate);

      const viewResolution = /** @type {number} */ (view.getResolution());
      //let url ='http://localhost:8880/geoserver/UAVDATA/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=application/json&TRANSPARENT=true&QUERY_LAYERS=UAVDATA:State_Boundary_Jhar0&STYLES&LAYERS=UAVDATA:State_Boundary_Jhar0&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=100&X=50&Y=50&SRS=EPSG%3A4326&WIDTH=101&HEIGHT=101&BBOX=84.40905768214726%2C22.985595336416733%2C85.51867682277226%2C24.095214477041733';
      
      document.getElementById('dataTableDiv').innerHTML = "";
      let tableString = "";
      //LayerArrList.forEach((lyr, i) => {
      for (var i = 0; i < LayerArrList.length; i++) {
        let lyrId = LayerArrList[i].split("_");
        //map.getLayers().array_[6].values_.layers.array_[0].sourceChangeKey_.target.params_.LAYERS;
        let lyrXX = map.getLayers().array_[6].values_.layers.array_[i];
        const url = lyrXX.getSource().getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          'EPSG:4326', {
            'INFO_FORMAT': 'application/json'
          }
        );
        if (url) {
          await fetch(url)
            .then((response) =>  response.text())
            .then( (html) => {
              let dataString = JSON.parse(html);
              if (dataString.features.length > 0) {
                let dataStringX = dataString.features[0].properties;
                let dataKeys = Object.keys(dataStringX);
                //let tableString="";
                if (dataKeys.length > 5) {
                  tableString += "<h4>" + lyrId[1].toUpperCase() + "</h4>"
                  tableString += "<table id='tableData' class='table table-sm table-bordered'>";
                  tableString += "<tr>";
                  for (var j = 0; j < dataKeys.length; j++) {
                    tableString += "<td>" + dataKeys[j].toUpperCase() + "</td>";
                  }
                  tableString += "</tr>";
                  for (var i = 0; i < dataString.features.length; i++) {
                    tableString += "<tr>";
                    for (let j = 0; j < dataKeys.length; j++) {
                      tableString += "<td>" + dataString.features[0].properties[dataKeys[j]] + "</td>";
                    }
                  }
                  tableString += "</tr>";
                  tableString += "</table>";
                }

                document.getElementById('dataTableDiv').innerHTML += tableString;
                $("#attrData").show();
                // map.getTargetElement().classList.remove('spinner');
                //progress.hide();
              }
              map.getTargetElement().classList.remove('spinner');
              progress.hide();
            });
        }
      }
  }

});

//lat long of pointer move on map
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const data = stateBoundary.getData(evt.pixel);
  const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
  //document.getElementById('info').innerHTML = evt.pixel;
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

console.log(LayerArrList);
// show layer options - show hide / opacity
$('#layertree li > span').click(function () {$(this).siblings('fieldset').toggle();  }).siblings('fieldset').hide();

//measurement code
function startMeasureFunc(){

let typeSelect = document.getElementById('type');
let showSegments = document.getElementById('segments');
let clearPrevious = document.getElementById('clear');

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

const labelStyle = new Style({
  text: new Text({
    font: '14px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
  }),
});

const tipStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
  text: new Text({
    text: 'Drag to modify',
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
});

const segmentStyles = [segmentStyle];

const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2';
  }
  return output;
};

// const raster = new TileLayer({
//   source: new OSM(),
// });

//const source = new VectorSource();

const modify = new Modify({source: source, style: modifyStyle});

let tipPoint;

function styleFunction(feature, segments, drawType, tip) {
  const styles = [style];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;
  if (!drawType || drawType === type) {
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }
  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }
  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }
  if (
    tip &&
    type === 'Point' &&
    !modify.getOverlay().getSource().getFeatures().length
  ) {
    tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }
  return styles;
}

// const vector = new VectorLayer({
//   source: source,
//   style: function (feature) {
//     return styleFunction(feature, showSegments.checked);
//   },
// });

// const map = new Map({
//   layers: [raster, vector],
//   target: 'map',
//   view: new View({
//     center: [-11000000, 4600000],
//     zoom: 15,
//   }),
// });
 
//map.addLayers([vector]);
map.addInteraction(modify);

let draw; // global so we can remove it later

function addInteraction() {
  const drawType = typeSelect.value;
  const activeTip =
    'Click to continue drawing the ' +
    (drawType === 'Polygon' ? 'polygon' : 'line');
  const idleTip = 'Click to start measuring';
  let tip = idleTip;
  draw = new Draw({
    source: source,
    type: drawType,
    style: function (feature) {
      return styleFunction(feature, showSegments.checked, drawType, tip);
    },
  });
  draw.on('drawstart', function () {
    if (clearPrevious.checked) {
      source.clear();
    }
    modify.setActive(false);
    tip = activeTip;
  });
  draw.on('drawend', function () {
    modifyStyle.setGeometry(tipPoint);
    modify.setActive(true);
    map.once('pointermove', function () {
      modifyStyle.setGeometry();
    });
    tip = idleTip;
  });
  modify.setActive(true);
  map.addInteraction(draw);
}

typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
};

addInteraction();

showSegments.onchange = function () {
  vector.changed();
  draw.getOverlay().changed();
};
}
if($("#startMeasrBtn").length){
  document.getElementById("startMeasrBtn").onclick = function() {
    alert("dfsssdfsd")
    startMeasureFunc()
     }
}

// if(document.getElementById("startMeasrBtn").length){
//   document.getElementById("startMeasrBtn").onclick = function() {
//     alert("dfsssdfsd")
//      };
// }
//startMeasureFunc()
//measurement 
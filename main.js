import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';
import OSM from 'ol/source/OSM';
//import Map from 'ol/Map.js';
//import OSM from 'ol/source/OSM.js';
import TileJSON from 'ol/source/TileJSON.js';
//import View from 'ol/View.js';
import {Group as LayerGroup} from 'ol/layer.js';
import { addCoordinateTransforms,  addProjection,  transform,fromLonLat} from 'ol/proj.js';
import Stamen from 'ol/source/Stamen.js';
import BingMaps from 'ol/source/BingMaps.js';
import {Control,ScaleLine, defaults as defaultControls} from 'ol/control.js';
import {getRenderPixel} from 'ol/render.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
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
const stateBoundary =new TileLayer({
  //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
  source: new TileWMS({
    url: 'http://localhost:8880/geoserver/UAVDATA/wms',
    params: {'LAYERS': 'UAVDATA:State_Boundary_Jhar0', 'TILED': true},
    serverType: 'geoserver',
    // Countries have transparency, so do not fade tiles:
    //transition: 0,
  }),
  visible: true,
 // preload: Infinity,
})

const view = new View({
  projection: 'EPSG:4326',
  center: [85.23, 23.81566],
  //center: fromLonLat([85.23, 23.81566]),
  //center: transform([85.23, 23.81566], 'EPSG:4326', 'EPSG:4326'),
  zoom: 7,
  //rotation: 1,
});

const map = new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'metric',
    }),
    mousePositionControl
  ]),
 // controls: defaultControls().extend([new RotateNorthControl()]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      source: new OSM({
        'url':'http://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url':'http://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url':'http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      }),
      visible: false,
      preload: Infinity,
    }),
    new TileLayer({
      source: new OSM({
        'url':'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
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
      new TileLayer({
        //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
        source: new TileWMS({
          url: 'http://localhost:8880/geoserver/UAVDATA/wms',
          params: {'LAYERS': 'UAVDATA:District_Boundary_Jharkhand', 'TILED': true},
          serverType: 'geoserver', 
        }),
        visible: false, 
      }),
       
    ],
  }),
  // for layer groups:
     // for Stamen layer groups: 
    new LayerGroup({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: 'watercolor',
          }),visible: false,
          name: 'watercolor',
        }),
        new TileLayer({
          source: new Stamen({
            layer: 'terrain-labels',
          }),visible: false,
          name: 'terrain',
        }), 
      ],
    }),
    // for layer groups: 
  ],
  target: 'map',
  view:view,
  

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
 

function bindInputs(layerid, layer) {
  var visibilityInput = $(layerid + ' input.visible');
  visibilityInput.on('change', function() {
    layer.setVisible(this.checked);
  });
  visibilityInput.prop('checked', layer.getVisible());

  var opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input change', function() {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}
map.getLayers().forEach(function(layer, i) {
  bindInputs('#layer' + i, layer);
  if (layer instanceof LayerGroup) {
    layer.getLayers().forEach(function(sublayer, j) {
      bindInputs('#layer' + i + j, sublayer);
    });
  }
});
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

map.on('singleclick', function (evt) {
  document.getElementById('info').innerHTML = '';
  document.getElementById('info').innerHTML = evt.pixel;
  const viewResolution = /** @type {number} */ (view.getResolution());
  const url = stateBoundary.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:4326',
    {'INFO_FORMAT': 'text/html'}
  );
  if (url) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById('info').innerHTML = html;
      });
  }
});
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  const data = stateBoundary.getData(evt.pixel);
  const hit = data && data[3] > 0; // transparent pixels have zero for data[3]
  //document.getElementById('info').innerHTML = evt.pixel;
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});



$('#layertree li > span')
  .click(function () {
    $(this).siblings('fieldset').toggle();
  })
  .siblings('fieldset')
  .hide();

  
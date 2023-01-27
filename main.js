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
import {fromLonLat} from 'ol/proj.js';
import Stamen from 'ol/source/Stamen.js';
import BingMaps from 'ol/source/BingMaps.js';
import {Control, defaults as defaultControls} from 'ol/control.js';


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
 
const map = new Map({
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
      new TileLayer({
        //extent: [84.64499493941553, 23.364668102080785,87.31799167318536, 24.532780056064038],
        source: new TileWMS({
          url: 'http://localhost:8880/geoserver/UAVDATA/wms',
          params: {'LAYERS': 'UAVDATA:State_Boundary_Jhar0', 'TILED': true},
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          //transition: 0,
        }),
        visible: false,
       // preload: Infinity,
      }),
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
  view: new View({
    center: fromLonLat([85.23, 23.81566]),
    zoom: 8,
    //rotation: 1,
  }),
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

$('#layertree li > span')
  .click(function () {
    $(this).siblings('fieldset').toggle();
  })
  .siblings('fieldset')
  .hide();

  
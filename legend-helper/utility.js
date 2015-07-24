/**
 * 
 * @author {@link:https://github.com/btfou Ben Fousek}
 * @see {@link:https://github.com/WSDOT-GIS/arcgis-js-layer-list/issues/5#issuecomment-123047108}
 */

/**
 * Ben Fousek: Saw your link to this in the TOC discussion on GeoNet. 
 * Here's a little utility class I use for making simple legends for various widgets. 
 * Creating surface nodes from symbols is in _createVectorLegend method. 
 * Probably should have another method just to create and return surface node.
 */

define([
  'put-selector/put',
  'dojo/_base/array',
  'dojo/_base/lang',
  'dojo/has',
  'dojox/gfx',
  'esri/request'
], function (
  put,
  array,
  lang,
  has,
  gfx,
  esriRequest
) {
    'use strict';
    return {
        // makes a request for legend json and returns the esri/request deferred
        // note: does not work for FeatureLayer - use layer's renderer to create svg(s) on client
        // note: does not support AGS < 10.1
        // @param layer {Object} api layer
        getLegendJson: function (layer) {
            return esriRequest({
                url: layer.url + '/legend',
                callbackParamName: 'callback',
                content: {
                    f: 'json',
                    token: (typeof layer._getToken === 'function') ? layer._getToken() : null
                }
            });
        },

        // creates a legend and returns as a div dom node
        // @param layer {Object} api layer
        // @param className {String} optional class name for div
        // @param layerIds {Array} array of layerIds to include in legend otherwise includes all
        createLegend: function (layer, className, layerIds) {
            var div = put((className) ? 'div.' + className : 'div');
            layerIds = layerIds || false;
            if (layer.graphics) {
                var symbol = layer.renderer.symbol,
                  infos = layer.renderer.infos;
                if (symbol) {
                    this._createVectorLegend([{
                        symbol: symbol,
                        description: '',
                        label: '',
                        value: ''
                    }], layer, div);
                } else if (infos) {
                    this._createVectorLegend(infos, layer, div);
                } else {
                    put(div, 'span.legend-error', 'No legend');
                }
            } else {
                this._createJsonLegend(layer, div, layerIds);
            }
            return div;
        },

        ///////////////////////////////////////////////////
        // make legend json request and handle result/error
        ///////////////////////////////////////////////////
        _createJsonLegend: function (layer, div, layerIds) {
            this.getLegendJson(layer).then(
              lang.hitch(this, '_createJsonLegendResult', div, layer, layerIds),
              lang.hitch(this, '_createJsonLegendError', div)
            );
        },
        _createJsonLegendResult: function (div, layer, layerIds, result) {
            var table = put(div, 'table.legend-table');
            array.forEach(result.layers, function (legendLayer) {
                if (layerIds && array.indexOf(layerIds, legendLayer.layerId) === -1) {
                    return;
                }

                if (legendLayer.legend.length === 1) {
                    var tr = put(table, 'tr'),
                      imgtd = put(tr, 'td.legend-image');
                    put(imgtd, this._createImage(legendLayer.legend[0], legendLayer.layerId, layer));
                    put(tr, 'td.legend-label', legendLayer.layerName);
                } else {
                    put(table, 'tr td.legend-heading[colspan=2]', legendLayer.layerName);
                    array.forEach(legendLayer.legend, function (legend) {
                        var tr = put(table, 'tr'),
                          imgtd = put(tr, 'td.legend-image');
                        put(imgtd, this._createImage(legend, legendLayer.layerId, layer));
                        put(tr, 'td.legend-label', legend.label);
                    }, this);
                }
            }, this);
        },
        _createJsonLegendError: function (div /*, error*/) {
            put(div, 'span.legend-error', 'Legend error');
        },
        // create a image from json and return img node
        _createImage: function (legend, layerId, layer) {
            var img, src = legend.url;
            if ((!has('ie') || has('ie') >= 9) && legend.imageData && legend.imageData.length > 0) {
                src = 'data:image/png;base64,' + legend.imageData;
            } else if (legend.url.indexOf('http') !== 0) {
                src = layer.url + '/' + layerId + '/images/' + legend.url;
                var token = layer._getToken();
                if (token) {
                    src += '?token=' + token;
                }
            }
            img = put('img.' + layer.id + '-' + layerId + '-legend-image', {
                src: src,
                width: legend.width,
                height: legend.height
            });
            img.style.opacity = layer.opacity;
            layer.on('opacity-change', function (opacity) {
                img.style.opacity = opacity;
            });
            return img;
        },

        /////////////////////////////////////////////
        // create legend from graphics layer renderer
        /////////////////////////////////////////////
        _defaultSurfaceDims: [20, 20],
        _createVectorLegend: function (infos, layer, div) {
            var table = put(div, 'table.legend-table');
            array.forEach(infos, function (info) {
                var sym = info.symbol,
                  descriptor = sym.getShapeDescriptors(),
                  ds = descriptor.defaultShape,
                  fill = descriptor.fill,
                  stroke = descriptor.stroke,
                  tr = put(table, 'tr'),
                  symtd = put(tr, 'td.legend-image');
                put(tr, 'td.legend-label', info.label || '');
                if (!ds.src) {
                    var w = this._defaultSurfaceDims[0],
                      h = this._defaultSurfaceDims[1];
                    if (sym.width && sym.height) {
                        w = sym.width;
                        h = sym.height;
                    }
                    var surfaceNode = put(symtd, 'span.' + layer.id + '-legend-image[style=width' + w + 'px;height:' + h + 'px;display:inline-block;]');
                    var surface = gfx.createSurface(surfaceNode, w, h);
                    var shape = surface.createShape(ds);
                    if (fill) {
                        shape.setFill(fill);
                    }
                    if (stroke) {
                        shape.setStroke(stroke);
                    }
                    shape.applyTransform({
                        dx: w / 2,
                        dy: h / 2
                    });
                } else {
                    put(symtd, 'img.' + layer.id + '-legend-image', {
                        src: ds.src,
                        width: sym.width,
                        height: sym.height
                    });
                }
                // set opacity of td
                //  it works but is there a better way?
                symtd.style.opacity = layer.opacity;
                layer.on('opacity-change', function (opacity) {
                    symtd.style.opacity = opacity;
                });
            }, this);
        }
    };
});
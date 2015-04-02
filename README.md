Layer List for ArcGIS API for JavaScript
=======================================

Provides a layer list UI control for a map.


## CSS ##

### `.layer-list` ###

This class is applied to the layer list's root `<ul>` element.

### `.layer-label` ###

A layer's label will have this class.

### `.control-container` ###

This is for styling the per-layer controls' container, which contains opacity and sublayer controls.

### `.sublayer-list` ###

List of a layer's sublayers will have this class.

### `opacity-slider` ###

The `<input type='range'>` element that controls a layer's opacity will have this class.


### `.badge` ###

The `badge` classes use the `:before` pseudo-class.

#### `.badge-supports-dynamic-layers` ####

A badge that is used to indicate a layer supports the `dynamicLayers` capability introduced at ArcGIS Server 10.3.

#### layer type badges ####

* `layer-type-arcgis-feature-layer`
* `layer-type-arcgis-map-service-layer`
* `layer-type-arcgis-tiled-map-service-layer`

### `.toggle-closed` ###

Clicking a layer's label will add or remove this class from the corresponding layer's list item element. This is used to hide layer's controls.

```css
.toggle-closed .control-container {
    display: none;
}
```

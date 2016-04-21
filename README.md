Layer List for ArcGIS API for JavaScript
=======================================

Provides a layer list UI control for a map.

## Demo ##

Demo: http://wsdot-gis.github.io/arcgis-js-layer-list/demo

### `webmap` parameter ###

You can try the demo a webmap from ArcGIS online by adding the `webmap` query string parameter.

#### Example ####

http://wsdot-gis.github.io/arcgis-js-layer-list/demo?webmap=927b5daaa7f4434db4b312364489544d

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

API
---
## Modules

<dl>
<dt><a href="#module_badgeUtils">badgeUtils</a></dt>
<dd></dd>
<dt><a href="#module_LayerList">LayerList</a></dt>
<dd></dd>
<dt><a href="#module_LayerOptionsDialog">LayerOptionsDialog</a></dt>
<dd></dd>
<dt><a href="#module_miscUtils">miscUtils</a></dt>
<dd></dd>
<dt><a href="#module_SublayerList">SublayerList</a></dt>
<dd></dd>
<dt><a href="#module_LegendHelper">LegendHelper</a></dt>
<dd></dd>
<dt><a href="#module_LegendItem">LegendItem</a></dt>
<dd></dd>
<dt><a href="#module_LegendLayer">LegendLayer</a></dt>
<dd></dd>
<dt><a href="#module_LegendResponse">LegendResponse</a></dt>
<dd></dd>
</dl>

## External

<dl>
<dt><a href="#external_OperationalLayer">OperationalLayer</a> : <code>Object</code></dt>
<dd><p>Represents an operation layer in a web map.</p>
</dd>
</dl>

<a name="module_badgeUtils"></a>

## badgeUtils

* [badgeUtils](#module_badgeUtils)
    * [.createBadge(...classNames)](#module_badgeUtils.createBadge) ⇒ <code>HTMLSpanElement</code>
    * [.createLayerTypeClass(layerType)](#module_badgeUtils.createLayerTypeClass) ⇒ <code>string</code>
    * [.createLayerTypeBadge(layerType)](#module_badgeUtils.createLayerTypeBadge) ⇒ <code>HTMLSpanElement</code>

<a name="module_badgeUtils.createBadge"></a>

### badgeUtils.createBadge(...classNames) ⇒ <code>HTMLSpanElement</code>
Creates an HTML span with classes applied.

**Kind**: static method of <code>[badgeUtils](#module_badgeUtils)</code>  
**Returns**: <code>HTMLSpanElement</code> - Returns the HTML span element that can be styled into a badge.  

| Param | Type | Description |
| --- | --- | --- |
| ...classNames | <code>string</code> | One or more class names to be added to the span. |

<a name="module_badgeUtils.createLayerTypeClass"></a>

### badgeUtils.createLayerTypeClass(layerType) ⇒ <code>string</code>
Creates a CSS class name based on a operationalLayers elements' layerType value.

**Kind**: static method of <code>[badgeUtils](#module_badgeUtils)</code>  
**Returns**: <code>string</code> - A string that can be used as a CSS class name.  

| Param | Type | Description |
| --- | --- | --- |
| layerType | <code>string</code> | The layer type's name |

<a name="module_badgeUtils.createLayerTypeBadge"></a>

### badgeUtils.createLayerTypeBadge(layerType) ⇒ <code>HTMLSpanElement</code>
Creates a span element with a layer type class and "badge" class.

**Kind**: static method of <code>[badgeUtils](#module_badgeUtils)</code>  
**Returns**: <code>HTMLSpanElement</code> - An HTML span element that can be transformed into a badge via CSS.  

| Param | Type | Description |
| --- | --- | --- |
| layerType | <code>string</code> | Layer type name |

<a name="module_LayerList"></a>

## LayerList

* [LayerList](#module_LayerList)
    * [LayerList](#exp_module_LayerList--LayerList) ⏏
        * [new LayerList(operationalLayers, domNode)](#new_module_LayerList--LayerList_new)
        * _instance_
            * [.setScale(scale)](#module_LayerList--LayerList+setScale)
        * _inner_
            * [~root](#module_LayerList--LayerList..root) : <code>external:HTMLUListElement</code> &#124; <code>external:HTMLOListElement</code>
            * [~dialog](#module_LayerList--LayerList..dialog) : <code>external:HTMLDialogElement</code>

<a name="exp_module_LayerList--LayerList"></a>

### LayerList ⏏
**Kind**: Exported class  
<a name="new_module_LayerList--LayerList_new"></a>

#### new LayerList(operationalLayers, domNode)

| Param | Type | Description |
| --- | --- | --- |
| operationalLayers | <code>Array.&lt;external:OperationLayer&gt;</code> | An array of operational layers. |
| domNode | <code>external:HTMLUListElement</code> &#124; <code>external:HTMLOListElement</code> | The root DOM node: either an UL or OL. |

<a name="module_LayerList--LayerList+setScale"></a>

#### layerList.setScale(scale)
Call this function to update the out-of-scale classes
on layers.

**Kind**: instance method of <code>[LayerList](#exp_module_LayerList--LayerList)</code>  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>number</code> | The new scale |

**Example**  
```js
// map is an esri/Map object.
map.on("zoom-end", function () {
    // Update layer list items to show if they are not visible due to zoom scale.
    layerList.setScale(map.getScale());
});
```
<a name="module_LayerList--LayerList..root"></a>

#### LayerList~root : <code>external:HTMLUListElement</code> &#124; <code>external:HTMLOListElement</code>
**Kind**: inner property of <code>[LayerList](#exp_module_LayerList--LayerList)</code>  
<a name="module_LayerList--LayerList..dialog"></a>

#### LayerList~dialog : <code>external:HTMLDialogElement</code>
**Kind**: inner property of <code>[LayerList](#exp_module_LayerList--LayerList)</code>  
<a name="module_LayerOptionsDialog"></a>

## LayerOptionsDialog

* [LayerOptionsDialog](#module_LayerOptionsDialog)
    * [.createLayerOptionsDialog()](#module_LayerOptionsDialog.createLayerOptionsDialog) ⇒ <code>HTMLDialogElement</code>
    * [.showLayerOptionsDialog(opLayer)](#module_LayerOptionsDialog.showLayerOptionsDialog) ⇒ <code>HTMLDialogElement</code>

<a name="module_LayerOptionsDialog.createLayerOptionsDialog"></a>

### LayerOptionsDialog.createLayerOptionsDialog() ⇒ <code>HTMLDialogElement</code>
Creates the layer options dialog.
The layer list will use a single dialog for the options of all layers.
The controls and contents will be updated when called for a layer.

**Kind**: static method of <code>[LayerOptionsDialog](#module_LayerOptionsDialog)</code>  
**Returns**: <code>HTMLDialogElement</code> - Returns a dialog that the user can use to set layer options.  
<a name="module_LayerOptionsDialog.showLayerOptionsDialog"></a>

### LayerOptionsDialog.showLayerOptionsDialog(opLayer) ⇒ <code>HTMLDialogElement</code>
Shows the layer options dialog with options for the specified layer.

**Kind**: static method of <code>[LayerOptionsDialog](#module_LayerOptionsDialog)</code>  
**Returns**: <code>HTMLDialogElement</code> - The layer options dialog for the input operational layer.  

| Param | Type | Description |
| --- | --- | --- |
| opLayer | <code>OperationalLayer</code> | An operational layer |

<a name="module_miscUtils"></a>

## miscUtils

* [miscUtils](#module_miscUtils)
    * [~arrayContains(array, value)](#module_miscUtils..arrayContains) ⇒ <code>Boolean</code>
    * [~parseIntList(s)](#module_miscUtils..parseIntList) ⇒ <code>Array.&lt;number&gt;</code>
    * [~splitWords(s, [re])](#module_miscUtils..splitWords) ⇒ <code>Array.&lt;string&gt;</code>

<a name="module_miscUtils..arrayContains"></a>

### miscUtils~arrayContains(array, value) ⇒ <code>Boolean</code>
Determines if an array contains a given value.

**Kind**: inner method of <code>[miscUtils](#module_miscUtils)</code>  
**Returns**: <code>Boolean</code> - Returns true if the array contains the given value, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | An array to be searched. |
| value | <code>\*</code> | The value to search for in the array. |

<a name="module_miscUtils..parseIntList"></a>

### miscUtils~parseIntList(s) ⇒ <code>Array.&lt;number&gt;</code>
Parses a string containing comma-separated
integer values into an array of integers.

**Kind**: inner method of <code>[miscUtils](#module_miscUtils)</code>  
**Returns**: <code>Array.&lt;number&gt;</code> - Returns the integers listed in the input string as an array of numbers.  

| Param | Type | Description |
| --- | --- | --- |
| s | <code>string</code> | A string containing a comma-separated list of integers. |

<a name="module_miscUtils..splitWords"></a>

### miscUtils~splitWords(s, [re]) ⇒ <code>Array.&lt;string&gt;</code>
Splits a camel-case or Pascal-case variable name into individual words.

**Kind**: inner method of <code>[miscUtils](#module_miscUtils)</code>  
**Returns**: <code>Array.&lt;string&gt;</code> - The input string, split into different parts.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| s | <code>string</code> |  | A camel-case or Pascal-case string. |
| [re] | <code>RegExp</code> | <code>/([A-Za-z]?)([a-z]+)/g</code> | Regular expression used for detecting the start of a new word. |

<a name="module_SublayerList"></a>

## SublayerList

* [SublayerList](#module_SublayerList)
    * [SublayerList](#exp_module_SublayerList--SublayerList) ⏏
        * [new SublayerList(layer)](#new_module_SublayerList--SublayerList_new)
        * [~root](#module_SublayerList--SublayerList..root) : <code>HTMLUListElement</code>
        * [~createSublayerListItem(layerInfo)](#module_SublayerList--SublayerList..createSublayerListItem) ⇒ <code>HTMLLIElement</code>

<a name="exp_module_SublayerList--SublayerList"></a>

### SublayerList ⏏
**Kind**: Exported class  
<a name="new_module_SublayerList--SublayerList_new"></a>

#### new SublayerList(layer)
A list of a map service's sublayers.


| Param | Type | Description |
| --- | --- | --- |
| layer | <code>esri/layers/Layer</code> | A layer. |

<a name="module_SublayerList--SublayerList..root"></a>

#### SublayerList~root : <code>HTMLUListElement</code>
**Kind**: inner property of <code>[SublayerList](#exp_module_SublayerList--SublayerList)</code>  
<a name="module_SublayerList--SublayerList..createSublayerListItem"></a>

#### SublayerList~createSublayerListItem(layerInfo) ⇒ <code>HTMLLIElement</code>
Creates a sublayer list item representing a layer info.

**Kind**: inner method of <code>[SublayerList](#exp_module_SublayerList--SublayerList)</code>  
**Returns**: <code>HTMLLIElement</code> - A sublayer list item representing the input layer info object.  

| Param | Type | Description |
| --- | --- | --- |
| layerInfo | <code>esri/layers/LayerInfo</code> | A LayerInfo object. |

<a name="module_LegendHelper"></a>

## LegendHelper
<a name="module_LegendHelper..getLegendInfo"></a>

### LegendHelper~getLegendInfo(mapServiceUrl, [dynamicLayers]) ⇒ <code>Promise</code>
Gets legend info for a map service.

**Kind**: inner method of <code>[LegendHelper](#module_LegendHelper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| mapServiceUrl | <code>string</code> &#124; <code>esri/layers/layer</code> | Either the URL of a map service or a Layer class from the ArcGIS API for JavaScript. |
| [dynamicLayers] | <code>Array.&lt;Object&gt;</code> | Dynamic layer definitions. |

<a name="module_LegendItem"></a>

## LegendItem

* [LegendItem](#module_LegendItem)
    * [LegendItem](#exp_module_LegendItem--LegendItem) ⏏
        * [new LegendItem(json)](#new_module_LegendItem--LegendItem_new)
        * [.label](#module_LegendItem--LegendItem+label) : <code>string</code>
        * [.url](#module_LegendItem--LegendItem+url) : <code>string</code>
        * [.imageData](#module_LegendItem--LegendItem+imageData) : <code>string</code>
        * [.contentType](#module_LegendItem--LegendItem+contentType) : <code>string</code>
        * [.height](#module_LegendItem--LegendItem+height) : <code>number</code>
        * [.width](#module_LegendItem--LegendItem+width) : <code>number</code>
        * [.values](#module_LegendItem--LegendItem+values) : <code>Array.&lt;number&gt;</code>
        * [.getDataUrl()](#module_LegendItem--LegendItem+getDataUrl) ⇒ <code>string</code>
        * [.toHtmlTableRow()](#module_LegendItem--LegendItem+toHtmlTableRow) ⇒ <code>HTMLTableRowElement</code>

<a name="exp_module_LegendItem--LegendItem"></a>

### LegendItem ⏏
**Kind**: Exported class  
<a name="new_module_LegendItem--LegendItem_new"></a>

#### new LegendItem(json)
Represents an item in a layer's legend.


| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | Initializes member values. |

<a name="module_LegendItem--LegendItem+label"></a>

#### legendItem.label : <code>string</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+url"></a>

#### legendItem.url : <code>string</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+imageData"></a>

#### legendItem.imageData : <code>string</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+contentType"></a>

#### legendItem.contentType : <code>string</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+height"></a>

#### legendItem.height : <code>number</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+width"></a>

#### legendItem.width : <code>number</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+values"></a>

#### legendItem.values : <code>Array.&lt;number&gt;</code>
**Kind**: instance property of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendItem--LegendItem+getDataUrl"></a>

#### legendItem.getDataUrl() ⇒ <code>string</code>
Returns a data URL for the legend item's image.

**Kind**: instance method of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
**Returns**: <code>string</code> - Data URL of an image.  
<a name="module_LegendItem--LegendItem+toHtmlTableRow"></a>

#### legendItem.toHtmlTableRow() ⇒ <code>HTMLTableRowElement</code>
Creates a table row representation of a legend item.

**Kind**: instance method of <code>[LegendItem](#exp_module_LegendItem--LegendItem)</code>  
<a name="module_LegendLayer"></a>

## LegendLayer

* [LegendLayer](#module_LegendLayer)
    * [LegendLayer](#exp_module_LegendLayer--LegendLayer) ⏏
        * [new LegendLayer(json)](#new_module_LegendLayer--LegendLayer_new)
        * [.layerId](#module_LegendLayer--LegendLayer+layerId) : <code>number</code>
        * [.layerName](#module_LegendLayer--LegendLayer+layerName) : <code>string</code>
        * [.layerType](#module_LegendLayer--LegendLayer+layerType) : <code>string</code>
        * [.minScale](#module_LegendLayer--LegendLayer+minScale) : <code>number</code>
        * [.maxScale](#module_LegendLayer--LegendLayer+maxScale) : <code>number</code>
        * [.legend](#module_LegendLayer--LegendLayer+legend) : <code>Array.&lt;LegendItem&gt;</code>
        * [.createHtmlTable()](#module_LegendLayer--LegendLayer+createHtmlTable) ⇒ <code>HTMLTableElement</code>

<a name="exp_module_LegendLayer--LegendLayer"></a>

### LegendLayer ⏏
**Kind**: Exported class  
<a name="new_module_LegendLayer--LegendLayer_new"></a>

#### new LegendLayer(json)
Represents a layer of a map service.


| Param | Type | Description |
| --- | --- | --- |
| json | <code>Object</code> | Corresponds to members to initialize their values. |

<a name="module_LegendLayer--LegendLayer+layerId"></a>

#### legendLayer.layerId : <code>number</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+layerName"></a>

#### legendLayer.layerName : <code>string</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+layerType"></a>

#### legendLayer.layerType : <code>string</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+minScale"></a>

#### legendLayer.minScale : <code>number</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+maxScale"></a>

#### legendLayer.maxScale : <code>number</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+legend"></a>

#### legendLayer.legend : <code>Array.&lt;LegendItem&gt;</code>
**Kind**: instance property of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendLayer--LegendLayer+createHtmlTable"></a>

#### legendLayer.createHtmlTable() ⇒ <code>HTMLTableElement</code>
Creates an HTML table for a legend layer.

**Kind**: instance method of <code>[LegendLayer](#exp_module_LegendLayer--LegendLayer)</code>  
<a name="module_LegendResponse"></a>

## LegendResponse

* [LegendResponse](#module_LegendResponse)
    * [LegendResponse](#exp_module_LegendResponse--LegendResponse) ⏏
        * [new LegendResponse(json)](#new_module_LegendResponse--LegendResponse_new)
        * _instance_
            * [.layers](#module_LegendResponse--LegendResponse+layers) : <code>Array.&lt;LegendLayer&gt;</code>
            * [.createHtmlTables()](#module_LegendResponse--LegendResponse+createHtmlTables) ⇒ <code>Array.&lt;HTMLTableElement&gt;</code>
        * _static_
            * [.parseJson(jsonString)](#module_LegendResponse--LegendResponse.parseJson) ⇒ <code>LegendResponse</code>

<a name="exp_module_LegendResponse--LegendResponse"></a>

### LegendResponse ⏏
**Kind**: Exported class  
<a name="new_module_LegendResponse--LegendResponse_new"></a>

#### new LegendResponse(json)
The top level of a response for a Legend request.


| Param | Type |
| --- | --- |
| json | <code>Object</code> | 
| json.layers | <code>Array.&lt;LegendLayer&gt;</code> | 

<a name="module_LegendResponse--LegendResponse+layers"></a>

#### legendResponse.layers : <code>Array.&lt;LegendLayer&gt;</code>
**Kind**: instance property of <code>[LegendResponse](#exp_module_LegendResponse--LegendResponse)</code>  
<a name="module_LegendResponse--LegendResponse+createHtmlTables"></a>

#### legendResponse.createHtmlTables() ⇒ <code>Array.&lt;HTMLTableElement&gt;</code>
Creates an array of HTML tables with a layer's legend.
Array ordinals correspond to layer IDs.
Some elements may be undefined if there is no corresponding layer.

**Kind**: instance method of <code>[LegendResponse](#exp_module_LegendResponse--LegendResponse)</code>  
<a name="module_LegendResponse--LegendResponse.parseJson"></a>

#### LegendResponse.parseJson(jsonString) ⇒ <code>LegendResponse</code>
Parses legend response text into a LegendResponse object.

**Kind**: static method of <code>[LegendResponse](#exp_module_LegendResponse--LegendResponse)</code>  

| Param | Type | Description |
| --- | --- | --- |
| jsonString | <code>string</code> | Response from a map service legend request. |

<a name="external_OperationalLayer"></a>

## OperationalLayer : <code>Object</code>
Represents an operation layer in a web map.

**Kind**: global external  
**See**: [ArcGIS REST API: operationalLayer](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/operationalLayer/02r300000049000000/)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID that will be given to the layer when added to a map. |
| layerType | <code>string</code> | The type of layer. |
| url | <code>string</code> |  |
| visibility | <code>Boolean</code> |  |
| opacity | <code>Number</code> |  |
| title | <code>string</code> |  |
| itemId | <code>string</code> | ArcGIS Online item id |
| minScale | <code>Number</code> |  |
| maxScale | <code>Number</code> |  |


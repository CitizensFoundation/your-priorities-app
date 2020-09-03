# lit-google-map

This project is port of [google-map](https://www.webcomponents.org/element/GoogleWebComponents/google-map) webcomponent based on [LitElement](https://lit-element.polymer-project.org/) library.

## Table of contents

[How to use](#How-to-use)

[How to build](#How-to-build)

[Map element attributes](#Map-element-attributes)

[Marker element attributes](#Marker-element-attributes)

[License](#License)

## How to use

Include lit-google-map bundle in HTML file:

```html
<script src="lit-google-map.bundle.js"></script>
```

or its minified version:

```html
<script src="lit-google-map.bundle.min.js"></script>
```

Use component in any place you want (remember to fill in Google Maps API key):

```html
<lit-google-map api-key="YOUR_GOOGLE_MAPS_API_KEY">    
</lit-google-map>
```

You can also include any number of map markers:

```html
<lit-google-map api-key="YOUR_GOOGLE_MAPS_API_KEY">
    <lit-google-map-marker slot="markers" latitude="49.4404582" longitude="20.2700361">
    </lit-google-map-marker>  
    <lit-google-map-marker slot="markers" latitude="50.797444" longitude="20.4600623">
    </lit-google-map-marker>
</lit-google-map>
```

## How to build

Before build install all required packages:

```
npm install
```

Bare build:

```
npm run build
```

Build with bundle step:

```
npm run bundle
```

## Map element attributes

* '*api-key*' - Google map API key
* '*version*' - Google map js script version to load (default: '3.39')
* '*styles*' - Map styles in json format
* '*zoom*' - Zoom level (default: '8')
* '*fit-to-markers*' - Fit map area to display all markers
* '*map-type*' - Map type to display: 'roadmap', 'satellite', 'hybrid', 'terrain'
* '*center-latitude*'- Latitude of map initial center point
* '*center-longitude*' - Longitude of map initial center point

Example:

```html
<lit-google-map api-key="SOME_API_KEY" zoom="6" map-type="satellite" center-latitude="51.8436554" center-longitude="19.5070867">    
</lit-google-map>
```

## Marker element attributes

* '*latitude*' - Marker latitude position
* '*longitude*' - Marker longitude position
* '*label*' - Marker label
* '*z-index*' - Marker z index

Example:

```html
<lit-google-map-marker slot="markers" latitude="49.4404582" longitude="20.2700361">
</lit-google-map-marker>
```

Markers can also have associated InfoWindow with html content:

```html
<lit-google-map-marker slot="markers" latitude="50.797444" longitude="20.4600623">
    <p>Some description</p>
    <img src="some_image.jpg" alt="some image">
</lit-google-map-marker>
```

## License

MIT
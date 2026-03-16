# Mapbox: Runtime Patterns (GL JS)

Comprehensive patterns for implementing Mapbox GL JS at runtime, covering map lifecycle, events, user interactions, sources, markers, and popups.

---

## Map Lifecycle & Initialization

### Basic Map Setup

```typescript
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN!;

const map = new mapboxgl.Map({
  container: 'map', // HTML element ID
  style: 'mapbox://styles/username/style-id',
  center: [-74.5, 40], // [lng, lat]
  zoom: 9,
  pitch: 45,
  bearing: -17.6,
  
  // Performance options
  antialias: false, // Enable for better 3D rendering (slower)
  maxTileCacheSize: null, // Auto-managed tile cache
  
  // Interaction options
  interactive: true,
  cooperativeGestures: false, // Require ctrl/cmd for scroll zoom
  
  // Attribution
  attributionControl: true,
  customAttribution: 'Custom attribution text'
});
```

### Map Events

**Lifecycle events:**
```typescript
map.on('load', () => {
  // Style loaded, safe to add sources/layers
});

map.on('idle', () => {
  // Map finished loading/rendering, tiles loaded
});

map.on('error', (e) => {
  // Handle map errors
  console.error('Map error:', e.error);
});

map.on('remove', () => {
  // Map removed from DOM
});
```

**Movement events:**
```typescript
map.on('movestart', () => { /* Camera started moving */ });
map.on('move', () => { /* Camera moving */ });
map.on('moveend', () => { /* Camera finished moving */ });

map.on('zoomstart', () => { /* Zoom started */ });
map.on('zoom', () => { /* Zooming */ });
map.on('zoomend', () => { /* Zoom finished */ });

map.on('rotatestart', () => { /* Rotation started */ });
map.on('rotate', () => { /* Rotating */ });
map.on('rotateend', () => { /* Rotation finished */ });

map.on('pitchstart', () => { /* Pitch started */ });
map.on('pitch', () => { /* Pitching */ });
map.on('pitchend', () => { /* Pitch finished */ });
```

**Data events:**
```typescript
map.on('data', (e) => {
  if (e.dataType === 'source' && e.isSourceLoaded) {
    // Source data loaded
  }
});

map.on('styledata', () => {
  // Style data changed
});

map.on('sourcedata', (e) => {
  console.log('Source:', e.sourceId, 'Type:', e.sourceDataType);
});
```

---

## Camera & Navigation

### Jump to Location (No Animation)

```typescript
map.jumpTo({
  center: [-74.5, 40],
  zoom: 12,
  pitch: 60,
  bearing: -20
});
```

### Ease to Location (Smooth Animation)

```typescript
map.easeTo({
  center: [-74.5, 40],
  zoom: 12,
  pitch: 60,
  bearing: -20,
  duration: 2000, // ms
  easing: (t) => t, // Linear easing function
  essential: true // Not affected by prefers-reduced-motion
});
```

### Fly to Location (Arc Animation)

```typescript
map.flyTo({
  center: [-74.5, 40],
  zoom: 12,
  speed: 1.2, // Speed multiplier
  curve: 1.42, // Zoom curve
  easing: (t) => t,
  essential: false
});
```

### Fit to Bounds

```typescript
const bounds = [
  [-74.6, 40.0], // Southwest [lng, lat]
  [-74.4, 40.2]  // Northeast [lng, lat]
];

map.fitBounds(bounds, {
  padding: 50, // Uniform padding
  // Or individual padding
  padding: { top: 10, bottom: 25, left: 15, right: 5 },
  
  maxZoom: 15,
  duration: 2000,
  essential: true
});
```

### Camera Methods

```typescript
// Get current camera position
const center = map.getCenter(); // LngLat
const zoom = map.getZoom(); // number
const bearing = map.getBearing(); // degrees
const pitch = map.getPitch(); // degrees

// Set individual properties
map.setCenter([-74.5, 40]);
map.setZoom(12);
map.setBearing(45);
map.setPitch(60);

// Pan incrementally
map.panBy([100, 50]); // Pixels [x, y]
map.panTo([-74.5, 40]);

// Zoom incrementally
map.zoomIn({ duration: 1000 });
map.zoomOut({ duration: 1000 });
map.zoomTo(14, { duration: 1000 });

// Reset orientation
map.resetNorth({ duration: 1000 });
map.resetNorthPitch({ duration: 1000 });
```

---

## User Interaction & Events

### Mouse Events

```typescript
map.on('click', (e) => {
  console.log('Clicked at:', e.lngLat);
  console.log('Screen coords:', e.point);
  console.log('Features:', e.features); // If layer specified
});

map.on('dblclick', (e) => { /* Double click */ });
map.on('contextmenu', (e) => { /* Right click */ });

map.on('mousemove', (e) => {
  console.log('Mouse at:', e.lngLat);
});

map.on('mouseenter', 'layer-id', () => {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'layer-id', () => {
  map.getCanvas().style.cursor = '';
});
```

### Touch Events

```typescript
map.on('touchstart', (e) => {
  console.log('Touch points:', e.points);
  console.log('Coordinates:', e.lngLats);
});

map.on('touchmove', (e) => { /* Touch move */ });
map.on('touchend', (e) => { /* Touch end */ });
```

### Query Features

```typescript
// Query rendered features at point
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['layer-id-1', 'layer-id-2']
  });
  
  console.log('Features at click:', features);
});

// Query within bounding box
const bbox = [
  [e.point.x - 5, e.point.y - 5],
  [e.point.x + 5, e.point.y + 5]
];
const features = map.queryRenderedFeatures(bbox, {
  layers: ['poi-labels'],
  filter: ['==', ['get', 'type'], 'restaurant']
});

// Query all features in source
const sourceFeatures = map.querySourceFeatures('source-id', {
  sourceLayer: 'layer-name',
  filter: ['>', ['get', 'population'], 1000000]
});
```

---

## Sources (Runtime Management)

### GeoJSON Source

```typescript
// Add source
map.addSource('points', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  },
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50
});

// Update data
const source = map.getSource('points') as mapboxgl.GeoJSONSource;
source.setData({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-74.5, 40] },
      properties: { name: 'Location A' }
    }
  ]
});

// Load external GeoJSON
source.setData('https://example.com/data.geojson');

// Incremental update (more efficient for large datasets)
source.updateData({
  add: [newFeature1, newFeature2],
  update: [modifiedFeature],
  remove: ['feature-id-to-remove']
});
```

### Vector Tile Source

```typescript
map.addSource('custom-tiles', {
  type: 'vector',
  tiles: ['https://example.com/tiles/{z}/{x}/{y}.mvt'],
  minzoom: 6,
  maxzoom: 14
});

// Update tile URL
const source = map.getSource('custom-tiles') as mapboxgl.VectorTileSource;
source.setTiles(['https://new-url.com/tiles/{z}/{x}/{y}.mvt']);
```

### Image Source

```typescript
map.addSource('radar', {
  type: 'image',
  url: 'https://example.com/image.png',
  coordinates: [
    [-80.425, 46.437],
    [-71.516, 46.437],
    [-71.516, 37.936],
    [-80.425, 37.936]
  ]
});

// Update image
const source = map.getSource('radar') as mapboxgl.ImageSource;
source.updateImage({
  url: 'https://example.com/new-image.png',
  coordinates: [/* new coordinates */]
});
```

### Canvas Source

```typescript
const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;

map.addSource('canvas-source', {
  type: 'canvas',
  canvas: canvas,
  coordinates: [
    [-122.51596391201019, 37.56238816766053],
    [-122.51467645168304, 37.56410183312965],
    [-122.51309394836426, 37.563391708549425],
    [-122.51423120498657, 37.56161849366671]
  ],
  animate: true
});
```

---

## Layers (Runtime Management)

### Add Layer

```typescript
map.addLayer({
  id: 'custom-layer',
  type: 'circle',
  source: 'points',
  paint: {
    'circle-radius': 8,
    'circle-color': '#ff0000'
  }
});

// Add layer before another layer
map.addLayer({
  id: 'new-layer',
  type: 'line',
  source: 'routes',
  paint: { 'line-color': '#00ff00' }
}, 'existing-layer-id'); // Insert before this layer
```

### Update Layer Properties

```typescript
// Update paint property
map.setPaintProperty('layer-id', 'circle-radius', 10);

// Update with transition
map.setPaintProperty('layer-id', 'circle-color', '#0000ff');

// Update layout property
map.setLayoutProperty('layer-id', 'visibility', 'none');

// Update filter
map.setFilter('layer-id', ['==', ['get', 'type'], 'restaurant']);
```

### Remove Layer

```typescript
if (map.getLayer('layer-id')) {
  map.removeLayer('layer-id');
}
```

---

## Markers & Popups

### Create Marker

```typescript
const marker = new mapboxgl.Marker({
  color: '#FF0000',
  draggable: true,
  anchor: 'bottom'
})
  .setLngLat([-74.5, 40])
  .addTo(map);

// Marker events
marker.on('dragend', () => {
  const lngLat = marker.getLngLat();
  console.log('Marker moved to:', lngLat);
});

// Update marker position
marker.setLngLat([-74.6, 40.1]);

// Remove marker
marker.remove();
```

### Custom Marker Element

```typescript
const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(/marker.png)';
el.style.width = '40px';
el.style.height = '40px';

const marker = new mapboxgl.Marker({ element: el })
  .setLngLat([-74.5, 40])
  .addTo(map);
```

### Create Popup

```typescript
const popup = new mapboxgl.Popup({
  closeButton: true,
  closeOnClick: true,
  offset: 25
})
  .setLngLat([-74.5, 40])
  .setHTML('<h3>Title</h3><p>Description</p>')
  .addTo(map);

// Or set text only
popup.setText('Simple text popup');

// Or set DOM content
const div = document.createElement('div');
div.innerHTML = '<h3>Title</h3><p>Content</p>';
popup.setDOMContent(div);

// Remove popup
popup.remove();
```

### Attach Popup to Marker

```typescript
const popup = new mapboxgl.Popup({ offset: 25 })
  .setText('Popup content');

const marker = new mapboxgl.Marker()
  .setLngLat([-74.5, 40])
  .setPopup(popup)
  .addTo(map);
```

### Popup on Click

```typescript
map.on('click', 'poi-labels', (e) => {
  const coordinates = e.features[0].geometry.coordinates.slice();
  const description = e.features[0].properties.description;
  
  new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});
```

---

## Feature State (Interactive Styling)

### Set Feature State

```typescript
// Set state for a feature
map.setFeatureState(
  {
    source: 'states',
    sourceLayer: 'states-layer',
    id: 12 // Feature ID
  },
  { hover: true, selected: false }
);

// Get feature state
const state = map.getFeatureState({
  source: 'states',
  sourceLayer: 'states-layer',
  id: 12
});

// Remove feature state
map.removeFeatureState({
  source: 'states',
  sourceLayer: 'states-layer',
  id: 12
}, 'hover'); // Remove specific key, or omit to remove all
```

### Use Feature State in Style

```json
{
  "id": "states-layer",
  "type": "fill",
  "source": "states",
  "paint": {
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#ff0000",
      "#0000ff"
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "selected"], false],
      0.8,
      0.5
    ]
  }
}
```

### Interactive Hover Example

```typescript
let hoveredStateId: number | null = null;

map.on('mousemove', 'states-fill', (e) => {
  if (e.features && e.features.length > 0) {
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'states', id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = e.features[0].id as number;
    map.setFeatureState(
      { source: 'states', id: hoveredStateId },
      { hover: true }
    );
  }
});

map.on('mouseleave', 'states-fill', () => {
  if (hoveredStateId !== null) {
    map.setFeatureState(
      { source: 'states', id: hoveredStateId },
      { hover: false }
    );
  }
  hoveredStateId = null;
});
```

---

## Controls

### Navigation Control

```typescript
map.addControl(new mapboxgl.NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true
}), 'top-right');
```

### Geolocate Control

```typescript
const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  showUserHeading: true
});

map.addControl(geolocate);

// Trigger programmatically
geolocate.trigger();

// Listen to events
geolocate.on('geolocate', (e) => {
  console.log('User location:', e.coords);
});
```

### Fullscreen Control

```typescript
map.addControl(new mapboxgl.FullscreenControl({
  container: document.querySelector('body')
}));
```

### Scale Control

```typescript
map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 100,
  unit: 'imperial' // or 'metric', 'nautical'
}), 'bottom-left');
```

### Custom Control

```typescript
class CustomControl implements mapboxgl.IControl {
  private map?: mapboxgl.Map;
  private container?: HTMLElement;
  
  onAdd(map: mapboxgl.Map): HTMLElement {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl';
    this.container.textContent = 'Custom Control';
    
    this.container.addEventListener('click', () => {
      alert('Custom control clicked!');
    });
    
    return this.container;
  }
  
  onRemove(): void {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

map.addControl(new CustomControl(), 'top-left');
```

---

## Performance Optimization

### Debounce Events

```typescript
let timeout: NodeJS.Timeout;

map.on('move', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Expensive operation here
    console.log('Map finished moving');
  }, 300);
});
```

### Use Idle Event

```typescript
map.on('idle', () => {
  // Map finished rendering, good time for analysis
  const features = map.queryRenderedFeatures();
  console.log('Visible features:', features.length);
});
```

### Limit Queries

```typescript
map.on('mousemove', 'poi-layer', (e) => {
  // Query only in small area
  const features = map.queryRenderedFeatures([
    [e.point.x - 5, e.point.y - 5],
    [e.point.x + 5, e.point.y + 5]
  ], {
    layers: ['poi-layer']
  });
});
```

---

## Best Practices

✅ **Always wait for `load` event** before adding sources/layers  
✅ **Remove event listeners** when component unmounts  
✅ **Reuse Popup/Marker instances** instead of creating new ones  
✅ **Use feature state** for hover/selection instead of re-styling layers  
✅ **Debounce expensive operations** on move/zoom events  
✅ **Check if layer/source exists** before removing  
✅ **Use `idle` event** for post-render operations  
✅ **Batch layer updates** when adding multiple layers  
✅ **Handle map resize** when container size changes: `map.resize()`  
✅ **Clean up on unmount:** `map.remove()`

---

This command provides comprehensive GL JS runtime patterns for production-ready Mapbox implementations.

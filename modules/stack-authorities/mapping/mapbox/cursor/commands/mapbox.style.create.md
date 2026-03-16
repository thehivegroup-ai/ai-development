# Mapbox: Create Style

Create a custom Mapbox style with proper layer organization and data-driven styling.

---

## Workflow

### Step 1: Define Style Metadata

```json
{
  "version": 8,
  "name": "Custom Style",
  "metadata": {
    "mapbox:autocomposite": true,
    "mapbox:type": "default"
  }
}
```

### Step 2: Add Sources

```json
{
  "sources": {
    "composite": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v8"
    },
    "custom-data": {
      "type": "vector",
      "url": "mapbox://username.tileset-id"
    }
  }
}
```

**Source Limits:**
- Maximum 15 unique sources per style
- Use source compositing when possible
- Combine tilesets before upload to reduce source count

### Step 3: Create Layer Hierarchy

**Layer Order (bottom to top):**

1. **Background Layer**
```json
{
  "id": "background",
  "type": "background",
  "paint": { "background-color": "#f5f5f5" }
}
```

2. **Fill Layers** (polygons)
```json
{
  "id": "water",
  "type": "fill",
  "source": "composite",
  "source-layer": "water",
  "paint": {
    "fill-color": "#3bb2d0",
    "fill-opacity": 0.8
  }
}
```

3. **Line Layers** (roads, boundaries)
```json
{
  "id": "roads",
  "type": "line",
  "source": "composite",
  "source-layer": "road",
  "paint": {
    "line-color": "#fff",
    "line-width": 2
  }
}
```

4. **Symbol Layers** (labels, icons)
```json
{
  "id": "place-labels",
  "type": "symbol",
  "source": "composite",
  "source-layer": "place_label",
  "layout": {
    "text-field": ["get", "name"],
    "text-font": ["Open Sans Regular"],
    "text-size": 12
  }
}
```

### Step 4: Add Data-Driven Styling

**Zoom-Based Interpolation:**
```json
{
  "circle-radius": {
    "base": 1.5,
    "stops": [
      [10, 2],
      [15, 5],
      [20, 10]
    ]
  }
}
```

**Data-Based Styling:**
```json
{
  "fill-color": [
    "interpolate",
    ["linear"],
    ["get", "population"],
    0, "#fff",
    100000, "#ff0",
    1000000, "#f00"
  ]
}
```

**Conditional Styling:**
```json
{
  "fill-color": [
    "match",
    ["get", "class"],
    "park", "#0f0",
    "hospital", "#f0f",
    "school", "#ff0",
    "#ccc"
  ]
}
```

### Step 5: Add 3D Features (Optional)

**Terrain:**
```json
{
  "terrain": {
    "source": "mapbox-dem",
    "exaggeration": 1.5
  }
}
```

**3D Buildings:**
```json
{
  "id": "3d-buildings",
  "type": "fill-extrusion",
  "source": "composite",
  "source-layer": "building",
  "filter": ["==", "extrude", "true"],
  "paint": {
    "fill-extrusion-color": "#aaa",
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "min_height"],
    "fill-extrusion-opacity": 0.6
  }
}
```

### Step 6: Configure Global Properties

**Light (for fill-extrusion layers):**
```json
{
  "light": {
    "anchor": "viewport",
    "color": "#fff",
    "intensity": 0.4,
    "position": [1.15, 210, 30]
  }
}
```

**Fog (for depth):**
```json
{
  "fog": {
    "range": [0.5, 10],
    "color": "#fff",
    "horizon-blend": 0.1
  }
}
```

### Step 7: Publish

1. **Save Draft:** Changes saved locally in editor
2. **Preview:** Test style at different zooms and locations
3. **Publish:** Click **Publish** to make available to applications
4. **Wait:** Updates propagate within 15 minutes

---

## Usage in Applications

### Web (Mapbox GL JS)

```typescript
import mapboxgl from 'mapbox-gl';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/username/style-id',
  center: [-74.5, 40],
  zoom: 9
});
```

### iOS

```swift
import MapboxMaps

let mapView = MapView(frame: view.bounds)
mapView.mapboxMap.styleURI = StyleURI(rawValue: "mapbox://styles/username/style-id")
```

### Android

```kotlin
import com.mapbox.maps.MapView

val mapView = MapView(this)
mapView.getMapboxMap().loadStyleUri("mapbox://styles/username/style-id")
```

---

## Best Practices

✅ Use component-based styling for consistent colors/typography  
✅ Keep source count ≤ 15  
✅ Filter data to create multiple layers from one source  
✅ Set appropriate zoom extents for layers  
✅ Use expressions for data-driven styling  
✅ Order layers logically (background → fills → lines → symbols)  
✅ Test style at multiple zoom levels and locations  
✅ Publish only after thorough preview

---

This command generates production-ready Mapbox styles with proper structure, data-driven styling, and optimization.

---
name: mapbox-standards
version: 2.0.0
description: >
  Mapbox Studio workflows, MCP API tools, tileset management, style editing, and map integration. 
  Use when working with Mapbox Studio, Mapbox APIs (geocoding, search, directions, isochrones), 
  creating custom map styles, managing geographic data, or integrating maps in web/mobile applications.

  This skill complements official Mapbox Agent Skills (.agents/skills/mapbox-*) which provide 
  framework-specific integration patterns (React, Vue, Angular), performance optimization, and 
  search workflows. Use this skill for Studio workflows and MCP API integration; use Mapbox Agent 
  Skills for framework-specific questions.

  Trigger when user mentions: Mapbox Studio, dataset editor, tileset upload, style specification, 
  MCP tools, bulk geocoding, directions API, isochrones, GeoJSON workflows, or asks about Studio 
  manual workflows vs programmatic API approaches.
---

# Skill: Mapbox Studio Standards

**Technology:** Mapbox Studio + GL JS + Mobile SDKs + MCP API Tools  
**Skill Type:** Mapping & GIS

---

## Quick Navigation: Which Mapbox Skill Do I Need?

**Decision Tree for AI Assistants:**

```
Start here if unsure which Mapbox skill to use.

1. What is the user trying to do?

   A. SEARCH/GEOCODING
      ├─ Need to choose which search tool/parameters? → mapbox-search-patterns
      └─ Need full search implementation workflow? → mapbox-search-integration

   B. MAP STYLES
      ├─ Creating new styles or style recipes? → mapbox-style-patterns
      └─ Validating/optimizing existing styles? → mapbox-style-quality

   C. DATA VISUALIZATION
      └─ Choropleth, heatmaps, 3D extrusions? → mapbox-data-visualization-patterns

   D. WEB INTEGRATION
      ├─ React/Vue/Svelte integration? → mapbox-web-integration-patterns
      └─ Performance optimization? → mapbox-web-performance-patterns

   E. MCP SERVER INTEGRATION
      └─ Using MCP DevKit Server tools? → mapbox-mcp-devkit-patterns

   F. SECURITY
      └─ Token management and security? → mapbox-token-security

   G. STUDIO WORKFLOWS / MCP API BASICS
      └─ Datasets, tilesets, basic MCP usage? → THIS SKILL (mapbox-standards)
```

**Use THIS skill (mapbox-standards) when:**

- User needs Studio workflow basics (datasets, tilesets)
- User asks about MCP API integration patterns
- User is new to Mapbox ecosystem (overview/entry point)
- User asks "How does Studio work?" or "What's the data flow?"

**Not for:**

- Framework-specific integration (use mapbox-web-integration-patterns)
- Search implementation (use mapbox-search-integration or mapbox-search-patterns)
- Style recipes or validation (use mapbox-style-patterns or mapbox-style-quality)
- Data visualization patterns (use mapbox-data-visualization-patterns)

---

## Skill Scope & Complementary Resources

### This Skill Covers

- Mapbox Studio manual workflows (dataset editor, style editor, tileset management)
- MCP API tools integration (directions, geocoding, isochrones, static maps)
- Studio ↔ MCP data flow (GeoJSON interchange)
- Style specification compliance
- Bulk operation patterns with MCP tools

### Official Mapbox Agent Skills Cover (see `.agents/skills/mapbox-*`)

- **Framework integration** (React, Vue, Svelte, Angular) → `mapbox-web-integration-patterns`
- **Performance optimization** (bundle size, rendering) → `mapbox-web-performance-patterns`
- **Search workflows** (Search Box API, autocomplete) → `mapbox-search-integration`
- **Search tool selection** (parameter optimization) → `mapbox-search-patterns`
- **Style recipes** (restaurant finders, real estate) → `mapbox-style-patterns`
- **Style validation** (quality assurance, accessibility) → `mapbox-style-quality`
- **Data visualization** (choropleth, heat maps, 3D) → `mapbox-data-visualization-patterns`
- **Token security** (scope management, rotation) → `mapbox-token-security`
- **MCP DevKit** (style management via MCP) → `mapbox-mcp-devkit-patterns`

### When to Use Which

**Use this skill when user asks:**

- "How do I create a dataset in Studio?"
- "How do I use MCP tools for bulk geocoding?"
- "What's the data flow from MCP API to Studio tileset?"
- "How do I export a dataset to a tileset?"
- "How do I integrate MCP directions tool with GL JS?"

**Use Mapbox Agent Skills when user asks:**

- "How do I integrate Mapbox in React?" → `mapbox-web-integration-patterns`
- "How do I optimize Mapbox bundle size?" → `mapbox-web-performance-patterns`
- "How do I implement address search?" → `mapbox-search-integration`
- "What's the best search API for my use case?" → `mapbox-search-patterns`
- "How do I create a choropleth map?" → `mapbox-data-visualization-patterns`
- "How do I secure my Mapbox tokens?" → `mapbox-token-security`

**Both resources when user asks:**

- "How do I build a store locator in React?" (integration patterns + MCP search tools)
- "How do I optimize my Mapbox app?" (framework optimization + style optimization)
- "How do I implement POI search?" (search workflows + MCP category_search_tool)

---

---

## Parallel Execution Opportunities

**Mapbox workflows have natural parallelization points:**

```
Phase 1: Data Preparation (PARALLEL - Independent datasets)
┌──────────────────────────────────────────────┐
│ Create dataset 1 + add features              │
│ Create dataset 2 + add features              │
│ Create dataset 3 + add features              │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Tileset Export (PARALLEL - Independent tilesets)
┌──────────────────────────────────────────────┐
│ Export dataset 1 → tileset 1                 │
│ Export dataset 2 → tileset 2                 │
│ Export dataset 3 → tileset 3                 │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 3: Style Creation (SEQUENTIAL)
• Add all tilesets as sources
• Create layers (some layers can be parallel)
• Apply styling
```

**Bulk operations (via MCP tools):**

```
Bulk Processing (PARALLEL within loop, with rate limiting)
┌──────────────────────────────────────────────┐
│ Geocode 100 addresses (100-200ms delays)    │
│ Search 50 POIs (100-200ms delays)           │
│ Generate 20 isochrones (100-200ms delays)   │
└───────────────────────────────────────────────┘
```

**Time savings:** 40-60% for multi-dataset workflows, 30-50% for bulk operations

---

## Core Workflow

### 1. Data Preparation

**Dataset Creation:**

- Upload GeoJSON, CSV (geocoded), KML, GPX, or Shapefile
- Or create features directly in dataset editor using draw tools
- Add/edit feature properties for data-driven styling

**Dataset Editor Features:**

- Draw points, lines, polygons
- Search places and save to dataset
- Edit geometry and properties
- Import additional data (5 MB limit per upload)

### 2. Tileset Export

**Convert Dataset → Tileset:**

```
Dataset (editable GeoJSON) → Tileset (optimized vector tiles)
```

**Tileset Benefits:**

- Fast rendering at all zoom levels
- Cacheable and scalable
- Ready for style editor

**Tileset Upload Direct:**

- Vector: GeoJSON, CSV, Shapefile, KML, GPX, MBTiles
- Raster: GeoTIFF
- Free tier: 20 uploads/month, 300 MB per upload

### 3. Style Creation

**Component-Based Styling:**

Use components for group-level control:

- **Colors:** Global palette with semantic tokens (_Base_, _Greenspace_, _Water_, etc.)
- **Typography:** Font pairings and text styles (_Major cities_, _Minor roads_, etc.)
- **Patterns:** Shared visual treatments

**Component Properties:**

- Toggle, dropdown, or slider controls
- Apply to multiple layers simultaneously
- Update components to receive latest features

**When to Eject Components:**

- Need fine-grained layer control
- Want to reorder layers within component
- Insert custom layers between component layers
- ⚠️ Cannot be reversed once ejected

**Layer-Based Styling:**

Seven layer types:

1. **Fill:** Polygons with color/pattern
2. **Line:** Styled linestrings
3. **Symbol:** Text labels and icons
4. **Circle:** Point data visualization
5. **Fill-Extrusion:** 3D polygon extrusion
6. **Heatmap:** Density visualization
7. **Raster/Hillshade:** Image layers

### 4. Data-Driven Styling

**Style Across Zoom Range:**

```json
{
  "circle-radius": {
    "stops": [
      [10, 2],
      [15, 5],
      [20, 10]
    ]
  }
}
```

**Style Across Data Range:**

```json
{
  "fill-color": {
    "property": "population",
    "stops": [
      [0, "#fff"],
      [1000000, "#f00"]
    ]
  }
}
```

**Style With Data Conditions:**

```json
{
  "fill-color": [
    "match",
    ["get", "class"],
    "park",
    "#0f0",
    "hospital",
    "#f0f",
    "#ccc"
  ]
}
```

### 5. Publishing

**Draft vs Production:**

- **Draft:** Changes only visible in editor
- **Production:** Click **Publish** to update live maps
- ⏱️ Updates propagate within 15 minutes

---

## Style Specification Patterns

### Basic Style Structure

```json
{
  "version": 8,
  "name": "Custom Style",
  "metadata": {
    "mapbox:autocomposite": true
  },
  "sources": {
    "composite": {
      "type": "vector",
      "url": "mapbox://mapbox.mapbox-streets-v8"
    },
    "custom-data": {
      "type": "vector",
      "url": "mapbox://username.tileset-id"
    }
  },
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": { "background-color": "#f5f5f5" }
    },
    {
      "id": "custom-fill",
      "type": "fill",
      "source": "custom-data",
      "source-layer": "layer-name",
      "paint": {
        "fill-color": "#3bb2d0",
        "fill-opacity": 0.8
      }
    }
  ]
}
```

### Source Compositing

**Auto-Composite (Default):**

- Bundles Mapbox tilesets + custom tilesets into one composite source
- Improves label placement across sources
- Faster map loading

**Turn Off Compositing:**

- When you need distinct sources for runtime control
- Each source counts toward 15 source limit
- Cannot make label placement calculations between sources

---

## Expression Operators & Patterns

### Expression Categories

Expressions define formulas for computing property values. Full reference: https://docs.mapbox.com/style-spec/reference/expressions/

#### Lookup Operators

```json
["get", "property-name"]              // Get feature property
["has", "property-name"]              // Check if property exists
["at", index, array]                  // Get array element
["length", array_or_string]           // Get array/string length
["in", value, array_or_string]        // Check if value in array/string
```

#### Decision Operators

```json
["match", input, label1, output1, label2, output2, fallback]
["case", condition1, output1, condition2, output2, fallback]
["coalesce", value1, value2, fallback]  // First non-null value
```

#### Math Operators

```json
["+", value1, value2]                 // Addition
["-", value1, value2]                 // Subtraction
["*", value1, value2]                 // Multiplication
["/", value1, value2]                 // Division
["%", value1, value2]                 // Modulo
["^", base, exponent]                 // Power
["sqrt", value]                       // Square root
["log10", value]                      // Base 10 logarithm
["abs", value]                        // Absolute value
["round", value]                      // Round to integer
["ceil", value]                       // Round up
["floor", value]                      // Round down
["min", value1, value2, ...]          // Minimum value
["max", value1, value2, ...]          // Maximum value
```

#### String Operators

```json
["concat", string1, string2, ...]     // Concatenate strings
["downcase", string]                  // Convert to lowercase
["upcase", string]                    // Convert to uppercase
["slice", string, start, end]         // Extract substring
```

#### Type Operators

```json
["to-string", value]                  // Convert to string
["to-number", value]                  // Convert to number
["to-boolean", value]                 // Convert to boolean
["to-color", value]                   // Convert to color
["typeof", value]                     // Get type
```

#### Comparison Operators

```json
["==", value1, value2]                // Equal
["!=", value1, value2]                // Not equal
[">", value1, value2]                 // Greater than
[">=", value1, value2]                // Greater than or equal
["<", value1, value2]                 // Less than
["<=", value1, value2]                // Less than or equal
```

#### Logical Operators

```json
["all", condition1, condition2, ...]  // Logical AND
["any", condition1, condition2, ...]  // Logical OR
["!", condition]                      // Logical NOT
```

#### Interpolation Operators

```json
["interpolate", interpolation, input, stop1, output1, stop2, output2, ...]
["step", input, default, stop1, output1, stop2, output2, ...]
```

**Interpolation types:**

- `["linear"]` - Linear interpolation
- `["exponential", base]` - Exponential interpolation (e.g., base 1.5)
- `["cubic-bezier", x1, y1, x2, y2]` - Cubic bezier curve

#### Zoom & Feature Operators

```json
["zoom"]                              // Current zoom level
["feature-state", "state-key"]        // Get feature state
["geometry-type"]                     // Feature geometry type
["id"]                                // Feature ID
["properties"]                        // Feature properties object
```

### Common Expression Patterns

#### Combine Zoom and Data

```json
{
  "circle-radius": [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    10,
    ["*", ["get", "value"], 0.1],
    15,
    ["*", ["get", "value"], 0.5],
    20,
    ["*", ["get", "value"], 1.0]
  ]
}
```

#### Multi-Condition Logic

```json
{
  "fill-color": [
    "case",
    [">", ["get", "population"], 1000000],
    "#8b0000",
    [">", ["get", "population"], 500000],
    "#ff4500",
    [">", ["get", "population"], 100000],
    "#ffa500",
    [">", ["get", "population"], 50000],
    "#ffff00",
    "#90ee90"
  ]
}
```

#### String Concatenation

```json
{
  "text-field": [
    "concat",
    ["get", "name"],
    " (",
    ["to-string", ["get", "population"]],
    ")"
  ]
}
```

#### Conditional with Fallback Chain

```json
{
  "text-field": [
    "coalesce",
    ["get", "name_en"],
    ["get", "name_local"],
    ["get", "name"],
    "Unnamed"
  ]
}
```

#### Color Interpolation

```json
{
  "line-color": [
    "interpolate",
    ["linear"],
    ["get", "temperature"],
    -10,
    "#0000ff",
    0,
    "#00ffff",
    10,
    "#00ff00",
    20,
    "#ffff00",
    30,
    "#ff0000"
  ]
}
```

#### Math Operations

```json
{
  "circle-radius": ["sqrt", ["/", ["get", "area"], 3.14159]]
}
```

#### Array/String Operations

```json
{
  "filter": ["in", "park", ["get", "categories"]]
}
```

#### Feature State (Dynamic Styling)

```json
{
  "fill-color": [
    "case",
    ["boolean", ["feature-state", "hover"], false],
    "#ff0000",
    "#3bb2d0"
  ]
}
```

---

## Advanced Style Features

### Imports (Style Composition)

Compose styles from other styles. Imported styles become base layers.

```json
{
  "version": 8,
  "imports": [
    {
      "id": "basemap",
      "url": "mapbox://styles/mapbox/standard",
      "config": {
        "showPointOfInterestLabels": false,
        "showTransitLabels": false,
        "font": "Montserrat",
        "lightPreset": "dusk"
      }
    }
  ],
  "sources": {
    "custom-data": {
      "type": "geojson",
      "data": "https://example.com/data.geojson"
    }
  },
  "layers": [
    {
      "id": "custom-markers",
      "type": "circle",
      "source": "custom-data",
      "paint": {
        "circle-radius": 8,
        "circle-color": "#ff0000"
      }
    }
  ]
}
```

**Benefits:**

- Reuse Mapbox Standard or other styles as base
- Configure imported style via `config` object
- Add custom layers on top
- Update base style independently

### Schema (Configuration Properties)

Define configurable properties for your style.

```json
{
  "schema": {
    "showLabels": {
      "type": "boolean",
      "default": true,
      "metadata": {
        "description": "Toggle label visibility across all layers"
      }
    },
    "primaryColor": {
      "type": "color",
      "default": "#3bb2d0",
      "metadata": {
        "description": "Primary brand color for highlights"
      }
    },
    "theme": {
      "type": "string",
      "default": "light",
      "values": ["light", "dark", "satellite"],
      "metadata": {
        "description": "Visual theme preset"
      }
    },
    "zoomLevel": {
      "type": "number",
      "default": 10,
      "minimum": 0,
      "maximum": 22
    }
  }
}
```

**Use config values in layers:**

```json
{
  "paint": {
    "fill-color": ["config", "primaryColor"]
  },
  "layout": {
    "visibility": ["case", ["config", "showLabels"], "visible", "none"]
  }
}
```

### Slots (Custom Layer Insertion)

Slots are placeholders for custom layers in imported styles.

**Standard slots:**

- `bottom` - Below all base map layers
- `middle` - Between base map fills and labels
- `top` - Above all base map layers

```json
{
  "layers": [
    {
      "id": "custom-polygons",
      "type": "fill",
      "slot": "bottom",
      "source": "boundaries",
      "paint": {
        "fill-color": "#3bb2d0",
        "fill-opacity": 0.3
      }
    },
    {
      "id": "custom-markers",
      "type": "symbol",
      "slot": "top",
      "source": "markers",
      "layout": {
        "icon-image": "marker-15"
      }
    }
  ]
}
```

### Appearances (Conditional Styling)

Define sets of appearance objects to change layer styling based on conditions.

```json
{
  "id": "buildings",
  "type": "fill-extrusion",
  "source": "composite",
  "source-layer": "building",
  "appearances": [
    {
      "id": "day-mode",
      "condition": ["==", ["config", "theme"], "light"],
      "paint": {
        "fill-extrusion-color": "#d0d0d0",
        "fill-extrusion-opacity": 0.8
      }
    },
    {
      "id": "night-mode",
      "condition": ["==", ["config", "theme"], "dark"],
      "paint": {
        "fill-extrusion-color": "#333333",
        "fill-extrusion-opacity": 0.9
      }
    }
  ]
}
```

### Weather Effects

#### Fog

```json
{
  "fog": {
    "range": [0.5, 10],
    "color": "#ffffff",
    "high-color": "#245cdf",
    "space-color": "#000000",
    "horizon-blend": 0.1,
    "star-intensity": 0.15
  }
}
```

#### Rain

```json
{
  "rain": {
    "intensity": 0.8,
    "opacity": 0.6,
    "color": "#ffffff",
    "direction": 135,
    "vignette": 0.3
  }
}
```

#### Snow

```json
{
  "snow": {
    "intensity": 0.7,
    "opacity": 0.8,
    "direction": 180,
    "vignette": 0.5
  }
}
```

### Featuresets (Interactive Layer Groups)

Define groups of layers for interaction when style is imported.

```json
{
  "featuresets": {
    "buildings": {
      "selectors": [
        { "layer": "building-fill" },
        { "layer": "building-outline" }
      ]
    },
    "roads": {
      "selectors": [{ "layer": "road-primary" }, { "layer": "road-secondary" }]
    }
  }
}
```

**Use in imported styles:**

```javascript
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    featureset: 'buildings',
  });
});
```

---

## Integration Patterns

### Mapbox GL JS (Web)

```typescript
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN!;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/username/style-id',
  center: [-74.5, 40],
  zoom: 9,
  pitch: 45,
  bearing: -17.6,
});

// Add controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl());

// Wait for style to load
map.on('load', () => {
  // Add custom layer
  map.addLayer({
    id: 'custom-layer',
    type: 'circle',
    source: {
      type: 'geojson',
      data: '/path/to/data.geojson',
    },
    paint: {
      'circle-radius': 6,
      'circle-color': '#ff0000',
    },
  });
});
```

### Mapbox Maps SDK for iOS

```swift
import MapboxMaps

class MapViewController: UIViewController {
    var mapView: MapView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let cameraOptions = CameraOptions(
            center: CLLocationCoordinate2D(latitude: 40.7, longitude: -74.0),
            zoom: 9
        )

        let mapInitOptions = MapInitOptions(
            cameraOptions: cameraOptions,
            styleURI: StyleURI(rawValue: "mapbox://styles/username/style-id")
        )

        mapView = MapView(frame: view.bounds, mapInitOptions: mapInitOptions)
        view.addSubview(mapView)
    }
}
```

### Mapbox Maps SDK for Android

```kotlin
import com.mapbox.maps.MapView
import com.mapbox.maps.Style
import com.mapbox.geojson.Point

class MapActivity : AppCompatActivity() {
    private lateinit var mapView: MapView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        mapView = MapView(this)
        setContentView(mapView)

        mapView.getMapboxMap().apply {
            loadStyleUri("mapbox://styles/username/style-id") {
                // Style loaded
            }
            setCamera(
                CameraOptions.Builder()
                    .center(Point.fromLngLat(-74.0, 40.7))
                    .zoom(9.0)
                    .build()
            )
        }
    }
}
```

---

## Performance Best Practices

### Tileset Optimization

- Simplify geometries at low zoom levels
- Use appropriate zoom extents (min/max zoom)
- Monitor tile size graph in tileset explorer
- Keep tiles under 500 KB for optimal performance

### Style Optimization

- Stay within 15 source limit
- Use filters to create multiple layers from one source
- Remove unused layers and sources
- Minimize symbol layers at high zoom levels

### Runtime Optimization

- Use clustering for dense point data
- Implement viewport-based filtering
- Debounce user interactions
- Load styles asynchronously
- Use `lazy: true` for conditional layers

---

## Common Patterns

### Choropleth Map (Data-Driven Fill)

```json
{
  "id": "population-density",
  "type": "fill",
  "source": "counties",
  "source-layer": "county-data",
  "paint": {
    "fill-color": [
      "interpolate",
      ["linear"],
      ["get", "density"],
      0,
      "#fff",
      100,
      "#ff0",
      1000,
      "#f00"
    ],
    "fill-opacity": 0.7
  }
}
```

### Clustered Points

```json
{
  "id": "clusters",
  "type": "circle",
  "source": "points",
  "filter": ["has", "point_count"],
  "paint": {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1"
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
  }
}
```

### 3D Buildings

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

---

## Troubleshooting

### Source Limit Exceeded

- Combine tilesets before upload
- Use filters to split one source into multiple layers
- Remove unused sources

### Missing Features

- Check zoom extent on layer
- Verify source-layer name matches tileset
- Check filter conditions
- Inspect feature properties in tileset explorer

### Style Not Updating

- Ensure you clicked **Publish** (not just Save)
- Wait 15 minutes for propagation
- Clear browser cache
- Verify style URL in application

### Label Collisions

- Adjust `text-padding` or `icon-padding`
- Use `symbol-placement: line` for road labels
- Enable `text-allow-overlap: false` (default)
- Adjust `text-max-angle` for curved labels

---

## MCP Tools Integration

### Overview

The Mapbox MCP server (`user-mapbox-mcp`) provides 22 programmatic API tools for runtime map operations. These tools complement Studio workflows by enabling automated geocoding, search, directions, static map generation, and geometry operations.

**Server identifier:** `user-mapbox-mcp`  
**Usage pattern:** Always read tool schema before use with `Read` tool on `/Users/robertfiore/.cursor/projects/Users-robertfiore-Welltower-DataCo-towerai/mcps/user-mapbox-mcp/tools/<tool-name>.json`

### MCP Tool Categories

#### Geocoding & Search

**search_and_geocode_tool**

- Search POIs, brands, chains, geocode addresses
- Use `proximity` parameter for local results
- Returns GeoJSON FeatureCollection
- Example: Find "Starbucks near Central Park" → get coordinates + metadata

**reverse_geocode_tool**

- Convert coordinates → address
- Returns place context (country, region, postcode, etc.)

**category_search_tool**

- Search by category (restaurants, coffee shops, museums)
- Better than search_and_geocode_tool for generic place types
- Filter by category IDs

**place_details_tool**

- Get detailed information for a specific place
- Requires mapbox_id from search results

**category_list_tool**

- List all available POI category IDs
- Use before category_search_tool

#### Directions & Routing

**directions_tool**

- Calculate routes between 2-25 waypoints
- Profiles: driving-traffic, driving, walking, cycling
- Vehicle constraints: max_height, max_width, max_weight
- Returns: duration, distance, turn-by-turn instructions
- Use `geometries: "none"` for compact responses (route planning)
- Use `geometries: "geojson"` for visualization (LineString)

**optimization_tool**

- Solve traveling salesman problem (TSP)
- Optimizes waypoint order for shortest/fastest route
- Up to 12 coordinates

**map_matching_tool**

- Snap GPS traces to road network
- Corrects noisy GPS data

**matrix_tool**

- Calculate travel times/distances between multiple points
- Returns NxN matrix of durations/distances

**isochrone_tool**

- Generate travel time polygons
- Example: "Show all areas reachable within 15 min drive"
- Returns GeoJSON Polygon

#### Static Maps

**static_map_image_tool**

- Generate static map images (PNG/JPEG)
- Supports overlays: markers, paths, GeoJSON
- Max size: 1280x1280 pixels
- Use for: documentation, testing, email/PDF reports

#### Geometry Operations

**area_tool**

- Calculate polygon area (square meters)

**distance_tool**

- Calculate distance between two points (meters)

**buffer_tool**

- Create buffer around point/line/polygon
- Example: "500m radius around store location"

**centroid_tool**

- Calculate center point of polygon

**bbox_tool**

- Get bounding box of geometry

**simplify_tool**

- Simplify geometry (reduce vertices)
- Use tolerance parameter to control detail

**bearing_tool**

- Calculate bearing between two points (degrees)

#### Utility

**version_tool**

- Get MCP server version

**resource_reader_tool**

- Read MCP resources

### Studio vs MCP Decision Guide

**Use Studio (manual workflows) when:**

- Designing map styles (visual, interactive work)
- Creating/editing datasets with draw tools
- Exploring tileset properties in tileset explorer
- Iterating on visual design and component styling
- One-off data preparation and export
- Working with style specification JSON directly

**Use MCP (API tools) when:**

- Geocoding addresses programmatically (bulk operations)
- Calculating directions/routes for multiple points
- Generating isochrones (travel time polygons for analysis)
- Bulk searching or category queries (find all coffee shops in area)
- Creating static map images for documentation, testing, or reports
- Geometry operations (buffer zones, simplification, centroids)
- Automating repetitive spatial tasks
- Runtime map features (user-initiated directions, search)

### MCP → Studio Integration Workflow

**Pattern: API-generated data → Studio dataset → tileset → style**

1. **Generate data with MCP tools:**

   ```typescript
   // Example: Geocode addresses, get GeoJSON
   const result = await CallMcpTool({
     server: 'user-mapbox-mcp',
     toolName: 'search_and_geocode_tool',
     arguments: {
       q: '1600 Pennsylvania Avenue',
       proximity: { longitude: -77.0369, latitude: 38.9072 },
     },
   });
   // result.features = GeoJSON FeatureCollection
   ```

2. **Save GeoJSON locally:**

   ```bash
   # Save to file
   echo '<GeoJSON>' > data/locations.geojson
   ```

3. **Upload to Studio dataset:**
   - Go to Mapbox Studio → Datasets
   - Create new dataset or open existing
   - Click Import → upload locations.geojson
   - Edit properties if needed
   - Save dataset

4. **Export dataset to tileset:**
   - Click Export → Create new tileset
   - Wait for processing (optimized vector tiles)

5. **Add tileset to style:**
   - Go to Mapbox Studio → Styles
   - Open style or create new
   - Add source: `mapbox://username.tileset-id`
   - Create layers using tileset data
   - Use data-driven styling with properties from MCP results

6. **Generate test images with MCP:**
   ```typescript
   // Validate styled map
   await CallMcpTool({
     server: 'user-mapbox-mcp',
     toolName: 'static_map_image_tool',
     arguments: {
       center: { longitude: -77.0369, latitude: 38.9072 },
       zoom: 12,
       size: { width: 800, height: 600 },
       style: 'mapbox://styles/username/style-id',
     },
   });
   ```

### Common MCP Workflow Examples

#### Bulk Geocoding → Dataset Creation

**Use case:** Geocode list of addresses, create map visualization

```markdown
1. Use search_and_geocode_tool for each address
2. Collect GeoJSON features into FeatureCollection
3. Save as .geojson file
4. Upload to Studio dataset
5. Export to tileset
6. Style in Studio (circle layer with data-driven colors)
```

#### Isochrone Analysis → Style Overlay

**Use case:** Show service coverage areas (15-min drive time)

```markdown
1. Use isochrone_tool with origin coordinates
2. Get GeoJSON Polygon representing 15-min drive area
3. Save polygon as dataset
4. Export to tileset
5. Add fill layer to style with semi-transparent color
```

#### Directions Visualization

**Use case:** Show route between locations on map

```markdown
1. Use directions_tool with geometries: "geojson"
2. Get LineString geometry for route
3. Save as GeoJSON file
4. Upload to Studio dataset as line feature
5. Export to tileset
6. Style as line layer with data-driven width/color based on duration
```

#### Static Map Generation for Reports

**Use case:** Generate map images for documentation/reports

```markdown
1. Design style in Studio
2. Publish style, note style ID
3. Use static_map_image_tool with:
   - center: target location
   - zoom: appropriate level
   - style: mapbox://styles/username/style-id
   - overlays: markers for key locations
4. Save PNG/JPEG to docs/ or reports/
```

### MCP Tool Usage Patterns

**Always read tool schema first:**

```bash
# Before calling any MCP tool
Read /Users/robertfiore/.cursor/projects/Users-robertfiore-Welltower-DataCo-towerai/mcps/user-mapbox-mcp/tools/<tool-name>.json
```

**Handle GeoJSON results:**

- MCP search/geocoding tools return GeoJSON FeatureCollection
- MCP directions tool returns route geometry (LineString if `geometries: "geojson"`)
- MCP isochrone tool returns Polygon geometry
- All compatible with Studio dataset uploads

**Authentication:**

- MCP server uses environment variables for Mapbox access tokens
- Assumes `MAPBOX_ACCESS_TOKEN` configured
- No token handling needed in tool calls

**Rate limits:**

- Mapbox API rate limits apply to MCP tools
- Free tier: limited requests per month
- Batch operations carefully
- Consider caching results

---

This skill provides comprehensive Mapbox Studio and integration patterns for creating production-ready map applications.

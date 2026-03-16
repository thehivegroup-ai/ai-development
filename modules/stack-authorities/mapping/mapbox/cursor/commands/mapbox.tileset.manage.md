# Mapbox: Manage Tileset

Manage Mapbox tilesets including upload, replacement, and optimization.

---

## Workflow

### Step 1: Prepare Data

**Supported Vector Formats:**
- GeoJSON (recommended)
- CSV (must be geocoded with lat/lon or address columns)
- Shapefile (zipped)
- KML
- GPX
- MBTiles

**Supported Raster Formats:**
- GeoTIFF

**Data Requirements:**
- Valid GeoJSON structure
- Proper coordinate reference system (WGS84 / EPSG:4326)
- Feature properties for data-driven styling
- Geometry simplified for performance

### Step 2: Upload Tileset

**Via Mapbox Studio:**

1. Go to **Tilesets** page
2. Click **New tileset**
3. Select **Upload a file**
4. Choose file from local system
5. Wait for processing (blue circle → green checkmark)

**Limitations (Free Tier):**
- 20 uploads per month
- 300 MB per file
- No processing or hosting charges

**Via Mapbox Tiling Service (MTS):**
- Programmatic uploads via API
- Higher limits (billed usage)
- Recipe-based configuration

### Step 3: Export Dataset to Tileset

**From Dataset Editor:**

1. Open dataset in editor
2. Click **Export**
3. Choose **Export to new tileset** or **Update connected tileset**
4. Tileset created with reference back to dataset

**Benefits:**
- Dataset remains editable
- Re-export to update tileset
- Styles referencing tileset auto-update

### Step 4: Configure Tileset Properties

**Tileset ID Format:**
```
username.identifier
```

**Tileset Visibility:**
- **Private (default):** Only accessible with your access token
- **Public:** Accessible by any Mapbox user (you retain ownership)

**Bounding Box:**
- Automatic from data extent
- View in tileset explorer

**Zoom Extents:**
- Set in style editor per layer
- Control at which zoom levels data appears

### Step 5: Inspect Tileset

**Tileset Explorer Features:**

1. **Vector Layers List:** View all layers and properties
2. **Tile Size Graph:** Monitor tile sizes at each zoom level (target < 500 KB)
3. **X-Ray View:** Preview rendered data, inspect feature properties
4. **Bounding Box Viewport:** Navigate data extent
5. **Job History:** View processing history (MTS only)

### Step 6: Replace Tileset

**Update Existing Tileset:**

1. Go to tileset menu (three dots)
2. Click **Replace**
3. Upload new data file
4. Tileset ID remains same
5. All styles referencing tileset automatically update

**Use Cases:**
- Data corrections
- Periodic updates (e.g., monthly census data)
- Geometry simplification

---

## Optimization Strategies

### Reduce Tile Size

**Simplify Geometries:**
```bash
# Using mapshaper CLI
mapshaper input.geojson -simplify 10% -o output.geojson
```

**Remove Unnecessary Properties:**
```json
{
  "type": "Feature",
  "properties": {
    "name": "Feature Name",
    "value": 100
    // Remove unused properties before upload
  },
  "geometry": { ... }
}
```

**Set Appropriate Zoom Extents:**
- High-detail features: zoom 10-20
- City-level features: zoom 8-14
- State/country features: zoom 2-8

### Combine Tilesets

**Reduce Source Count:**
- Merge related datasets before upload
- Use single tileset with multiple source-layers
- Filter in style editor to separate visually

**Example: Merge GeoJSON Files**
```javascript
const combined = {
  type: "FeatureCollection",
  features: [
    ...dataset1.features,
    ...dataset2.features
  ]
};
```

---

## Common Patterns

### CSV to Tileset (Point Data)

**CSV Format:**
```csv
longitude,latitude,name,value
-74.006,40.7128,New York,100
-118.2437,34.0522,Los Angeles,80
```

**Requirements:**
- `longitude` and `latitude` columns (or `lon`/`lat`)
- WGS84 coordinate system
- No headers with spaces (use underscores)

### GeoJSON to Tileset (Polygon Data)

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "District 1",
        "population": 50000,
        "density": 2500
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-74, 40], [-74, 41], [-73, 41], [-73, 40], [-74, 40]]]
      }
    }
  ]
}
```

### Shapefile to Tileset

**Requirements:**
- Zip all shapefile components (.shp, .shx, .dbf, .prj)
- Ensure .prj file exists (defines coordinate system)
- Keep file size < 300 MB (free tier)

---

## Tileset Management

### Make Public/Private

**Use Cases:**
- **Private:** Production apps, sensitive data
- **Public:** Open data, shared basemaps, demos

**Important:**
- Public tilesets accessible by any Mapbox user
- You retain ownership and control (only you can edit/delete)
- Public tilesets still require valid access token

### Delete Tileset

**Warning:** Deletion is permanent and cannot be undone.

**Impact:**
- Styles referencing tileset will break
- Applications using those styles will fail to render
- No recovery option

**Before Deleting:**
1. Check which styles reference this tileset
2. Notify team/users
3. Update or remove references
4. Test applications

### Star Favorite Tilesets

**Use Case:** Quick access to frequently used tilesets on homepage.

---

## Troubleshooting

### Upload Failed

**Common Causes:**
- Invalid GeoJSON structure
- File size > 300 MB (free tier)
- Exceeded 20 uploads/month (free tier)
- Unsupported coordinate system

**Solutions:**
- Validate GeoJSON with online validator
- Split large files or simplify geometries
- Wait for next month or upgrade to MTS
- Reproject to WGS84 (EPSG:4326)

### Missing Features in Style

**Check:**
1. Tileset uploaded successfully (green checkmark)
2. Correct source-layer name in style
3. Layer zoom extent matches tileset zoom levels
4. Filter conditions not excluding all features
5. Feature properties exist for data-driven styling

### Large Tile Sizes

**Solutions:**
- Simplify geometries at low zoom levels
- Remove unnecessary feature properties
- Split into multiple zoom-dependent layers
- Use appropriate zoom extents

---

## Best Practices

✅ Validate data before upload  
✅ Simplify geometries for performance  
✅ Use descriptive tileset IDs (e.g., `username.us-counties-2024`)  
✅ Keep tile sizes < 500 KB  
✅ Set appropriate zoom extents in style editor  
✅ Monitor tile size graph in tileset explorer  
✅ Use private visibility for production apps  
✅ Document tileset purpose and update frequency

---

This command provides comprehensive tileset management workflows for Mapbox Studio.

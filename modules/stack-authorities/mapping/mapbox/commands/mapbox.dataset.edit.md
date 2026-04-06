# Mapbox: Edit Dataset

Create and edit GeoJSON datasets in Mapbox Studio dataset editor.

---

## Workflow

### Step 1: Create Dataset

**From Datasets Page:**

1. Click **New dataset**
2. Choose option:
   - **Blank dataset:** Start from scratch
   - **Upload data:** Import GeoJSON, CSV, KML, GPX, or Shapefile

**Supported Formats:**
- GeoJSON (recommended)
- CSV (must be geocoded)
- KML
- GPX
- Shapefile (zipped)

**Restrictions:**
- 5 MB per file upload
- Unlimited total dataset size
- Datasets > 20 MB not displayable in editor (use API)

### Step 2: Draw Features

**Draw Tools:**

1. **marker Draw Point:** Click map to place point feature
2. **line Draw Line:** Click to start, click to add vertices, double-click to finish
3. **polygon Draw Polygon:** Click to start, click to add vertices, close polygon to finish

**Edit Geometry:**
- Click feature to select
- Drag vertices to adjust shape
- Drag feature (hover until cursor shows position icon) to move
- Click trash to delete

**Multiple Selection:**
- Shift + click + drag to select multiple features
- Delete selected features with trash button

### Step 3: Search and Add Places

**Search Places:**

1. Click search **Search places** in toolbar
2. Type location (address, city, country, etc.)
3. Select result
4. Click **Save to dataset** to add as feature

**Supported Search Types:**
- Countries, regions, postcodes
- Cities, towns, neighborhoods
- Addresses
- **Not supported:** POIs (points of interest)

**Powered by:** Mapbox Geocoding API

### Step 4: Edit Feature Properties

**Add Properties:**

1. Click feature on map
2. Properties panel opens on left
3. Click **\+ Add property**
4. Enter property name and value
5. Click checkmark to save

**Edit Properties:**
- Click property value to edit
- Use text, number, or boolean values
- Delete properties with trash icon

**View as GeoJSON:**
- Click **GeoJSON** tab to view raw feature JSON
- Useful for copying property structures

**Property Use Cases:**
- Data-driven styling (choropleth maps, conditional colors)
- Popups in web/mobile apps
- Filtering in style editor
- Analysis and visualization

### Step 5: Import Additional Data

**Add to Existing Dataset:**

1. Click plus **Import** in dataset editor
2. Select file (GeoJSON, CSV, KML, GPX, Shapefile)
3. Features added without overwriting existing data

**Important:**
- Importing duplicate features creates duplicates (no deduplication)
- Feature IDs reset on import (use custom property for stable IDs)
- 5 MB limit per import
- Unlimited number of imports

### Step 6: Use Reference Tileset

**Add Custom Background:**

1. Click tileset **Reference tileset** in toolbar
2. Select raster tileset from your account
3. Tileset displays between basemap and your data

**Use Cases:**
- Custom satellite imagery
- Historical maps
- Overlay context for drawing

**Remove Reference:**
- Click **Deselect close** or click active tileset

### Step 7: Save Changes

**History (Current Session Only):**

1. Click history **History** in toolbar
2. View all changes since opening dataset
3. Revert changes within current session

**Important:**
- History resets when you close dataset
- Cannot undo after closing dataset
- Save frequently

**Click Save:**
- All changes committed to dataset
- Dataset updated in your account

### Step 8: Export to Tileset

**Export Workflow:**

1. Click **Export** button
2. Choose option:
   - **Export to new tileset:** Create new tileset
   - **Update connected tileset:** Update existing tileset (if previously exported)

**Connected Tilesets:**
- Maintain reference back to dataset
- Re-export to update tileset
- Styles using tileset auto-update

**Tileset Benefits:**
- Optimized vector tiles for fast rendering
- Usable in Mapbox Studio style editor
- Cacheable and scalable

---

## Common Patterns

### Create Point Dataset from CSV

**CSV Format:**
```csv
longitude,latitude,name,category,value
-74.006,40.7128,Location A,retail,100
-118.2437,34.0522,Location B,office,80
```

**Steps:**
1. Create new dataset
2. Upload CSV
3. Edit properties as needed
4. Export to tileset

### Draw Polygon Boundaries

**Use Case:** Define service areas, districts, zones

**Steps:**
1. Create blank dataset
2. Change background to satellite (paint **Background**)
3. Use polygon **Draw Polygon** tool
4. Click vertices around boundary
5. Close polygon
6. Add properties (name, type, etc.)
7. Export to tileset

### Combine Multiple Data Sources

**Use Case:** Merge data from different files

**Steps:**
1. Create dataset from first file
2. Click plus **Import** to add second file
3. Repeat for additional files
4. Edit properties to standardize
5. Export combined dataset to tileset

### Edit Existing GeoJSON

**Steps:**
1. Upload GeoJSON to create dataset
2. Use draw tools to adjust geometries
3. Edit properties in panel
4. Save changes
5. Download updated GeoJSON (or export to tileset)

---

## Dataset Editor Features

### Search Dataset

**Find Features by Property:**

1. Click search **Search dataset** in toolbar
2. Enter property value
3. View results with thumbnails
4. Click result to jump to feature on map

**Use Case:** Quickly locate specific features in large datasets

### Background Styles

**Available Backgrounds:**
- Default dataset editor style (light)
- Mapbox Satellite
- Mapbox Satellite Streets
- Empty canvas

**Switch Background:**
- Click paint **Background** button
- Select desired background

### Keyboard Shortcuts

**View Shortcuts:**
- Click question **Help** button
- Review keyboard shortcuts
- Enable guided walkthrough (first time)

**Common Shortcuts:**
- `Delete` or `Backspace`: Delete selected feature
- `Esc`: Deselect feature
- `Ctrl/Cmd + Z`: Undo (current session only)

---

## Data Management

### Download Dataset

**Export as GeoJSON:**

1. Go to Datasets page
2. Click menu (three dots) next to dataset
3. Click arrow-down **Download**
4. Save GeoJSON file locally

**Use Cases:**
- Backup dataset
- Use in other GIS software
- Share with collaborators
- Process with scripts

### Replace Dataset

**No Direct Replace:**
- Mapbox Studio doesn't support replacing all features at once
- Must update features individually via Dataset API
- Or delete all features and import new data

### Delete Dataset

**Important:**
- Deletion cannot be undone
- Connected tilesets remain intact
- Cannot update tilesets from deleted dataset

**Before Deleting:**
1. Download dataset as backup
2. Note connected tilesets
3. Plan re-export workflow if needed

---

## Best Practices

✅ Save frequently (history only persists during current session)  
✅ Use descriptive property names (lowercase, underscores for spaces)  
✅ Add custom ID property if feature IDs matter (import resets IDs)  
✅ Validate data before export (check properties, geometries)  
✅ Use appropriate geometry types (points, lines, polygons)  
✅ Keep datasets under 20 MB for editor compatibility  
✅ Export to tileset for use in styles (datasets not directly usable)  
✅ Document dataset purpose and property schema

---

## Troubleshooting

### Dataset Not Displaying in Editor

**Cause:** Dataset > 20 MB  
**Solution:** Use Datasets API to edit, or split into smaller datasets

### Upload Failed

**Common Causes:**
- Invalid GeoJSON structure
- File size > 5 MB per import
- Unsupported file format

**Solutions:**
- Validate GeoJSON online
- Split large files
- Convert to supported format

### Properties Not Appearing in Style

**Check:**
1. Feature has property (click feature in dataset editor)
2. Property name matches expression in style
3. Property value is correct type (string, number, boolean)
4. Dataset exported to tileset
5. Style references correct tileset

### Lost Changes

**Cause:** History resets when dataset closed  
**Solution:** No recovery - save frequently during editing session

---

## Integration with Styles

### Use Dataset Properties in Style

**After Export to Tileset:**

```json
{
  "id": "data-layer",
  "type": "circle",
  "source": "custom-data",
  "source-layer": "layer-name",
  "paint": {
    "circle-color": [
      "match",
      ["get", "category"],
      "retail", "#f00",
      "office", "#0f0",
      "#ccc"
    ],
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["get", "value"],
      0, 2,
      100, 10
    ]
  }
}
```

### Update Tileset After Dataset Changes

**Connected Tileset:**

1. Edit dataset
2. Save changes
3. Click **Export**
4. Choose **Update connected tileset**
5. All styles using tileset auto-update (within 15 min)

---

This command provides comprehensive dataset editing workflows for Mapbox Studio.

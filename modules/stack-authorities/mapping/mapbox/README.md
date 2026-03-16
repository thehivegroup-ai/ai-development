# Mapbox Stack Authority

**Module ID:** `mapping/mapbox`  
**Version:** 1.0.0

---

## Overview

Mapbox mapping platform for creating custom map styles, managing tilesets and datasets, and implementing maps in web and mobile applications using Mapbox GL JS and native SDKs.

---

## What's Included

- **Rule:** 50-mapping-mapbox.mdc
- **Commands:** 
  - mapbox.style.create
  - mapbox.tileset.manage
  - mapbox.dataset.edit
- **Skill:** mapbox-standards
- **Agent:** mapbox.style-reviewer

---

## Technology

- Mapbox Studio (style editor, dataset editor, tileset management)
- Mapbox GL JS (web)
- Mapbox Maps SDK for iOS and Android (mobile)
- Mapbox Standard and Satellite styles
- Vector and raster tilesets

---

## Key Workflows

### Dataset → Tileset → Style → Application

1. **Dataset Editor:** Create/edit GeoJSON features with properties
2. **Tileset Export:** Convert dataset to vector tiles for performance
3. **Style Editor:** Configure visual appearance using components and layers
4. **Integration:** Use style URL in Mapbox GL JS or mobile SDKs

### Style Customization

- **Components:** Group-level styling (colors, typography, patterns)
- **Layers:** Individual feature styling (fill, line, symbol, circle, etc.)
- **3D Features:** Terrain, fill-extrusion, hillshade, sky layers
- **Data-driven styling:** Style by zoom range, data range, or conditions

---

## Common Patterns

### Custom Data Upload
- Upload GeoJSON, CSV, KML, GPX, Shapefile, or GeoTIFF
- Max 20 uploads/month, 300 MB per upload (free tier)
- Vector sources: 15 source limit per style

### Style Publishing
- Draft mode: changes visible only in editor
- Production mode: publish to update live applications
- Updates take up to 15 minutes to propagate

### Component-Based Design
- Use components for consistent styling across layers
- Eject components only when fine-grained layer control needed
- Update components to receive latest features

---

**Last Updated:** 2026-03-16

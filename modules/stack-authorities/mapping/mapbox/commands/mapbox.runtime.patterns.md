# Mapbox: Runtime Patterns

Implement runtime Mapbox GL JS patterns for interactive maps.

## Parallel Execution

**Map initialization and configuration can be parallelized:**

```
Phase 1: Setup (PARALLEL)
┌──────────────────────────────────────────────┐
│ Task A: Map Configuration                    │
│         - Access token setup                 │
│         - Initial map options                │
│                                              │
│ Task B: Event Handlers                       │
│         - Define click handlers              │
│         - Setup interaction events           │
│                                              │
│ Task C: Data Sources Preparation             │
│         - Prepare GeoJSON data               │
│         - Configure source options           │
└──────────────────┬───────────────────────────┘
                   ↓
Phase 2: Map Initialization (SEQUENTIAL)
• Create map instance
• Wait for 'load' event
                   ↓
Phase 3: Layer Addition (SEQUENTIAL - order matters)
• Add sources
• Add layers in order (fill → line → symbol)
• Add controls and markers
```

**Time savings:** 30-40% faster

## Steps

1. **Initialize map** - Create map instance with style and options
2. **Add sources** - GeoJSON, vector tiles, or image sources
3. **Add layers** - Create layers with data-driven styling
4. **Add interactions** - Click handlers, hover effects, popups
5. **Add controls** - Navigation, geolocate, fullscreen controls
6. **Test behavior** - Verify events, camera movements, feature queries

## Common Patterns

### Map Lifecycle
- Wait for `load` event before adding sources/layers
- Use `idle` event for post-render operations
- Clean up on unmount: `map.remove()`

### Interactive Features
- Use feature state for hover/selection (not re-styling)
- Query features at click point: `queryRenderedFeatures(e.point)`
- Debounce expensive operations on move/zoom events

### Markers & Popups
- Reuse Popup/Marker instances
- Attach popups to markers for better UX
- Use custom marker elements for branding

## Guidance

- **Apply `mapbox-standards` skill** for Studio and style integration
- **Apply `mapbox-web-integration-patterns` and `mapbox-web-performance-patterns` skills** for GL JS lifecycle, sources/layers, markers, controls, and performance

# KLZ PropTech KV Store Data Flow Diagram

## Overview

This document provides the visual architecture diagram for the KLZ PropTech KV Store optimization system.

## Accessing the Diagram

### Interactive Version

The interactive diagram is available in the application:

1. Navigate to **Help** section in the sidebar
2. Click on **"KV Store Data Flow Architecture"** card
3. Interact with the diagram (hover, zoom, toggle animations)

Direct path: `/data-flow-diagram`

### Features

The interactive diagram includes:

- **Hover effects** - Highlight components on hover
- **Animations** - Flowing data particles showing real-time data flow
- **Zoom controls** - Scale from 50% to 150%
- **Export options** - Download as PNG or SVG
- **Performance metrics** - Live stats display at bottom
- **Legend** - Clear explanation of visual elements

## Diagram Components

### 1. Supabase KV Store (Left)
- **Color**: Dark Green (#5B6E49)
- **Icon**: Database
- **Description**: JSONB key/value storage layer
- **Key Patterns**:
  - `audit:{timestamp}`
  - `api:{endpoint}:{timestamp}`
  - `login:{user_id}:{timestamp}`

### 2. KV Data Fetcher
- **Color**: Medium Green (#7A8F6A)
- **Icon**: Activity
- **Description**: Optimized query layer
- **Features**:
  - Prefix-based queries
  - 200 entry limit
  - JSONB parsing with validation
  - ~150ms fetch time

### 3. Smart Cache System (Center)
- **Color**: Soft Green (#9BAE84)
- **Icon**: Cloud
- **Description**: In-memory caching layer
- **Specs**:
  - LRU eviction (500 items max)
  - 2-minute TTL
  - 85-95% hit rate
  - Real-time invalidation

### 4. Data Aggregator
- **Color**: Soft Green (#9BAE84)
- **Icon**: Bar Chart
- **Description**: Time-based data processing
- **Functions**:
  - Day/Week/Month grouping
  - Preprocessed chart data
  - Memoization

### 5. Frontend Consumers (Right)
- **Color**: Muted Green (#8B9F7F)
- **Components**:
  - Admin Intelligence Dashboard
  - Security Audit Dashboard
  - Performance Monitor Widget

### 6. AI Optimizer (Top - Future)
- **Color**: Gold (#D9C58E)
- **Icon**: Brain
- **Description**: Future enhancement layer
- **Planned Features**:
  - Predictive caching
  - Anomaly detection
  - Smart cache warming

## Connection Types

### Solid Arrows (Green)
- Represent main data flow
- Show synchronous operations
- Include flow animations

### Dotted Arrows (Gold)
- Represent real-time updates
- Show asynchronous operations
- Indicate future AI connections

## Performance Metrics Displayed

| Metric | Value | Description |
|--------|-------|-------------|
| Avg Load Time | 150-300ms | Total request to render time |
| Cache Hit Rate | 85-95% | Requests served from cache |
| Fetch Time | ~150ms | Database query time |
| Cache Size | 500 items | Maximum cached entries |
| TTL | 2 minutes | Cache duration |

## Use Cases

This diagram is designed for:

1. **Developer Onboarding** - Understanding system architecture
2. **Technical Documentation** - Explaining optimization strategy
3. **Investor Presentations** - Showcasing technical capabilities
4. **Performance Audits** - Visualizing data flow bottlenecks
5. **Team Training** - Teaching caching and optimization concepts

## Export Options

### PNG Export
- **Resolution**: 1920x1080 (16:9)
- **DPI**: 300 for print quality
- **Use Case**: Presentations, reports, documentation

### SVG Export
- **Format**: Scalable vector graphics
- **Use Case**: Technical documentation, web embedding
- **Benefits**: Infinite scaling, small file size

## Technical Implementation

The diagram is built using:

- **React** - Component framework
- **Motion/React** - Animations
- **SVG** - Vector graphics
- **Lucide Icons** - Icon library
- **Tailwind CSS** - Styling

Source code: `/components/KVStoreDataFlowDiagram.tsx`

## Color Palette

```
Database Layer:    #5B6E49 (Dark Green)
Fetch Layer:       #7A8F6A (Medium Green)
Processing Layers: #9BAE84 (Soft Green)
Frontend:          #8B9F7F (Muted Green)
AI Future:         #D9C58E (Gold)
Accents:           #6366F1 (Blue for real-time)
```

## Viewing Tips

1. **Desktop**: Best viewed at 100% zoom on 1920px+ screens
2. **Tablet**: Use zoom controls for optimal viewing
3. **Presentations**: Export to PNG at 1920x1080
4. **Documentation**: Use SVG for embedding in docs

## Related Documentation

- [KV Store Optimization Guide](./KV_STORE_OPTIMIZATION_GUIDE.md)
- [Performance Metrics](./KV_STORE_OPTIMIZATION_GUIDE.md#performance-results)
- [Architecture Overview](./KV_STORE_OPTIMIZATION_GUIDE.md#architecture)

---

**Version**: 1.0.0  
**Last Updated**: October 22, 2025  
**Maintained By**: Development Team  
**License**: KLZ PropTech Internal Documentation

/**
 * Estal PropTech KV Store Data Flow Visualization
 * Interactive diagram showing data flow from Supabase to Frontend with real-time telemetry
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Cloud,
  Clock,
  Gauge,
  Brain,
  Shield,
  Activity,
  Zap,
  RefreshCw,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Pause,
  Code,
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useTelemetryData } from '../hooks/useTelemetryData';
import { SystemHealthPanel } from './SystemHealthPanel';
import { LiveNode } from './LiveNode';

interface FlowNode {
  id: string;
  label: string;
  description?: string;
  icon: any;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  subLabels?: string[];
  metrics?: string[];
  nodeType: 'database' | 'fetch' | 'cache' | 'aggregation' | 'frontend' | 'ai';
}

export function KVStoreDataFlowDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showAnimations, setShowAnimations] = useState(true);
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);
  
  // Real-time telemetry data
  const {
    metrics,
    history,
    isLive,
    isPaused,
    togglePause,
    healthScore,
    lastUpdateTime,
  } = useTelemetryData({
    enabled: true,
    pollingInterval: 5000, // 5 seconds
    historySize: 30,
  });

  // Define all nodes in the diagram
  const nodes: FlowNode[] = [
    // 1. Supabase KV Store
    {
      id: 'supabase',
      label: 'Supabase KV Store',
      description: 'JSONB key/value storage',
      icon: Database,
      color: '#5B6E49',
      x: 50,
      y: 250,
      width: 180,
      height: 140,
      subLabels: [
        'audit:{timestamp}',
        'api:{endpoint}:{ts}',
        'login:{user_id}:{ts}',
      ],
      nodeType: 'database',
    },
    
    // 2. Fetch Layer
    {
      id: 'fetch',
      label: 'KV Data Fetcher',
      description: 'Prefix-based queries',
      icon: Activity,
      color: '#7A8F6A',
      x: 280,
      y: 260,
      width: 160,
      height: 120,
      subLabels: ['Limit: 200 entries', 'JSONB parsing'],
      metrics: metrics ? [`${metrics.fetchLatency}ms`] : ['~150ms'],
      nodeType: 'fetch',
    },
    
    // 3. Cache Layer (center)
    {
      id: 'cache',
      label: 'Smart Cache System',
      description: 'In-memory + persistent',
      icon: Cloud,
      color: '#9BAE84',
      x: 490,
      y: 240,
      width: 200,
      height: 160,
      subLabels: [
        'LRU (500 items)',
        'TTL: 2 minutes',
        metrics ? `Hit rate: ${metrics.cacheHitRate}%` : 'Hit rate: 85-95%',
      ],
      nodeType: 'cache',
    },
    
    // 4. Aggregation Layer
    {
      id: 'aggregation',
      label: 'Data Aggregator',
      description: 'Time-based grouping',
      icon: BarChart3,
      color: '#9BAE84',
      x: 740,
      y: 260,
      width: 170,
      height: 120,
      subLabels: ['Day/Week/Month', 'Preprocess for charts'],
      nodeType: 'aggregation',
    },
    
    // 5. Frontend Consumers
    {
      id: 'admin-dashboard',
      label: 'Admin Intelligence',
      icon: Gauge,
      color: '#8B9F7F',
      x: 960,
      y: 180,
      width: 160,
      height: 80,
      nodeType: 'frontend',
    },
    {
      id: 'security-dashboard',
      label: 'Security Audit',
      icon: Shield,
      color: '#8B9F7F',
      x: 960,
      y: 290,
      width: 160,
      height: 80,
      nodeType: 'frontend',
    },
    {
      id: 'performance-monitor',
      label: 'Performance Monitor',
      icon: TrendingUp,
      color: '#8B9F7F',
      x: 960,
      y: 400,
      width: 160,
      height: 80,
      nodeType: 'frontend',
    },
    
    // 6. AI Analytics (top overlay)
    {
      id: 'ai-optimizer',
      label: 'AI Optimizer',
      description: 'Future Phase',
      icon: Brain,
      color: '#D9C58E',
      x: 490,
      y: 60,
      width: 200,
      height: 100,
      subLabels: ['Predictive caching', 'Anomaly detection'],
      nodeType: 'ai',
    },
  ];

  // Define connections between nodes
  const connections = [
    // Main data flow
    { from: 'supabase', to: 'fetch', type: 'solid', label: 'Query' },
    { from: 'fetch', to: 'cache', type: 'solid', label: 'Store' },
    { from: 'cache', to: 'aggregation', type: 'solid', label: 'Process' },
    { from: 'aggregation', to: 'admin-dashboard', type: 'solid' },
    { from: 'aggregation', to: 'security-dashboard', type: 'solid' },
    { from: 'aggregation', to: 'performance-monitor', type: 'solid' },
    
    // Real-time sync
    { from: 'supabase', to: 'cache', type: 'dotted', label: 'Real-time sync' },
    
    // AI future connections
    { from: 'ai-optimizer', to: 'cache', type: 'dotted', label: 'Smart caching' },
    { from: 'ai-optimizer', to: 'aggregation', type: 'dotted', label: 'Predictions' },
    
    // Direct cache read
    { from: 'cache', to: 'admin-dashboard', type: 'dotted', label: 'Instant read' },
  ];

  // Generate SVG path for curved connections
  const generatePath = (from: FlowNode, to: FlowNode, type: 'solid' | 'dotted') => {
    const startX = from.x + from.width;
    const startY = from.y + from.height / 2;
    const endX = to.x;
    const endY = to.y + to.height / 2;
    
    const controlX1 = startX + (endX - startX) / 3;
    const controlX2 = startX + ((endX - startX) * 2) / 3;
    
    return `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
  };

  return (
    <>
    <Card className="w-full bg-white rounded-[24px] border-2 border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl flex items-center gap-3">
              <Database className="w-7 h-7 text-primary" />
              Estal PropTech KV Store Data Flow
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              Interactive visualization of caching, aggregation, and analytics layers
              {isLive && (
                <Badge variant="default" className="rounded-[6px] ml-2 bg-green-600">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white mr-1"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  Live Telemetry
                </Badge>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Telemetry Mode Toggle */}
            <Button
              onClick={togglePause}
              variant={isPaused ? 'outline' : 'default'}
              size="sm"
              className="rounded-[12px] flex items-center gap-2"
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm">Pause</span>
                </>
              )}
            </Button>
            
            {/* Animation Toggle */}
            <Button
              onClick={() => setShowAnimations(!showAnimations)}
              variant="outline"
              size="sm"
              className="rounded-[12px] flex items-center gap-2"
            >
              {showAnimations ? (
                <>
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Animations</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Static</span>
                </>
              )}
            </Button>

            {/* Developer Mode Toggle */}
            <Button
              onClick={() => setShowDeveloperMode(!showDeveloperMode)}
              variant={showDeveloperMode ? 'default' : 'outline'}
              size="sm"
              className="rounded-[12px] flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              <span className="text-sm">Dev</span>
            </Button>
            
            <Badge variant="default" className="rounded-[8px]">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              v1.0.0
            </Badge>
          </div>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative bg-gradient-to-br from-muted/10 to-muted/30" style={{ aspectRatio: '16/9' }}>
        {/* Grid background */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Main SVG Canvas */}
        <svg className="w-full h-full" viewBox="0 0 1200 640">
          <defs>
            {/* Arrow markers */}
            <marker
              id="arrowhead-solid"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#9BAE84" />
            </marker>
            <marker
              id="arrowhead-dotted"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#D9C58E" />
            </marker>

            {/* Gradient for nodes */}
            <linearGradient id="node-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Shimmer gradient for frontend nodes */}
            <linearGradient id="shimmer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Draw connections first (behind nodes) */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;

            const path = generatePath(fromNode, toNode, conn.type);
            const isDotted = conn.type === 'dotted';
            const isHovered = hoveredNode === conn.from || hoveredNode === conn.to;

            return (
              <g key={`conn-${idx}`}>
                {/* Connection path */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={isDotted ? '#D9C58E' : '#9BAE84'}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeDasharray={isDotted ? '8 4' : '0'}
                  markerEnd={`url(#arrowhead-${conn.type})`}
                  opacity={isHovered ? 0.9 : 0.5}
                  initial={{ pathLength: 0 }}
                  animate={showAnimations ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: idx * 0.15 }}
                />

                {/* Flowing particles on connections - speed based on throughput */}
                {showAnimations && conn.type === 'solid' && (
                  <motion.circle
                    r="4"
                    fill="#9BAE84"
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: '100%' }}
                    transition={{
                      duration: metrics ? Math.max(2, 5 - metrics.dataUpdates / 20) : 3,
                      repeat: Infinity,
                      delay: idx * 0.5,
                      ease: 'linear',
                    }}
                    style={{ offsetPath: `path("${path}")` }}
                  />
                )}

                {/* Connection label */}
                {conn.label && (
                  <text
                    x={fromNode.x + (toNode.x - fromNode.x) / 2}
                    y={fromNode.y + (toNode.y - fromNode.y) / 2 - 10}
                    fontSize="11"
                    fill="#6B7280"
                    textAnchor="middle"
                    fontFamily="Inter, sans-serif"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw nodes with live telemetry */}
          {nodes.map((node, idx) => (
            <LiveNode
              key={node.id}
              {...node}
              metrics={metrics}
              isHovered={hoveredNode === node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}

          {/* Performance Metrics Callouts */}
          <g>
            {/* Cache Hit Rate */}
            <rect x="500" y="430" width="180" height="50" rx="12" fill="#10B981" opacity="0.9" />
            <text x="590" y="450" fontSize="11" fontWeight="600" fill="white" textAnchor="middle">
              Cache Hit Rate
            </text>
            <text x="590" y="468" fontSize="16" fontWeight="700" fill="white" textAnchor="middle">
              85-95%
            </text>
          </g>

          {/* Real-time Sync Indicator (bottom) */}
          <g>
            <rect x="40" y="560" width="600" height="60" rx="16" fill="#6366F1" opacity="0.15" />
            <text x="50" y="582" fontSize="12" fontWeight="600" fill="#6366F1">
              ⚡ Real-time Event Flow
            </text>
            <text x="50" y="600" fontSize="10" fill="#6B7280">
              Supabase subscriptions trigger silent cache updates with pulse animations
            </text>
          </g>
        </svg>

        {/* Floating Legend */}
        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-[16px] border-2 border-border p-4 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Legend</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-0.5 bg-[#9BAE84]" />
              <span className="text-xs text-muted-foreground">Data flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-0.5 bg-[#D9C58E] border-dashed border-t-2" />
              <span className="text-xs text-muted-foreground">Real-time updates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-[6px] bg-[#5B6E49]" />
              <span className="text-xs text-muted-foreground">Database layer</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-[6px] bg-[#9BAE84]" />
              <span className="text-xs text-muted-foreground">Processing layer</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-[6px] bg-[#D9C58E]" />
              <span className="text-xs text-muted-foreground">AI future layer</span>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-[12px] text-sm"
          >
            {nodes.find(n => n.id === hoveredNode)?.label}
          </motion.div>
        )}
      </div>

      {/* Footer Stats - Live or Static */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="grid grid-cols-5 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Fetch Time</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {metrics ? `${metrics.fetchLatency}ms` : '~150ms'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Cache Hit Rate</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {metrics ? `${metrics.cacheHitRate}%` : '85-95%'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Data Updates</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {metrics ? `${metrics.dataUpdates}/int` : '~30/int'}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Database className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Cache Size</p>
            </div>
            <p className="text-lg font-semibold text-foreground">500 items</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {metrics ? `${metrics.errorRate}%` : '<1%'}
            </p>
          </div>
        </div>
      </div>

      {/* Developer Mode Overlay */}
      {showDeveloperMode && metrics && (
        <div className="p-6 border-t border-border bg-muted/50">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Developer Console</h3>
          </div>
          <div className="bg-black/90 text-green-400 font-mono text-xs p-4 rounded-[12px] max-h-40 overflow-auto">
            <div className="space-y-1">
              <div>📊 Current Metrics:</div>
              <div className="ml-4">
                <div>fetchLatency: {metrics.fetchLatency}ms</div>
                <div>cacheHitRate: {metrics.cacheHitRate}%</div>
                <div>errorRate: {metrics.errorRate}%</div>
                <div>dataUpdates: {metrics.dataUpdates}</div>
                <div>subscriptionHealth: {metrics.subscriptionHealth ? '✅ connected' : '❌ disconnected'}</div>
                <div>timestamp: {new Date(metrics.timestamp).toISOString()}</div>
              </div>
              <div className="mt-2">📈 History Points: {history.length}/30</div>
              <div>🎯 Health Score: {healthScore}</div>
              <div className="mt-2 text-amber-400">
                ⚡ Telemetry Mode: {isPaused ? 'PAUSED' : 'LIVE'}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
    
    {/* Floating System Health Panel */}
    <SystemHealthPanel
      metrics={metrics}
      history={history}
      healthScore={healthScore}
      lastUpdateTime={lastUpdateTime}
      isLive={isLive}
    />
    </>
  );
}

/**
 * Static SVG export version for documentation
 */
export function KVStoreDataFlowSVG() {
  // Define nodes for static export
  const nodes = [
    { id: 'supabase', label: 'Supabase KV Store', x: 50, y: 250, width: 180, height: 140, color: '#5B6E49' },
    { id: 'fetch', label: 'KV Data Fetcher', x: 280, y: 260, width: 160, height: 120, color: '#7A8F6A' },
    { id: 'cache', label: 'Smart Cache System', x: 490, y: 240, width: 200, height: 160, color: '#9BAE84' },
    { id: 'aggregation', label: 'Data Aggregator', x: 740, y: 260, width: 170, height: 120, color: '#9BAE84' },
    { id: 'admin', label: 'Admin Dashboard', x: 960, y: 180, width: 160, height: 80, color: '#8B9F7F' },
    { id: 'security', label: 'Security Audit', x: 960, y: 290, width: 160, height: 80, color: '#8B9F7F' },
    { id: 'performance', label: 'Performance Monitor', x: 960, y: 400, width: 160, height: 80, color: '#8B9F7F' },
    { id: 'ai', label: 'AI Optimizer (Future)', x: 490, y: 60, width: 200, height: 100, color: '#D9C58E' },
  ];

  const generatePath = (fromX: number, fromY: number, toX: number, toY: number) => {
    const controlX1 = fromX + (toX - fromX) / 3;
    const controlX2 = fromX + ((toX - fromX) * 2) / 3;
    return `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
  };

  return (
    <svg
      viewBox="0 0 1200 640"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'white' }}
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid-export" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="1" />
        </pattern>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#9BAE84" />
        </marker>
        <marker id="arrow-dotted" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#D9C58E" />
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-export)" />

      {/* Title */}
      <text x="600" y="35" fontSize="24" fontWeight="700" fill="#1F2937" textAnchor="middle" fontFamily="Inter, sans-serif">
        Estal PropTech KV Store Data Flow Architecture
      </text>

      {/* Main data flow connections */}
      <path d={generatePath(230, 320, 280, 320)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d={generatePath(440, 320, 490, 320)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d={generatePath(690, 320, 740, 320)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d={generatePath(910, 300, 960, 220)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d={generatePath(910, 320, 960, 330)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
      <path d={generatePath(910, 340, 960, 440)} stroke="#9BAE84" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

      {/* Real-time sync (dotted) */}
      <path d={generatePath(230, 280, 490, 300)} stroke="#D9C58E" strokeWidth="2" fill="none" strokeDasharray="8 4" markerEnd="url(#arrow-dotted)" />
      
      {/* AI connections (dotted) */}
      <path d={generatePath(590, 160, 590, 240)} stroke="#D9C58E" strokeWidth="2" fill="none" strokeDasharray="8 4" markerEnd="url(#arrow-dotted)" />
      <path d={generatePath(690, 130, 740, 260)} stroke="#D9C58E" strokeWidth="2" fill="none" strokeDasharray="8 4" markerEnd="url(#arrow-dotted)" />

      {/* Draw nodes */}
      {nodes.map(node => (
        <g key={node.id}>
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx="20"
            fill={node.color}
            opacity="0.85"
          />
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx="20"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height / 2 + 5}
            fontSize="14"
            fontWeight="600"
            fill="white"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Performance metrics box */}
      <rect x="500" y="480" width="200" height="70" rx="12" fill="#10B981" opacity="0.2" stroke="#10B981" strokeWidth="2" />
      <text x="600" y="500" fontSize="12" fontWeight="600" fill="#059669" textAnchor="middle">Cache Hit Rate</text>
      <text x="600" y="530" fontSize="24" fontWeight="700" fill="#059669" textAnchor="middle">85-95%</text>

      {/* Legend */}
      <g transform="translate(40, 480)">
        <rect width="200" height="140" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="2" />
        <text x="100" y="25" fontSize="12" fontWeight="600" fill="#1F2937" textAnchor="middle">Legend</text>
        <line x1="20" y1="45" x2="60" y2="45" stroke="#9BAE84" strokeWidth="2" />
        <text x="70" y="50" fontSize="10" fill="#6B7280">Data flow</text>
        <line x1="20" y1="65" x2="60" y2="65" stroke="#D9C58E" strokeWidth="2" strokeDasharray="8 4" />
        <text x="70" y="70" fontSize="10" fill="#6B7280">Real-time updates</text>
        <rect x="20" y="80" width="16" height="16" rx="4" fill="#5B6E49" />
        <text x="45" y="92" fontSize="10" fill="#6B7280">Database</text>
        <rect x="20" y="100" width="16" height="16" rx="4" fill="#9BAE84" />
        <text x="45" y="112" fontSize="10" fill="#6B7280">Processing</text>
        <rect x="20" y="120" width="16" height="16" rx="4" fill="#D9C58E" />
        <text x="45" y="132" fontSize="10" fill="#6B7280">AI Future</text>
      </g>

      {/* Real-time indicator */}
      <rect x="750" y="560" width="420" height="60" rx="12" fill="#6366F1" opacity="0.1" stroke="#6366F1" strokeWidth="1" />
      <text x="760" y="582" fontSize="11" fontWeight="600" fill="#6366F1">⚡ Real-time Event Flow</text>
      <text x="760" y="600" fontSize="9" fill="#6B7280">Supabase subscriptions trigger silent cache updates</text>
      
      {/* Export marker */}
      <text x="1150" y="630" fontSize="10" fill="#9CA3AF" textAnchor="end" fontFamily="Inter, sans-serif">
        v1.0.0 © Estal PropTech 2025
      </text>
    </svg>
  );
}

/**
 * Live Node Component - Wraps diagram nodes with real-time visual feedback
 */

import { motion } from 'motion/react';
import type { TelemetryMetrics } from '../hooks/useTelemetryData';
import { 
  getLatencyColor, 
  getCacheHitRateColor 
} from '../hooks/useTelemetryData';

interface LiveNodeProps {
  id: string;
  label: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  baseColor: string;
  metrics: TelemetryMetrics | null;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  subLabels?: string[];
  nodeMetrics?: string[];
  nodeType: 'database' | 'fetch' | 'cache' | 'aggregation' | 'frontend' | 'ai';
}

/**
 * Get node intensity based on performance
 */
function getNodeIntensity(nodeType: string, metrics: TelemetryMetrics | null): number {
  if (!metrics) return 0.85;

  switch (nodeType) {
    case 'database':
      // Intensity based on fetch latency (inverse)
      return Math.max(0.6, Math.min(1, 1 - (metrics.fetchLatency - 100) / 500));
    
    case 'fetch':
      // Intensity based on data updates
      return Math.max(0.7, Math.min(1, 0.7 + metrics.dataUpdates / 100));
    
    case 'cache':
      // Intensity based on cache hit rate
      return Math.max(0.6, Math.min(1, metrics.cacheHitRate / 100));
    
    case 'aggregation':
      // Pulse based on activity
      return 0.85;
    
    case 'frontend':
      // Based on overall health
      return metrics.subscriptionHealth ? 0.9 : 0.6;
    
    case 'ai':
      // Future layer - subtle
      return 0.75;
    
    default:
      return 0.85;
  }
}

/**
 * Get border glow strength
 */
function getBorderGlow(nodeType: string, metrics: TelemetryMetrics | null): number {
  if (!metrics) return 0;

  switch (nodeType) {
    case 'cache':
      // Strong glow for high cache hit rate
      return metrics.cacheHitRate > 90 ? 8 : metrics.cacheHitRate > 80 ? 4 : 0;
    
    case 'database':
      // Glow when latency is good
      return metrics.fetchLatency < 200 ? 6 : 0;
    
    case 'aggregation':
      // Glow on updates
      return metrics.dataUpdates > 30 ? 5 : 0;
    
    default:
      return 0;
  }
}

/**
 * Get pulse animation for active nodes
 */
function shouldPulse(nodeType: string, metrics: TelemetryMetrics | null): boolean {
  if (!metrics) return false;

  switch (nodeType) {
    case 'aggregation':
      return metrics.dataUpdates > 20;
    case 'frontend':
      return metrics.subscriptionHealth;
    default:
      return false;
  }
}

export function LiveNode({
  id,
  label,
  description,
  x,
  y,
  width,
  height,
  baseColor,
  metrics,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  subLabels,
  nodeMetrics,
  nodeType,
}: LiveNodeProps) {
  const intensity = getNodeIntensity(nodeType, metrics);
  const glowStrength = getBorderGlow(nodeType, metrics);
  const pulse = shouldPulse(nodeType, metrics);

  // Calculate dynamic color
  const nodeColor = adjustColorIntensity(baseColor, intensity);

  return (
    <g
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect behind node */}
      {glowStrength > 0 && (
        <motion.rect
          x={x - glowStrength}
          y={y - glowStrength}
          width={width + glowStrength * 2}
          height={height + glowStrength * 2}
          rx="20"
          fill={nodeColor}
          opacity={0.3}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main node background with pulse */}
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="20"
        fill={nodeColor}
        opacity={isHovered ? 0.95 : intensity}
        animate={pulse ? {
          scale: [1, 1.02, 1],
        } : {}}
        transition={pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        } : {}}
        style={{ transformOrigin: `${x + width / 2}px ${y + height / 2}px` }}
      />

      {/* Gradient overlay */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="20"
        fill="url(#node-gradient)"
      />

      {/* Border with dynamic glow */}
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="20"
        fill="none"
        stroke="white"
        strokeWidth={isHovered ? 3 : glowStrength > 0 ? 2 : 1.5}
        opacity={glowStrength > 0 ? 0.8 : 0.5}
        animate={glowStrength > 0 ? {
          opacity: [0.5, 0.9, 0.5],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Shimmer effect for frontend nodes receiving data */}
      {nodeType === 'frontend' && metrics?.subscriptionHealth && (
        <motion.rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="20"
          fill="url(#shimmer-gradient)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            x: [x - width, x + width],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Node label */}
      <text
        x={x + width / 2}
        y={y + 30}
        fontSize="14"
        fontWeight="600"
        fill="white"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
      >
        {label}
      </text>

      {/* Node description */}
      {description && (
        <text
          x={x + width / 2}
          y={y + 48}
          fontSize="10"
          fill="white"
          opacity="0.8"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          {description}
        </text>
      )}

      {/* Sub-labels */}
      {subLabels?.map((sublabel, i) => (
        <text
          key={i}
          x={x + width / 2}
          y={y + 70 + i * 18}
          fontSize="9"
          fill="white"
          opacity="0.9"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {sublabel}
        </text>
      ))}

      {/* Node metrics */}
      {nodeMetrics?.map((metric, i) => (
        <text
          key={i}
          x={x + width / 2}
          y={y + height - 15}
          fontSize="10"
          fontWeight="600"
          fill="#FCD34D"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
        >
          {metric}
        </text>
      ))}

      {/* Live indicator dot for active nodes */}
      {metrics?.subscriptionHealth && (nodeType === 'cache' || nodeType === 'database') && (
        <g>
          <circle
            cx={x + width - 15}
            cy={y + 15}
            r="4"
            fill="#10B981"
          />
          <motion.circle
            cx={x + width - 15}
            cy={y + 15}
            r="4"
            fill="#10B981"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </g>
      )}
    </g>
  );
}

/**
 * Helper function to adjust color intensity
 */
function adjustColorIntensity(hexColor: string, intensity: number): string {
  // Parse hex color
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Adjust intensity
  const adjustedR = Math.round(r * intensity);
  const adjustedG = Math.round(g * intensity);
  const adjustedB = Math.round(b * intensity);
  
  // Convert back to hex
  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
}

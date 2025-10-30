/**
 * KV Store Cache System
 * Provides in-memory caching with TTL and smart invalidation
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastSync: number;
}

class KVCache {
  private cache: Map<string, CacheEntry<any>>;
  private stats: CacheStats;
  private maxSize: number;
  private defaultTTL: number; // in milliseconds

  constructor(maxSize = 500, defaultTTL = 2 * 60 * 1000) {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      lastSync: Date.now(),
    };
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get data from cache
   */
  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const age = Date.now() - entry.timestamp;
    const maxAge = ttl || this.defaultTTL;

    if (age > maxAge) {
      // Expired
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key,
    });

    this.stats.size = this.cache.size;
    this.stats.lastSync = Date.now();
  }

  /**
   * Get multiple keys by prefix
   */
  getByPrefix<T>(prefix: string, ttl?: number): T[] {
    const results: T[] = [];
    const now = Date.now();
    const maxAge = ttl || this.defaultTTL;

    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(prefix)) {
        const age = now - entry.timestamp;
        if (age <= maxAge) {
          results.push(entry.data as T);
        } else {
          // Remove expired entry
          this.cache.delete(key);
        }
      }
    }

    return results;
  }

  /**
   * Set multiple entries
   */
  setMany<T>(entries: Array<{ key: string; data: T }>): void {
    entries.forEach(({ key, data }) => {
      this.set(key, data);
    });
  }

  /**
   * Clear cache by prefix
   */
  clearByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
    this.stats.size = this.cache.size;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;

    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  /**
   * Get age of cached data in seconds
   */
  getAge(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    return Math.floor((Date.now() - entry.timestamp) / 1000);
  }

  /**
   * Check if cache has valid data
   */
  has(key: string, ttl?: number): boolean {
    return this.get(key, ttl) !== null;
  }

  /**
   * Update last sync timestamp
   */
  markSynced(): void {
    this.stats.lastSync = Date.now();
  }

  /**
   * Get time since last sync in seconds
   */
  getTimeSinceSync(): number {
    return Math.floor((Date.now() - this.stats.lastSync) / 1000);
  }
}

// Export singleton instance
export const kvCache = new KVCache();

// Export class for testing
export { KVCache };

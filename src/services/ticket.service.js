// const Redis = require('ioredis');
// const SupportTicket = require('../models/supportTicket.model');
// const SupportMessage = require('../models/supportMessage.model');

// const redis = new Redis({
//   host: process.env.REDIS_HOST || 'localhost',
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     return delay;
//   }
// });

// redis.on('connect', () => {
//   console.log('✅ Redis connected for ticket caching');
// });

// redis.on('error', (err) => {
//   console.error('❌ Redis error:', err.message);
// });

// const CACHE_TTL = 300; // 5 minutes
// const CACHE_PREFIX = 'ticket:';

// /**
//  * Get ticket from cache or database
//  */
// /**
//  * Get ticket by ID with caching
//  */
// async function getTicketById(ticketId, populate = true) {
//   const cacheKey = `ticket:${ticketId}`;

//   try {
//     // Try cache first
//     const cached = await redis.get(cacheKey);
//     if (cached) {
//       console.log(`✅ Cache hit for ticket ${ticketId}`);
//       return JSON.parse(cached);
//     }

//     console.log(`❌ Cache miss for ticket ${ticketId}`);

//     // Fetch from DB
//     let query = SupportTicket.findById(ticketId);
    
//     if (populate) {
//       query = query
//         .populate('user', 'email firstName lastName role')
//         .populate('primaryAgent', 'email firstName lastName role averageRating totalRatings')
//         .populate('assignedAgents.agent', 'email firstName lastName role');
//     }

//     const ticket = await query;

//     if (!ticket) {
//       return null; // Don't cache null
//     }

//     // Cache for 5 minutes
//     await redis.setex(cacheKey, 300, JSON.stringify(ticket));

//     return ticket;
//   } catch (error) {
//     console.error(`Error getting ticket ${ticketId}:`, error);
//     // Return null instead of throwing to allow fallback
//     return null;
//   }
// }

// /**
//  * Invalidate ticket cache
//  */
// async function invalidateTicketCache(ticketId) {
//   try {
//     const cacheKey = `${CACHE_PREFIX}${ticketId}`;
//     await redis.del(cacheKey);
//     console.log(`🗑️  Cache invalidated for ticket ${ticketId}`);
//   } catch (error) {
//     console.error('Error invalidating cache:', error);
//   }
// }

// /**
//  * Get ticket messages (with caching)
//  */
// async function getTicketMessages(ticketId, limit = 50) {
//   try {
//     const cacheKey = `${CACHE_PREFIX}messages:${ticketId}`;
//     const cached = await redis.get(cacheKey);
    
//     if (cached) {
//       console.log(`✅ Cache hit for messages ${ticketId}`);
//       return JSON.parse(cached);
//     }
    
//     console.log(`❌ Cache miss for messages ${ticketId}`);
    
//     const messages = await SupportMessage.find({ ticket: ticketId })
//       .populate('sender', 'email firstName lastName role')
//       .sort({ createdAt: 1 })
//       .limit(limit);
    
//     // Cache for 2 minutes (shorter TTL for messages)
//     await redis.setex(cacheKey, 120, JSON.stringify(messages));
    
//     return messages;
//   } catch (error) {
//     console.error('Error getting messages:', error);
//     return await SupportMessage.find({ ticket: ticketId })
//       .populate('sender', 'email firstName lastName role')
//       .sort({ createdAt: 1 })
//       .limit(limit);
//   }
// }

// /**
//  * Invalidate messages cache
//  */
// async function invalidateMessagesCache(ticketId) {
//   try {
//     const cacheKey = `${CACHE_PREFIX}messages:${ticketId}`;
//     await redis.del(cacheKey);
//     console.log(`🗑️  Messages cache invalidated for ticket ${ticketId}`);
//   } catch (error) {
//     console.error('Error invalidating messages cache:', error);
//   }
// }

// /**
//  * Get ticket statistics (cached)
//  */
// async function getTicketStats(userId = null, role = null) {
//   try {
//     const cacheKey = userId 
//       ? `${CACHE_PREFIX}stats:user:${userId}`
//       : `${CACHE_PREFIX}stats:global`;
    
//     const cached = await redis.get(cacheKey);
//     if (cached) {
//       return JSON.parse(cached);
//     }
    
//     const matchQuery = userId ? { user: userId } : {};
    
//     const stats = await SupportTicket.aggregate([
//       { $match: matchQuery },
//       {
//         $facet: {
//           byStatus: [
//             { $group: { _id: '$status', count: { $sum: 1 } } }
//           ],
//           byPriority: [
//             { $group: { _id: '$priority', count: { $sum: 1 } } }
//           ],
//           byCategory: [
//             { $group: { _id: '$category', count: { $sum: 1 } } }
//           ],
//           overall: [
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: 1 },
//                 avgResponseTime: { $avg: '$responseTime' },
//                 avgResolutionTime: { $avg: '$resolutionTime' },
//                 avgRating: { $avg: '$rating' }
//               }
//             }
//           ]
//         }
//       }
//     ]);
    
//     const result = {
//       byStatus: stats[0].byStatus.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       byPriority: stats[0].byPriority.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       byCategory: stats[0].byCategory.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       overall: stats[0].overall[0] || {
//         total: 0,
//         avgResponseTime: 0,
//         avgResolutionTime: 0,
//         avgRating: 0
//       }
//     };
    
//     // Cache for 5 minutes
//     await redis.setex(cacheKey, 300, JSON.stringify(result));
    
//     return result;
//   } catch (error) {
//     console.error('Error getting stats:', error);
//     return null;
//   }
// }

// /**
//  * Invalidate stats cache
//  */
// async function invalidateStatsCache(userId = null) {
//   try {
//     if (userId) {
//       await redis.del(`${CACHE_PREFIX}stats:user:${userId}`);
//     }
//     await redis.del(`${CACHE_PREFIX}stats:global`);
//     console.log(`🗑️  Stats cache invalidated`);
//   } catch (error) {
//     console.error('Error invalidating stats cache:', error);
//   }
// }

// module.exports = {
//   redis,
//   getTicketById,
//   invalidateTicketCache,
//   getTicketMessages,
//   invalidateMessagesCache,
//   getTicketStats,
//   invalidateStatsCache
// };



const Redis = require('ioredis');
const SupportTicket = require('../models/supportTicket.model');
const SupportMessage = require('../models/supportMessage.model');

let redis = null;

// Only create Redis if not disabled and credentials provided
if (process.env.REDIS_DISABLED !== 'true' && process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost') {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    tls: process.env.REDIS_HOST.includes('upstash') ? {} : undefined,
    maxRetriesPerRequest: 3, // CRITICAL: Limit retries
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 3) {
        console.warn('⚠️ Redis max retries reached, giving up');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true // Don't connect immediately
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected for ticket caching');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
    // Don't crash the app
  });

  // Try to connect but don't block startup
  redis.connect().catch(err => {
    console.warn('⚠️ Redis connection failed, running without cache:', err.message);
    redis = null;
  });
} else {
  console.log('ℹ️ Redis disabled or not configured, running without cache');
}

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'ticket:';

/**
 * Get ticket from cache or database
 */
/**
 * Get ticket by ID with caching
 */
async function getTicketById(ticketId, populate = true) {
  const cacheKey = `ticket:${ticketId}`;

  try {
    // Try cache first only if Redis is available
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`✅ Cache hit for ticket ${ticketId}`);
        return JSON.parse(cached);
      }
      console.log(`❌ Cache miss for ticket ${ticketId}`);
    }

    // Fetch from DB
    let query = SupportTicket.findById(ticketId);
    
    if (populate) {
      query = query
        .populate('user', 'email firstName lastName role')
        .populate('primaryAgent', 'email firstName lastName role averageRating totalRatings')
        .populate('assignedAgents.agent', 'email firstName lastName role');
    }

    const ticket = await query;

    if (!ticket) {
      return null; // Don't cache null
    }

    // Cache for 5 minutes only if Redis is available
    if (redis) {
      await redis.setex(cacheKey, 300, JSON.stringify(ticket)).catch(err => {
        console.warn('Cache set failed:', err.message);
      });
    }

    return ticket;
  } catch (error) {
    console.error(`Error getting ticket ${ticketId}:`, error);
    // Return null instead of throwing to allow fallback
    return null;
  }
}

/**
 * Invalidate ticket cache
 */
async function invalidateTicketCache(ticketId) {
  if (!redis) return; // Skip if Redis unavailable
  
  try {
    const cacheKey = `${CACHE_PREFIX}${ticketId}`;
    await redis.del(cacheKey);
    console.log(`🗑️  Cache invalidated for ticket ${ticketId}`);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
}

/**
 * Get ticket messages (with caching)
 */
async function getTicketMessages(ticketId, limit = 50) {
  try {
    if (redis) {
      const cacheKey = `${CACHE_PREFIX}messages:${ticketId}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        console.log(`✅ Cache hit for messages ${ticketId}`);
        return JSON.parse(cached);
      }
      
      console.log(`❌ Cache miss for messages ${ticketId}`);
    }
    
    const messages = await SupportMessage.find({ ticket: ticketId })
      .populate('sender', 'email firstName lastName role')
      .sort({ createdAt: 1 })
      .limit(limit);
    
    // Cache for 2 minutes (shorter TTL for messages)
    if (redis) {
      await redis.setex(`${CACHE_PREFIX}messages:${ticketId}`, 120, JSON.stringify(messages))
        .catch(err => console.warn('Cache set failed:', err.message));
    }
    
    return messages;
  } catch (error) {
    console.error('Error getting messages:', error);
    return await SupportMessage.find({ ticket: ticketId })
      .populate('sender', 'email firstName lastName role')
      .sort({ createdAt: 1 })
      .limit(limit);
  }
}

/**
 * Invalidate messages cache
 */
async function invalidateMessagesCache(ticketId) {
  if (!redis) return; // Skip if Redis unavailable
  
  try {
    const cacheKey = `${CACHE_PREFIX}messages:${ticketId}`;
    await redis.del(cacheKey);
    console.log(`🗑️  Messages cache invalidated for ticket ${ticketId}`);
  } catch (error) {
    console.error('Error invalidating messages cache:', error);
  }
}

/**
 * Get ticket statistics (cached)
 */
async function getTicketStats(userId = null, role = null) {
  try {
    if (redis) {
      const cacheKey = userId 
        ? `${CACHE_PREFIX}stats:user:${userId}`
        : `${CACHE_PREFIX}stats:global`;
      
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }
    
    const matchQuery = userId ? { user: userId } : {};
    
    const stats = await SupportTicket.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } }
          ],
          overall: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                avgResponseTime: { $avg: '$responseTime' },
                avgResolutionTime: { $avg: '$resolutionTime' },
                avgRating: { $avg: '$rating' }
              }
            }
          ]
        }
      }
    ]);
    
    const result = {
      byStatus: stats[0].byStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byPriority: stats[0].byPriority.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byCategory: stats[0].byCategory.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      overall: stats[0].overall[0] || {
        total: 0,
        avgResponseTime: 0,
        avgResolutionTime: 0,
        avgRating: 0
      }
    };
    
    // Cache for 5 minutes
    if (redis) {
      const cacheKey = userId 
        ? `${CACHE_PREFIX}stats:user:${userId}`
        : `${CACHE_PREFIX}stats:global`;
      await redis.setex(cacheKey, 300, JSON.stringify(result))
        .catch(err => console.warn('Cache set failed:', err.message));
    }
    
    return result;
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
}

/**
 * Invalidate stats cache
 */
async function invalidateStatsCache(userId = null) {
  if (!redis) return; // Skip if Redis unavailable
  
  try {
    if (userId) {
      await redis.del(`${CACHE_PREFIX}stats:user:${userId}`);
    }
    await redis.del(`${CACHE_PREFIX}stats:global`);
    console.log(`🗑️  Stats cache invalidated`);
  } catch (error) {
    console.error('Error invalidating stats cache:', error);
  }
}

module.exports = {
  redis,
  getTicketById,
  invalidateTicketCache,
  getTicketMessages,
  invalidateMessagesCache,
  getTicketStats,
  invalidateStatsCache
};
'use client'

import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'image' | 'gallery'
  count?: number
}

export default function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const shimmer = {
    initial: { backgroundPosition: '200% center' },
    animate: {
      backgroundPosition: ['-200% center', '200% center'],
    },
  }

  const skeletonBase =
    'bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-200% animate-pulse'

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-card rounded-xl overflow-hidden shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Image Skeleton */}
            <div className={`h-64 ${skeletonBase}`} />

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              <div className={`h-6 w-3/4 rounded ${skeletonBase}`} />
              <div className={`h-4 w-1/2 rounded ${skeletonBase}`} />
              <div className="space-y-2">
                <div className={`h-4 w-full rounded ${skeletonBase}`} />
                <div className={`h-4 w-5/6 rounded ${skeletonBase}`} />
              </div>
              <div className={`h-8 w-1/3 rounded ${skeletonBase}`} />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'image') {
    return (
      <motion.div
        className={`w-full h-96 rounded-xl ${skeletonBase}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    )
  }

  if (type === 'gallery') {
    return (
      <div className="space-y-4">
        <motion.div
          className={`w-full h-96 rounded-lg ${skeletonBase}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className={`aspect-square rounded-lg ${skeletonBase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Text skeleton
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-4 rounded ${skeletonBase} ${i === count - 1 ? 'w-3/4' : 'w-full'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

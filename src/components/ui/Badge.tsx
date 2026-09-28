import React from 'react'
import { cn } from '../../lib/utils'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-primary hover:bg-primary/80 text-primary-foreground',
  secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
  outline: 'border border-input text-foreground',
  success: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-500 border border-amber-500/20',
  error: 'bg-red-500/15 text-red-500 border border-red-500/20',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)} {...props} />
  )
}

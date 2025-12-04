import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
	{
		variants: {
			variant: {
				default: 'bg-amber-600/20 text-amber-400 border border-amber-600/30',
				secondary: 'bg-stone-700 text-stone-300 border border-stone-600',
				success:
					'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30',
				destructive: 'bg-red-600/20 text-red-400 border border-red-600/30',
				outline: 'border border-stone-600 text-stone-300',
				ironman: 'bg-gray-600/20 text-gray-300 border border-gray-500/30',
				hardcore: 'bg-red-900/30 text-red-400 border border-red-700/30',
				ultimate: 'bg-stone-600/20 text-stone-300 border border-stone-500/30',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };

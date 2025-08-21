import React from 'react';

interface Icon3DProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray' | 'yellow';
  className?: string;
}

const sizeClasses: Record<NonNullable<Icon3DProps['size']>, string> = {
  sm: 'p-1.5 rounded-lg',
  md: 'p-2 rounded-xl',
  lg: 'p-3 rounded-2xl',
};

const colorClasses: Record<NonNullable<Icon3DProps['color']>, string> = {
  blue: 'from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40',
  green: 'from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40',
  purple: 'from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40',
  orange: 'from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40',
  gray: 'from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/40',
  yellow: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40',
};

const Icon3D: React.FC<Icon3DProps> = ({ children, size = 'md', color = 'blue', className }) => {
  return (
    <div
      className={[
        'inline-flex items-center justify-center bg-gradient-to-br',
        sizeClasses[size],
        colorClasses[color],
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_rgba(0,0,0,0.08)]',
        'border border-white/70 dark:border-white/10',
        'transition-transform duration-300 will-change-transform hover:-translate-y-0.5 active:translate-y-0',
        'relative before:absolute before:inset-0 before:rounded-inherit before:bg-white/40 before:opacity-40 before:translate-y-[-60%] before:blur-xl before:content-[""]',
        className || '',
      ].join(' ')}
      style={{ borderRadius: 'inherit' }}
    >
      {children}
    </div>
  );
};

export default Icon3D;

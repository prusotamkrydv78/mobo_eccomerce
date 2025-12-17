import React from 'react';
import { Card, CardContent } from './Card';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'slate', 
  trend, 
  trendValue,
  className = '',
  ...props 
}) => {
  const colorClasses = {
    slate: 'text-slate-600',
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    green: 'text-green-600'
  };

  const iconColorClasses = {
    slate: 'text-slate-400',
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    green: 'text-green-400'
  };

  return (
    <Card className={className} {...props}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm mt-1 ${
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

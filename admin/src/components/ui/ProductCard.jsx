import React from 'react';
import { Edit, Trash2, Eye, ImageIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import Badge from './Badge';
import Button from '../Button';

const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  deleteLoading = false,
  onViewImage,
  className = '',
  ...props 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'red' };
    if (stock < 10) return { label: 'Low Stock', variant: 'yellow' };
    return { label: 'In Stock', variant: 'green' };
  };

  const stockStatus = getStockStatus(product.stock || 0);

  return (
    <Card hover className={`overflow-hidden group ${className}`} {...props}>
      <div className="relative h-48 bg-slate-50">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <>
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {product.imageUrls.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                +{product.imageUrls.length - 1} more
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-300" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onViewImage(product.imageUrls?.[0])}
            className="bg-white/90 p-2 rounded-lg mr-2 hover:bg-white transition-colors"
          >
            <Eye size={16} className="text-slate-700" />
          </button>
        </div>

        <div className="absolute top-2 left-2">
          <Badge variant={stockStatus.variant} size="sm">
            {stockStatus.label}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-slate-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(product.price)}
          </span>
          <Badge variant="default" size="sm">
            {product.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-3 text-sm text-slate-600">
          <span>Stock: {product.stock || 0}</span>
          <span>Sold: {product.sold || 0}</span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product._id)}
            disabled={deleteLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

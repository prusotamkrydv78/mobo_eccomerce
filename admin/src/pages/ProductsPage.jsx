import { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../lib/axios";
import { Plus, Search, Filter, Package, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/Button";
import { Card, CardContent } from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ProductCard from "../components/ui/ProductCard";
import ProductForm from "../components/forms/ProductForm";
import { useApi, useMutation } from "../components/hooks/useApi";

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Use custom hooks for API calls
    const { data: productsData, loading: initialLoading, refetch: refetchProducts } = useApi('/admin/product');
    const { mutate: deleteProduct, loading: deleteLoading } = useMutation('/admin/product', {
      onSuccess: () => {
        refetchProducts();
        toast.success('Product deleted successfully');
      }
    });

    const products = productsData?.products || [];

    // Calculate product statistics
    const productStats = useMemo(() => {
        return {
            total: products.length,
            inStock: products.filter(p => (p.stock || 0) > 0).length,
            lowStock: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length,
            outOfStock: products.filter(p => (p.stock || 0) === 0).length,
            totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
        };
    }, [products]);

    // Event handlers
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        await deleteProduct(id, 'delete', `/admin/product/${id}`);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleViewImage = (imageUrl) => {
        setImagePreview(imageUrl);
    };

    const handleFormSubmit = async (formData, files) => {
        try {
            setLoading(true);
            
            // Convert files to base64 if needed
            const imageBase64 = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });
            
            const resolvedImages = await Promise.all(imageBase64);
            
            const submitData = {
                ...formData,
                images: resolvedImages
            };

            if (editingProduct) {
                await axiosInstance.put(`/admin/product/${editingProduct._id}`, submitData);
                toast.success("Product updated successfully");
            } else {
                await axiosInstance.post("/admin/product", submitData);
                toast.success("Product created successfully");
            }
            
            refetchProducts();
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setImagePreview(null);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    if (initialLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Products</h1>
                    <LoadingSpinner size="md" text="Loading products..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 animate-pulse">
                            <div className="h-48 bg-slate-200 rounded-t-xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Products</h1>
                    <p className="text-slate-600 mt-1">Manage your product inventory</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    <Plus size={20} className="mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Products" value={productStats.total} icon={Package} color="slate" />
                <StatCard title="In Stock" value={productStats.inStock} icon={Package} color="green" />
                <StatCard title="Low Stock" value={productStats.lowStock} icon={Package} color="yellow" />
                <StatCard title="Out of Stock" value={productStats.outOfStock} icon={Package} color="red" />
                <StatCard title="Total Value" value={`$${productStats.totalValue.toFixed(2)}`} icon={Package} color="emerald" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="sm:w-auto">
                    <Filter size={20} className="mr-2" />
                    Filters
                </Button>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No products found</h3>
                    <p className="text-slate-600 mb-6">
                        {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
                    </p>
                    {!searchTerm && (
                        <Button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus size={20} className="mr-2" />
                            Add Your First Product
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            deleteLoading={deleteLoading}
                            onViewImage={handleViewImage}
                        />
                    ))}
                </div>
            )}

            {/* Product Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button 
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <ProductForm
                                initialData={editingProduct}
                                onSubmit={handleFormSubmit}
                                loading={loading}
                                onCancel={() => { setIsModalOpen(false); resetForm(); }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {imagePreview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full rounded-lg"
                        />
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg hover:bg-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;

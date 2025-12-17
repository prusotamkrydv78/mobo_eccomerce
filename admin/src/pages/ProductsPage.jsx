import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { Plus, Trash2, Edit, X } from "lucide-react";
import toast from "react-hot-toast";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [], // Stores actual File objects or base64 if needed, but here we likely need urls or files
    });

    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get("/admin/product");
            setProducts(res.data.products);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axiosInstance.delete(`/admin/product/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Need to convert files to base64 for Cloudinary upload in backend...
            // OR the backend expects multitype form data. 
            // Looking at backend `multer.middleware`, it expects 'images' field.
            // And `admin.controller` `createProduct` expects `images` to be an array of image strings (base64 or urls)
            // Wait, standard multer upload usually handles multipart/form-data.
            // But the controller code: `images.map(image => cloudinary.v2.uploader.upload(image))`
            // This suggests the backend might expect BASE64 STRINGS if `req.body.images` is used directly in map without req.files usage?
            // Actually `adminRouter.post("/product", upload.array("images", 5), createProduct);`
            // Middleware handles upload to disk? `multer.diskStorage`...
            // Controller: `const { id } = req.params; const { ..., images } = req.body;`
            // If multer processes files, they are in `req.files`.
            // The controller code CHECKS `req.body.images`.
            // Controller: `uploadImages = await Promise.all(images.map((image) => cloudinary.v2.uploader.upload(image)));`
            // This strongly implies `images` is expected to be an array of Base64 strings sent in JSON body, 
            // OR the controller is implemented assuming `images` acts as file paths if multer puts them there?
            // Reviewing `admin.controller.js`:
            // `const { images } = req.body;`
            // If using `upload.array`, multer puts files in `req.files`. it does NOT put them in `req.body.images`.
            // The controller seems to ignore `req.files` and looks at `req.body.images`.
            // THIS IS A BUG IN BACKEND CONTROLLER or expects Base64.
            // `cloudinary.v2.uploader.upload(image)` accepts local file path or base64.
            // If `req.body.images` comes from Frontend as Base64 strings, then `multer` middleware is redundant/unused for the actual logic unless it's just passing body?
            // But `upload.array` consumes multipart.
            
            // DECISION: I will assume I need to send BASE64 strings for now because the controller iterates `req.body.images`.
            // I will convert files to base64 on client.
            
            const imagePromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            });

            const base64Images = await Promise.all(imagePromises);

            const payload = {
                ...formData,
                images: base64Images
            };

            await axiosInstance.post("/admin/product", payload);
            toast.success("Product created successfully");
            setIsModalOpen(false);
            fetchProducts();
            setFormData({ name: "", description: "", price: "", category: "", images: [] });
            setFiles([]);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Products</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Product</th>
                            <th className="p-4 font-semibold text-slate-600">Price</th>
                            <th className="p-4 font-semibold text-slate-600">Category</th>
                            <th className="p-4 font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.images && product.images[0]}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <span className="font-medium text-slate-800">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">${product.price}</td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-slate-500">No products found.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Product</h2>
                            <button onClick={() => setIsModalOpen(false)}>
                                <X className="text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-slate-500"
                                />
                                <p className="text-xs text-slate-400 mt-1">Select multiple images</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                {loading ? "Creating..." : "Create Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;

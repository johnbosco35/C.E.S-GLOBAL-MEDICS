import React, { useState } from "react";
import { Upload, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { addProduct } from "@/Api/AdminProduct";

const AdminNewProduct = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    brands: [{ name: "", price: "", stock: "" }],
  });
  const [images, setImages] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBrandChange = (index: number, field: string, value: string) => {
    const newBrands = [...formData.brands];
    newBrands[index] = { ...newBrands[index], [field]: value };
    setFormData({ ...formData, brands: newBrands });
  };

  const addBrand = () => {
    setFormData({
      ...formData,
      brands: [...formData.brands, { name: "", price: "", stock: "" }],
    });
  };

  const removeBrand = (index: number) => {
    setFormData({
      ...formData,
      brands: formData.brands.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const totalImages = images.length + newImages.length;

      if (totalImages > 3) {
        toast({
          title: "Too many images",
          description: "You can only upload up to 3 images per product.",
          variant: "destructive",
        });
        return;
      }

      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const saveProduct = async (status: "draft" | "published") => {
    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }

    const form = new FormData();

    // Append all images
    images.forEach((img) => {
      form.append("productImages", img);
    });

    form.append("productName", formData.name);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append(
      "brands",
      JSON.stringify(
        formData.brands
          .filter((b) => b.name) // remove empty brands
          .map((b) => ({
            name: b.name,
            price: parseFloat(b.price),
            stock: parseInt(b.stock),
          }))
      )
    );

    try {
      const res = await addProduct(form);

      toast({
        title: "Product Added",
        description: "Product was successfully added.",
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        brands: [{ name: "", price: "", stock: "" }],
      });
      setImages([]);
    } catch (err: any) {
      toast({
        title: "Error adding product",
        description: err?.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProduct("published");
  };

  const handleSaveDraft = () => {
    saveProduct("draft");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Add New Product
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <motion.select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Medical Equipment">Medical Equipment</option>
                <option value="Laboratory Kits">Laboratory Kits</option>
                <option value="Reagents">Reagents</option>
                <option value="Disposables">Disposables</option>
              </motion.select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <motion.textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Brands & Pricing
            </label>
            {formData.brands.map((brand, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={brand.name}
                  onChange={(e) =>
                    handleBrandChange(index, "name", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={brand.price}
                  onChange={(e) =>
                    handleBrandChange(index, "price", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={brand.stock}
                  onChange={(e) =>
                    handleBrandChange(index, "stock", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeBrand(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={formData.brands.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBrand}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Brand
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Images (Up to 3) *
            </label>
            <div className="mt-2">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-blue-400">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Click to upload images ({images.length}/3)
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 3}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNewProduct;

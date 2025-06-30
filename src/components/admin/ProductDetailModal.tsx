import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Brand {
  name: string;
  price: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  brands: Brand[];
  description?: string;
  // images: string[];
  images: (string | File)[];
}

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductDetailModal: React.FC<Props> = ({
  product,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      const deep = JSON.parse(JSON.stringify(product));
      setEditedProduct({
        ...deep,
        description:
          product.description || "No description available for this product.",
      });
    }
    setIsEditing(false);
  }, [product]);

  if (!product || !editedProduct) return null;

  const totalStock = editedProduct.brands.reduce((sum, b) => sum + b.stock, 0);
  const status = totalStock > 0 ? "Active" : "Out of Stock";

  const handleInputChange = (
    field: keyof Omit<Product, "brands" | "images" | "id">,
    value: string
  ) => {
    setEditedProduct((prev) => prev && { ...prev, [field]: value });
  };

  const updateBrandField = (idx: number, field: keyof Brand, value: string) => {
    const updated = editedProduct.brands.map((b, i) =>
      i === idx
        ? { ...b, [field]: field === "stock" ? parseInt(value) || 0 : value }
        : b
    );
    setEditedProduct({ ...editedProduct, brands: updated });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Product Details
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{product.name}"?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(product.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "You can edit the product details below."
              : "View and manage the product details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images section */}
          <div>
            <Label className="font-semibold">Product Images</Label>
            {editedProduct.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {editedProduct.images.map((img, i) => {
                  const src =
                    typeof img === "string" ? img : URL.createObjectURL(img);
                  return (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      {isEditing && (
                        <button
                          className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded"
                          onClick={() => {
                            const copy = [...editedProduct.images];
                            copy.splice(i, 1);
                            setEditedProduct({
                              ...editedProduct,
                              images: copy,
                            });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No images available</p>
            )}
            {isEditing && (
              <div className="mt-2">
                <Label>Add Images</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    // const files = Array.from(e.target.files || []);
                    setEditedProduct({
                      ...editedProduct,
                      images: [
                        ...editedProduct.images,
                        ...(e.target.files || []),
                      ],
                    });
                  }}
                />
              </div>
            )}
          </div>

          {/* Core fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product ID</Label>
              <Input disabled value={`#${product.id}`} />
            </div>
            <div>
              <Label>Status</Label>
              <Input disabled value={status} />
            </div>
          </div>

          <div>
            <Label>Name</Label>
            <Input
              disabled={!isEditing}
              value={editedProduct.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </Label>
            <motion.select
              disabled={!isEditing}
              value={editedProduct.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Medical Equipment">Medical Equipment</option>
              <option value="Laboratory Kits">Laboratory Kits</option>
              <option value="Reagents">Reagents</option>
              <option value="Disposables">Disposables</option>
            </motion.select>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <Label className="font-semibold">Brands</Label>
            {editedProduct.brands.map((b, i) => (
              <div key={i} className="grid grid-cols-3 gap-4">
                <Input
                  disabled={!isEditing}
                  value={b.name}
                  placeholder="Brand name"
                  onChange={(e) => updateBrandField(i, "name", e.target.value)}
                />
                <Input
                  disabled={!isEditing}
                  value={b.price}
                  type="number"
                  placeholder="Price"
                  onChange={(e) => updateBrandField(i, "price", e.target.value)}
                />
                <Input
                  disabled={!isEditing}
                  value={b.stock.toString()}
                  type="number"
                  placeholder="Stock"
                  onChange={(e) => updateBrandField(i, "stock", e.target.value)}
                />
              </div>
            ))}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              disabled={!isEditing}
              value={editedProduct.description}
              rows={4}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </div>

        {isEditing && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={() => onUpdate(editedProduct)}>
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, Upload, X, User, ShieldCheck } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  review: string;
  images: string[];
  date: string;
  verified: boolean;
}

const Review = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState("Anonymous User");
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    // Check if user has purchased this product
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const userPurchased = orders.some(
      (order: any) =>
        order.items &&
        order.items.some((item: any) => item.id === parseInt(id || "0"))
    );
    setHasPurchased(userPurchased);

    // Load existing reviews for this product from all verified purchasers
    const savedReviews = localStorage.getItem("productReviews");
    if (savedReviews) {
      const allReviews = JSON.parse(savedReviews);
      const productReviews = allReviews.filter(
        (r: Review) => r.productId === id
      );
      setReviews(productReviews);
    }
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasPurchased) {
      toast({
        title: "Purchase Required",
        description:
          "You need to purchase this product before leaving a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Convert images to base64 for storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
      })
    );

    const newReview: Review = {
      id: Date.now().toString(),
      productId: id!,
      userName,
      rating,
      review,
      images: imageUrls,
      date: new Date().toLocaleDateString(),
      verified: true,
    };

    // Save to localStorage
    const savedReviews = localStorage.getItem("productReviews");
    const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
    allReviews.push(newReview);
    localStorage.setItem("productReviews", JSON.stringify(allReviews));

    // Update local state
    setReviews((prev) => [...prev, newReview]);

    setIsSubmitting(false);

    // Reset form
    setRating(0);
    setReview("");
    setImages([]);

    toast({
      title: "Review Submitted",
      description: "Thank you for your review!",
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              C.E.S GLOBAL MEDICS
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link
            to={`/product/${id}`}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Product
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Write Review Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Write a Review
            </h1>

            {!hasPurchased && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  You need to purchase this product before you can leave a
                  review.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Images (Optional)
                </label>
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md hover:border-blue-400 dark:hover:border-blue-500">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Click to upload images
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !rating || !review.trim() || isSubmitting || !hasPurchased
                }
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting
                  ? "Submitting..."
                  : hasPurchased
                  ? "Submit Review"
                  : "Purchase Required to Review"}
              </button>
            </form>
          </div>

          {/* Reviews Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Customer Reviews ({reviews.length})
              </h2>
              <Link
                to={`/reviews/${id}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
              >
                View All Reviews
              </Link>
            </div>

            {reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {reviews.slice(0, 3).map((reviewItem) => (
                  <div
                    key={reviewItem.id}
                    className="border-b dark:border-gray-700 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {reviewItem.userName}
                            </h4>
                            {reviewItem.verified && (
                              <ShieldCheck className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {reviewItem.date}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 mb-2">
                          {renderStars(reviewItem.rating)}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {reviewItem.review}
                        </p>
                        {reviewItem.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {reviewItem.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;

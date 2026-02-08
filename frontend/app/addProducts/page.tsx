"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addProductThunk } from "../../redux/productSlice";

import "./addProduct.css";

const AddProductSchema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  images: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "At least one image is required"),

});

type ProductFormData = z.infer<typeof AddProductSchema>;


export default function AddProductsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/authentication/login");
      return;
    }

    if (user.role !== "SELLER") {
      router.push("/sellerDashboard");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(AddProductSchema),
  });

const handleAddProducts: SubmitHandler<ProductFormData> = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock.toString());
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
    if(user){
        formData.append("sellerId", user.id.toString());
    }
    dispatch(addProductThunk(formData));

    reset();
    alert("Product added successfully")
  };

  if (!user || user.role !== "SELLER") {
    return <Typography sx={{ p: 4 }}>Redirecting...</Typography>;
  }

  return (
    <Box className="Design">
      <form onSubmit={handleSubmit(handleAddProducts)} noValidate>
        <TextField
          fullWidth
          label="Product Name"
          sx={{ mb: 2 }}
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          sx={{ mb: 2 }}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Price"
          sx={{ mb: 2 }}
          {...register("price", { valueAsNumber: true })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />

        <TextField
          fullWidth
          label="Category"
          sx={{ mb: 2 }}
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        />

        <TextField
          fullWidth
          label="Brand"
          sx={{ mb: 2 }}
          {...register("brand")}
          error={!!errors.brand}
          helperText={errors.brand?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Stock"
          sx={{ mb: 2 }}
          {...register("stock", { valueAsNumber: true })}
          error={!!errors.stock}
          helperText={errors.stock?.message}
        />

        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images")}
          />
          {errors.images && (
            <Typography color="error" variant="body2">
              {errors.images.message as string}
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          ADD PRODUCT 📦
        </Button>
      </form>
    </Box>
  );
}

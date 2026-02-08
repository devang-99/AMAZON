/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  CardMedia,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProductsThunk } from "../../redux/productSlice";
import { addToCartThunk, getMyCartThunk } from "../../redux/cartSlice";

import AmazonHeader from "../components/amazonNavbar";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/products";

/* ---------------- TYPES ---------------- */
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
}

/* ---------------- COMPONENT ---------------- */
export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search");
  const categoryQuery = searchParams.get("category");

  const { data: products } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);

  /* ---------------- EFFECTS ---------------- */

  // Fetch products based on search / category
  useEffect(() => {
    if (searchQuery) {
      dispatch(fetchProductsThunk({ searchTerm: searchQuery }));
      return;
    }

    if (categoryQuery && categoryQuery !== "All") {
      dispatch(fetchProductsThunk({ category: categoryQuery }));
      return;
    }

    dispatch(fetchProductsThunk({}));
  }, [dispatch, searchQuery, categoryQuery]);

  // Normalize URL when category is "All"
  useEffect(() => {
    if (categoryQuery === "All") {
      router.replace("/userDashboard");
    }
  }, [categoryQuery, router]);

  // Load cart when user exists
  useEffect(() => {
    if (user?.id) {
      dispatch(getMyCartThunk(user.id));
    }
  }, [dispatch, user]);

  /* ---------------- HANDLERS ---------------- */
  const handleAddToCart = (productId: number) => {
    if (!user?.id) {
      router.push("/authentication/login");
      return;
    }

    dispatch(
      addToCartThunk({
        userId: user.id,
        productId,
        quantity: 1,
      })
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <AmazonHeader />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          px: 3,
          py: 4,
        }}
      >
        {products.map((product: Product) => (
          <Card
            key={product.id}
            sx={{
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={
                product.images?.length
                  ? `${IMAGE_BASE_URL}/${product.images[0]}`
                  : "/placeholder.png"
              }
              alt={product.name}
              sx={{ objectFit: "contain", p: 2 }}
            />

            <CardContent>
              <Typography fontWeight="bold" noWrap>
                {product.name}
              </Typography>
              <Typography color="primary" fontWeight="bold">
                ₹{product.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.category}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                size="small"
                onClick={() => router.push(`/productDetail/${product.id}`)}
              >
                Details
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAddToCart(product.id)}
              >
                Add
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProductByIdThunk } from "../../../redux/productSlice";
import { addToCartThunk } from "../../../redux/cartSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/products";
const PLACEHOLDER_IMAGE =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2FhYSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
;

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { productDetail, loading } = useAppSelector(
        (state) => state.products
    );
    const { user } = useAppSelector((state) => state.auth);

    const [activeImage, setActiveImage] = useState<string>(PLACEHOLDER_IMAGE);

    /* ---------------- FETCH PRODUCT ---------------- */
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdThunk(Number(id)));
        }
    }, [dispatch, id]);

    /* ---------------- SET DEFAULT IMAGE ---------------- */
    useEffect(() => {
        if (productDetail?.images?.length) {
            setActiveImage(
                `${IMAGE_BASE_URL}/${productDetail.images[0]}`
            );
        }
    }, [productDetail]);

    /* ---------------- HANDLERS ---------------- */
    const handleAddToCart = () => {
        if (!user) {
            router.push("/authentication/login");
            return;
        }

        dispatch(
            addToCartThunk({
                userId:user.id,
                productId: productDetail!.id,
                quantity: 1,
            })
        );
    };

    /* ---------------- LOADING STATE ---------------- */
    if (loading || !productDetail) {
        return (
            <Box sx={{ maxWidth: 1000, mx: "auto", mt: 15 }}>
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <Box sx={{ px: 2, mt: 14 }}>
            <Card
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: 3,
                    display: "flex",
                    gap: 4,
                    flexDirection: { xs: "column", md: "row" },
                    boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
                    borderRadius: 3,
                }}
            >
                {/* ---------- IMAGE SECTION ---------- */}
                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            border: "1px solid #eee",
                            borderRadius: 2,
                            p: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 380,
                            mb: 2,
                        }}
                    >
                        <img
                            src={activeImage}
                            alt={productDetail.name}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    PLACEHOLDER_IMAGE;
                            }}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>

                    {/* ---------- THUMBNAILS ---------- */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {productDetail.images.map((img, index) => {
                            const imgUrl = `${IMAGE_BASE_URL}/${img}`;

                            return (
                                <Box
                                    key={index}
                                    onClick={() => setActiveImage(imgUrl)}
                                    sx={{
                                        width: 70,
                                        height: 70,
                                        border:
                                            activeImage === imgUrl
                                                ? "2px solid #2874f0"
                                                : "1px solid #ccc",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        p: 1,
                                    }}
                                >
                                    <img
                                        src={imgUrl}
                                        alt="thumb"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* ---------- DETAILS SECTION ---------- */}
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold">
                        {productDetail.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Brand: <b>{productDetail.brand}</b>
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#388e3c", mt: 2 }}>
                        ₹{productDetail.price}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Category: <b>{productDetail.category}</b>
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mt: 1,
                            color: productDetail.stock > 0 ? "green" : "red",
                        }}
                    >
                        {productDetail.stock > 0
                            ? `In Stock (${productDetail.stock} available)`
                            : "Out of Stock"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1">
                        {productDetail.description}
                    </Typography>

                    {/* ---------- ACTION BUTTONS ---------- */}
                    <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                        <Button
                            variant="contained"
                            onClick={handleAddToCart}
                            disabled={productDetail.stock === 0}
                            sx={{
                                backgroundColor: "#ff9f00",
                                fontWeight: "bold",
                                px: 4,
                                "&:hover": { backgroundColor: "#fb8c00" },
                            }}
                        >
                            Add to Cart
                        </Button>

                        <Button
                            variant="contained"
                            disabled={productDetail.stock === 0}
                            sx={{
                                backgroundColor: "#fb641b",
                                fontWeight: "bold",
                                px: 4,
                                "&:hover": { backgroundColor: "#f4511e" },
                            }}
                        >
                            Buy Now
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

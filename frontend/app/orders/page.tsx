/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getMyOrdersThunk } from "../../redux/orderSlice";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/products";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { orders, loading } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (!user?.id) {
      router.push("/authentication/login");
      return;
    }

    dispatch(getMyOrdersThunk(user.id));
  }, [dispatch, user, router]);

  /* ---------------- STATES ---------------- */
  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading orders...</Typography>;
  }

  if (orders.length === 0) {
    return <Typography sx={{ p: 4 }}>No orders found</Typography>;
  }

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Card key={order.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography>
              Order ID: #{order.id}
            </Typography>

            <Typography>
              Address: {order.address}
            </Typography>

            <Typography>
              Phone: {order.phoneNumber}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Chip
                label={`Payment: ${order.paymentStatus}`}
                color="primary"
              />
              <Chip
                label={`Delivery: ${order.deliveryStatus}`}
                color="success"
              />
            </Box>

            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Items
            </Typography>

            {order.items.map((item) => (
              <Box
                key={item.product.id}
                sx={{ display: "flex", gap: 2, mt: 1 }}
              >
                <img
                  src={`${IMAGE_BASE_URL}/${item.product.images[0]}`}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                />

                <Box>
                  <Typography>
                    {item.product.name}
                  </Typography>
                  <Typography>
                    ₹{item.price} × {item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Total: ₹
              {order.items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              )}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

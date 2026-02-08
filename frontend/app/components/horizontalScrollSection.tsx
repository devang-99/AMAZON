/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
  title: string;
  images: string[];
};

const HorizontalProductRow = ({ title, images }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [images]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        my: 4,
        mx: 3,
        px: 2,
        py: 2,
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 2,
        }}
      >
        <Typography fontSize={20} fontWeight={700}>
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#007185",
            fontSize: 14,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          See all offers
        </Typography>
      </Box>

      <Box sx={{ position: "relative" }} mb={4}>
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "white" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            scrollBehavior: "smooth",
            px: 4,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{
                minWidth: 280,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={img}
                alt={`product-${index}`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                }}
              />
            </Box>
          ))}
        </Box>

        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "white" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default HorizontalProductRow;

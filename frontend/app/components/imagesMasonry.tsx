/* eslint-disable @next/next/no-img-element */
"use client";

import { Box, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

type Props = {
  title: string;
  images: string[];
};

const MasonrySection = ({ title, images }: Props) => {
  return (
    <Box
      sx={{
        p: 2,
        width: "33%",
        height: "500px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography fontWeight={700} sx={{ mb: 1 , textAlign:"center"}}>
        {title}
      </Typography>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 1,
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          {images.map((src, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
              }}
            >
              <img
                src={src}
                alt={`${title}-${index}`}
                style={{
                  width: "100%",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default MasonrySection;

/* eslint-disable @next/next/no-img-element */
"use client";

import { Box, Stack } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { bannerImages } from "@/public/bannerImages";
import MasonrySection from "../components/imagesMasonry";
import { clothesImages, electronicsImages, groceryImages } from "@/public/masonryImages";
import DashboardCardSection from "../components/card";
import AmazonHeader from "../components/amazonNavbar";
import HorizontalProductRow from "../components/horizontalScrollSection";
import { bikeImages } from "@/public/bikeImages";

const Dashboard = () => {
    return (
         <>
         <AmazonHeader/>
        <Box>
            <Carousel
                autoPlay
                infiniteLoop
                interval={3000}
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
            >
                {bannerImages.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`banner-${index}`}
                        style={{
                            width: "100%",
                            height: "600px",
                            objectFit: "fill",
                        }}
                    />
                ))}
            </Carousel>
            <Stack direction="row" spacing="1">
                <MasonrySection
                    title="Electronics"
                    images={electronicsImages}
                />

                <MasonrySection
                    title="Clothes"
                    images={clothesImages}
                />

                <MasonrySection
                    title="Groceries"
                    images={groceryImages}
                />
            </Stack>


            <DashboardCardSection/>

    <HorizontalProductRow 
        title="Starting ₹70,348 | From daily commutes to weekend thrills"
        images={bikeImages}
      />
        <DashboardCardSection/>

            <HorizontalProductRow 
        title="Starting ₹70,348 | From daily commutes to weekend thrills"
        images={bikeImages}
      />
        </Box>
        </>
    );
};

export default Dashboard;

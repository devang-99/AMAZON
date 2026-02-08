/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Typography,
    InputBase,
    IconButton,
    Badge,
    Button,
    Menu,
    MenuItem,
    Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMyCartThunk } from "@/redux/cartSlice";

export default function AmazonHeader() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);
    const { items } = useAppSelector((state) => state.cart);

    const [search, setSearch] = useState("");
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
    const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);

    const openCategory = Boolean(categoryAnchor);
    const openLang = Boolean(langAnchor);
    const openAccount = Boolean(accountAnchor);

    const cartCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getMyCartThunk(user.id));
        }
    }, [dispatch, user]);

    const handleSearch = () => {
        if (!search.trim()) return;
        router.push(`/?search=${encodeURIComponent(search.trim())}`);
    };

    const handleCategorySelect = (category: string) => {
        setCategoryAnchor(null);

        if (category === "All Categories") {
            router.push("/");
        } else {
            router.push(`/?category=${encodeURIComponent(category)}`);
        }
    };

    return (
        <>
            <AppBar position="sticky" sx={{ backgroundColor: "#131921" }}>
                <Toolbar sx={{ display: "flex", gap: 2 }}>
                    <Box
                        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                        onClick={() => router.push("/generalDashboard")}
                    >
                        <img
                            src="https://logos-world.net/wp-content/uploads/2020/06/Amazon-Logo.png"
                            alt="Amazon"
                            style={{
                                filter: "invert(100%)",
                                width: "7rem",
                                height: "auto",
                                maxWidth: "100%",
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            color: "white",
                            ml: 1,
                        }}
                    >
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Box>
                            <Typography sx={{ fontSize: 11, color: "#ccc" }}>
                                Deliver to
                            </Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                                {user?.username || "India"}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: 2,
                            overflow: "hidden",
                            mx: 2,
                        }}
                    >
                        <Box
                            sx={{
                                px: 2,
                                display: { xs: "none", sm: "flex" },
                                alignItems: "center",
                                borderRight: "1px solid #ddd",
                                backgroundColor: "#f3f3f3",
                                fontSize: 18,
                                fontWeight: 700,
                                fontFamily: "fangsong",
                                cursor: "pointer",
                                color: "gray",
                            }}
                            onClick={(e) => setCategoryAnchor(e.currentTarget)}
                        >
                            All <ArrowDropDownIcon fontSize="small" />
                        </Box>

                        <Menu
                            anchorEl={categoryAnchor}
                            open={openCategory}
                            onClose={() => setCategoryAnchor(null)}
                        >
                            {[
                                "All Categories",
                                "Electronics",
                                "Fashion",
                                "Books",
                                "Home & Kitchen",
                            ].map((category) => (
                                <MenuItem
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </MenuItem>
                            ))}
                        </Menu>

                        <InputBase
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            placeholder="Search Amazon.in"
                            sx={{
                                flex: 1,
                                px: 2,
                                "& input::placeholder": {
                                    color: "gray",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    opacity: 1,
                                },
                            }}
                        />

                        <IconButton
                            onClick={handleSearch}
                            sx={{
                                backgroundColor: "#febd69",
                                borderRadius: 0,
                                px: 2,
                                "&:hover": { backgroundColor: "#f3a847" },
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>

                    <IconButton
                        sx={{ display: { xs: "flex", md: "none" }, color: "white" }}
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            alignItems: "center",
                            color: "white",
                            cursor: "pointer",
                        }}
                        onClick={(e) => setLangAnchor(e.currentTarget)}
                    >
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            EN <ArrowDropDownIcon fontSize="small" />
                        </Typography>
                    </Box>

                    <Menu
                        anchorEl={langAnchor}
                        open={openLang}
                        onClose={() => setLangAnchor(null)}
                    >
                        {["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা"].map((lang) => (
                            <MenuItem key={lang}>{lang}</MenuItem>
                        ))}
                    </Menu>

                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            color: "white",
                            cursor: "pointer",
                            ml: 2,
                        }}
                        onClick={(e) => {
                            if (!user) {
                                router.push("/authentication/login");
                            } else {
                                setAccountAnchor(e.currentTarget);
                            }
                        }}
                    >
                        <Typography sx={{ fontSize: 13 }}>
                            Hello, {user?.username || "Sign in"}
                        </Typography>
                        <Typography sx={{ fontSize: 19, fontWeight: 600 }}>
                            Account & Lists <ArrowDropDownIcon fontSize="small" />
                        </Typography>
                    </Box>

                    <Menu
                        anchorEl={accountAnchor}
                        open={openAccount}
                        onClose={() => setAccountAnchor(null)}
                    >
                        {!user
                            ? [
                                <MenuItem
                                    key="signin"
                                    onClick={() => {
                                        setAccountAnchor(null);
                                        router.push("/authentication/login");
                                    }}
                                >
                                    Sign In
                                </MenuItem>,
                            ]
                            : [
                                <MenuItem
                                    key="account"
                                    onClick={() => {
                                        setAccountAnchor(null);
                                        router.push("/account");
                                    }}
                                >
                                    Your Account
                                </MenuItem>,
                                <MenuItem
                                    key="orders"
                                    onClick={() => {
                                        setAccountAnchor(null);
                                        router.push("/orders");
                                    }}
                                >
                                    Your Orders
                                </MenuItem>,
                                <MenuItem
                                    key="wishlist"
                                    onClick={() => {
                                        setAccountAnchor(null);
                                        router.push("/wishlist");
                                    }}
                                >
                                    Your Wishlist
                                </MenuItem>,
                                <MenuItem
                                    key="logout"
                                    onClick={() => {
                                        setAccountAnchor(null);
                                        router.push("/authentication/login");
                                    }}
                                >
                                    Sign Out
                                </MenuItem>,
                            ]}
                    </Menu>

                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            color: "white",
                            cursor: "pointer",
                            ml: 2,
                        }}
                        onClick={() => router.push("/orders")}
                    >
                        <Typography sx={{ fontSize: 12 }}>Returns</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            & Orders
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            cursor: "pointer",
                            ml: 2,
                        }}
                        onClick={() => router.push("/cart")}
                    >
                        <Badge badgeContent={cartCount} color="warning">
                            <ShoppingCartIcon />
                        </Badge>
                        <Typography
                            sx={{
                                ml: 1.5,
                                fontWeight: 600,
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            Cart
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <AppBar position="static" sx={{ backgroundColor: "#232f3e", height: 55 }}>
                <Toolbar sx={{ gap: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button
                        startIcon={<MenuIcon />}
                        sx={{ color: "white", fontWeight: 600 }}
                        onClick={() => setLeftMenuOpen(true)}
                    >
                        All
                    </Button>

                    {[
                        "Fresh",
                        "Amazon Pay",
                        "Prime",
                        "Gift Ideas",
                        "Home Improvement",
                        "Audible",
                        "Books",
                        "Buy Again",
                        "Gift Cards",
                        "Amazon Basics",
                        "Today's Deals",
                    ].map((item) => (
                        <Typography
                            key={item}
                            sx={{
                                color: "white",
                                fontSize: 17,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: { xs: "none", md: "block" },
                            }}
                        >
                            {item}
                        </Typography>
                    ))}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            >
                <Box sx={{ width: 260 }}>
                    <Box sx={{ p: 2, backgroundColor: "#232f3e", color: "white" }}>
                        <Typography fontWeight={600}>
                            Hello, {user?.username || "Sign in"}
                        </Typography>
                    </Box>

                    {[
                        { label: "Your Account", path: "/account" },
                        { label: "Your Orders", path: "/orders" },
                        { label: "Your Wishlist", path: "/wishlist" },
                        { label: "Returns & Orders", path: "/orders" },
                        { label: "Cart", path: "/cart" },
                    ].map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => {
                                router.push(item.path);
                                setMobileMenuOpen(false);
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}

                    <Box sx={{ borderTop: "1px solid #ddd", mt: 1 }}>
                        <Typography variant="h6" ml={1.5} mt={1.3}>
                            Languages
                        </Typography>
                        {["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা"].map((lang) => (
                            <MenuItem key={lang}>{lang}</MenuItem>
                        ))}
                    </Box>
                </Box>
            </Drawer>

            <Drawer
                anchor="left"
                open={leftMenuOpen}
                onClose={() => setLeftMenuOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        height: "100vh",
                    },
                }}
            >
                <Box sx={{ height: "100%", overflowY: "auto" }}>
                    <Box
                        sx={{
                            px: 2,
                            py: 2,
                            backgroundColor: "#232f3e",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography fontWeight={700}>
                            Hello, {user?.username || "Sign in"}
                        </Typography>
                    </Box>

                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                            Trending
                        </Typography>
                        {["Best Sellers", "New Releases", "Movers and Shakers"].map(
                            (item) => (
                                <MenuItem key={item}>{item}</MenuItem>
                            )
                        )}
                    </Box>

                    <Box sx={{ px: 2, py: 1, borderTop: "1px solid #eee" }}>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                            Digital Content and Devices
                        </Typography>
                        {[
                            "Echo & Alexa",
                            "Fire TV",
                            "Kindle E-Readers & eBooks",
                            "Audible Audiobooks",
                            "Amazon Prime Video",
                            "Amazon Prime Music",
                        ].map((item) => (
                            <MenuItem
                                key={item}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                {item}
                                <ArrowDropDownIcon sx={{ transform: "rotate(-90deg)" }} />
                            </MenuItem>
                        ))}
                    </Box>

                    <Box sx={{ px: 2, py: 1, borderTop: "1px solid #eee" }}>
                        <Typography fontWeight={700} sx={{ mb: 1 }}>
                            Shop by Category
                        </Typography>
                        {[
                            "Mobiles, Computers",
                            "TV, Appliances, Electronics",
                            "Men's Fashion",
                            "Women's Fashion",
                        ].map((item) => (
                            <MenuItem
                                key={item}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                {item}
                                <ArrowDropDownIcon sx={{ transform: "rotate(-90deg)" }} />
                            </MenuItem>
                        ))}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

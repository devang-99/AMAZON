/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import { auth, gitProvider, provider } from "../../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  GithubLogin,
  GoogleLogin,
  loginThunk,
  clearError,
} from "../../../redux/authSlice";

import "./login.css";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const getErrorMessage = (err: any) => {
    if (typeof err === "string") return err;
    if (err?.message) return err.message;
    return "Login failed";
  };

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginThunk({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      reset();

      if (result.role === "CUSTOMER") {
        setTimeout(() => router.push("/"), 1000);
      }

      if (result.role === "SELLER") {
        setTimeout(() => router.push("/sellerDashboard"), 1000);
      }



    } catch (err: any) {
      setSnackbarMessage(getErrorMessage(err));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(clearError());

    try {
      const res = await signInWithPopup(auth, provider);
      const email = res.user.email;
      if (!email) throw new Error("Email not available");

      await dispatch(GoogleLogin({ email })).unwrap();

      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setSnackbarMessage(getErrorMessage(err));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleGithubSignIn = async () => {
    dispatch(clearError());

    try {
      const res = await signInWithPopup(auth, gitProvider);
      const email = res.user.email;
      if (!email) throw new Error("Email not available");

      await dispatch(GithubLogin({ email })).unwrap();

      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setSnackbarMessage(getErrorMessage(err));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box className="cont">
      <Box
        component="img"
        src="https://logos-world.net/wp-content/uploads/2020/06/Amazon-Logo.png"
        alt="Logo"
        width={200}
      />

      <Box className="design">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "white", color: "black" }}
          onClick={handleGoogleSignIn}
        >
          <FcGoogle style={{ fontSize: 24, marginRight: 10 }} />
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2, backgroundColor: "black" }}
          onClick={handleGithubSignIn}
        >
          <FaGithub style={{ fontSize: 24, marginRight: 10 }} />
          Sign in with GitHub
        </Button>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <FormControl fullWidth margin="normal" error={!!errors.password}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              {...register("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link href="/authentication/signup" style={{ color: "#1976d2" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./signup.css";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
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
  Select,
  MenuItem,

} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { signInWithPopup } from "firebase/auth";
import { auth, provider, gitProvider } from "../../../firebase/firebase";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  handleGithubSignUpThunk,
  handleGoogleSignUpThunk,
  signupThunk,
} from "../../../redux/authSlice";

import { extractNameFromEmail } from "../../components/nameExtract";

const RegisterSchema = z.object({
  username: z.string().max(15, "Username cannot exceed 15 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CUSTOMER", "SELLER"]),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthSnackbarOpen, setOauthSnackbarOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const getErrorMessage = (err: any) => {
    if (typeof err === "string") return err;
    if (err?.message) return err.message;
    return "Something went wrong";
  };

  const onSubmit = async (data: RegisterFormData) => {
    setCustomError(null);
    setOauthError(null);

    try {
      const result = await dispatch(
        signupThunk({
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        })
      ).unwrap();

      setSnackbarOpen(true);

      if (result.role === "CUSTOMER") {
        setTimeout(() => router.push("/"), 1000);
      }

      if (result.role === "SELLER") {
        setTimeout(() => router.push("/sellerDashboard"), 1000);
      }


    } catch (err: any) {
      setCustomError(getErrorMessage(err));
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignUp = async () => {
    setCustomError(null);
    setOauthError(null);

    try {
      const res = await signInWithPopup(auth, provider);
      const email = res.user.email;
      const username =
        res.user.displayName || extractNameFromEmail(email);
      const role = "CUSTOMER"

      await dispatch(
        handleGoogleSignUpThunk({ username, email, role })
      ).unwrap();

      setSnackbarOpen(true);
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      setOauthError(getErrorMessage(err));
      setOauthSnackbarOpen(true);
    }
  };

  const handleGithubSignUp = async () => {
    setCustomError(null);
    setOauthError(null);

    try {
      const res = await signInWithPopup(auth, gitProvider);
      const email = res.user.email;
      const username = extractNameFromEmail(email);
      const role = "CUSTOMER"

      await dispatch(
        handleGithubSignUpThunk({ username, email, role })
      ).unwrap();

      setSnackbarOpen(true);
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      setOauthError(getErrorMessage(err));
      setOauthSnackbarOpen(true);
    }
  };

  return (
    <Box className="cont">
      <Box
        component="img"
        src="https://logos-world.net/wp-content/uploads/2020/06/Amazon-Logo.png"
        alt="Logo"
        width={200}
        height={100}
      />

      <Box className="design">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "white", color: "black" }}
          onClick={handleGoogleSignUp}
        >
          <FcGoogle style={{ fontSize: 24, marginRight: 10 }} />
          Sign up with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{ mb: 2, backgroundColor: "black" }}
          onClick={handleGithubSignUp}
        >
          <FaGithub style={{ fontSize: 24, marginRight: 10 }} />
          Sign up with GitHub
        </Button>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

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
            <FormHelperText>
              {errors.password?.message}
            </FormHelperText>
          </FormControl>

          <Controller
            name="role"
            control={control}
            defaultValue="CUSTOMER"
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  {...field}
                  labelId="role-label"
                  label="Role"
                >
                  <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                  <MenuItem value="SELLER">SELLER</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.role?.message}
                </FormHelperText>
              </FormControl>
            )}
          />



          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/authentication/login" style={{ color: "#1976d2" }}>
              Login
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
          severity={customError || error ? "error" : "success"}
          onClose={() => setSnackbarOpen(false)}
        >
          {customError || error || "Registration successful"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={oauthSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setOauthSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setOauthSnackbarOpen(false)}
        >
          {oauthError}
        </Alert>
      </Snackbar>
    </Box>
  );
}

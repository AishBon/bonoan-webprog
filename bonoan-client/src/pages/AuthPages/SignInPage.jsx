import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { loginUser } from "../../services/UserService";

const inputClasses =
  "mt-2 w-full rounded-xl border border-orange-500/30 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      // backend may return { user, token } OR flat user
      const user = data.user ?? data;

      // ─────────────────────────────────────────────
      // BLOCK viewer accounts
      // ─────────────────────────────────────────────
      if (user.type === "viewer") {
        setError(
          "Viewer accounts do not have access to this application. Please contact an administrator.",
        );
        setLoading(false);
        return;
      }

      // ─────────────────────────────────────────────
      // NORMALIZE USER TO MATCH YOUR SCHEMA
      // ─────────────────────────────────────────────
      const normalizedUser = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        contactNumber: user.contactNumber || "",
        email: user.email || email,
        type: user.type || "editor",
        username: user.username || "",
        address: user.address || "",
        isActive: user.isActive ?? true,

        // IMPORTANT: never persist password in frontend storage
      };

      // ─────────────────────────────────────────────
      // STORE FULL USER (SCHEMA-COMPATIBLE)
      // ─────────────────────────────────────────────
      localStorage.setItem("currentUser", JSON.stringify(normalizedUser));

      // store token if exists
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // keep backward compatibility (your old usage)
      localStorage.setItem("firstName", normalizedUser.firstName);
      localStorage.setItem("type", normalizedUser.type);

      // ─────────────────────────────────────────────
      // NAVIGATE
      // ─────────────────────────────────────────────
      navigate("/dashboard", {
        state: {
          firstName: normalizedUser.firstName,
          type: normalizedUser.type,
        },
      });
    } catch (err) {
      const msg =
        err?.response?.status === 401 || err?.response?.status === 400
          ? "Invalid email or password."
          : err?.response?.data?.message ||
            "Something went wrong. Please try again.";

      console.error("Login failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-orange-400">Log In</h1>

      <p className="mt-3 text-sm text-gray-400">
        Welcome back. Enter your credentials to continue.
      </p>

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* EMAIL */}
        <div>
          <label htmlFor="email" className="text-sm text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label htmlFor="password" className="text-sm text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        {/* REMEMBER / FORGOT */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Remember me</span>
          <span className="cursor-pointer hover:text-orange-400">Forgot?</span>
        </div>

        {/* LOGIN BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* FOOTER */}
      <p className="mt-6 text-sm text-gray-400">
        No account?{" "}
        <Link to="/auth/signup" className="text-orange-400 hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default SignInPage;

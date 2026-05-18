import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../../components/Button";
import { createUser } from "../../services/UserService";

/* ─── Styles ─────────────────────────────────────────────────────── */
const inputCls =
  "mt-2 w-full rounded-xl border border-orange-500/30 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500";

const selectCls =
  "mt-2 w-full rounded-xl border border-orange-500/30 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 appearance-none cursor-pointer";

const labelCls = "text-sm text-gray-300";
const errorCls = "mt-1 text-xs text-red-400";

/* ─── Constants — lowercase to match backend exactly ─────────────── */
const ROLES = ["editor", "viewer"];
const GENDERS = ["male", "female", "other"];

const labelize = (v) => v.charAt(0).toUpperCase() + v.slice(1);

const BLANK = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  contactNumber: "",
  email: "",
  type: "editor",
  username: "",
  password: "",
  address: "",
};

/* ─── Component ──────────────────────────────────────────────────── */
const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(BLANK);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  /* VALIDATION — mirrors backend and UsersPage exactly */
  const validate = () => {
    const errs = {};

    if (!form.firstName.trim()) errs.firstName = "Required.";
    if (!form.lastName.trim()) errs.lastName = "Required.";

    if (!form.age.trim()) errs.age = "Required.";
    else if (!/^\d+$/.test(form.age.trim())) errs.age = "Must be a number.";

    if (!form.gender) errs.gender = "Required.";

    if (!form.contactNumber.trim()) errs.contactNumber = "Required.";
    else if (!/^\d{11}$/.test(form.contactNumber.trim()))
      errs.contactNumber = "Must be 11 digits.";

    if (!form.email.trim()) errs.email = "Required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errs.email = "Invalid email.";

    if (!form.username.trim()) errs.username = "Required.";
    else if (/\s/.test(form.username)) errs.username = "No spaces allowed.";

    if (!form.password) errs.password = "Required.";
    else if (form.password.length < 8) errs.password = "Min. 8 characters.";

    if (!form.address.trim()) errs.address = "Required.";

    if (!ROLES.includes(form.type)) errs.type = "Invalid role.";

    return errs;
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: form.age.trim(), // backend stores age as string
        gender: form.gender.toLowerCase(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim().toLowerCase(),
        type: form.type.toLowerCase(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        address: form.address.trim(),
        isActive: true, // required by schema
      };

      await createUser(payload);

      navigate("/auth/signin", {
        state: { message: "Account created! Please sign in." },
      });
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* Helpers */
  const fe = (name) =>
    fieldErrors[name] ? <p className={errorCls}>{fieldErrors[name]}</p> : null;

  const ic = (name) =>
    `${inputCls} ${fieldErrors[name] ? "border-red-400 focus:border-red-400" : ""}`;

  /* ─── RENDER ───────────────────────────────────────────────────── */
  return (
    <>
      <h1 className="text-3xl font-bold text-orange-400">Sign Up</h1>

      <p className="mt-3 text-sm text-gray-400">
        Create your account and start using the system.
      </p>

      {apiError && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {/* FIRST / LAST NAME */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className={ic("firstName")}
              placeholder="Juan"
            />
            {fe("firstName")}
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className={ic("lastName")}
              placeholder="dela Cruz"
            />
            {fe("lastName")}
          </div>
        </div>

        {/* AGE / GENDER / CONTACT */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Age</label>
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              className={ic("age")}
              placeholder="25"
              inputMode="numeric"
            />
            {fe("age")}
          </div>

          <div>
            <label className={labelCls}>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`${selectCls} ${fieldErrors.gender ? "border-red-400" : ""}`}
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {labelize(g)}
                </option>
              ))}
            </select>
            {fe("gender")}
          </div>

          <div>
            <label className={labelCls}>Contact No.</label>
            <input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              className={ic("contactNumber")}
              placeholder="09XXXXXXXXX"
              inputMode="numeric"
              maxLength={11}
            />
            {fe("contactNumber")}
          </div>
        </div>

        {/* EMAIL / USERNAME */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={ic("email")}
              placeholder="you@email.com"
            />
            {fe("email")}
          </div>
          <div>
            <label className={labelCls}>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={ic("username")}
              placeholder="juandelacruz"
            />
            {fe("username")}
          </div>
        </div>

        {/* ROLE / PASSWORD */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Role</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={selectCls}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {labelize(r)}
                </option>
              ))}
            </select>
            {fe("type")}
          </div>

          <div>
            <label className={labelCls}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={ic("password")}
              placeholder="Min. 8 characters"
            />
            {fe("password")}
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className={labelCls}>Address</label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className={`${ic("address")} resize-none`}
            placeholder="Street, City, Province"
          />
          {fe("address")}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/auth/signin" className="text-orange-400 hover:underline">
          Log In
        </Link>
      </p>
    </>
  );
};

export default SignUpPage;

"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { updateUser, getUserById } from "@/lib/firestore/user"; // Pastikan ada fungsi getUserById untuk mengambil data
import { useParams } from "next/navigation"; // Import useParams

import CustomAlert from "@/components/ui/CustomAlert";
import BackButton from "@/components/ui/BackButton";

const EditUserForm = () => {
  const [alert, setAlert] = React.useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const { id } = useParams(); // Menggunakan useParams untuk mengambil id dari URL
 const [formData, setFormData] = useState({
     email: '',
     name: '',
     password: '',
     role: 'admin',
     status: 'active',
   });
  const [loading, setLoading] = useState(false);

  // Pre-fill form with user data from Firestore when id is available
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          // Ambil data user berdasarkan id
          const userDoc = await getUserById(id as string); // Pastikan getUserById mengembalikan data pengguna
          if (userDoc) {
            setFormData({
              email: userDoc.email || "",
              name: userDoc.name || "",
              password: "", // Jangan pre-fill password
              role: userDoc.role || "user",
              status: userDoc.status || "user",
            });
          }
        } catch (error) {
          console.error("Error fetching user: ", error);

          setAlert({
            type: "success",
            message: "User Update successfully!",
            show: true,
          });
          setTimeout(
            () => setAlert((prev) => ({ ...prev, show: false })),
            3000
          );
        }
      };
      fetchUserData();
    }
    // Hide the alert after 3 seconds
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!formData.email || !formData.name || !formData.role) {
      setAlert({
        type: "error",
        message: "Please fill out all required fields.",
        show: true,
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
      return;
    }

    setLoading(true);

    try {
      // Only update password if it's not empty (to avoid overwriting with empty password)
      const updateData: Partial<{
        name: string;
        email: string;
        password: string;
        role: string;
      }> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      // Call the updateUser function from Firebase utility
      await updateUser(id as string, updateData);
      setAlert({
        type: "success",
        message: "User updated successfully!",
        show: true,
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
      // Redirect or show a success message
    } catch (error) {
      console.error("Error updating user: ", error);
      setAlert({
        type: "error",
        message: "Failed to update user.",
        show: true,
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-start bg-background px-4">
      
      <BackButton />
      <div className="w-full space-y-6 bg-card p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-semibold text-center">Edit User</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank if not changing"
              value={formData.password}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Role Select */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="lecture">Lecture</option>
            </select>
          </div>

          {/* Status Select */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="non-active">Non-Active</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition"
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>

      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default EditUserForm;

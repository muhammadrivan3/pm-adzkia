"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// optional kalau pakai toast
import CustomAlert from "@/components/ui/CustomAlert";
import { createUser } from "@/lib/firestore/user";
import BackButton from "@/components/ui/BackButton";

const UserForm = () => {
  const [alert, setAlert] = React.useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);

    try {
      const { email, password, name, role, status } = formData;
      const userData = {
        email,
        password,
        name: name,
        role,
        status,
      };
      const userId = await createUser(userData); // Panggil fungsi createUser
      console.log(`User created with ID: ${userId}`);

      // Set success alert
      setAlert({
        type: "success",
        message: "User added successfully!",
        show: true,
      });

      // Reset form after success
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "admin",
        status: "active",
      });

      // Hide the alert after 3 seconds
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } catch (error) {
      setError("Failed to create user. Please try again.");
      console.error(error);
      setAlert({
        type: "error",
        message: "Failed to add user. Please try again.",
        show: true,
      });

      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-10 py-10 bg-muted/40 flex flex-col justify-start items-start   rounded-xl">
      <BackButton />
      <Card className="w-full shadow-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-primary tracking-tight">
            Tambah Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium mb-1 block">
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
              />
            </div>

            {/* name */}
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1 block">
                name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium mb-1 block"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="text-sm font-medium mb-1 block">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="lecture">Lecture</option>
              </select>
            </div>
            {/* Status */}
            <div>
              <label htmlFor="role" className="text-sm font-medium mb-1 block">
                Status
              </label>
              <select
                id="role"
                name="role"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="non-active">Non-Active</option>
              </select>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Tambah User
            </Button>
          </form>
        </CardContent>
      </Card>
      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default UserForm;

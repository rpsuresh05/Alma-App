"use client";

import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Example login
    login.mutate({
      email: "user@example.com",
      password: "password",
    });
  };

  return <form onSubmit={handleSubmit}>{/* Your login form fields */}</form>;
}

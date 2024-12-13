import * as React from "react";
import { api } from "@/utils/api";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/profile-form";

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold">My Profile</h1>
      <ProfileForm />
    </div>
  );
}

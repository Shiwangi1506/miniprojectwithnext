"use client";
// src/hooks/useUser.ts
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useUser = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;

    if (session?.user?.role === "user") {
      router.push("/user-dashboard");
    } else if (session?.user?.role === "worker") {
      router.push("/registration");
    }
    else{
      router.push("/login");
    }
  }, [session, status, router]);

  return { session, status };
};

export default useUser;

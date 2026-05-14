"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        const user = data.user;

        // Organizers/Admins go to events
        if (user?.role === "organizer" || user?.role === "admin") {
          router.push("/dashboard/events");
        } 
        // Regular users go to tickets
        else {
          router.push("/dashboard/tickets");
        }
      } catch (error) {
        console.error(error);
        router.push("/dashboard/tickets");
      }
    };

    fetchUser();
  }, [router]);

  return null;
}


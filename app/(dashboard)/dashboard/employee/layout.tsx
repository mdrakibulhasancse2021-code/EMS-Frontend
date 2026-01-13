/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.role === "Employee") {
        setIsAuthorized(true);
      } else {
        // যদি এমপ্লয়ি না হয়, তবে তাকে তার নিজস্ব রোলে পাঠিয়ে দাও
        router.push(`/dashboard/${user.role.toLowerCase()}`);
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthorized) return null; // অথোরাইজড না হওয়া পর্যন্ত ব্ল্যাঙ্ক থাকবে

  return <>{children}</>;
}

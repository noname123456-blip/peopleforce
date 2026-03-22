"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OffboardingPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/offboarding/dashboard"); }, [router]);
  return null;
}

"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function MenusPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/menus/hot");
  }, [router]);

  return <></>;
}
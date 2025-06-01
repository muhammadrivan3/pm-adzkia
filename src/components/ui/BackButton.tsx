"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 mb-4"
      onClick={() => router.back()}
    >
      <ArrowLeft size={16} />
      Kembali
    </Button>
  );
};

export default BackButton;

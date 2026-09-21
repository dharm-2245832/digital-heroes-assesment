"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProof } from "@/actions/verification";
import { Button } from "@/components/ui/button";

export function ProofUploadForm({ winnerId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("winnerId", winnerId);

    const result = await uploadProof(formData);

    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-300">Upload Screenshot Proof</p>
      {error && <div className="text-xs text-red-500">{error}</div>}
      <input
        type="file"
        name="file"
        accept="image/*"
        required
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-700"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Uploading..." : "Submit Proof"}
      </Button>
    </form>
  );
}

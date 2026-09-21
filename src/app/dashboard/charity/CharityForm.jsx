"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserCharity } from "@/actions/charity";
import { Button } from "@/components/ui/button";

export function CharityForm({ charities, currentSelection, currentPercentage }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserCharity(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}
      {success && <div className="text-sm text-green-500 bg-green-500/10 p-3 rounded">Preferences updated successfully.</div>}

      <div>
        <label className="text-sm font-medium text-gray-300">Select Charity</label>
        <select
          name="charityId"
          defaultValue={currentSelection || ""}
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
        >
          <option value="" disabled>Select a cause...</option>
          {charities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Contribution Percentage (%)</label>
        <p className="text-xs text-gray-500 mb-2">Minimum 10%. You can choose to give more of your subscription fee to charity.</p>
        <input
          name="contributionPercentage"
          type="number"
          min="10"
          max="100"
          defaultValue={currentPercentage || 10}
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Updating..." : "Save Preferences"}
      </Button>
    </form>
  );
}

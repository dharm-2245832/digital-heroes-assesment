"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCharity, deleteCharity } from "@/actions/adminCharity";
import { Button } from "@/components/ui/button";

export function CharityAdminClient({ initialCharities }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createCharity(formData);

    if (result.error) {
      setError(result.error);
    } else {
      e.currentTarget.reset();
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this charity?")) return;
    setLoading(true);
    const result = await deleteCharity(id);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-xl font-medium mb-4">Add New Charity</h2>
        <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-4">
          {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}
          <div>
            <label className="text-sm font-medium text-gray-300">Name</label>
            <input
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Charity"}
          </Button>
        </form>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-xl font-medium mb-4">Directory</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {initialCharities.map(charity => (
                <tr key={charity.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-white align-top">{charity.name}</td>
                  <td className="px-6 py-4 text-gray-400 max-w-md line-clamp-2" title={charity.description}>{charity.description}</td>
                  <td className="px-6 py-4 text-right align-top">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(charity.id)} disabled={loading} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {initialCharities.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No charities added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

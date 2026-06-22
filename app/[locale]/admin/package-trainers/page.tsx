"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
}

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
}

interface PackageTrainerLink {
  id: string;
  packageId: string;
  trainerId: string;
  role: string;
  isIncluded: boolean;
  priceAdd: string | null;
  maxSlots: number | null;
  offeringDescription: string | null;
  isActive: boolean;
  package: { name: string };
  trainer: { firstName: string; lastName: string };
}

export default function AdminPackageTrainers() {
  const [links, setLinks] = useState<PackageTrainerLink[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    packageId: "",
    trainerId: "",
    role: "coach",
    isIncluded: false,
    priceAdd: "",
    maxSlots: "",
    offeringDescription: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, pkgRes, trainerRes] = await Promise.all([
        fetch("/api/admin/package-trainers"),
        fetch("/api/packages"),
        fetch("/api/trainers"),
      ]);

      if (linksRes.ok) {
        const data = await linksRes.json();
        setLinks(data.packageTrainers || []);
      }
      if (pkgRes.ok) {
        const data = await pkgRes.json();
        setPackages(data.packages || []);
      }
      if (trainerRes.ok) {
        const data = await trainerRes.json();
        setTrainers(data.trainers || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/package-trainers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceAdd: formData.priceAdd ? parseFloat(formData.priceAdd) : undefined,
          maxSlots: formData.maxSlots ? parseInt(formData.maxSlots) : undefined,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          packageId: "",
          trainerId: "",
          role: "coach",
          isIncluded: false,
          priceAdd: "",
          maxSlots: "",
          offeringDescription: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to create link:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this link?")) return;

    try {
      const res = await fetch(`/api/admin/package-trainers?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Package Trainers</h1>
          <p className="text-neutral-400">Manage which trainers are available in each package</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          {showForm ? "Cancel" : "Add Link"}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4">New Package-Trainer Link</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Package</label>
                <select
                  value={formData.packageId}
                  onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="" className="bg-neutral-900">Select package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} className="bg-neutral-900">
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Trainer</label>
                <select
                  value={formData.trainerId}
                  onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="" className="bg-neutral-900">Select trainer</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-neutral-900">
                      {t.firstName} {t.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="coach" className="bg-neutral-900">Coach</option>
                  <option value="lead" className="bg-neutral-900">Lead</option>
                  <option value="assistant" className="bg-neutral-900">Assistant</option>
                  <option value="nutritionist" className="bg-neutral-900">Nutritionist</option>
                  <option value="physio" className="bg-neutral-900">Physio</option>
                  <option value="personal" className="bg-neutral-900">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Offering Description</label>
                <input
                  type="text"
                  value={formData.offeringDescription}
                  onChange={(e) => setFormData({ ...formData, offeringDescription: e.target.value })}
                  placeholder="e.g., Personal 1-on-1 coaching"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <input
                  type="checkbox"
                  id="isIncluded"
                  checked={formData.isIncluded}
                  onChange={(e) => setFormData({ ...formData, isIncluded: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-teal-500 focus:ring-teal-500"
                />
                <label htmlFor="isIncluded" className="text-white text-sm">
                  Included in base price
                </label>
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Additional Price ($)</label>
                <input
                  type="number"
                  value={formData.priceAdd}
                  onChange={(e) => setFormData({ ...formData, priceAdd: e.target.value })}
                  disabled={formData.isIncluded}
                  min={0}
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Max Slots</label>
                <input
                  type="number"
                  value={formData.maxSlots}
                  onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                  placeholder="Unlimited"
                  min={1}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-600/50 text-white rounded-lg transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Create Link
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">No package-trainer links found</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-neutral-400 border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 font-medium">Package</th>
                  <th className="px-6 py-4 font-medium">Trainer</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Slots</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-sm">{link.package.name}</td>
                    <td className="px-6 py-4 text-white text-sm">
                      {link.trainer.firstName} {link.trainer.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 text-neutral-300 text-xs rounded-full capitalize">
                        {link.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {link.isIncluded ? (
                        <span className="text-green-400 text-sm">Included</span>
                      ) : link.priceAdd ? (
                        <span className="text-teal-400 text-sm font-semibold">+${link.priceAdd}</span>
                      ) : (
                        <span className="text-neutral-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-neutral-300 text-sm">
                      {link.maxSlots || "Unlimited"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          link.isActive
                            ? "text-green-400 bg-green-400/10"
                            : "text-neutral-400 bg-neutral-400/10"
                        }`}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

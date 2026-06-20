"use client";

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterPill({ label, isActive, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        isActive
          ? "bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/20"
          : "bg-[#1a1a25] text-[#8b8b9a] border border-[#1e1e2e] hover:border-[#4a9eff]/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

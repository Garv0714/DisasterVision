"use client";

import { ChangeEvent } from "react";
import { AlertCircle, MapPin } from "lucide-react";
import { AssessmentFormData, DisasterType, FormErrors } from "@/types/assessment";
import { DISASTER_TYPE_OPTIONS } from "@/constants/assessment";

interface AssessmentFormProps {
  formData: AssessmentFormData;
  errors: FormErrors;
  onChange: (data: AssessmentFormData) => void;
}

export default function AssessmentForm({
  formData,
  errors,
  onChange,
}: AssessmentFormProps) {
  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, location: e.target.value });
  };

  const handleDisasterTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...formData,
      disasterType: e.target.value as DisasterType,
    });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...formData, description: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="location"
          className="text-sm font-medium text-slate-700"
        >
          Location
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="e.g. Cox's Bazar, Bangladesh"
            className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              errors.location
                ? "border-red-300 focus:border-red-400"
                : "border-slate-300 focus:border-blue-400"
            }`}
          />
        </div>
        {errors.location && (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.location}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="disasterType"
          className="text-sm font-medium text-slate-700"
        >
          Disaster Type
        </label>
        <select
          id="disasterType"
          value={formData.disasterType}
          onChange={handleDisasterTypeChange}
          className={`w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            errors.disasterType
              ? "border-red-300 focus:border-red-400"
              : "border-slate-300 focus:border-blue-400"
          }`}
        >
          <option value="">Select disaster type</option>
          {DISASTER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.disasterType && (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.disasterType}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe the affected area, extent of damage observed, or any relevant context..."
          className={`w-full resize-none rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            errors.description
              ? "border-red-300 focus:border-red-400"
              : "border-slate-300 focus:border-blue-400"
          }`}
        />
        {errors.description && (
          <span className="flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.description}
          </span>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, AlertCircle } from "lucide-react";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import ImageUploadBox from "@/components/assessment/ImageUploadBox";
import UploadProgress from "@/components/assessment/UploadProgress";
import { validateImageFile, buildDefaultAssessmentTitle } from "@/constants/assessment";
import { createAssessment, ApiError } from "@/services/assessment";
import {
  AssessmentFormData,
  FormErrors,
  UploadedImage,
} from "@/types/assessment";

const INITIAL_FORM_DATA: AssessmentFormData = {
  location: "",
  disasterType: "",
  description: "",
};

type ViewState = "form" | "loading";

export default function NewAssessmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AssessmentFormData>(INITIAL_FORM_DATA);
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [afterImage, setAfterImage] = useState<UploadedImage | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [viewState, setViewState] = useState<ViewState>("form");

  const handleBeforeImageChange = (image: UploadedImage | null) => {
    setBeforeImage(image);
    if (image) {
      setErrors((prev) => ({ ...prev, beforeImage: undefined }));
    }
  };

  const handleAfterImageChange = (image: UploadedImage | null) => {
    setAfterImage(image);
    if (image) {
      setErrors((prev) => ({ ...prev, afterImage: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (!formData.disasterType) {
      nextErrors.disasterType = "Please select a disaster type.";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!beforeImage) {
      nextErrors.beforeImage = "Before disaster image is required.";
    } else {
      const result = validateImageFile(beforeImage.file);
      if (!result.valid) nextErrors.beforeImage = result.error;
    }

    if (!afterImage) {
      nextErrors.afterImage = "After disaster image is required.";
    } else {
      const result = validateImageFile(afterImage.file);
      if (!result.valid) nextErrors.afterImage = result.error;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM_DATA);
    setBeforeImage(null);
    setAfterImage(null);
    setErrors({});
  };

  const handleStartAssessment = async () => {
    if (!validate()) return;

    setErrors((prev) => ({ ...prev, submit: undefined }));
    setViewState("loading");

    try {
      // formData.disasterType is guaranteed non-empty past validate()
      const disasterType = formData.disasterType as Exclude
        AssessmentFormData["disasterType"],
        ""
      >;

      await createAssessment({
        title: buildDefaultAssessmentTitle(disasterType, formData.location),
        description: formData.description,
        location: formData.location,
        disaster_type: disasterType,
      });

      router.push("/assessments");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong submitting this assessment.";
      setErrors((prev) => ({ ...prev, submit: message }));
      setViewState("form");
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <ClipboardList className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Upload Assessment
          </h1>
          <p className="text-sm text-slate-500">
            Submit before and after disaster imagery to prepare a new damage
            assessment.
          </p>
        </div>
      </div>

      {viewState === "loading" && (
        <UploadProgress message="Submitting assessment..." />
      )}

      {viewState === "form" && (
        <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <ImageUploadBox
              label="Before Disaster Image"
              description="Upload imagery captured prior to the event."
              image={beforeImage}
              onChange={handleBeforeImageChange}
              error={errors.beforeImage}
            />
            <ImageUploadBox
              label="After Disaster Image"
              description="Upload imagery captured after the event."
              image={afterImage}
              onChange={handleAfterImageChange}
              error={errors.afterImage}
            />
          </div>

          <div className="h-px w-full bg-slate-100" />

          <AssessmentForm
            formData={formData}
            errors={errors}
            onChange={setFormData}
          />

          {errors.submit && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartAssessment}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Start Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
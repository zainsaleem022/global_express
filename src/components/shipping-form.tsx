"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import ServiceResultCard from "./ServiceResultCard";

interface PackageDimensions {
  weight: string;
  length: string;
  width: string;
  height: string;
  errors?: {
    weight?: string;
    length?: string;
    width?: string;
    height?: string;
  };
}

interface FormData {
  fromCountry: string; // Stores CountryID as string
  fromPostcode: string;
  toCountry: string; // Stores CountryID as string
  toPostcode: string;
  quantity: string;
  itemType: string;
  packagingType: string;
  measurementUnit: string;
  packages: PackageDimensions[];
}

interface Country {
  _id: string;
  CountryID: number;
  Title: string;
  CountryCode: string;
}

interface ServiceResult {
  ServiceID: number;
  ServiceName: string;
  CarrierName: string;
  ChargeableWeight: number;
  TransitTimeEstimate: string;
  IsWarehouseService: boolean;
  TotalCost: {
    TotalCostNetWithCollection: number;
    TotalCostNetWithoutCollection: number;
    TotalCostGrossWithCollection: number;
    TotalCostGrossWithoutCollection: number;
  };
  ServicePriceBreakdown: Array<{
    Code: string;
    Description: string;
    Cost: number;
  }>;
  OptionalExtras: Array<{
    Code: string;
    Description: string;
    Cost: number;
  }>;
  SignatureRequiredAvailable: boolean;
  ExpectedLabels: Array<{
    LabelRole: string;
    LabelFormat: string;
    LabelGenerateStatus: string;
    AvailableSizes: Array<{ Size: string }>;
  }>;
  CollectionOptions?: Array<{
    CollectionOptionID: number;
    CollectionOptionTitle: string;
    CollectionCharge: number;
    SameDayCollectionCutOffTime: string;
    ExpectedLabel: {
      LabelRole: string;
      LabelFormat: string;
      LabelGenerateStatus: string;
      AvailableSizes: Array<{ Size: string }>;
    };
  }>;
  SameDayCollectionCutOffTime?: string;
  ServiceType?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    Status: string;
    Notifications: string[];
    QuoteID: number;
    ServiceResults: ServiceResult[];
  };
}

const isValidNumber = (value: string): boolean => {
  if (value === "") return true;
  // Remove any trailing slashes or other invalid characters
  const cleanValue = value.replace(/[^0-9.]/g, "");
  if (cleanValue === "") return false;
  const num = Number.parseFloat(cleanValue);
  return !isNaN(num) && num > 0;
};

export default function ShippingForm() {
  const [formData, setFormData] = useState<FormData>({
    fromCountry: "",
    fromPostcode: "",
    toCountry: "",
    toPostcode: "",
    quantity: "1",
    itemType: "",
    packagingType: "",
    measurementUnit: "kg/cm",
    packages: [{ weight: "", length: "", width: "", height: "" }],
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<ServiceResult[] | null>(null);

  useEffect(() => {
    if (results) {
      console.log("Service Results:", results);
      console.log("Number of service results:", results.length);
    }
  }, [results]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setSubmitError("Failed to load countries");
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Update packages array when quantity changes
    const newQuantity = Number.parseInt(formData.quantity);
    const currentPackages = formData.packages;

    if (newQuantity > currentPackages.length) {
      // Add new packages
      const newPackages = Array.from(
        { length: newQuantity - currentPackages.length },
        () => ({
          weight: "",
          length: "",
          width: "",
          height: "",
        })
      );
      setFormData((prev) => ({
        ...prev,
        packages: [...currentPackages, ...newPackages],
      }));
    } else if (newQuantity < currentPackages.length) {
      // Remove excess packages
      setFormData((prev) => ({
        ...prev,
        packages: currentPackages.slice(0, newQuantity),
      }));
    }
  }, [formData.quantity, formData.packages]);

  const validatePackageDimensions = (
    pkg: PackageDimensions
  ): PackageDimensions => {
    const errors: { [key: string]: string } = {};

    if (!isValidNumber(pkg.weight)) {
      errors.weight = "Weight must be a valid positive number";
    }
    if (!isValidNumber(pkg.length)) {
      errors.length = "Length must be a valid positive number";
    }
    if (!isValidNumber(pkg.width)) {
      errors.width = "Width must be a valid positive number";
    }
    if (!isValidNumber(pkg.height)) {
      errors.height = "Height must be a valid positive number";
    }

    return {
      ...pkg,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageChange = (
    index: number,
    field: keyof PackageDimensions,
    value: string
  ) => {
    // Clean the input value by removing invalid characters
    const cleanValue = value.replace(/[^0-9.]/g, "");

    setFormData((prev) => {
      const newPackages = [...prev.packages];
      newPackages[index] = {
        ...newPackages[index],
        [field]: cleanValue,
      };
      newPackages[index] = validatePackageDimensions(newPackages[index]);
      return {
        ...prev,
        packages: newPackages,
      };
    });
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validate required fields
    if (!formData.fromCountry) errors.fromCountry = "Please select a country";
    if (!formData.fromPostcode) errors.fromPostcode = "Postcode is required";
    if (!formData.toCountry) errors.toCountry = "Please select a country";
    if (!formData.toPostcode) errors.toPostcode = "Postcode is required";
    if (!formData.itemType) errors.itemType = "Please select an item type";
    if (!formData.packagingType)
      errors.packagingType = "Please select a packaging type";

    // Validate package dimensions
    const hasPackageErrors = formData.packages.some((pkg) => pkg.errors);
    if (hasPackageErrors) {
      errors.packages = "Please fix package dimension errors";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setResults(null); // Clear previous results

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Map CountryID to CountryData for fromCountry and toCountry
      const fromCountryData = countries.find(
        (country) => country.CountryID.toString() === formData.fromCountry
      );
      const toCountryData = countries.find(
        (country) => country.CountryID.toString() === formData.toCountry
      );

      if (!fromCountryData || !toCountryData) {
        throw new Error("Selected country not found");
      }

      const submissionData = {
        ...formData,
        fromCountry: {
          CountryID: fromCountryData.CountryID,
          CountryCode: fromCountryData.CountryCode,
          Title: fromCountryData.Title,
        },
        toCountry: {
          CountryID: toCountryData.CountryID,
          CountryCode: toCountryData.CountryCode,
          Title: toCountryData.Title,
        },
      };

      const response = await fetch("/api/shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit shipping information"
        );
      }

      setResults(data.data.ServiceResults);
      console.log("Shipping information submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting shipping information:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit shipping information"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const weightPlaceholder = formData.measurementUnit === "kg/cm" ? "kg" : "lb";
  const dimensionPlaceholder =
    formData.measurementUnit === "kg/cm" ? "cm" : "inches";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-center text-sm font-medium">
              Sending from...
            </div>
            <Select
              value={formData.fromCountry}
              onValueChange={(value) => handleInputChange("fromCountry", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem
                    key={country.CountryID}
                    value={country.CountryID.toString()}
                  >
                    {country.Title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.fromCountry && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.fromCountry}
              </p>
            )}
            <Input
              type="text"
              placeholder="Postcode (required)"
              className={`mt-2 ${
                formErrors.fromPostcode ? "border-red-500" : ""
              }`}
              value={formData.fromPostcode}
              onChange={(e) =>
                handleInputChange("fromPostcode", e.target.value)
              }
            />
            {formErrors.fromPostcode && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.fromPostcode}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 text-center text-sm font-medium">
              Delivered to...
            </div>
            <Select
              value={formData.toCountry}
              onValueChange={(value) => handleInputChange("toCountry", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem
                    key={country.CountryID}
                    value={country.CountryID.toString()}
                  >
                    {country.Title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.toCountry && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.toCountry}
              </p>
            )}
            <Input
              type="text"
              placeholder="Postcode (required)"
              className={`mt-2 ${
                formErrors.toPostcode ? "border-red-500" : ""
              }`}
              value={formData.toPostcode}
              onChange={(e) => handleInputChange("toPostcode", e.target.value)}
            />
            {formErrors.toPostcode && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.toPostcode}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-sm">Number of packages</div>
              <Select
                value={formData.quantity}
                onValueChange={(value) => handleInputChange("quantity", value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">What are you sending?</div>
              <Select
                value={formData.itemType}
                onValueChange={(value) => handleInputChange("itemType", value)}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parcel">Parcel/Large Letter</SelectItem>
                  <SelectItem value="pallet">Pallet</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.itemType && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.itemType}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">Outer Packaging Type:</div>
              <Select
                value={formData.packagingType}
                onValueChange={(value) =>
                  handleInputChange("packagingType", value)
                }
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select packaging" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardboard">Cardboard Box</SelectItem>
                  <SelectItem value="jiffy">Jiffy / Flyer Bag</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.packagingType && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.packagingType}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-2 border-b border-gray-200 pb-2">
                <div className="text-center text-sm font-medium">Weight</div>
                <div className="text-center text-sm font-medium">Length</div>
                <div className="text-center text-sm font-medium">Width</div>
                <div className="text-center text-sm font-medium">Height</div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {formData.packages.map((pkg, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 border-b border-gray-100 py-2 last:border-0"
                  >
                    <div>
                      <Input
                        type="text"
                        placeholder={weightPlaceholder}
                        className={`text-center ${
                          pkg.errors?.weight ? "border-red-500" : ""
                        }`}
                        value={pkg.weight}
                        onChange={(e) =>
                          handlePackageChange(index, "weight", e.target.value)
                        }
                      />
                      {pkg.errors?.weight && (
                        <p className="mt-1 text-xs text-red-500">
                          {pkg.errors.weight}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder={dimensionPlaceholder}
                        className={`text-center ${
                          pkg.errors?.length ? "border-red-500" : ""
                        }`}
                        value={pkg.length}
                        onChange={(e) =>
                          handlePackageChange(index, "length", e.target.value)
                        }
                      />
                      {pkg.errors?.length && (
                        <p className="mt-1 text-xs text-red-500">
                          {pkg.errors.length}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder={dimensionPlaceholder}
                        className={`text-center ${
                          pkg.errors?.width ? "border-red-500" : ""
                        }`}
                        value={pkg.width}
                        onChange={(e) =>
                          handlePackageChange(index, "width", e.target.value)
                        }
                      />
                      {pkg.errors?.width && (
                        <p className="mt-1 text-xs text-red-500">
                          {pkg.errors.width}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder={dimensionPlaceholder}
                        className={`text-center ${
                          pkg.errors?.height ? "border-red-500" : ""
                        }`}
                        value={pkg.height}
                        onChange={(e) =>
                          handlePackageChange(index, "height", e.target.value)
                        }
                      />
                      {pkg.errors?.height && (
                        <p className="mt-1 text-xs text-red-500">
                          {pkg.errors.height}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {formErrors.packages && (
                <p className="mt-2 text-sm text-red-500">
                  {formErrors.packages}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-sm">Measurements:</div>
              <RadioGroup
                value={formData.measurementUnit}
                onValueChange={(value) =>
                  handleInputChange("measurementUnit", value)
                }
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="kg/cm" id="kg-cm" />
                  <Label htmlFor="kg-cm" className="text-sm">
                    kg/cm
                  </Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="lb/inches" id="lb-inches" />
                  <Label htmlFor="lb-inches" className="text-sm">
                    lb/inches
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          {submitError && <p className="text-sm text-red-500">{submitError}</p>}
          <Button
            type="submit"
            size="lg"
            className="gap-2 bg-blue-600 px-8 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Get a quote"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      {results && results.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Available Services
          </h2>
          <div className="space-y-8">
            {results.map((result) => (
              <ServiceResultCard key={result.ServiceID} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

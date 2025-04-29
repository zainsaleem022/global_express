import { NextResponse } from "next/server";

interface PackageData {
  weight: string;
  length: string;
  width: string;
  height: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the received data
    // console.log("Received shipping form data:", JSON.stringify(data, null, 2));

    // Validate quantity and packages
    const quantity = parseInt(data.quantity, 10);
    if (isNaN(quantity) || quantity !== data.packages.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity does not match the number of packages",
        },
        { status: 400 }
      );
    }

    // Validate country objects
    if (!data.fromCountry || !data.toCountry) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid country data",
        },
        { status: 400 }
      );
    }

    // Transform packages
    const packages = data.packages.map((pkg: PackageData) => ({
      Weight: parseFloat(pkg.weight),
      Length: parseFloat(pkg.length),
      Width: parseFloat(pkg.width),
      Height: parseFloat(pkg.height),
    }));

    // Construct API request payload
    const apiPayload = {
      Credentials: {
        APIKey: process.env.TRANSGLOBAL_API_KEY || "Au7xYE5b8s",
        Password: process.env.TRANSGLOBAL_API_PASSWORD || "]ABpgR9t7t",
      },
      Shipment: {
        Consignment: {
          ItemType: "Parcel", // Use frontend itemType directly as it matches API
          Packages: packages,
        },
        CollectionAddress: {
          City: "", // Per Python example
          Postcode: data.fromPostcode,
          Country: {
            CountryID: data.fromCountry.CountryID,
            CountryCode: data.fromCountry.CountryCode,
          },
        },
        DeliveryAddress: {
          City: "", // Per Python example
          Postcode: data.toPostcode,
          Country: {
            CountryID: data.toCountry.CountryID,
            CountryCode: data.toCountry.CountryCode,
          },
        },
      },
    };

    // Make API request
    const apiResponse = await fetch(
      "https://services3.transglobalexpress.co.uk/Quote/V2/GetQuoteMinimal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      }
    );

    const apiData = await apiResponse.json();

    if (apiData.Status !== "SUCCESS") {
      console.error("API error:", apiData.Notifications);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to retrieve quote",
          errors: apiData.Notifications,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shipping quote retrieved successfully",
      data: apiData,
    });
  } catch (error) {
    console.error("Error processing shipping form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing shipping information",
      },
      { status: 500 }
    );
  }
}

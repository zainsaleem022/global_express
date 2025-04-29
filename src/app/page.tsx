import { Button } from "@/src/components/ui/button";
import ShippingForm from "@/src/components/shipping-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-14 sm:h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-blue-600">
              GlobalExpress
            </span>
            <span className="hidden sm:inline text-sm text-muted-foreground">
              delivering worldwide, sustainably
            </span>
          </div>
        </div>
      </header>
      <nav className="border-b bg-white">
        <div className="container h-12 px-4 md:px-6 overflow-x-auto">
          <div className="flex items-center gap-1 text-sm whitespace-nowrap">
            <Button variant="ghost" size="sm">
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
            >
              Quote
            </Button>
            <Button variant="ghost" size="sm">
              Track
            </Button>
            <Button variant="ghost" size="sm">
              Services
            </Button>
            <Button variant="ghost" size="sm">
              Information
            </Button>
            <Button variant="ghost" size="sm">
              Tools
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-blue-100 text-blue-600"
            >
              Featured
            </Button>
            <Button variant="ghost" size="sm">
              Shop Integrations
            </Button>
            <Button variant="ghost" size="sm">
              Packaging Shop
            </Button>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <section className="relative bg-gradient-to-b from-blue-400 to-blue-600 py-12 sm:py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                Compare worldwide parcel delivery services...
              </h1>
              <div className="overflow-hidden rounded-lg bg-white p-4 sm:p-6 shadow-lg">
                <ShippingForm />
              </div>
            </div>
          </div>
        </section>
        <section className="border-t bg-white py-8 sm:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold">
                  PARCEL DELIVERY
                </h3>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <path d="M2 22h20" />
                    <path d="M6.5 13.5V17a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3.5" />
                    <path d="M12 17v-6.5" />
                    <path d="M9 11.5V17" />
                    <path d="M15 11.5V17" />
                    <path d="M5 13.5 12 2l7 11.5" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold">
                  AIR FREIGHT
                </h3>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
                    <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A2.97 2.97 0 0 1 8.5 6" />
                    <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A2.97 2.97 0 0 1 8.5 6" />
                    <path d="M12 16v-3" />
                    <path d="M12 9V7" />
                    <path d="M15.32 14.37A9.8 9.8 0 0 0 16 12c0-5-3.5-8-8-8" />
                    <path d="M18 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
                    <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold">
                  SEA FREIGHT
                </h3>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 sm:h-8 sm:w-8"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg font-semibold">
                  PACKAGING SUPPLIES
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-slate-50">
        <div className="container px-4 py-8 md:px-6">
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 GlobalExpress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

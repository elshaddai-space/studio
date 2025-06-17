// src/app/dashboard/page.tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle } from "lucide-react";
import type { BusinessDetails } from "@/types";
import { getAllBusinesses, createBusinessTableIfNotExists } from "@/lib/db";
import { format } from 'date-fns';
import BusinessActionButtons from "@/components/dashboard/BusinessActionButtons"; // New import


async function fetchData(): Promise<BusinessDetails[]> {
  try {
    await createBusinessTableIfNotExists();
    const businesses = await getAllBusinesses();
    return businesses;
  } catch (error) {
    console.error("Failed to fetch businesses for dashboard:", error);
    throw error;
  }
}

export default async function DashboardPage() {
  let businesses: BusinessDetails[] = [];
  let fetchError: string | null = null;

  try {
    businesses = await fetchData();
  } catch (error: any) {
    fetchError = error.message || "An unexpected error occurred while fetching data.";
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="flex items-center text-2xl font-headline text-primary">
            <Users className="mr-3 h-7 w-7" />
            Business Users Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {fetchError && (
            <div className="p-4 text-destructive-foreground bg-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p>Error: {fetchError}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted/60">
                  <TableHead className="w-[200px] font-semibold text-primary">Business Name</TableHead>
                  <TableHead className="font-semibold text-primary">Type</TableHead>
                  <TableHead className="font-semibold text-primary">Contact Person</TableHead>
                  <TableHead className="font-semibold text-primary">Phone</TableHead>
                  <TableHead className="font-semibold text-primary">GSTIN</TableHead>
                  <TableHead className="font-semibold text-primary">Email</TableHead>
                  <TableHead className="text-right font-semibold text-primary">Onboarded At</TableHead>
                  <TableHead className="text-center font-semibold text-primary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{business.businessName}</TableCell>
                    <TableCell className="text-muted-foreground">{business.businessType}</TableCell>
                    <TableCell className="text-muted-foreground">{business.contactPerson}</TableCell>
                    <TableCell className="text-muted-foreground">{business.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{business.gstin || "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{business.email || "N/A"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {business.createdAt ? format(new Date(business.createdAt), 'PPpp') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      {business.id ? (
                        <BusinessActionButtons businessId={business.id} businessName={business.businessName} />
                      ) : (
                        <div className="text-muted-foreground text-xs">ID missing</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {(businesses.length === 0 && !fetchError) && (
                <TableCaption>No business users onboarded yet, or unable to fetch data.</TableCaption>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

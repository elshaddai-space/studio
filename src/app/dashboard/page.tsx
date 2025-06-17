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
import { Users } from "lucide-react";
import type { BusinessDetails } from "@/types";

// Sample data - in a real app, this would come from a database
const sampleBusinesses: BusinessDetails[] = [
  {
    businessName: "Innovate Solutions",
    businessType: "Pvt Ltd",
    phone: "+919876543210",
    gstin: "22AAAAA0000A1Z5",
    email: "contact@innovate.com",
  },
  {
    businessName: "GreenTech Organics",
    businessType: "LLP",
    phone: "+919123456789",
    email: "info@greentech.org",
  },
  {
    businessName: "Quick Fix Plumbing",
    businessType: "Sole Proprietorship",
    phone: "+917001002003",
    gstin: "29BBBBB1111B1Z0",
  },
  {
    businessName: "Creative Minds Agency",
    businessType: "Partnership",
    phone: "+918887776665",
    email: "hello@creativeminds.io",
  },
   {
    businessName: "FoodieFiesta Catering",
    businessType: "Pvt Ltd",
    phone: "+919990001111",
    gstin: "07CCCCC2222C1Z7",
    email: "orders@foodiefiesta.com",
  },
];

export default function DashboardPage() {
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted/60">
                  <TableHead className="w-[200px] font-semibold text-primary">Business Name</TableHead>
                  <TableHead className="font-semibold text-primary">Type</TableHead>
                  <TableHead className="font-semibold text-primary">Phone</TableHead>
                  <TableHead className="font-semibold text-primary">GSTIN</TableHead>
                  <TableHead className="text-right font-semibold text-primary">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleBusinesses.map((business, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{business.businessName}</TableCell>
                    <TableCell className="text-muted-foreground">{business.businessType}</TableCell>
                    <TableCell className="text-muted-foreground">{business.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{business.gstin || "N/A"}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{business.email || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
               {sampleBusinesses.length === 0 && (
                <TableCaption>No business users onboarded yet.</TableCaption>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

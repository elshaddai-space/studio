
// src/lib/db.ts
import { neon } from '@neondatabase/serverless';
import type { BusinessDetails, BusinessDetailsBase } from '@/types';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not loaded. ' +
    'Please ensure your .env.local file is correctly placed in the project root, ' +
    'contains the DATABASE_URL, and that you have fully restarted your Next.js development server.'
  );
}

const sql = neon(process.env.DATABASE_URL);

export async function createBusinessTableIfNotExists(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        businessName TEXT NOT NULL,
        businessType TEXT NOT NULL,
        contactPerson TEXT NOT NULL,
        phone TEXT NOT NULL,
        gstin TEXT,
        email TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Table 'businesses' checked/created successfully.");
  } catch (error) {
    console.error("Error creating 'businesses' table:", error);
    // Depending on your error handling strategy, you might want to re-throw or handle differently
  }
}

export async function insertBusinessDetails(details: BusinessDetailsBase): Promise<void> {
  const { businessName, businessType, contactPerson, phone, gstin, email } = details;
  try {
    // Assuming column names in the DB are businessname, businesstype, contactperson (lowercase)
    // due to unquoted identifiers in CREATE TABLE.
    // The VALUES are from camelCase JS object properties.
    await sql`
      INSERT INTO businesses (businessName, businessType, contactPerson, phone, gstin, email)
      VALUES (${businessName}, ${businessType}, ${contactPerson}, ${phone}, ${gstin || null}, ${email || null});
    `;
  } catch (error) {
    console.error("Error inserting business details:", error);
    throw new Error("Failed to save business details to the database.");
  }
}

export async function getAllBusinesses(): Promise<BusinessDetails[]> {
  try {
    // Explicitly alias lowercase DB column names to camelCase for JS object mapping.
    // PostgreSQL stores unquoted identifiers as lowercase.
    const businesses = await sql<BusinessDetails[]>`
      SELECT
        id,
        businessname AS "businessName",
        businesstype AS "businessType",
        contactperson AS "contactPerson",
        phone,
        gstin,
        email,
        createdat AS "createdAt"
      FROM businesses
      ORDER BY createdat DESC;
    `;
    return businesses;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("Failed to fetch businesses from the database.");
    // return []; // Or return empty array on error, depending on desired behavior
  }
}

export async function deleteBusinessById(id: number): Promise<void> {
  try {
    const result = await sql`
      DELETE FROM businesses WHERE id = ${id};
    `;
    if (result.rowCount === 0) {
      console.warn(`No business found with id ${id} to delete.`);
      // Optionally throw an error if no row was deleted, indicating the ID might be invalid
      // throw new Error(`No business found with id ${id}.`);
    }
  } catch (error) {
    console.error(`Error deleting business with id ${id}:`, error);
    throw new Error(`Failed to delete business with id ${id}.`);
  }
}

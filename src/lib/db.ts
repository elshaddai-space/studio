// src/lib/db.ts
import { neon } from '@neondatabase/serverless';
import type { BusinessDetails, BusinessDetailsBase } from '@/types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

export async function createBusinessTableIfNotExists(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        businessName TEXT NOT NULL,
        businessType TEXT NOT NULL,
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
  const { businessName, businessType, phone, gstin, email } = details;
  try {
    await sql`
      INSERT INTO businesses (businessName, businessType, phone, gstin, email)
      VALUES (${businessName}, ${businessType}, ${phone}, ${gstin || null}, ${email || null});
    `;
  } catch (error) {
    console.error("Error inserting business details:", error);
    throw new Error("Failed to save business details to the database.");
  }
}

export async function getAllBusinesses(): Promise<BusinessDetails[]> {
  try {
    const businesses = await sql<BusinessDetails[]>`
      SELECT id, businessName, businessType, phone, gstin, email, createdAt
      FROM businesses
      ORDER BY createdAt DESC;
    `;
    return businesses;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw new Error("Failed to fetch businesses from the database.");
    // return []; // Or return empty array on error, depending on desired behavior
  }
}

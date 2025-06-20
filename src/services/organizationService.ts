import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { Organization } from "@/models/types";

export async function createOrganization(input: {
  name: string;
  logoUrl: string;
  billing: { plan: string; status: "active" | "past_due" };
}): Promise<Organization> {
  const { organizations } = await getCollections();

  const org: Organization = {
    _id: new ObjectId(),
    name: input.name,
    logoUrl: input.logoUrl,
    billing: {
      ...input.billing,
      lastPaymentAt: new Date()
    },
    createdAt: new Date()
  };

  await organizations.insertOne(org);
  return org;
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const { organizations } = await getCollections();
  return await organizations.findOne({ _id: new ObjectId(id) });
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const { organizations } = await getCollections();
  return await organizations.find({}).toArray();
}

export async function updateOrganization(
  id: string,
  updates: Partial<Omit<Organization, "_id" | "createdAt">>
): Promise<Organization | null> {
  const { organizations } = await getCollections();
  
  await organizations.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getOrganizationById(id);
}

export async function deleteOrganization(id: string): Promise<boolean> {
  const { organizations } = await getCollections();
  const result = await organizations.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

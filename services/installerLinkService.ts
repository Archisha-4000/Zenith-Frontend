import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { InstallerLink } from "@/models/types";

export async function createInstallerLink(input: {
  org_id: ObjectId;
  url: string;
  expiresInDays?: number;
}): Promise<InstallerLink> {
  const { installer_links } = await getCollections();

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + (input.expiresInDays || 7));

  const installerLink: InstallerLink = {
    _id: new ObjectId(),
    org_id: input.org_id,
    url: input.url,
    expires_at: expirationDate,
    revoked_at: null,
    created_at: new Date()
  };

  await installer_links.insertOne(installerLink);
  return installerLink;
}

export async function getInstallerLinkById(id: string): Promise<InstallerLink | null> {
  const { installer_links } = await getCollections();
  return await installer_links.findOne({ _id: new ObjectId(id) });
}

export async function getInstallerLinksByOrgId(orgId: string): Promise<InstallerLink[]> {
  const { installer_links } = await getCollections();
  return await installer_links.find({ org_id: new ObjectId(orgId) }).toArray();
}

export async function getValidInstallerLinks(orgId: string): Promise<InstallerLink[]> {
  const { installer_links } = await getCollections();
  const now = new Date();
  
  return await installer_links.find({
    org_id: new ObjectId(orgId),
    expires_at: { $gt: now },
    revoked_at: null
  }).toArray();
}

export async function updateInstallerLink(
  id: string,
  updates: Partial<Omit<InstallerLink, "_id" | "created_at">>
): Promise<InstallerLink | null> {
  const { installer_links } = await getCollections();
  
  await installer_links.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getInstallerLinkById(id);
}

export async function revokeInstallerLink(id: string): Promise<InstallerLink | null> {
  const { installer_links } = await getCollections();
  
  await installer_links.updateOne(
    { _id: new ObjectId(id) },
    { $set: { revoked_at: new Date() } }
  );

  return await getInstallerLinkById(id);
}

export async function deleteInstallerLink(id: string): Promise<boolean> {
  const { installer_links } = await getCollections();
  const result = await installer_links.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

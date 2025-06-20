import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { User } from "@/models/types";

export async function createUser(input: {
  org_id: ObjectId;
  employee_id: string;
  name: string;
  auth_provider: {
    type: "civic";
    provider_user_id: string;
  };
  role: "admin" | "manager" | "employee";
  is_on_leave?: boolean;
}): Promise<User> {
  const { users } = await getCollections();

  const user: User = {
    _id: new ObjectId(),
    org_id: input.org_id,
    employee_id: input.employee_id,
    name: input.name,
    auth_provider: input.auth_provider,
    role: input.role,
    is_on_leave: input.is_on_leave ?? false,
    created_at: new Date()
  };

  await users.insertOne(user);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const { users } = await getCollections();
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function getUsersByOrgId(orgId: string): Promise<User[]> {
  const { users } = await getCollections();
  return await users.find({ org_id: new ObjectId(orgId) }).toArray();
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, "_id" | "created_at">>
): Promise<User | null> {
  const { users } = await getCollections();
  
  await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getUserById(id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const { users } = await getCollections();
  const result = await users.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

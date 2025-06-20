import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { User, ClientUser } from "@/models/types";

export async function createUser(input: {
  org_id: ObjectId;
  employee_id: string;
  name: string;
  email?: string;
  auth_provider: {
    type: "civic";
    provider_user_id: string;
  };
  role?: "admin" | "manager" | "employee";
  job_role?: string;
  seniority?: "junior" | "mid" | "senior";
  skills?: string[];
  current_workload?: number;
  hourly_rate?: number;
  performance_rating?: number;
  is_on_leave?: boolean;
}): Promise<ClientUser> {
  const { users } = await getCollections();

  const user: User = {
    _id: new ObjectId(),
    org_id: input.org_id,
    employee_id: input.employee_id,
    name: input.name,
    email: input.email || "",
    auth_provider: input.auth_provider,
    role: input.role || "employee",
    job_role: input.job_role || "",
    seniority: input.seniority || "mid",
    skills: input.skills || [],
    current_workload: input.current_workload || 0,
    hourly_rate: input.hourly_rate || 0,
    performance_rating: input.performance_rating || 0,
    is_on_leave: input.is_on_leave ?? false,
    created_at: new Date()
  };  await users.insertOne(user);
  
  // Convert ObjectIds to strings for client-side compatibility
  return {
    ...user,
    _id: user._id.toString(),
    org_id: user.org_id.toString(),
    created_at: user.created_at
  } as ClientUser;
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

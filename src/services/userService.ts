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
  [key: string]: any; // Allow any additional fields from CSV
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
    created_at: new Date(),
    // Include all additional fields from the input (e.g., from CSV)
    ...Object.keys(input).reduce((acc, key) => {
      // Skip fields we've already handled and internal fields
      if (!['org_id', 'employee_id', 'name', 'email', 'auth_provider', 'role', 
            'job_role', 'seniority', 'skills', 'current_workload', 'hourly_rate', 
            'performance_rating', 'is_on_leave', '_id', 'created_at'].includes(key)) {
        acc[key] = input[key];
      }
      return acc;
    }, {} as Record<string, any>)
  };await users.insertOne(user);
    // Convert ObjectIds to strings for client-side compatibility
  return {
    ...user,
    _id: user._id.toString(),
    org_id: user.org_id instanceof ObjectId ? user.org_id.toHexString() : String(user.org_id),
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

export async function getUserByEmail(email: string): Promise<any | null> {
  const { users } = await getCollections();
  const user = await users.findOne({ email: email });
  
  if (!user) return null;
  
  // Convert MongoDB objects to plain serializable objects
  const serializedUser: any = {};
  
  for (const [key, value] of Object.entries(user)) {
    if (value instanceof ObjectId) {
      serializedUser[key] = value.toString();
    } else if (value instanceof Date) {
      serializedUser[key] = value.toISOString();
    } else if (value && typeof value === 'object' && value.constructor === Object) {
      // Handle nested objects
      serializedUser[key] = JSON.parse(JSON.stringify(value));
    } else {
      serializedUser[key] = value;
    }
  }
  
  return serializedUser;
}

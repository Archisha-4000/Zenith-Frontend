import { getCollections } from "@/lib/db/collections";
import { ObjectId } from "mongodb";
import { Device } from "@/models/types";

export async function createDevice(input: {
  user_id: ObjectId;
  node_pub_key: string;
}): Promise<Device> {
  const { devices } = await getCollections();

  const device: Device = {
    _id: new ObjectId(),
    user_id: input.user_id,
    node_pub_key: input.node_pub_key,
    last_seen_at: new Date(),
    registered_at: new Date()
  };

  await devices.insertOne(device);
  return device;
}

export async function getDeviceById(id: string): Promise<Device | null> {
  const { devices } = await getCollections();
  return await devices.findOne({ _id: new ObjectId(id) });
}

export async function getDevicesByUserId(userId: string): Promise<Device[]> {
  const { devices } = await getCollections();
  return await devices.find({ user_id: new ObjectId(userId) }).toArray();
}

export async function getDeviceByNodePubKey(nodePubKey: string): Promise<Device | null> {
  const { devices } = await getCollections();
  return await devices.findOne({ node_pub_key: nodePubKey });
}

export async function updateDevice(
  id: string,
  updates: Partial<Omit<Device, "_id" | "registered_at">>
): Promise<Device | null> {
  const { devices } = await getCollections();
  
  await devices.updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );

  return await getDeviceById(id);
}

export async function updateLastSeen(id: string): Promise<Device | null> {
  const { devices } = await getCollections();
  
  await devices.updateOne(
    { _id: new ObjectId(id) },
    { $set: { last_seen_at: new Date() } }
  );

  return await getDeviceById(id);
}

export async function deleteDevice(id: string): Promise<boolean> {
  const { devices } = await getCollections();
  const result = await devices.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

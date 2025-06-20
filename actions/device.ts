"use server";

import { createDevice, getDeviceById, getDevicesByUserId, updateDevice, updateLastSeen, deleteDevice } from "@/services/deviceService";
import { revalidatePath } from "next/cache";
import { ActionResult, validateRequired } from "./utils";
import { Device } from "@/models/types";
import { ObjectId } from "mongodb";

export async function createDeviceAction(formData: FormData): Promise<ActionResult<Device>> {
  try {
    const userId = formData.get("userId") as string;
    const nodePubKey = formData.get("nodePubKey") as string;

    // Validation
    const fieldErrors = validateRequired({ userId, nodePubKey });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const device = await createDevice({
      user_id: new ObjectId(userId),
      node_pub_key: nodePubKey
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/devices");
    revalidatePath(`/dashboard/users/${userId}`);
    
    return { success: true, data: device };
  } catch (error) {
    console.error("Failed to create device:", error);
    return { success: false, error: "Failed to create device" };
  }
}

export async function getDeviceAction(id: string): Promise<ActionResult<Device>> {
  try {
    const device = await getDeviceById(id);
    
    if (!device) {
      return { success: false, error: "Device not found" };
    }
    
    return { success: true, data: device };
  } catch (error) {
    console.error("Failed to get device:", error);
    return { success: false, error: "Failed to get device" };
  }
}

export async function getDevicesByUserAction(userId: string): Promise<ActionResult<Device[]>> {
  try {
    const devices = await getDevicesByUserId(userId);
    return { success: true, data: devices };
  } catch (error) {
    console.error("Failed to get devices:", error);
    return { success: false, error: "Failed to get devices" };
  }
}

export async function updateDeviceAction(formData: FormData): Promise<ActionResult<Device>> {
  try {
    const id = formData.get("id") as string;
    const nodePubKey = formData.get("nodePubKey") as string;

    // Validation
    const fieldErrors = validateRequired({ id });
    if (fieldErrors) {
      return { success: false, fieldErrors };
    }

    const updates: any = {};
    if (nodePubKey) updates.node_pub_key = nodePubKey;

    const device = await updateDevice(id, updates);
    
    if (!device) {
      return { success: false, error: "Device not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/devices");
    revalidatePath(`/dashboard/devices/${id}`);
    
    return { success: true, data: device };
  } catch (error) {
    console.error("Failed to update device:", error);
    return { success: false, error: "Failed to update device" };
  }
}

export async function updateDeviceLastSeenAction(deviceId: string): Promise<ActionResult<Device>> {
  try {
    const device = await updateLastSeen(deviceId);
    
    if (!device) {
      return { success: false, error: "Device not found" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/devices");
    revalidatePath(`/dashboard/devices/${deviceId}`);
    
    return { success: true, data: device };
  } catch (error) {
    console.error("Failed to update device last seen:", error);
    return { success: false, error: "Failed to update device last seen" };
  }
}

export async function deleteDeviceAction(deviceId: string): Promise<ActionResult<boolean>> {
  try {
    const result = await deleteDevice(deviceId);
    
    if (!result) {
      return { success: false, error: "Device not found or could not be deleted" };
    }

    // Revalidate relevant paths
    revalidatePath("/dashboard/devices");
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to delete device:", error);
    return { success: false, error: "Failed to delete device" };
  }
}

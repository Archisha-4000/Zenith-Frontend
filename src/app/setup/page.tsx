import { redirect } from 'next/navigation';
import { getUser } from "@civic/auth/nextjs";
import { SetupForm } from './setup-form';

export default async function SetupPage() {
  // Check if user is authenticated
  const user = await getUser();
  
  if (!user) {
    redirect('/');
  }

  return (
    <SetupForm 
      userId={user.id} 
      userName={user.name || user.email} 
    />
  );
}

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'; 

export default async function HomePage() {

  const accessToken = (await cookies()).get('accessToken')?.value;

  if (accessToken) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login'); 
  }
}
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateRoomId } from '@/lib/room-code';

export async function GET() {
  const id = generateRoomId();
  
  // Set cookie to flag creator intent
  // Scoped to the specific room path to avoid leaking to other rooms
  // Short expiry (60s) just enough for the redirect
  // httpOnly: false so client-side code can verify it
  (await cookies()).set('room-creator', id, {
    path: '/',
    maxAge: 60,
    sameSite: 'lax',
    httpOnly: false, 
  });

  redirect(`/room/${id}`);
}

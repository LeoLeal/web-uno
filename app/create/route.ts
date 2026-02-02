import { redirect } from 'next/navigation';
import { generateRoomId } from '@/lib/room-code';

export async function GET() {
  const id = generateRoomId();
  redirect(`/room/${id}`);
}

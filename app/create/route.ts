import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const id = uuidv4();
  redirect(`/room/${id}`);
}

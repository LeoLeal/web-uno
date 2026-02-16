import { describe, expect, it } from 'vitest';
import RoomPage from './page';

describe('room page module location', () => {
  it('exports room page from app/room/page', () => {
    expect(RoomPage).toBeTypeOf('function');
  });
});

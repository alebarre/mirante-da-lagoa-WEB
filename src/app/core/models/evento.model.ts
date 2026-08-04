export interface Evento {
  id?: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  organizer?: string;
  status?: string;
  restrictedToResidents: boolean;
  maxParticipants?: number;
  notes?: string;
}

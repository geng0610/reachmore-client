export interface AudienceList {
  _id: string;
  name: string;
  userId: string;
  seedContacts: string[];
  generatedContacts: string[];
  createdAt: Date;
  updatedAt: Date;
}

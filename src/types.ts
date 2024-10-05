export interface AudienceList {
    _id: string;
    name: string;
    userId: string;
    organizationId: string;
    freeFormContacts: string;
    additionalContext: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SummaryDataItem {
    value: string;
    count: number;
    percentage: string;
}

export interface SummaryData {
    [key: string]: SummaryDataItem[];
}

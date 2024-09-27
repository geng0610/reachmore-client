// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
  api.interceptors.request.use(
    async (config) => {
      const token = await getToken(); // Fetch the token when making requests
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// New API functions for user preferences
export const getUserPreferences = () =>
  api.get(`/api/user-preferences/`);

export const updateUserPreferences = (data: any) =>
  api.put(`/api/user-preferences/`, data);

export const getRequirements = (documentId: string) =>
  api.get(`/api/requirements`, { params: { document_id: documentId } });
export const getRequirement = (id: string) => api.get(`/api/requirements/${id}`);
export const createRequirement = (data: any) => api.post('/api/requirements', data);
export const updateRequirement = (id: string, data: any) => api.put(`/api/requirements/${id}`, data);
export const deleteRequirement = (id: string) => api.delete(`/api/requirements/${id}`);

export const getRequirementDocuments = () => api.get('/api/requirement-documents');
export const getRequirementDocument = (id: string) => api.get(`/api/requirement-documents/${id}`);
export const createRequirementDocument = (data: any) => api.post('/api/requirement-documents', data);
export const updateRequirementDocument = (id: string, data: any) => api.put(`/api/requirement-documents/${id}`, data);
export const deleteRequirementDocument = (id: string) => api.delete(`/api/requirement-documents/${id}`);
export const searchRequirementDocuments = (query: string) => api.get(`/api/requirement-documents/typeahead-search?q=${query}`);

// Vendor API calls
export const getVendorProfile = () => api.get('/api/vendors');
export const createOrUpdateVendorProfile = (data: any) => api.post('/api/vendors', data);
export const deleteVendorProfile = () => api.delete('/api/vendors');
export const getPublishedVendors = () => api.get('/api/vendors/published');

// Search vendors by name
export const searchVendors = (query: string) => api.get(`/api/vendors/typeahead?q=${query}`);

// Function to grant vendor access to a document
export const grantVendorAccess = (vendorId: string, documentId: string) =>
  api.post('/api/vendor-document-access/grant-access', { vendor_id: vendorId, document_id: documentId });

// Revoke access for a vendor for a specific document (soft delete)
export const revokeVendorAccess = (vendorId: string, documentId: string) => 
  api.delete('/api/vendor-document-access/revoke-access', { data: { vendor_id: vendorId, document_id: documentId } });

// Function to get all vendors with access to a specific document
export const getVendorsWithAccessToDocument = (documentId: string) =>
  api.get(`/api/vendor-document-access/document/${documentId}/vendors`);

// Fetch documents the vendor has access to
export const getDocumentsForVendor = (vendorId: string) =>
  api.get(`/api/vendor-document-access/vendor/${vendorId}/documents`);


// Function to get organization name by organization ID
export const getOrganizationName = (organizationId: string) =>
  api.get(`/api/organizations/${organizationId}/name`);


// Consolidated function to get vendor responses for a requirement or specific vendor response
export const getVendorResponses = (requirementId?: string, vendorId?: string) =>
  api.get('/api/vendor-responses', { params: { requirementId, vendorId } });


// Function to create a vendor response
export const createVendorResponse = (data: any) => api.post('/api/vendor-responses', data);

// Function to update a vendor response
export const updateVendorResponse = (id: string, data: any) => api.put(`/api/vendor-responses/${id}`, data);

export const getApprovalStates = () => api.get('/api/approval-states');
export const createApprovalState = (data: any) => api.post('/api/approval-states', data);
export const updateApprovalState = (id: string, data: any) => api.put(`/api/approval-states/${id}`, data);
export const deleteApprovalState = (id: string) => api.delete(`/api/approval-states/${id}`);


export default api;

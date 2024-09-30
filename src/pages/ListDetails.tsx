import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AudienceList } from '../types';
import { getAudienceList, updateAudienceList, generateQuery, getLatestQuery } from '../services/api';

const ListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<AudienceList | null>(null);
  const [listName, setListName] = useState('');
  const [freeFormContacts, setFreeFormContacts] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [latestQuery, setLatestQuery] = useState('');


  useEffect(() => {
    fetchList();
    fetchLatestQuery();
  }, []);
  
  const fetchLatestQuery = async () => {
    try {
      const response = await getLatestQuery(id!);
      setLatestQuery(response.data.query);
    } catch (err) {
      console.error('Failed to fetch latest query', err);
    }
  };

  const fetchList = async () => {
    try {
      const response = await getAudienceList(id!);
      setList(response.data);
      setListName(response.data.name);
      setFreeFormContacts(response.data.freeFormContacts || '');
      setAdditionalContext(response.data.additionalContext || '');
    } catch (err) {
      console.error('Failed to fetch audience list', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAudienceList(id!, { name: listName, freeFormContacts, additionalContext });
      alert('Audience list updated successfully');
    } catch (err) {
      console.error('Failed to update audience list', err);
    }
  };

  const handleGenerateQuery = async () => {
    try {
      await generateQuery(id!);
      const response = await getLatestQuery(id!);
      setLatestQuery(response.data.query);
    } catch (err) {
      console.error('Failed to generate query', err);
    }
  };

  if (!list) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Audience List Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="listName" className="form-label">List Name:</label>
          <input
            type="text"
            id="listName"
            className="form-control"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="freeFormContacts" className="form-label">Free-Form Contacts:</label>
          <textarea
            id="freeFormContacts"
            className="form-control"
            rows={5}
            value={freeFormContacts}
            onChange={(e) => setFreeFormContacts(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="additionalContext" className="form-label">Additional Context:</label>
          <textarea
            id="additionalContext"
            className="form-control"
            rows={3}
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      <button type="button" className="btn btn-secondary" onClick={handleGenerateQuery}>
        Generate Query
      </button>
      {latestQuery && (
        <div className="mt-4">
          <h4>Latest Query:</h4>
          <pre>{latestQuery}</pre>
        </div>
      )}
    </div>
  );
};

export default ListDetails;

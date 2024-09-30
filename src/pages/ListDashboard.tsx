import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AudienceList } from '../types';
import { createAudienceList, getAudienceLists } from '../services/api';

const ListDashboard: React.FC = () => {
  const [lists, setLists] = useState<AudienceList[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await getAudienceLists();
      if (Array.isArray(response.data)) {
        setLists(response.data);
      } else {
        console.error('Response data is not an array:', response.data);
        setLists([]);
      }
    } catch (err) {
      console.error('Failed to fetch audience lists', err);
      setLists([]);
    }
  };

  const handleCreateNewList = async () => {
    try {
      const response = await createAudienceList({ name: 'New Audience List' });
      navigate(`/lists/${response.data._id}`);
    } catch (err) {
      console.error('Failed to create new audience list', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Audience Lists</h1>
        <button className="btn btn-primary" onClick={handleCreateNewList}>New List</button>
      </div>
      {lists.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You don't have any audience lists yet. Click the "New List" button to create one.
        </div>
      ) : (
        <ul className="list-group">
          {lists.map((list) => (
            <li key={list._id} className="list-group-item">
              <Link to={`/lists/${list._id}`}>{list.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListDashboard;

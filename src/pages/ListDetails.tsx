import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AudienceList, SummaryDataItem, SummaryData } from '../types';
import {
  getAudienceList,
  updateAudienceList,
  generateQuery,
  getLatestQuery,
  getQueryToContacts,
  saveOverallFeedback,
  saveContactFeedback,
  getAudienceQueryFeedback,
  generateQueryWithFeedback,
} from '../services/api';
import QueryResults from '../components/QueryResults';

interface LatestQuery {
  _id: string;
  query: string;
}

const ListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<AudienceList | null>(null);
  const [listName, setListName] = useState('');
  const [freeFormContacts, setFreeFormContacts] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [latestQuery, setLatestQuery] = useState<LatestQuery | null>(null);
  const [queryToContacts, setQueryToContacts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isGeneratingQuery, setIsGeneratingQuery] = useState(false);
  const [isFetchingResults, setIsFetchingResults] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  // const [currentContact, setCurrentContact] = useState<any | null>(null);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [sampleContacts, setSampleContacts] = useState<any[]>([]);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [contactFeedback, setContactFeedback] = useState<{ [key: string]: 'upvote' | 'downvote' }>({});
  const [overallFeedbackSaved, setOverallFeedbackSaved] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [listInputSaved, setListInputSaved] = useState(false);




  useEffect(() => {
    fetchList();
    fetchLatestQuery();
  }, []);

  useEffect(() => {
    // console.log('Fetching query to contacts...');
    if (latestQuery) {
      console.log('Fetching query to contacts... from inside useEffect');
      fetchAudienceSummaryAndContacts();
      fetchFeedbackData();
    }
  }, [latestQuery]); // Add currentPage as a dependency

  const fetchLatestQuery = async () => {
    try {
      const response = await getLatestQuery(id!);
      setLatestQuery(response.data.audienceQuery);
    } catch (err) {
      console.error('Failed to fetch latest query', err);
    }
  };

  const fetchSampleContacts = async () => {
    try {
      const response = await getQueryToContacts(latestQuery!._id, 1, 20);
      console.log('Fetched sample contacts:', response.data.data);
      setSampleContacts(response.data.data);
    } catch (err) {
      console.error('Failed to fetch sample contacts', err);
    }
  };

  const fetchFeedbackData = async () => {
    try {
      console.log('Fetching feedback data for: ', latestQuery!._id);
      const response = await getAudienceQueryFeedback(latestQuery!._id);
      const feedbackData = response.data;
      console.log('Fetched feedback data:', feedbackData);
      const feedbackMap: { [key: string]: 'upvote' | 'downvote' } = {};
      feedbackData.contactFeedback.forEach((feedback: any) => {
        feedbackMap[feedback.contactId] = feedback.feedback;
      });
      setContactFeedback(feedbackMap);
      setOverallFeedback(feedbackData.overallFeedback);
    } catch (err) {
      console.error('Failed to fetch feedback data', err);
      setContactFeedback({});
      setOverallFeedback('');
      setCurrentContactIndex(0);
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

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAudienceList(id!, { name: listName, freeFormContacts, additionalContext });
      setListInputSaved(true);
      // alert('Audience list updated successfully');
      // handleGenerateQuery();
    } catch (err) {
      console.error('Failed to update audience list', err);
    }
  };

  useEffect(() => {
    if (listInputSaved) {
      const timer = setTimeout(() => {
        setListInputSaved(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [listInputSaved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAudienceList(id!, { name: listName, freeFormContacts, additionalContext });
      // alert('Audience list updated successfully');
      handleGenerateQuery();
    } catch (err) {
      console.error('Failed to update audience list', err);
    }
  };

  const fetchAudienceSummaryAndContacts = async (retries = 0) => {
    try {
      console.log('Fetching query to contacts... retries:', retries);
      setIsFetchingResults(true);

      const response = await getLatestQuery(id!);

      if (response.data.audienceQuery.summaryData && response.data.audienceQuery.summaryData.location_country.length > 0) {
        console.log('Received summary data:', response.data.audienceQuery.summaryData);
        setSummaryData(response.data.audienceQuery.summaryData);
        setTotalCount(response.data.audienceQuery.totalCount); // Update totalCount state
        setIsFetchingResults(false);
      }
      fetchSampleContacts();

      // Fetch query to contacts
      const contactsResponse = await getQueryToContacts(response.data.audienceQuery._id, currentPage, 20);
      if (contactsResponse.data.data.length > 0) {
        setQueryToContacts(contactsResponse.data.data);
        setTotalPages(contactsResponse.data.totalPages);
      } else if (retries < 11) {
        // If no contacts are returned and retries are less than 3, retry after a delay
        setTimeout(() => {
          fetchAudienceSummaryAndContacts(retries + 1);
        }, 5000);
      }
    } catch (err) {
      console.error('Failed to fetch audience summary and contacts', err);
      setIsFetchingResults(false);
    }

  };

  const handleGenerateQuery = async () => {
    try {
      setIsGeneratingQuery(true);
      setLatestQuery(null);
      setQueryToContacts([]);
      setSummaryData(null);
      setIsFetchingResults(true);

      const response = await generateQuery(id!);
      setLatestQuery(response.data.audienceQuery);

    } catch (err) {
      console.error('Failed to generate query', err);
    } finally {
      setIsGeneratingQuery(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleContactFeedback = async (contactId: string, feedback: 'upvote' | 'downvote') => {
    try {
      await saveContactFeedback({
        audienceListId: id,
        audienceQueryId: latestQuery!._id,
        contactFeedback: [
          {
            contactId,
            feedback,
          },
        ],
      });
      setContactFeedback((prevFeedback) => ({
        ...prevFeedback,
        [contactId]: feedback,
      }));

      // Move to the next contact
      if (currentContactIndex < sampleContacts.length - 1) {
        setCurrentContactIndex((prevIndex) => prevIndex + 1);
      } else {
        // If it's the last contact, fetch more contacts or show a message
        if (sampleContacts.length < 80) {
          handleLoadMoreContacts();
        } else {
          // Show a message or perform any other desired action
          console.log('No more contacts to review');
        }
      }
    } catch (error) {
      console.error('Failed to save contact feedback', error);
    }
  };




  const handlePreviousContact = () => {
    setCurrentContactIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextContact = () => {
    setCurrentContactIndex((prevIndex) => Math.min(prevIndex + 1, sampleContacts.length - 1));
  };

  const handleLoadMoreContacts = async () => {
    try {
      const response = await getQueryToContacts(latestQuery!._id, sampleContacts.length / 20 + 1, 20);
      setSampleContacts((prevContacts) => [...prevContacts, ...response.data.data]);
    } catch (err) {
      console.error('Failed to load more contacts', err);
    }
  };

  const handleOverallFeedbackSubmit = async () => {
    if (latestQuery) {
      await saveOverallFeedback({
        audienceListId: id,
        audienceQueryId: latestQuery._id,
        overallFeedback,
      });
      setOverallFeedback(overallFeedback);
      setOverallFeedbackSaved(true);
    }
  };

  useEffect(() => {
    if (overallFeedbackSaved) {
      const timer = setTimeout(() => {
        setOverallFeedbackSaved(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [overallFeedbackSaved]);

  if (!list) {
    return <div>Loading...</div>;
  }


  const handleUpdateListWithFeedback = async () => {
    try {
      if (latestQuery) {
        setIsGeneratingQuery(true);
        setLatestQuery(null);
        setQueryToContacts([]);
        setSummaryData(null);
        setIsFetchingResults(true);

        console.log('Updating list with feedback...');

        const response = await generateQueryWithFeedback(latestQuery._id);
        // Refresh the page or update the state to reflect the new query results
        setLatestQuery(response.data.audienceQuery);
      }
    } catch (error) {
      console.error('Failed to update list with feedback', error);
    }
  };


  return (
    <div className="container pt-4 overflow-hidden mw-100 h-100 px-5">
      <div className="row h-100 overflow-hidden">
        <div className="col-4 h-100 overflow-auto">
          {/* Audience List Input */}
          <h2>Audience List Input</h2>
          <form>
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
              <label htmlFor="freeFormContacts" className="form-label">Share a few sample contacts of your ideal customer:</label>
              <textarea
                id="freeFormContacts"
                className="form-control"
                rows={5}
                value={freeFormContacts}
                onChange={(e) => setFreeFormContacts(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="additionalContext" className="form-label">Additional Context about your business:</label>
              <textarea
                id="additionalContext"
                className="form-control"
                rows={3}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <button
                onClick={handleSaveForm}
                className="btn btn-secondary"
                disabled={
                  isGeneratingQuery ||
                  isFetchingResults ||
                  (listName === list.name &&
                    freeFormContacts === list.freeFormContacts &&
                    additionalContext === list.additionalContext)
                }
              >
                Save List Input
              </button>
              {listInputSaved && (
                <span className="text-success ms-3">
                  List input saved!
                </span>
              )}
              <button
                // type="submit"
                onClick={handleSubmit}
                className={`btn ${queryToContacts.length > 0 ? 'btn-secondary' : 'btn-primary'}`}
                disabled={
                  isGeneratingQuery ||
                  isFetchingResults ||
                  (listName === list.name &&
                    freeFormContacts === list.freeFormContacts &&
                    additionalContext === list.additionalContext)
                }
              >
                {isGeneratingQuery || isFetchingResults
                  ? 'Loading...'
                  : queryToContacts.length > 0
                    ? 'Regenerate my list'
                    : 'Generate my list'}
              </button>

            </div>
          </form>
          <div className="mt-4">
            <span className='d-flex align-items-center justify-content-start mb-2'>
              <span className='fs-4'>Generated Query (For QA purposes)</span>
              <button
                type="button"
                className="btn btn-link btn-sm m-0"
                onClick={handleGenerateQuery}
                disabled={isGeneratingQuery}
              >
                <i className="bi bi-arrow-repeat p-0 m-0"></i>
              </button>

            </span>
            {isGeneratingQuery && <p>Generating query...</p>}
            {latestQuery && (
              <pre>{latestQuery.query}</pre>
            )}
          </div>
        </div>
        <div className="col-8 h-100 overflow-auto">
          {/* Audience Results */}
          <div className='d-flex align-items-center justify-content-between'>
            <h2>Audience Results</h2>
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#queryResultsModal"
                disabled={!summaryData}
              >
                View the entire list
              </button>
              <button
                type="button"
                className="ms-3 btn btn-primary"
              >
                Push to my ad channels
              </button>

            </div>
          </div>
          {isFetchingResults && <p>Fetching query results...</p>}
          {queryToContacts.length > 0 && (
            <div className='row'>
              {/* Audience Summary */}
              {/* <hr /> */}
              {summaryData ? (
                <div className="col-8 mt-4">
                  <div className='mb-4 d-flex align-items-center justify-content-between'>
                    <span className='fs-4'>
                      Audience Summary
                    </span>
                    <span className='fs-6'>
                      Total contacts: {totalCount}
                    </span>
                  </div>
                  <div className="row">
                    {Object.entries(summaryData).map(([key, values]) => {

                      if (key === 'sub_departments') {
                        return null; // Skip rendering the card for sub_departments
                      }
                      return (
                        <div key={key} className="col-6 mb-4">
                          <div className="card border-0">
                            <div className="card-body px-0 py-0">
                              <h5 className="card-title text-capitalize">{key.replace(/_/g, ' ')}</h5>
                              <ul className="list-group">
                                {values.map((item: SummaryDataItem, itemIndex: number) => (
                                  <li key={itemIndex} className="list-group-item px-0 py-0 border-0">
                                    <div className="row">
                                      <div className="col-6 text-truncate">{item.value}</div>
                                      <div className="col-6 text-end">
                                        <span>{item.count}</span>{' '}
                                        <span className="text-muted">/ {item.percentage}%</span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}


                  </div>
                  <div className="modal fade" id="queryResultsModal" tabIndex={-1} aria-labelledby="queryResultsModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl mx-4" style={{ maxWidth: '2000px' }}>
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="queryResultsModalLabel">Query Results</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <QueryResults
                            queryToContacts={queryToContacts}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No summary data available</p>
              )}


              {sampleContacts.length > 0 && (
                <div className="col-4 mt-4">
                  <div className="row align-items-center">
                    <div className='fs-4 mb-4'>Your Feedback</div>
                    <div className="text-center mb-4">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdateListWithFeedback}
                          disabled={
                            Object.values(contactFeedback).filter(Boolean).length === 0 &&
                            overallFeedback.trim() === ''
                          }
                        >
                          Update list by incorporating my {Object.values(contactFeedback).filter(Boolean).length} votes
                          {overallFeedback ? (overallFeedback.trim() !== '' ? ' and overall feedback' : '') : ''}
                        </button>
                      </div>
                    <hr />
                    <div className='fs-5 mb-2'>Sample Contacts</div>
                    {sampleContacts.slice(currentContactIndex, currentContactIndex + 1).map((contact) => (
                      <div key={contact.contactId} className="col-12 text-center">
                        <div className="card">
                          <div className="card-body text-start">
                            <h5 className="card-title text-truncate">{contact.clickhouseData.job_title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted text-truncate">{contact.clickhouseData.company_name}</h6>
                            <p className="card-text text-truncate">
                              {contact.clickhouseData.location_city}, {contact.clickhouseData.location_state}, {contact.clickhouseData.location_country}
                            </p>
                            <p className="card-text text-truncate">Seniority: {contact.clickhouseData.seniority}</p>
                            <p className="card-text text-truncate">Industry: {contact.clickhouseData.company_industry}</p>
                            <p className="card-text text-truncate">
                              Department: {contact.clickhouseData.departments.join(', ')}
                            </p>
                            <div className="d-flex text-center">
                              <div className="col align-items-center">
                                <button
                                  className={`btn btn-success ${contactFeedback[contact.contactId] === 'upvote' ? 'active' : ''}`}
                                  onClick={() => handleContactFeedback(contact.contactId, 'upvote')}
                                >
                                  <i className={`bi ${contactFeedback[contact.contactId] === 'upvote' ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
                                </button>
                              </div>
                              <div className="col align-items-center">
                                <button
                                  className={`btn btn-danger ${contactFeedback[contact.contactId] === 'downvote' ? 'active' : ''}`}
                                  onClick={() => handleContactFeedback(contact.contactId, 'downvote')}
                                >
                                  <i className={`bi ${contactFeedback[contact.contactId] === 'downvote' ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}`}></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='d-flex justify-content-center align-items-between mt-2'>
                          <div className='col align-items-center'>
                            <button
                              className="btn btn-secondary"
                              onClick={handlePreviousContact}
                              disabled={currentContactIndex === 0}
                              style={{ width: '100px' }}
                            >
                              Previous
                            </button>

                          </div>
                          <div className='col align-items-center'>
                            <span className="">{currentContactIndex + 1}/{sampleContacts.length}</span>
                          </div>
                          <div className='col align-items-center'>
                            {currentContactIndex >= sampleContacts.length - 1 ? (
                              <button className="btn btn-primary" onClick={handleLoadMoreContacts} style={{ width: '100px' }}>
                                Load More
                              </button>
                            ) : (
                              <button
                                className="btn btn-secondary"
                                onClick={handleNextContact}
                                disabled={currentContactIndex >= sampleContacts.length - 1}
                                style={{ width: '100px' }}
                              >
                                Next
                              </button>)}

                          </div>


                        </div>
                      </div>
                    ))}
                    <div className="mt-4 mb-4">
                      <div className='fs-5 mb-2'>Overall Feedback</div>
                      <textarea
                        className="form-control mb-2"
                        value={overallFeedback}
                        onChange={(e) => setOverallFeedback(e.target.value)}
                      ></textarea>
                      <div className='d-flex justify-content-end align-items-center'>
                        {overallFeedbackSaved && (
                          <span className="text-success me-3">
                            Feedback saved!
                          </span>
                        )}
                        <button
                          className="btn btn-secondary"
                          onClick={handleOverallFeedbackSubmit}
                        >
                          Save Feedback
                        </button>

                      </div>
                    </div>



                  </div>
                </div>
              )}


            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default ListDetails;
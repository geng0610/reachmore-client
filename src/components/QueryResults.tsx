import React from 'react';

interface QueryResultsProps {
    queryToContacts: any[];
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const QueryResults: React.FC<QueryResultsProps> = ({
    queryToContacts,
    currentPage,
    totalPages,
    onPageChange,
}) => {
    return (
        <div >
            <table className="table overflow-scroll d-block w-100" style={{ maxHeight: '600px', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                    <tr>
                        <th style={{ width: '10%' }}>Country</th>
                        <th style={{ width: '10%' }}>State</th>
                        <th style={{ width: '15%' }}>City</th>
                        <th style={{ width: '20%' }}>Job Title</th>
                        <th style={{ width: '5%' }}>Seniority</th>
                        <th style={{ width: '20%' }}>Company Name</th>
                        <th style={{ width: '10%' }}>Domain</th>
                        <th style={{ width: '10%' }}>Industry</th>
                    </tr>
                </thead>
                <tbody>
                    {queryToContacts.map((contact) => (
                        <tr key={contact.contactId}>
                            <td className='text-truncate'>{contact.clickhouseData.location_country}</td>
                            <td className='text-truncate'>{contact.clickhouseData.location_state}</td>
                            <td className='text-truncate'>{contact.clickhouseData.location_city}</td>
                            <td className='text-truncate'>{contact.clickhouseData.job_title}</td>
                            <td className='text-truncate'>{contact.clickhouseData.seniority}</td>
                            <td className='text-truncate'>{contact.clickhouseData.company_name}</td>
                            <td className='text-truncate'>{contact.clickhouseData.company_domain}</td>
                            <td className='text-truncate'>{contact.clickhouseData.company_industry}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <nav className='overflow-scroll d-block w-100'>
                <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            <button className="page-link" onClick={() => onPageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default QueryResults;

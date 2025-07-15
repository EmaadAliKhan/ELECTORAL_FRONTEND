import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/axiosConfig';
import Pagination from '../components/common/Pagination';
import '../assets/css/VoterList.css';

const VoterList = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(20);

  const [filters, setFilters] = useState({
    name: '',
    relation: '',
    house_number: '',
    age: '',
    gender: '',
    booth_number: '',
    epic_number: '',
    min_age: '',
    max_age: ''
  });

  const fetchVoters = useCallback(async () => {
    setLoading(true);
    try {
      const isFiltering = Object.values(filters).some(val => val !== '');
      const endpoint = isFiltering ? '/voters/search' : '/voters';
      const payload = isFiltering
        ? { method: 'POST', data: filters }
        : { method: 'GET' };

      const response = await apiClient(endpoint, payload);
      setVoters(response.data);
    } catch (error) {
      console.error("Failed to fetch voters", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchVoters();
      setCurrentPage(1); // Reset to page 1 on new filter
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters, fetchVoters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const indexOfLastVoter = currentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = voters.slice(indexOfFirstVoter, indexOfLastVoter);
  const totalPages = Math.ceil(voters.length / votersPerPage);

  return (
    <div className="voter-list-container">
      <div className="voter-list-header">
        <h2>Voter Database</h2>

        <div className="filter-form">
          <input name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
          <input name="relation" placeholder="Relation" value={filters.relation} onChange={handleFilterChange} />
          <input name="house_number" placeholder="House No." value={filters.house_number} onChange={handleFilterChange} />
          <input name="epic_number" placeholder="EPIC" value={filters.epic_number} onChange={handleFilterChange} />
          <input name="gender" placeholder="Gender" value={filters.gender} onChange={handleFilterChange} />
          <input name="booth_number" placeholder="Booth #" value={filters.booth_number} onChange={handleFilterChange} />
          <input name="age" placeholder="Age" value={filters.age} onChange={handleFilterChange} />
          <input name="min_age" placeholder="Min Age" value={filters.min_age} onChange={handleFilterChange} />
          <input name="max_age" placeholder="Max Age" value={filters.max_age} onChange={handleFilterChange} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="voter-table">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Name</th>
              <th>Relation</th>
              <th>House No.</th>
              <th>Age</th>
              <th>Gender</th>
              <th>EPIC Number</th>
              <th>Booth</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8">Loading...</td></tr>
            ) : (
              currentVoters.map(voter => (
                <tr key={voter.id}>
                  <td>{voter.serial}</td>
                  <td>{voter.name}</td>
                  <td>{voter.relation}</td>
                  <td>{voter.house_number}</td>
                  <td>{voter.age}</td>
                  <td>{voter.gender}</td>
                  <td>{voter.epic_number}</td>
                  <td>{voter.booth_number}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default VoterList;

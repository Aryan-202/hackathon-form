// client/src/pages/Admin/TeamsList.jsx
import React, { useState, useEffect } from 'react';
import { getTeams, qualifyTeam, exportTeams } from '../../api/adminApi';

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'registered', 'qualified'

  useEffect(() => {
    fetchTeams();
  }, [filter]);

  const fetchTeams = async () => {
    try {
      const response = await getTeams(filter);
      if (response.success) {
        setTeams(response.teams);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQualify = async (teamId) => {
    try {
      const response = await qualifyTeam(teamId);
      if (response.success) {
        // Update the team status in the local state
        setTeams(teams.map(team => 
          team._id === teamId ? { ...team, status: 'qualified' } : team
        ));
      }
    } catch (error) {
      console.error('Error qualifying team:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportTeams(filter);
      if (response.success && response.url) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.url;
        link.download = `teams-${filter}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting teams:', error);
    }
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Teams
            </button>
            <button
              onClick={() => setFilter('registered')}
              className={`px-4 py-2 rounded-md ${
                filter === 'registered' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Registered
            </button>
            <button
              onClick={() => setFilter('qualified')}
              className={`px-4 py-2 rounded-md ${
                filter === 'qualified' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Qualified
            </button>
          </div>
          
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Export to Excel
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {teams.map((team) => (
              <li key={team._id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{team.teamName}</h3>
                    <p className="text-sm text-gray-500">
                      Status: <span className={
                        team.status === 'qualified' 
                          ? 'text-green-600 font-medium' 
                          : 'text-blue-600 font-medium'
                      }>
                        {team.status}
                      </span>
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Team Leader</h4>
                      <p className="text-sm text-gray-600">
                        {team.leader.name} ({team.leader.regNo}) - {team.leader.email}
                      </p>
                    </div>
                    
                    {team.members && team.members.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                        {team.members.map((member, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {member.name} ({member.regNo}) - {member.email}
                            {member.verified ? ' ✓' : ' ✗'}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {team.status === 'registered' && (
                    <button
                      onClick={() => handleQualify(team._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Qualify for Round 2
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          {teams.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No teams found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
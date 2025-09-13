// client/src/pages/Admin/QualifiedTeams.jsx
import React, { useState, useEffect } from 'react';
import { getTeams, exportTeams } from '../../api/adminApi';

export default function QualifiedTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQualifiedTeams();
  }, []);

  const fetchQualifiedTeams = async () => {
    try {
      const response = await getTeams('qualified');
      if (response.success) {
        setTeams(response.teams);
      }
    } catch (error) {
      console.error('Error fetching qualified teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportTeams('qualified');
      if (response.success && response.url) {
        // Create a temporary link to download the file
        const link = document.createElement('a');
        link.href = response.url;
        link.download = 'qualified-teams.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error exporting qualified teams:', error);
    }
  };

  if (loading) {
    return <div>Loading qualified teams...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Qualified Teams</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-end">
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{team.teamName}</h3>
                  <p className="text-sm text-green-600 font-medium">Qualified for Round 2</p>
                  
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
              </li>
            ))}
          </ul>
          
          {teams.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No qualified teams found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
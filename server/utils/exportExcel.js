const ExcelJS = require('exceljs');

const exportTeamsToExcel = async (teams) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Teams');

  // Define columns
  worksheet.columns = [
    { header: 'Team Name', key: 'teamName', width: 20 },
    { header: 'Leader Name', key: 'leaderName', width: 20 },
    { header: 'Leader Reg No', key: 'leaderRegNo', width: 15 },
    { header: 'Leader Email', key: 'leaderEmail', width: 30 },
    { header: 'Member 1 Name', key: 'member1Name', width: 20 },
    { header: 'Member 1 Reg No', key: 'member1RegNo', width: 15 },
    { header: 'Member 1 Email', key: 'member1Email', width: 30 },
    { header: 'Member 2 Name', key: 'member2Name', width: 20 },
    { header: 'Member 2 Reg No', key: 'member2RegNo', width: 15 },
    { header: 'Member 2 Email', key: 'member2Email', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  // Add rows
  teams.forEach(team => {
    worksheet.addRow({
      teamName: team.teamName,
      leaderName: team.leader.name,
      leaderRegNo: team.leader.regNo,
      leaderEmail: team.leader.email,
      member1Name: team.members[0]?.name || '',
      member1RegNo: team.members[0]?.regNo || '',
      member1Email: team.members[0]?.email || '',
      member2Name: team.members[1]?.name || '',
      member2RegNo: team.members[1]?.regNo || '',
      member2Email: team.members[1]?.email || '',
      status: team.status,
      createdAt: team.createdAt.toLocaleString(),
    });
  });

  // Style header row
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
  });

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = exportTeamsToExcel;
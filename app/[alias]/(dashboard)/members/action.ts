import demoData from './demodata.json';
import { IMember } from './columns';

export async function getMembersData(page: number = 1, query: string = '') {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const searchQuery = query.trim().toLowerCase();

  const filteredMembers = (demoData.Members as IMember[]).filter(
    (member) =>
      member.username.toLowerCase().includes(searchQuery) ||
      member.name.toLowerCase().includes(searchQuery) ||
      member.account.toLowerCase().includes(searchQuery)
  );

  return {
    data: filteredMembers.slice(start, end),
    total: filteredMembers.length
  };
}

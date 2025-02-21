'use server';

import { Config } from '@citizenwallet/sdk';
// import { createClient } from '@supabase/supabase-js';

export async function getCommunitiesData(page: number = 1,query: string = '') {
  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }

  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data: Config[] = await response.json();


  const filteredData = data.filter(
    (community) =>
      community.community.hidden === false && 
      (community.community.alias.toLowerCase().includes(query.toLowerCase()) ||
        community.community.name.toLowerCase().includes(query.toLowerCase()))
  );
  
  
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const communities = filteredData.slice(start, end);
  const total = filteredData.length;
  return {
    communities,
    total
  };
}

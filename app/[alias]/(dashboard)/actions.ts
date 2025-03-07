'use server';

import { revalidatePath } from 'next/cache';


export async function getCommunities() {

  if (!process.env.COMMUNITIES_CONFIG_URL) {
    throw new Error('COMMUNITIES_CONFIG_URL is not set');
  }
    
  const response = await fetch(process.env.COMMUNITIES_CONFIG_URL);
  const data = await response.json();
  return data;
}


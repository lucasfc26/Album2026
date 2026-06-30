import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Sticker } from '../types/sticker'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function getClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env',
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

let client: SupabaseClient | null = null

function supabase() {
  client ??= getClient()
  return client
}

export async function fetchStickers(): Promise<Sticker[]> {
  const { data, error } = await supabase()
    .from('stickers')
    .select('*')
    .order('number', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function toggleStickerOwned(
  id: number,
  owned: boolean,
): Promise<Sticker> {
  const { data, error } = await supabase()
    .from('stickers')
    .update({ owned })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

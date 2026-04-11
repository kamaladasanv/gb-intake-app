import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fdoigysozhnlwqbjcyyn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkb2lneXNvemhubHdxYmpjeXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjI4NjMsImV4cCI6MjA5MTM5ODg2M30.EoURo72wZBy_9vhEjj00kVneyigYK8gjxiZbn8IMHgg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

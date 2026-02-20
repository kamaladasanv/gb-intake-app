import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yikpjzoqmlgsualwifln.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpa3Bqem9xbWxnc3VhbHdpZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Nzk0OTgsImV4cCI6MjA4NzE1NTQ5OH0.ePmkc8-Se1t5wRb7FkyyDLYyP9wtrvtgjB5-0_LjqA0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

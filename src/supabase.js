import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hoeamfqnvrxysmngwrmc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvZWFtZnFudnJ4eXNtbmd3cm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTI1MDEsImV4cCI6MjA5MzI4ODUwMX0.ZhMOL3zDYB_phB7dUainGAYAVxvEinZsR1yWLlbMV54'
export const supabase = createClient(supabaseUrl, supabaseKey,)

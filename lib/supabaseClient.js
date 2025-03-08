import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://jdeljzncigxjqfsrjoup.supabase.co'
const supabaseKey = process.env.SPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
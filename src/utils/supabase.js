import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
//const supabase = createClient(supabaseUrl, supabaseKey);
const supabase = createClient(
    "https://bhbgpqnqzcvkuiowmpwc.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoYmdwcW5xemN2a3Vpb3dtcHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTYwMDMsImV4cCI6MjA2NDI3MjAwM30.ZnRSLaIlQ8lHYEEaZhZYoYAxFfgSONiqH-1vRWHIFt8"
);
export default supabase;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zywkvwdaoalxokbkvkst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d2t2d2Rhb2FseG9rYmt2a3N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNDU2MjIsImV4cCI6MjEwMDkyMTYyMn0.Ux9vmYzkkm-qUZXnEj_I_X7H1bXlEgjxqm6uatIw--4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

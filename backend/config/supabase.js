import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Client for all operations (using anon key with RLS)
// Disable email confirmation for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin client (same as regular client for now)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test connection function
export const testConnection = async () => {
  try {
    console.log('🔗 Attempting to connect to Supabase database...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('📋 Available tables will be checked...');
      
      // Try a simpler connection test
      const { data: simpleTest, error: simpleError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (simpleError) {
        console.error('❌ Simple database test failed:', simpleError.message);
        return false;
      }
    }
    
    console.log('✅ Successfully connected to Supabase database!');
    console.log('📊 Database connection established');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    return false;
  }
};

// Email service configuration
export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Email templates
export const emailTemplates = {
  projectInvitation: (inviterName, projectName, acceptLink, declineLink) => ({
    subject: `You're invited to join "${projectName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Project Invitation</h2>
        <p>Hi there!</p>
        <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectName}"</strong> on SynergySphere.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${acceptLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block;">
            Accept Invitation
          </a>
          <a href="${declineLink}" style="background-color: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Decline
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">This invitation expires in 7 days.</p>
        <p style="color: #6b7280; font-size: 14px;">If you don't have an account, you'll be prompted to create one.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
          This email was sent by SynergySphere. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `
  })
};

// Email sending helper
export const sendEmail = async (to, template) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export default { supabase, supabaseAdmin, testConnection, emailTransporter, emailTemplates, sendEmail };

import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // Hardcoded admin credentials
  if (username === 'admin' && password === 'password') {
    // Create a secure admin token
    const adminToken = Buffer.from('admin_access_token_' + Date.now()).toString('base64');

    // Set a secure HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('admin_token', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    }));

    return res.status(200).json({ 
      success: true, 
      message: 'Admin login successful',
      redirectUrl: '/admin/dashboard'
    });
  }

  return res.status(401).json({ 
    success: false, 
    message: 'Invalid credentials' 
  });
}

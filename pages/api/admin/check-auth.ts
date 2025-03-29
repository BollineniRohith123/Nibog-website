import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminToken } from '../../../utils/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if admin token is valid
    const isAdmin = await verifyAdminToken(req);

    if (isAdmin) {
      return res.status(200).json({ authenticated: true });
    } else {
      return res.status(403).json({ authenticated: false, message: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Authentication check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@clerk/nextjs/api';

const prisma = new PrismaClient();

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { 
        minAge, 
        maxAge, 
        skillLevel, 
        page = 1, 
        limit = 10 
      } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      // Construct dynamic filtering
      const whereCondition: any = {};

      // Age-based filtering
      if (minAge && maxAge) {
        whereCondition.minAge = { lte: Number(minAge) };
        whereCondition.maxAge = { gte: Number(maxAge) };
      }

      // Skill level filtering
      if (skillLevel) {
        whereCondition.skillLevel = { 
          contains: String(skillLevel), 
          mode: 'insensitive' 
        };
      }

      // Fetch games with pagination
      const games = await prisma.game.findMany({
        where: whereCondition,
        take: limitNum,
        skip: offset,
        include: {
          _count: {
            select: { events: true }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Count total games for pagination
      const totalGames = await prisma.game.count({ where: whereCondition });

      res.status(200).json({
        games,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalGames / limitNum),
          totalGames,
          gamesPerPage: limitNum
        }
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ 
        error: 'Unable to fetch games', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, userRole } = req.body;
      
      // Only allow admin users to create games
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
      }

      const gameData = req.body.gameData;

      // Validate game data
      if (!gameData.name || !gameData.minAge || !gameData.maxAge) {
        return res.status(400).json({ error: 'Missing required game details' });
      }

      const newGame = await prisma.game.create({
        data: {
          name: gameData.name,
          description: gameData.description
        }
      });

      res.status(201).json(newGame);
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ 
        error: 'Unable to create game', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { userId, userRole } = req.body;
      
      // Only allow admin users to update games
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
      }

      const { gameId, gameData } = req.body;

      if (!gameId) {
        return res.status(400).json({ error: 'Game ID is required' });
      }

      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          name: gameData.name,
          description: gameData.description
        }
      });

      res.status(200).json(updatedGame);
    } catch (error) {
      console.error('Error updating game:', error);
      res.status(500).json({ 
        error: 'Unable to update game', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);

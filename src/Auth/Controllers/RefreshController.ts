import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const refreshTokenController = async (req:any, res:any) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: {
                token: refreshToken
            },
            include: {
                user: true
            }
        });

        if (!storedToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        try {
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!);
        } catch (error) {

            await prisma.refreshToken.delete({
                where: {
                    token: refreshToken
                }
            });

            return res.status(403).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        const newAccessToken = jwt.sign(
            { userId: storedToken.user.id, email: storedToken.user.email },
            ACCESS_TOKEN_SECRET!,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        const newRefreshToken = jwt.sign(
            { userId: storedToken.user.id },
            REFRESH_TOKEN_SECRET!,
            { expiresIn: REFRESH_TOKEN_EXPIRY }
        );

        await prisma.refreshToken.delete({
            where: {
                token: refreshToken
            }
        });

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });

        res.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/agendas - List all agendas with their events
export async function GET() {
  try {
    const agendas = await prisma.agenda.findMany({
      include: {
        events: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(agendas)
  } catch (error) {
    console.error('Error fetching agendas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agendas' },
      { status: 500 }
    )
  }
}

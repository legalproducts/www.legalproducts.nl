import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma'; // Update import to use named import

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail en wachtwoord zijn verplicht' },
        { status: 400 }
      );
    }

    try {
      // Find user by email with error handling
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Check if user exists and verify password
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json(
          { error: 'Ongeldige inloggegevens' },
          { status: 401 }
        );
      }

      // Return the user without the password
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json(
        { 
          message: 'Succesvol ingelogd', 
          user: userWithoutPassword 
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Database fout bij het inloggen' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het inloggen' },
      { status: 500 }
    );
  }
}

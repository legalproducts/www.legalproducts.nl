import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the userId cookie
    const response = NextResponse.json(
      { message: 'Succesvol uitgelogd' },
      { status: 200 }
    );
    
    // Clear the userId cookie
    response.cookies.delete('userId');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het uitloggen' },
      { status: 500 }
    );
  }
}

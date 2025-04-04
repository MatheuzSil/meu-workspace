import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { generateToken, hashPassword } from '../../../utils/auth';

const prisma = new PrismaClient()
const secret = process.env.AUTH_SECRET;


export async function register(req: Request) {
  try{
    const args = await req.json()
    const existingUser = await prisma.user.findFirst({ where: { email: args.email } })

    if(existingUser){
      return new NextResponse('User already exists', { status: 400 })
    }

    const hashedPassword = await hashPassword(args.password)

    const NewUser = await prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
        password: hashedPassword
      }
    })

    const token = await generateToken(NewUser.id)
    const response = new NextResponse('User created', { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false ,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response

  }catch(e){
    console.log(e)
    return NextResponse.json(`Erro ao cadastrar`, { status: 500 });
  }
}
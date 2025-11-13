import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || 'chave-secreta-aqui';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (email === 'admin@exemplo.com' && password === '123456') {
            const token = jwt.sign(
                { email, role: 'admin' },
                SECRET_KEY,
                { expiresIn: '1h' }
            )
            return NextResponse.json({
                message: 'Login realizado com sucesso',
                token
            }, { status: 200 });
        } 
        return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });

    } catch (error) {
        return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
    }
}
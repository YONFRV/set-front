import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/useApp';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { TrendingUp } from 'lucide-react';
import { saveCustomer } from '../services/customService';
export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (isLogin) {
      setLoading(true);
      const success = await login(email, password);
      setLoading(false);
      if (success) {
        toast.success('¡Bienvenido!');
        navigate('/');
      } else {
        toast.error('Credenciales inválidas');
      }
    } else {
      setLoading(true);
      try {
        const success = await saveCustomer(
          email,
          name,
          phone,
          password
        );

        if (success) {
          toast.success('¡Cuenta creada exitosamente! Saldo inicial: COP $500.000');
          navigate('/');
        }
      } catch (error: any) {
        if (error.response?.status === 409) {
          console.log(error.response);
          toast.error(error.response?.data.message||'El usuario ya existe');
          setLoading(false);
        } else {
          toast.error('Error al registrar usuario');
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-center text-2xl">
            {isLogin ? 'Inicia Sesión' : 'Crea tu Cuenta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? 'Accede a tu cuenta de inversión'
              : 'Comienza a invertir con COP $500.000'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Celular</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="3166666666"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isLogin
                ? '¿No tienes cuenta? Regístrate'
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

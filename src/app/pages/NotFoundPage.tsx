import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Página no encontrada</h2>
          <p className="text-slate-600 mb-6">
            La página que buscas no existe o ha sido movida.
          </p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            Volver al Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

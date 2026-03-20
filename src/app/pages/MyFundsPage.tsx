import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { FolderOpen, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export function MyFundsPage() {
  const { user, availableFunds, cancelFund } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelFund = (fundId: string) => {
    const fund = availableFunds.find(f => f.id === fundId);
    cancelFund(fundId);
    toast.success('Suscripción cancelada', {
      description: `Has cancelado tu inversión en ${fund?.name}`
    });
  };

  const userFunds = user?.funds.map(userFund => {
    const fundDetails = availableFunds.find(f => f.id === userFund.fundId);
    return {
      ...userFund,
      details: fundDetails
    };
  }) || [];

  if (userFunds.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mis Fondos</h1>
          <p className="text-slate-600 mt-1">Tus inversiones activas</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No tienes fondos activos</h3>
            <p className="text-slate-600 mt-2">Comienza a invertir desde el Dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Mis Fondos</h1>
        <p className="text-slate-600 mt-1">Tus inversiones activas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userFunds.map((userFund) => (
          <Card key={userFund.fundId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{userFund.details?.name}</CardTitle>
                    <Badge 
                      variant={userFund.details?.category === 'FPV' ? 'default' : 'secondary'} 
                      className="mt-1"
                    >
                      {userFund.details?.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-3">
                {userFund.details?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-slate-600">Monto invertido:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(userFund.amount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(userFund.subscribedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Cancelar Suscripción
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción cancelará tu inversión en {userFund.details?.name} y el monto de{' '}
                      {formatCurrency(userFund.amount)} será devuelto a tu saldo disponible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelFund(userFund.fundId)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
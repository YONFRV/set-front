import { useEffect, useState } from 'react';
import { useApp } from '../context/useApp';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { FolderOpen, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { TransactionUser } from '../context/AppContext';

export function MyFundsPage() {
  const { user, availableFunds, transactionForUserId,cancelTransaction,refreshUser } = useApp();

  const [transactions, setTransactions] = useState<TransactionUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user?.id) return;

      try {
        const data = await transactionForUserId(user.id);
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleCancelFund = async (fundId: string) => {
  const fund = transactions.find(f => f.fundId === fundId);

  try {
    await cancelTransaction(fund?.id || '');
    
    // Actualiza contexto global (balance) Y estado local (lista de fondos)
    await refreshUser();
    
    if (user?.id) {
      const updated = await transactionForUserId(user.id);
      setTransactions(updated);
    }

    toast.success('Suscripción cancelada', {
      description: `Has cancelado tu inversión en ${fund?.nameFund}`
    });
  } catch (error) {
    console.error(error);
    toast.error('Error al cancelar la suscripción');
  }
};

const cancelacionTxs = transactions.filter(tx => tx.type === 'CANCELACION' && tx.transactionCancele);
const aperturaTxs = transactions.filter(tx => tx.type === 'APERTURA' || tx.type === 'RECAUDO');

const aperturaConSaldo = aperturaTxs.map(ap => {
  // Buscar cancelaciones que afecten a esta apertura
  const canceladas = cancelacionTxs
    .filter(c => c.transactionCancele === ap.id)
    .reduce((sum, c) => sum + c.amount, 0);

  return {
    ...ap,
    amount: ap.amount - canceladas
  };
}).filter(ap => ap.amount > 0);

  const userFunds = aperturaConSaldo
    .filter(tx => tx.type === 'APERTURA'|| tx.type === 'RECAUDO' && tx.transactionCancele === null)
    .map(tx => {
      const details = availableFunds.find(f => f.id === tx.fundId);
      return {
        fundId: tx.fundId,
        type: tx.type,
        amount: tx.amount,
        subscribedAt: tx.date,
        details
      };
    });

    

  if (loading) {
    return <p className="p-6">Cargando transacciones...</p>;
  }

  if (userFunds.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mis Fondos</h1>

        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-10 h-10 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold">
              No tienes fondos activos
            </h3>
            <p className="text-slate-600 mt-2">
              Comienza a invertir desde el Dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Fondos</h1>
        <p className="text-slate-600">Tus inversiones activas</p>
      </div>

      {/* 📦 Fondos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userFunds.map(userFund => (
          <Card key={userFund.fundId}>
            <CardHeader>
              <CardTitle>{userFund.details?.name}</CardTitle>
              <Badge>
                {userFund.details?.category}
              </Badge>
              <CardDescription>
                {userFund.details?.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p>
                Monto:{' '}
                <strong>{formatCurrency(userFund.amount)}</strong>
              </p>

              <p className="text-sm text-slate-600">
                Desde:{' '}
                {format(new Date(userFund.subscribedAt), 'PPP', {
                  locale: es
                })}
              </p>
              <p className="text-sm text-slate-600">
                Tipo:{' '}
                {userFund.type }
              </p>
            </CardContent>

            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Cancelar
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Confirmar cancelación?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Se devolverá el dinero invertido.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelFund(userFund.fundId)}
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

      {/* 📊 Transacciones */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Transacciones</h2>

          {transactions.map(tx => (
            <Card key={tx.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{tx.nameFund}</CardTitle>
                    <Badge className="mt-1">{tx.type}</Badge>
                  </div>
                  <TrendingUp className="text-green-600" />
                </div>
              </CardHeader>

              <CardContent>
                <p className="font-bold text-green-600">
                  {formatCurrency(Number(tx.amount))}
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(tx.date), "d 'de' MMMM, yyyy", {
                      locale: es
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      
    </div>
  );
}
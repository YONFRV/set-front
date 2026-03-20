import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FundCard } from './FundCard';
import { SubscriptionModal } from './SubscriptionModal';
import { Card, CardContent } from '../components/ui/card';
import type { Fund } from '../context/AppContext';
import { toast } from 'sonner';
import { Wallet, TrendingUp, FolderOpen } from 'lucide-react';

export function DashboardPage() {
  const { user, availableFunds, subscribeFund } = useApp();
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubscribe = (fund: Fund) => {
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  const handleConfirmSubscription = (amount: number, notificationType: 'EMAIL' | 'SMS') => {
    if (!selectedFund) return;

    const success = subscribeFund(selectedFund.id, amount, notificationType);
    if (success) {
      toast.success(`¡Suscripción exitosa! Notificación enviada por ${notificationType}`, {
        description: `Has invertido ${formatCurrency(amount)} en ${selectedFund.name}`
      });
    } else {
      toast.error('Error en la suscripción', {
        description: 'No tienes saldo disponible para vincularte al fondo'
      });
    }
  };
console.log(user?.transactions);

const totalInvested = user?.transactions?.reduce((sum, t) => {
  if ((t.type === "APERTURA") || (t.type === "RECAUDO")) {
    return sum + t.amount;
  }
  if (t.type === "CANCELACION") {
    return sum - t.amount;
  }
  return sum;
}, 0) || 0;

const totalAperturas = user?.transactions?.reduce((count, t) => {
  if ((t.type === "APERTURA") || (t.type === "RECAUDO")) return count + 1;
  if (t.type === "CANCELACION") return count - 1;
  return count;
}, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Gestiona tus inversiones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Saldo Disponible</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(user?.balance || 0)}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Invertido</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Fondos Activos</p>
                <p className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
                  {totalAperturas}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Funds */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">Fondos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {availableFunds.map((fund) => (
            <FundCard key={fund.id} fund={fund} onSubscribe={handleSubscribe} />
          ))}
        </div>
      </div>

      <SubscriptionModal
        fund={selectedFund}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubscription}
        userBalance={user?.balance || 0}
        user={user}
      />
    </div>
  );
}
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Alert, AlertDescription } from '../components/ui/alert';
import type { Fund } from '../context/AppContext';
import { AlertCircle } from 'lucide-react';
import { createTransaction } from "../services/transaction";
import { useApp } from '../context/AppContext';

interface SubscriptionModalProps {
  fund: Fund | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, notificationType: 'Email' | 'SMS') => void;
  userBalance: number;
  user: any;
}

export function SubscriptionModal({ fund, isOpen, onClose, onConfirm, userBalance, user }: SubscriptionModalProps) {
  const [amount, setAmount] = useState('');
  const [notificationType, setNotificationType] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [error, setError] = useState('');
const { refreshUser } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleConfirm = async () => {
    if (!fund) return;

    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Ingresa un monto válido');
      return;
    }

    if (numAmount < fund.minAmount) {
      setError(`El monto mínimo es ${formatCurrency(fund.minAmount)}`);
      return;
    }

    if (numAmount > userBalance) {
      setError('No tienes saldo disponible para vincularte al fondo');
      return;
    }
    try {
      await createTransaction(user.id, fund.id, numAmount, notificationType);
      await refreshUser();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        setError(error.response.data.message);
        return;
      }
      setError('Error inesperado. Intenta nuevamente.');
    }
    //onConfirm(numAmount, notificationType);
    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    setNotificationType('EMAIL');
    setError('');
    onClose();
  };

  if (!fund) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suscribirse a {fund.name}</DialogTitle>
          <DialogDescription>
            Ingresa el monto que deseas invertir en este fondo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-600">Saldo disponible</p>
              <p className="font-semibold text-green-600">{formatCurrency(userBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Monto mínimo</p>
              <p className="font-semibold text-blue-600">{formatCurrency(fund.minAmount)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto a invertir</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              min={fund.minimumAmount}
              max={userBalance}
            />
          </div>

          <div className="space-y-3">
            <Label>Tipo de notificación</Label>
            <RadioGroup value={notificationType} onValueChange={(value) => setNotificationType(value as 'Email' | 'SMS')} >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EMAIL" id="email" />
                <Label htmlFor="email" className="font-normal cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SMS" id="sms" />
                <Label htmlFor="sms" className="font-normal cursor-pointer">
                  SMS
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
            Confirmar Suscripción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

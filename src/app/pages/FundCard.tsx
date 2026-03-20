import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import type { Fund } from '../context/AppContext';
import { TrendingUp } from 'lucide-react';

interface FundCardProps {
  fund: Fund;
  onSubscribe: (fund: Fund) => void;
}

export function FundCard({ fund, onSubscribe }: FundCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{fund.name}</CardTitle>
              <Badge variant={fund.category === 'FPV' ? 'default' : 'secondary'} className="mt-1">
                {fund.category}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-3">{fund.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-slate-600">Monto mínimo:</span>
          <span className="font-semibold text-blue-600">{formatCurrency(fund.minAmount)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSubscribe(fund)} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Suscribirse
        </Button>
      </CardFooter>
    </Card>
  );
}

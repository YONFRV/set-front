import { useApp } from '../context/useApp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { History, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export function HistoryPage() {
  const { user } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  if (!user?.transactions || user.transactions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Historial de Transacciones</h1>
          <p className="text-slate-600 mt-1">Registro de todas tus operaciones</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No hay transacciones</h3>
            <p className="text-slate-600 mt-2">Tus transacciones aparecerán aquí</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <History className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Historial de Transacciones</h1>
          <p className="text-slate-600 mt-1">Registro de todas tus operaciones</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las Transacciones</CardTitle>
          <CardDescription>
            Total de {user.transactions.length} transacción{user.transactions.length !== 1 ? 'es' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="min-w-[150px]">Fondo</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[200px]">Fecha</TableHead>
                  <TableHead className="text-right min-w-[100px]">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-xs md:text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.type === 'APERTURA' || transaction.type === 'RECAUDO' ? 'default' : 'secondary'}
                        className={
                          transaction.type === 'APERTURA' || transaction.type === 'RECAUDO'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.fundName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600">
                      {format(new Date(transaction.date), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      <span className={transaction.type === 'APERTURA' || transaction.type === 'RECAUDO' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'APERTURA' || transaction.type === 'RECAUDO' ?'+'  : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
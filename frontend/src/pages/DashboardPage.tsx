import {useMemo} from 'react';
import {ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar} from 'recharts';
import dayjs from 'dayjs';
import {BarChart3} from 'lucide-react';
import {motion} from 'framer-motion';

import {useDashboardSummary} from '../features/dashboard/hooks/useDashboardSummary';
import {PageHeader} from '../ui/molecules/PageHeader';
import {StatCard} from '../ui/molecules/StatCard';
import {Surface} from '../ui/atoms/Surface';
import {Text} from '../ui/atoms/Text';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);

/**
 * Dashboard repaginada com hierarquia clara e feedback visual.
 */
export const DashboardPage = () => {
  const {data, isLoading} = useDashboardSummary();

  const chartData = useMemo(() => {
    if (!data) return [] as Array<{name: string; total: number}>;
    return data.byServiceType.map(item => ({
      name: item.serviceType.replace(/_/g, ' '),
      total: item.total
    }));
  }, [data]);

  if (isLoading || !data) {
    return (
      <Surface padding="lg" className="flex items-center justify-center text-content-muted">
        Carregando dashboard...
      </Surface>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Período: ${dayjs(data.range.from).format('DD/MM/YYYY')} — ${dayjs(data.range.to).format(
          'DD/MM/YYYY'
        )}`}
        icon={<BarChart3 className="h-6 w-6" />}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Serviços concluídos" value={data.totalCompleted} />
        <StatCard label="Receita" value={formatCurrency(data.revenue)} tone="success" />
        <StatCard label="Pets atendidos" value={data.petsAttended} />
        <StatCard label="Tipos de serviço" value={data.byServiceType.length} />
      </section>

      <Surface padding="lg" className="space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <Text tone="muted" size="sm" className="uppercase tracking-wide">
              Volume por categoria
            </Text>
            <h3 className="text-2xl font-semibold text-content-strong">Serviços por tipo</h3>
          </div>
        </header>

        <motion.div
          initial={{opacity: 0, scale: 0.98}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" />
              <XAxis dataKey="name" stroke="var(--color-content-muted)" />
              <YAxis allowDecimals={false} stroke="var(--color-content-muted)" />
              <Tooltip
                cursor={{fill: 'var(--color-primary-soft)'}}
                contentStyle={{borderRadius: 16, borderColor: 'var(--color-border)'}}
              />
              <Bar dataKey="total" fill="var(--color-primary)" radius={[16, 16, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </Surface>
    </>
  );
};

import {useMemo} from 'react';
import {FileChartColumn} from 'lucide-react';
import {motion} from 'framer-motion';

import {useDashboardSummary} from '../features/dashboard/hooks/useDashboardSummary';
import {PageHeader} from '../ui/molecules/PageHeader';
import {Surface} from '../ui/atoms/Surface';
import {StatCard} from '../ui/molecules/StatCard';
import {Text} from '../ui/atoms/Text';
import {EmptyState} from '../ui/molecules/EmptyState';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);

/**
 * Relatórios estratégicos com foco nos principais indicadores.
 */
export const ReportsPage = () => {
  const {data, isLoading} = useDashboardSummary();

  const totalServices = data?.byServiceType.reduce((total, item) => total + item.total, 0) ?? 0;

  if (isLoading) {
    return (
      <Surface padding="lg" className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-xl bg-surface-muted" />
        ))}
      </Surface>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Sem dados disponíveis"
        description="Assim que começarmos a registrar atendimentos, os relatórios aparecerão aqui."
        icon={<FileChartColumn className="h-9 w-9" />}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Acompanhe o desempenho do negócio com indicadores consolidados."
        icon={<FileChartColumn className="h-6 w-6" />}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Serviços concluídos" value={data.totalCompleted} />
        <StatCard label="Receita total" value={formatCurrency(data.revenue)} tone="success" />
        <StatCard label="Pets atendidos" value={data.petsAttended} />
      </section>

      <Surface padding="lg" className="space-y-6">
        <header className="flex flex-col gap-1">
          <Text tone="muted" size="sm" className="uppercase tracking-wide">
            Distribuição por serviço
          </Text>
          <Text tone="default">Entenda quais serviços geram mais demanda.</Text>
        </header>

        <div className="space-y-3">
          {data.byServiceType.map(item => {
            const percent = totalServices ? Math.round((item.total / totalServices) * 100) : 0;
            return (
              <motion.div
                key={item.serviceType}
                className="space-y-2"
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.25}}
              >
                <div className="flex items-center justify-between">
                  <Text className="font-medium capitalize">{item.serviceType.replace('_', ' ').toLowerCase()}</Text>
                  <Text tone="muted" size="sm">
                    {item.total} ({percent}%)
                  </Text>
                </div>
                <div className="h-2 rounded-full bg-surface-muted">
                  <motion.div
                    className="h-2 rounded-full bg-primary"
                    initial={{width: 0}}
                    animate={{width: `${percent}%`}}
                    transition={{duration: 0.6, ease: [0.33, 1, 0.68, 1]}}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </Surface>
    </>
  );
};

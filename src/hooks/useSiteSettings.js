import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSiteSettings() {
  const { data: settings = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });
  return settings[0] || {};
}